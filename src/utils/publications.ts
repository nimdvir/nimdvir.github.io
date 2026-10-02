import { getCollection } from "astro:content";

export async function getPublications() {
  return (await getCollection("publications", ({ data }) => !data.draft)).sort(
    (a, b) =>
      b.data.year.localeCompare(a.data.year) ||
      a.data.title.localeCompare(b.data.title),
  );
}
