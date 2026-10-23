import { createHash } from "node:crypto";

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function tagValue(block, tag) {
  const re = new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + "\\s*>", "i");
  const match = block.match(re);
  return match ? decodeXml(match[1].trim()) : "";
}

export function normalizeSourceUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Source URL must be an absolute URL.");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP(S) source URLs are accepted.");
  }
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_.+|fbclid|gclid|mc_cid|mc_eid)$/i.test(key)) url.searchParams.delete(key);
  }
  url.hostname = url.hostname.toLowerCase();
  if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) {
    url.port = "";
  }
  return url.toString();
}

export function parseRss(xml, { retrievedAt = new Date().toISOString(), maxItems = 100 } = {}) {
  if (typeof xml !== "string" || !xml.trim()) throw new Error("RSS input is empty.");
  if (!Number.isInteger(maxItems) || maxItems < 1 || maxItems > 1000) throw new Error("maxItems must be between 1 and 1000.");
  const title = tagValue(xml, "title") || "Untitled feed";
  const itemBlocks = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item\s*>/gi)].slice(0, maxItems);
  const byUrl = new Map();
  for (const match of itemBlocks) {
    const block = match[1];
    const rawUrl = tagValue(block, "link") || tagValue(block, "guid");
    if (!rawUrl) continue;
    let url;
    try { url = normalizeSourceUrl(rawUrl); } catch { continue; }
    const sourceTitle = tagValue(block, "title") || url;
    const description = tagValue(block, "description").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const rawDate = tagValue(block, "pubDate") || tagValue(block, "published") || tagValue(block, "updated");
    const parsedDate = rawDate ? new Date(rawDate) : null;
    const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null;
    const source = {
      id: createHash("sha256").update(url).digest("hex").slice(0, 16),
      title: sourceTitle,
      url,
      publishedAt,
      description,
      feedTitle: title,
      retrievedAt,
    };
    const existing = byUrl.get(url);
    if (!existing || source.description.length > existing.description.length) byUrl.set(url, source);
  }
  return [...byUrl.values()].sort((a, b) => {
    const dateA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const dateB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return dateB - dateA || a.title.localeCompare(b.title);
  });
}
