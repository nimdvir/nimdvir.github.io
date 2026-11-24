// OAuth discovery lives under /.well-known (RFC 8414 and RFC 9728). Clients may also ask for the
// path-suffixed form, such as /.well-known/oauth-protected-resource/mcp.
const nextConfig = {
  async rewrites() {
    return [
      { source: "/.well-known/oauth-protected-resource", destination: "/api/oauth/protected-resource" },
      { source: "/.well-known/oauth-protected-resource/:path*", destination: "/api/oauth/protected-resource" },
      { source: "/.well-known/oauth-authorization-server", destination: "/api/oauth/metadata" },
      { source: "/.well-known/oauth-authorization-server/:path*", destination: "/api/oauth/metadata" },
    ];
  },
};

export default nextConfig;
