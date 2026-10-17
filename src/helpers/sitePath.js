function normalizeBasePath(basePath = process.env.SITE_BASE_PATH || "") {
  const segments = basePath.split("/").filter(Boolean);
  return segments.length ? `/${segments.join("/")}` : "";
}

function withBasePath(path, basePath = process.env.SITE_BASE_PATH || "") {
  if (typeof path !== "string" || !path || /^(?:[a-z][a-z\d+.-]*:|\/\/|[#?])/i.test(path)) {
    return path;
  }

  const base = normalizeBasePath(basePath);
  if (!base) return path;

  const absolutePath = path.startsWith("/") ? path : `/${path}`;
  if (
    absolutePath === base ||
    absolutePath.startsWith(`${base}/`) ||
    absolutePath.startsWith(`${base}?`) ||
    absolutePath.startsWith(`${base}#`)
  ) {
    return absolutePath;
  }

  return `${base}${absolutePath === "/" ? "/" : absolutePath}`;
}

function withoutBasePath(path, basePath = process.env.SITE_BASE_PATH || "") {
  if (typeof path !== "string" || !path) return path;

  const base = normalizeBasePath(basePath);
  if (!base) return path;
  if (path === base || path === `${base}/`) return "/";
  if (path.startsWith(`${base}/`)) return path.slice(base.length);
  return path;
}

module.exports = { normalizeBasePath, withBasePath, withoutBasePath };