"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ slug: "", destination_url: "", title: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const linkById = useMemo(
    () => Object.fromEntries((data?.links || []).map((link) => [link.id, link])),
    [data]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("shortenerAdminSecret");
    if (saved) {
      setSecret(saved);
      load(saved);
    }
  }, []);

  async function api(method, body, currentSecret = secret) {
    const response = await fetch("/api/admin", {
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
      setForm({ slug: "", destination_url: "", title: "" });
      setMessage("Link created.");
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function act(body) {
    setBusy(true);
    setMessage("");
    try {
      await api("POST", body);
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="shell">
        <div className="card">
          <h1>Link admin</h1>
          <p className="muted">Enter the private admin passcode.</p>
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
          <p className="muted">Create branded links and review lightweight click analytics.</p>
        </div>
        <button className="secondary" onClick={() => { sessionStorage.removeItem("shortenerAdminSecret"); setUnlocked(false); setSecret(""); }}>
          Lock
        </button>
      </div>

      <div className="grid stats">
        <div className="card stat"><span className="muted">Links</span><strong>{data?.summary.links || 0}</strong></div>
        <div className="card stat"><span className="muted">Active</span><strong>{data?.summary.active || 0}</strong></div>
        <div className="card stat"><span className="muted">Total clicks</span><strong>{data?.summary.totalClicks || 0}</strong></div>
        <div className="card stat"><span className="muted">Recent events loaded</span><strong>{data?.summary.recentClicks || 0}</strong></div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <h2>Create a short link</h2>
        <form className="form-grid" onSubmit={createLink}>
          <label>Slug<input placeholder="cv" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <label>Destination<input type="url" placeholder="https://www.nimdvir.com/cv/" value={form.destination_url} onChange={(e) => setForm({ ...form, destination_url: e.target.value })} required /></label>
          <label>Title<input placeholder="CV" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <button disabled={busy}>Create</button>
        </form>
        {message && <p className={"notice " + (message.includes("created") ? "success" : "error")}>{message}</p>}
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <h2>Links</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Short link</th><th>Destination</th><th>Clicks</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {(data?.links || []).map((link) => (
                <tr key={link.id}>
                  <td><span className="code">/{link.slug}</span>{link.title ? <><br/><span className="muted">{link.title}</span></> : null}</td>
                  <td><a href={link.destination_url} target="_blank" rel="noreferrer">{link.destination_url}</a></td>
                  <td>{link.click_count || 0}</td>
                  <td><span className="pill">{link.is_active ? "Active" : "Paused"}</span></td>
                  <td>
                    <div className="actions">
                      <button className="secondary" onClick={() => navigator.clipboard.writeText(window.location.origin + "/" + link.slug)}>Copy</button>
                      <button className="secondary" onClick={() => act({ action: "toggle", id: link.id, is_active: !link.is_active })}>{link.is_active ? "Pause" : "Activate"}</button>
                      <button className="danger" onClick={() => { if (window.confirm("Delete /" + link.slug + "?")) act({ action: "delete", id: link.id }); }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.links?.length && <tr><td colSpan="5" className="muted">No links yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Recent clicks</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Link</th><th>When</th><th>Device</th><th>Browser / OS</th><th>Location</th><th>Referrer</th></tr></thead>
            <tbody>
              {(data?.recentClicks || []).map((click) => {
                const link = linkById[click.link_id];
                return (
                  <tr key={click.id}>
                    <td className="code">/{link?.slug || click.link_id}</td>
                    <td>{new Date(click.clicked_at).toLocaleString()}</td>
                    <td>{click.device_type || "—"}</td>
                    <td>{[click.browser, click.os].filter(Boolean).join(" / ") || "—"}</td>
                    <td>{[click.city, click.region, click.country].filter(Boolean).join(", ") || "—"}</td>
                    <td>{click.referrer || "Direct / unavailable"}</td>
                  </tr>
                );
              })}
              {!data?.recentClicks?.length && <tr><td colSpan="6" className="muted">No clicks yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
