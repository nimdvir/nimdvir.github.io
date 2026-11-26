"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useMemo, useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PUBLIC_HOST, shortUrl as publicUrl, titledLine } from "../../lib/public-origin";

const GROUPS = { topic: "Topic", site: "Website", source: "Made with", none: "No grouping" };
const SORTS = {
  custom: "My order (drag to arrange)",
  newest: "Newest first",
  oldest: "Oldest first",
  clicks: "Most clicks",
  week: "Most active this week",
  last: "Last clicked",
  name: "Name (A-Z)",
};

// Font Awesome icon: <Icon name="copy" /> (solid) or <Icon name="github" brand />.
function Icon({ name, brand, className = "" }) {
  return <i className={(brand ? "fa-brands fa-" : "fa-solid fa-") + name + (className ? " " + className : "")} aria-hidden="true" />;
}

// Icon and color for a link's destination.
function siteIcon(link) {
  if (link.link_type === "path") return { name: "folder-open", color: "#e0a63a" };
  let url;
  try { url = new URL(link.destination_url); } catch { return { name: "globe", color: "#8fa3c7" }; }
  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;
  if (/\.pdf$/i.test(path)) return { name: "file-pdf", color: "#ef5b5b" };
  if (host === "drive.google.com") return { name: "google-drive", brand: true, color: "#34a853" };
  if (host === "docs.google.com") {
    if (path.startsWith("/presentation")) return { name: "person-chalkboard", color: "#f4b400" };
    if (path.startsWith("/spreadsheets")) return { name: "table", color: "#34a853" };
    if (path.startsWith("/forms")) return { name: "list-check", color: "#a37bf0" };
    return { name: "file-lines", color: "#4f8ef7" };
  }
  if (host.endsWith("youtube.com") || host === "youtu.be") return { name: "youtube", brand: true, color: "#ff3b4e" };
  if (host.endsWith("linkedin.com")) return { name: "linkedin", brand: true, color: "#2d8fe6" };
  if (host.endsWith("github.com") || host.endsWith("github.io")) return { name: "github", brand: true, color: "#e6e9f0" };
  if (host.endsWith("zoom.us")) return { name: "video", color: "#2d8cff" };
  if (host.endsWith("albany.edu")) return { name: "building-columns", color: "#b18ce0" };
  if (host.endsWith("nimdvir.com")) return { name: "house", color: "#9d8cff" };
  return { name: "globe", color: "#8fa3c7" };
}

const SOURCE_ICONS = { claude: "robot", chatgpt: "robot", gemini: "robot", admin: "gauge", "right-click": "computer-mouse", tmplat: "puzzle-piece", bookmarklet: "bookmark" };
const DEVICE_ICONS = { mobile: "mobile-screen", tablet: "tablet-screen-button", desktop: "desktop" };
const BROWSER_ICONS = { Chrome: "chrome", Firefox: "firefox-browser", Safari: "safari", Edge: "edge" };
const OS_ICONS = { Windows: "windows", macOS: "apple", iOS: "apple", Android: "android", Linux: "linux" };

// Clipboard API, with a fallback for browsers or pages where it is missing.
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

function readPref(key, fallback, allowed) {
  try {
    const value = localStorage.getItem("shortener:" + key);
    return value && value in allowed ? value : fallback;
  } catch {
    return fallback;
  }
}

function savePref(key, value) {
  try { localStorage.setItem("shortener:" + key, value); } catch {}
}

function siteOf(link) {
  if (link.link_type === "path") return "File paths";
  try { return new URL(link.destination_url).hostname.replace(/^www\./, ""); } catch { return "Other"; }
}

function groupOf(link, groupBy) {
  if (groupBy === "topic") return link.topic || "No topic";
  if (groupBy === "site") return siteOf(link);
  if (groupBy === "source") return link.created_via || "Unknown";
  return "";
}

const time = (value) => (value ? new Date(value).getTime() : 0);

function compare(sort) {
  return (a, b) => {
    if (sort === "oldest") return time(a.created_at) - time(b.created_at);
    if (sort === "clicks") return (b.click_count || 0) - (a.click_count || 0) || time(b.created_at) - time(a.created_at);
    if (sort === "week") return b.week_clicks - a.week_clicks || time(b.last_clicked_at) - time(a.last_clicked_at);
    if (sort === "last") return time(b.last_clicked_at) - time(a.last_clicked_at);
    if (sort === "name") return a.slug.localeCompare(b.slug);
    if (sort === "custom") {
      // Links never placed by dragging (e.g. new ones) come first, newest first.
      if (a.position == null || b.position == null) {
        if (a.position == null && b.position == null) return time(b.created_at) - time(a.created_at);
        return a.position == null ? -1 : 1;
      }
      return a.position - b.position;
    }
    return time(b.created_at) - time(a.created_at);
  };
}

function ago(value) {
  if (!value) return "never";
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours + " h ago";
  const days = Math.round(hours / 24);
  if (days < 30) return days + (days === 1 ? " day ago" : " days ago");
  return new Date(value).toLocaleDateString();
}

function CopyButton({ text, label, icon, title, className = "secondary" }) {
  const [state, setState] = useState("");
  return (
    <button
      type="button"
      className={className + (state ? " copied" : "")}
      title={title}
      onClick={async () => {
        setState((await copyText(text)) ? "Copied" : "Failed");
        setTimeout(() => setState(""), 1500);
      }}
    >
      <Icon name={state === "Copied" ? "check" : state ? "xmark" : icon} /> {state || label}
    </button>
  );
}

function GroupIcon({ groupBy, name, link }) {
  if (groupBy === "site") {
    const site = siteIcon(link);
    return <span style={{ color: site.color }}><Icon name={site.name} brand={site.brand} /></span>;
  }
  if (groupBy === "source") return <Icon name={SOURCE_ICONS[name] || "circle-question"} />;
  return <Icon name={name === "No topic" ? "inbox" : "tag"} />;
}

// Group heading; topic groups can be renamed in place.
function GroupHeading({ groupBy, name, links, onRename, busy }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const renamable = groupBy === "topic" && name !== "No topic";
  const clicks = links.reduce((sum, link) => sum + Number(link.click_count || 0), 0);

  if (editing) {
    return (
      <form
        className="group-rename"
        onSubmit={async (event) => {
          event.preventDefault();
          if (value.trim() !== name) await onRename(name, value);
          setEditing(false);
        }}
      >
        <Icon name="tag" />
        <input autoFocus maxLength={40} value={value} onChange={(e) => setValue(e.target.value)} aria-label="Topic name" />
        <button disabled={busy}><Icon name="check" /> Save</button>
        <button type="button" className="secondary" onClick={() => { setValue(name); setEditing(false); }}>Cancel</button>
      </form>
    );
  }
  return (
    <h3 className="group-name">
      <GroupIcon groupBy={groupBy} name={name} link={links[0]} /> {name}
      <span className="muted"> · {links.length} {links.length === 1 ? "link" : "links"} · {clicks} clicks</span>
      {renamable && (
        <button type="button" className="icon-button" title={"Rename " + name} onClick={() => { setValue(name); setEditing(true); }}>
          <Icon name="pen" /><span className="sr-only">Rename topic</span>
        </button>
      )}
    </h3>
  );
}

function TopLinks({ links, onOpen }) {
  const [mode, setMode] = useState("week");
  const key = mode === "week" ? "week_clicks" : "click_count";
  const top = links
    .filter((link) => Number(link[key] || 0) > 0)
    .sort((a, b) => Number(b[key] || 0) - Number(a[key] || 0))
    .slice(0, 5);

  return (
    <div className="card top-links" style={{ marginBottom: 18 }}>
      <div className="links-head">
        <h2><Icon name="trophy" /> Top links</h2>
        <div className="tabs" role="group" aria-label="Period">
          <button type="button" className={mode === "week" ? "" : "secondary"} aria-pressed={mode === "week"} onClick={() => setMode("week")}>This week</button>
          <button type="button" className={mode === "all" ? "" : "secondary"} aria-pressed={mode === "all"} onClick={() => setMode("all")}>All time</button>
        </div>
      </div>
      {!top.length && <p className="muted">{mode === "week" ? "No clicks this week yet." : "No clicks yet."}</p>}
      <ol className="top-list">
        {top.map((link, index) => {
          const site = siteIcon(link);
          const url = publicUrl(link.slug);
          return (
            <li key={link.id}>
              <span className="rank">{index + 1}</span>
              <span className="site-icon small-icon" style={{ "--tint": site.color }}><Icon name={site.name} brand={site.brand} /></span>
              <button type="button" className="top-name" onClick={() => onOpen(link.id)} title="Show this link">
                <span className="code">/{link.slug}</span>
                {link.title ? <span className="muted"> {link.title}</span> : null}
              </button>
              <span className="top-count"><strong>{link[key]}</strong> <span className="muted">clicks</span></span>
              <CopyButton text={titledLine(link.title, url)} label="Copy" icon="copy" title="Copy as: Title - link" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function LinkCard({ link, open, onToggle, api, act, busy, draggable }) {
  const url = publicUrl(link.slug);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id, disabled: !draggable });
  const [clicks, setClicks] = useState(null);
  const [clickError, setClickError] = useState("");
  const blank = () => ({
    slug: link.slug, link_type: link.link_type, destination_url: link.destination_url,
    title: link.title || "", topic: link.topic || "",
  });
  const [edit, setEdit] = useState(blank);
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { if (!editing) setEdit(blank()); }, [editing, link.slug, link.link_type, link.destination_url, link.title, link.topic]);

  useEffect(() => {
    if (!open) return;
    let live = true;
    setClickError("");
    api("GET", null, undefined, "?link=" + link.id)
      .then((result) => live && setClicks(result.clicks))
      .catch((error) => live && setClickError(error.message));
    return () => { live = false; };
  }, [open, link.click_count]);

  const site = siteIcon(link);
  const slug = edit.slug.trim().toLowerCase();
  const destChanged = edit.destination_url.trim() !== link.destination_url || edit.link_type !== link.link_type;
  const changed = slug !== link.slug || destChanged || edit.title !== (link.title || "") || edit.topic !== (link.topic || "");
  const style = { transform: CSS.Transform.toString(transform), transition };

  async function save(event) {
    event.preventDefault();
    setSaveError("");
    const body = { action: "update", id: link.id, title: edit.title, topic: edit.topic };
    if (destChanged) Object.assign(body, { destination_url: edit.destination_url.trim(), link_type: edit.link_type });
    if (slug !== link.slug) {
      const ok = window.confirm(
        "Rename " + PUBLIC_HOST + "/" + link.slug + " to " + PUBLIC_HOST + "/" + slug + "?\n\n" +
        "The old address stops working, so anyone who already has it will get \"not found\"."
      );
      if (!ok) return;
      body.slug = slug;
    }
    const error = await act(body, "Saved " + PUBLIC_HOST + "/" + (body.slug || link.slug));
    if (error) setSaveError(error);
    else setEditing(false);
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      id={"link-" + link.id}
      className={"link" + (open ? " open" : "") + (link.is_active ? "" : " paused") + (isDragging ? " dragging" : "")}
    >
      <div className="link-main">
        {draggable && (
          <button type="button" className="drag-handle" ref={setActivatorNodeRef} {...attributes} {...listeners} title="Drag to reorder">
            <Icon name="grip-vertical" /><span className="sr-only">Move {link.slug}</span>
          </button>
        )}
        <span className="site-icon" style={{ "--tint": site.color }}><Icon name={site.name} brand={site.brand} /></span>
        <div className="link-text">
          <a className="short code" href={url} target="_blank" rel="noopener noreferrer">{PUBLIC_HOST}/{link.slug}</a>
          {link.title ? <div className="link-title">{link.title}</div> : null}
          <div className="dest muted" title={link.destination_url}>
            {link.link_type === "path" ? <span className="code">{link.destination_url}</span> : link.destination_url}
          </div>
        </div>
        <div className="copy-buttons">
          <CopyButton text={titledLine(link.title, url)} label="Copy" icon="copy" title={link.title ? "Copy as: Title - link" : "Copy the link"} className="primary" />
          {link.title ? <CopyButton text={url} label="URL" icon="link" title="Copy only the URL" /> : null}
          <button type="button" className={editing ? "" : "secondary"} aria-expanded={editing} title="Change the short name, destination, title or topic" onClick={() => { setSaveError(""); setEditing(!editing); }}>
            <Icon name="pen" /> Edit
          </button>
        </div>
      </div>

      {editing && (
        <form className="edit-panel" onSubmit={save}>
          <label className="span-2">Short name
            <span className="prefixed"><span className="prefix">{PUBLIC_HOST}/</span>
              <input value={edit.slug} maxLength={48} autoFocus onChange={(e) => setEdit({ ...edit, slug: e.target.value })} required />
            </span>
          </label>
          <label>Type
            <select value={edit.link_type} onChange={(e) => setEdit({ ...edit, link_type: e.target.value })}>
              <option value="url">Web link</option>
              <option value="path">File path</option>
            </select>
          </label>
          <label className="span-3">Destination
            <input type={edit.link_type === "path" ? "text" : "url"} value={edit.destination_url} onChange={(e) => setEdit({ ...edit, destination_url: e.target.value })} required />
          </label>
          <label className="span-2">Title<input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
          <label>Topic<input list="topic-list" maxLength={40} placeholder="e.g. BITM 330" value={edit.topic} onChange={(e) => setEdit({ ...edit, topic: e.target.value })} /></label>
          {slug !== link.slug && <p className="notice warn-text span-3"><Icon name="triangle-exclamation" /> The old address {PUBLIC_HOST}/{link.slug} will stop working.</p>}
          {saveError && <p className="notice error span-3"><Icon name="circle-exclamation" /> {saveError}</p>}
          <div className="actions span-3">
            <button disabled={busy || !changed}><Icon name="floppy-disk" /> Save</button>
            <button type="button" className="secondary" onClick={() => { setSaveError(""); setEditing(false); }}>Cancel</button>
          </div>
        </form>
      )}

      <button type="button" className="link-meta" aria-expanded={open} onClick={onToggle}>
        <span><Icon name="chart-simple" /> <strong>{link.click_count || 0}</strong> clicks</span>
        <span className={link.week_clicks ? "hot" : ""}><Icon name="fire" /> {link.week_clicks} this week</span>
        <span><Icon name="clock" /> {ago(link.last_clicked_at)}</span>
        {link.topic ? <span className="pill"><Icon name="tag" /> {link.topic}</span> : null}
        {!link.is_active ? <span className="pill warn"><Icon name="pause" /> Paused</span> : null}
        {link.archived_at ? <span className="pill"><Icon name="box-archive" /> Archived</span> : null}
        <Icon name="chevron-down" className={"chevron" + (open ? " up" : "")} />
        <span className="sr-only">{open ? "Hide details" : "Show clicks and settings"}</span>
      </button>

      {open && (
        <div className="details">
          <div className="facts muted">
            <span><Icon name="calendar" /> Created {new Date(link.created_at).toLocaleDateString()}</span>
            <span><Icon name={SOURCE_ICONS[link.created_via] || "circle-question"} /> via {link.created_via || "unknown"}</span>
            {link.archived_at ? <span><Icon name="box-archive" /> Archived {new Date(link.archived_at).toLocaleDateString()}</span> : null}
            {link.link_type === "url" ? <a href={link.destination_url} target="_blank" rel="noopener noreferrer"><Icon name="arrow-up-right-from-square" /> Open destination</a> : null}
          </div>

          <h3><Icon name="chart-simple" /> Clicks</h3>
          {clickError && <p className="notice error">{clickError}</p>}
          {!clicks && !clickError && <p className="muted">Loading…</p>}
          {clicks && !clicks.length && <p className="muted">No clicks yet.</p>}
          {clicks && clicks.length > 0 && (
            <ul className="clicks">
              {clicks.map((click) => (
                <li key={click.id}>
                  <span className="when">{new Date(click.clicked_at).toLocaleString()}</span>
                  <span className="device">
                    <Icon name={DEVICE_ICONS[click.device_type] || "circle-question"} />
                    {BROWSER_ICONS[click.browser] ? <Icon name={BROWSER_ICONS[click.browser]} brand /> : null}
                    {OS_ICONS[click.os] ? <Icon name={OS_ICONS[click.os]} brand /> : null}
                    <span>{[click.browser, click.os].filter((v) => v && v !== "other").join(" · ") || click.device_type || "Unknown"}</span>
                  </span>
                  <span className="muted"><Icon name="location-dot" /> {[click.city, click.region, click.country].filter(Boolean).join(", ") || "Unknown location"}</span>
                  <span className="muted ref"><Icon name="arrow-right-to-bracket" /> {click.referrer || "Direct / unavailable"}</span>
                </li>
              ))}
            </ul>
          )}
          {clicks && clicks.length === 200 && <p className="muted small">Showing the latest 200.</p>}


          <div className="actions">
            <button type="button" className="secondary" disabled={busy} onClick={() => act({ action: "toggle", id: link.id, is_active: !link.is_active })}><Icon name={link.is_active ? "pause" : "play"} /> {link.is_active ? "Pause" : "Activate"}</button>
            <button type="button" className="secondary" disabled={busy} title={link.archived_at ? "" : "Hide from the list. The link keeps working."} onClick={() => act({ action: "archive", id: link.id, archived: !link.archived_at })}>
              <Icon name={link.archived_at ? "box-open" : "box-archive"} /> {link.archived_at ? "Restore" : "Archive"}
            </button>
            <button type="button" className="danger" disabled={busy} onClick={() => { if (window.confirm("Delete /" + link.slug + " for good? Its click history is deleted too. Archive keeps it instead.")) act({ action: "delete", id: link.id }); }}><Icon name="trash" /> Delete</button>
          </div>
        </div>
      )}
    </li>
  );
}

// One group of links; in "My order" its links can be dragged.
function LinkGroup({ links, draggable, onReorder, cardProps }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const list = (
    <ul className="links">
      {links.map((link) => <LinkCard key={link.id} link={link} draggable={draggable} {...cardProps(link)} />)}
    </ul>
  );
  if (!draggable) return list;
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const ids = links.map((link) => link.id);
        onReorder(ids, arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id)));
      }}
    >
      <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>{list}</SortableContext>
    </DndContext>
  );
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState(null);
  const emptyForm = { slug: "", destination_url: "", title: "", topic: "", link_type: "url" };
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [groupBy, setGroupBy] = useState("topic");
  const [sort, setSort] = useState("newest");
  const [openId, setOpenId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    setGroupBy(readPref("group", "topic", GROUPS));
    setSort(readPref("sort", "newest", SORTS));
    // The "Short link (name it)" bookmarklet opens /admin?url=...&title=...&slug=... to prefill the form.
    const params = new URLSearchParams(window.location.search);
    if (params.get("url")) {
      setForm({
        ...emptyForm,
        destination_url: params.get("url"),
        title: params.get("title") || "",
        slug: params.get("slug") || "",
        created_via: "bookmarklet",
      });
      window.history.replaceState(null, "", window.location.pathname);
    }
    const saved = sessionStorage.getItem("shortenerAdminSecret");
    if (saved) {
      setSecret(saved);
      load(saved);
    }
  }, []);

  async function api(method, body, currentSecret = secret, search = "") {
    const response = await fetch("/api/admin" + search, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": currentSecret,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed");
    return result;
  }

  async function load(currentSecret = secret) {
    setBusy(true);
    setMessage("");
    try {
      const result = await api("GET", null, currentSecret);
      setData(result);
      setUnlocked(true);
      sessionStorage.setItem("shortenerAdminSecret", currentSecret);
    } catch {
      setUnlocked(false);
      setData(null);
      setMessage("Wrong admin passcode.");
      sessionStorage.removeItem("shortenerAdminSecret");
    } finally {
      setBusy(false);
    }
  }

  async function createLink(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await api("POST", { action: "create", ...form });
      // Always the public address (https://dr.nimdvir.com/<name>), even when /admin is opened on an alias.
      const shortUrl = publicUrl(form.slug.trim().toLowerCase());
      const line = titledLine(form.title, shortUrl);
      const copied = await copyText(line);
      setForm(emptyForm);
      // load() clears the message, so show the result after it.
      await load();
      setMessage(copied ? "Link created and copied: " + line : "Link created: " + line);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  // Runs an admin action, reloads, and returns an error message (or null on success).
  async function act(body, success = "") {
    setBusy(true);
    setMessage("");
    try {
      await api("POST", body);
      await load();
      if (success) setMessage(success);
      return null;
    } catch (error) {
      setMessage(error.message);
      return error.message;
    } finally {
      setBusy(false);
    }
  }

  // Success messages fade after a few seconds; errors stay until dismissed.
  useEffect(() => {
    if (!message || !/created|^Saved/.test(message)) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const current = useMemo(() => (data?.links || []).filter((link) => !link.archived_at), [data]);
  const archived = useMemo(() => (data?.links || []).filter((link) => link.archived_at), [data]);

  const topics = useMemo(
    () => [...new Set((data?.links || []).map((link) => link.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [data]
  );

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const links = current
      .filter((link) => !q || [link.slug, link.title, link.destination_url, link.topic, link.created_via]
        .some((value) => String(value || "").toLowerCase().includes(q)))
      .sort(compare(sort));
    const map = new Map();
    for (const link of links) {
      const key = groupOf(link, groupBy);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(link);
    }
    const entries = [...map.entries()];
    // In "My order", groups follow their first link; otherwise biggest groups first. Catch-all groups go last.
    const last = new Set(["No topic", "Unknown", "Other"]);
    const rank = new Map(links.map((link, index) => [link.id, index]));
    return entries.sort(([a, x], [b, y]) =>
      (last.has(a) - last.has(b)) ||
      (sort === "custom" ? rank.get(x[0].id) - rank.get(y[0].id) : (y.length - x.length) || a.localeCompare(b)));
  }, [current, query, sort, groupBy]);

  const shown = groups.reduce((sum, [, links]) => sum + links.length, 0);

  // Dropping a link inside a group: the group's links swap among the places they already hold
  // in the full order, then every link whose place changed is saved.
  async function reorder(oldIds, newIds) {
    const full = [...current].sort(compare("custom")).map((link) => link.id);
    const slots = oldIds.map((id) => full.indexOf(id)).sort((a, b) => a - b);
    slots.forEach((slot, i) => { full[slot] = newIds[i]; });
    const byId = Object.fromEntries((data?.links || []).map((link) => [link.id, link]));
    const order = full.map((id, position) => ({ id, position })).filter(({ id, position }) => byId[id].position !== position);
    if (!order.length) return;
    const positions = Object.fromEntries(order.map(({ id, position }) => [id, position]));
    setData({ ...data, links: data.links.map((link) => (link.id in positions ? { ...link, position: positions[link.id] } : link)) });
    try {
      await api("POST", { action: "reorder", order });
    } catch (error) {
      setMessage("Couldn't save the new order: " + error.message);
      await load();
    }
  }

  function openLink(id) {
    setOpenId(id);
    setTimeout(() => document.getElementById("link-" + id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const cardProps = (link) => ({
    open: openId === link.id,
    onToggle: () => setOpenId(openId === link.id ? null : link.id),
    api,
    act,
    busy,
  });

  if (!unlocked) {
    return (
      <div className="shell">
        <div className="card">
          <h1>Link admin</h1>
          <p className="muted">Enter the private admin passcode.</p>
          {form.destination_url && <p className="muted">Then you can name the short link for {form.destination_url}.</p>}
          <form onSubmit={(event) => { event.preventDefault(); load(secret); }}>
            <label>
              Admin passcode
              <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} autoFocus />
            </label>
            <button disabled={busy || !secret}>{busy ? "Checking…" : "Open dashboard"}</button>
          </form>
          {message && <p className="notice error">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="toolbar">
        <div>
          <h1>Link admin</h1>
          <p className="muted">Create branded links and see who clicks them.</p>
        </div>
        <button className="secondary" onClick={() => { sessionStorage.removeItem("shortenerAdminSecret"); setUnlocked(false); setSecret(""); }}>
          <Icon name="lock" /> Lock
        </button>
      </div>

      <div className="grid stats">
        <div className="card stat"><span className="muted"><Icon name="link" /> Links</span><strong>{data?.summary.links || 0}</strong></div>
        <div className="card stat"><span className="muted"><Icon name="circle-check" /> Active</span><strong>{data?.summary.active || 0}</strong></div>
        <div className="card stat"><span className="muted"><Icon name="chart-simple" /> Total clicks</span><strong>{data?.summary.totalClicks || 0}</strong></div>
        <div className="card stat"><span className="muted"><Icon name="fire" /> Clicks this week</span><strong>{data?.summary.weekClicks || 0}</strong></div>
      </div>

      {message && (
        <div className={"toast " + (/created|^Saved/.test(message) ? "success" : "error")} role="status">
          <Icon name={/created|^Saved/.test(message) ? "circle-check" : "circle-exclamation"} /> <span>{message}</span>
          <button type="button" className="icon-button" onClick={() => setMessage("")}><Icon name="xmark" /><span className="sr-only">Dismiss</span></button>
        </div>
      )}

      <TopLinks links={current} onOpen={openLink} />

      <datalist id="topic-list">{topics.map((topic) => <option key={topic} value={topic} />)}</datalist>

      <div className="card" style={{ marginBottom: 18 }}>
        <h2><Icon name="wand-magic-sparkles" /> Create a short link</h2>
        <form className="form-grid" onSubmit={createLink}>
          <label>Type
            <select value={form.link_type} onChange={(e) => setForm({ ...form, link_type: e.target.value })}>
              <option value="url">Web link</option>
              <option value="path">File path</option>
            </select>
          </label>
          <label>Slug<input placeholder="cv" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <label className="wide">Destination<input type={form.link_type === "path" ? "text" : "url"} placeholder={form.link_type === "path" ? "G:\\My Drive\\notes.md" : "https://www.nimdvir.com/cv/"} value={form.destination_url} onChange={(e) => setForm({ ...form, destination_url: e.target.value })} required /></label>
          <label>Title<input placeholder="CV" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Topic<input list="topic-list" maxLength={40} placeholder="Optional" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></label>
          <button disabled={busy}><Icon name="plus" /> Create</button>
        </form>
        {message && <p className={"notice " + (message.includes("created") ? "success" : "error")}>{message}</p>}
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="links-head">
          <h2><Icon name="layer-group" /> Links</h2>
          <span className="muted">{shown === current.length ? shown : shown + " of " + current.length}</span>
        </div>
        <div className="controls">
          <label className="search">Search
            <span className="input-icon"><Icon name="magnifying-glass" /><input type="search" placeholder="Name, title, website, topic…" value={query} onChange={(e) => setQuery(e.target.value)} /></span>
          </label>
          <label>Group by
            <select value={groupBy} onChange={(e) => { setGroupBy(e.target.value); savePref("group", e.target.value); }}>
              {Object.entries(GROUPS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label>Sort
            <select value={sort} onChange={(e) => { setSort(e.target.value); savePref("sort", e.target.value); }}>
              {Object.entries(SORTS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
        </div>
        {sort === "custom" && current.length > 1 && (
          <p className="muted small hint"><Icon name="grip-vertical" /> Drag a link by its handle to move it within its group.</p>
        )}

        {groups.map(([name, links]) => (
          <section key={name || "all"} className="group">
            {name && <GroupHeading groupBy={groupBy} name={name} links={links} busy={busy} onRename={(from, to) => act({ action: "rename_topic", from, to })} />}
            <LinkGroup links={links} draggable={sort === "custom"} onReorder={reorder} cardProps={cardProps} />
          </section>
        ))}
        {!current.length && <p className="muted">No links yet.</p>}
        {current.length > 0 && !shown && <p className="muted">No links match "{query}".</p>}

        {archived.length > 0 && (
          <section className="group archived">
            <button type="button" className="secondary archive-toggle" aria-expanded={showArchived} onClick={() => setShowArchived(!showArchived)}>
              <Icon name="box-archive" /> Archived ({archived.length}) <Icon name="chevron-down" className={"chevron" + (showArchived ? " up" : "")} />
            </button>
            {showArchived && (
              <>
                <p className="muted small">Archived links are hidden here but still work. Open one to restore it.</p>
                <LinkGroup links={[...archived].sort((a, b) => time(b.archived_at) - time(a.archived_at))} draggable={false} onReorder={reorder} cardProps={cardProps} />
              </>
            )}
          </section>
        )}
      </div>

      <div className="card">
        <h2><Icon name="robot" /> Connected AI chats</h2>
        <p className="muted">Chats that can create and list links through <span className="code">/mcp</span>. Disconnecting stops them at once; they can reconnect only with the passcode.</p>
        <ul className="apps">
          {(data?.apps || []).map((app) => (
            <li key={app.client_id}>
              <div>
                <strong><Icon name="robot" /> {app.client_name || "AI chat"}</strong>
                <div className="muted small">
                  <span className="code">{app.redirect_host || "—"}</span> · connected {new Date(app.created_at).toLocaleDateString()} · last used {app.last_used_at ? ago(app.last_used_at) : "never"}
                </div>
              </div>
              <button className="danger" onClick={() => { if (window.confirm("Disconnect " + (app.client_name || "this chat") + "?")) act({ action: "revoke_app", client_id: app.client_id }); }}><Icon name="plug-circle-xmark" /> Disconnect</button>
            </li>
          ))}
          {!data?.apps?.length && <li className="muted">No chats connected yet.</li>}
        </ul>
      </div>
    </main>
  );
}
