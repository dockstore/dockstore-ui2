const PROXY_CONFIG = [
{
  context : [
    "/api",
    "/auth",
    "/containers",
    "/entries",
    "/metadata",
    "/organizations",
    "/users",
    "/workflows"],
    "target": "http://localhost:8080"
}
]

module.exports = PROXY_CONFIG;
