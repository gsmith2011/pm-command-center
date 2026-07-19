// Map workspace-relative markdown paths to app routes.
// Curated surfaces own the big areas; /files/* is the universal artifact viewer
// (source, ingestion, features, rules, docs, INDEXes) — every path renders somewhere.

export function hrefFor(wsPath: string): string {
  const noExt = wsPath.replace(/\.md$/, "");
  const [head, ...rest] = noExt.split("/");
  if (head === "hypotheses" && rest.length === 1 && rest[0] !== "INDEX" && rest[0] !== "_SCHEMA")
    return `/hypotheses/${rest[0]}`;
  if (head === "decisions" && rest.length === 1 && rest[0] !== "INDEX" && rest[0] !== "_SCHEMA")
    return `/decisions/${rest[0]}`;
  if (head === "stakeholders" && rest.length === 1 && rest[0] !== "INDEX" && rest[0] !== "_SCHEMA")
    return `/stakeholders/${rest[0]}`;
  if (wsPath === "knowledge/strategy.md") return "/strategy";
  if (head === "knowledge" && rest[0] === "users") return "/users";
  if (wsPath === "knowledge/product/metrics.md") return "/product#metrics";
  if (wsPath === "knowledge/product/roadmap.md") return "/product#roadmap";
  if (head === "knowledge" && rest[0] === "market") return "/market";
  if (head === "knowledge" && rest[0] === "org") return "/org";
  if (head === "maintenance" && rest[0] === "log") return `/review#${rest[1]}`;
  // everything else — including knowledge/product/features/* — gets the file viewer
  return `/files/${noExt}`;
}

/** Strip a #fragment from a workspace path before routing. */
export function hrefForTarget(target: string): string {
  const [p, frag] = target.split("#");
  const base = hrefFor(p);
  return frag && !base.includes("#") ? `${base}` : base;
}
