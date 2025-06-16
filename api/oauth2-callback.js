export default function handler(req, res) {
  const { query } = req;
  const { state, ...rest } = query;

  if (!state) return res.status(400).send("Missing state");

  try {
    const url = new URL(Buffer.from(state, "base64url").toString("utf8"));

    const allowedHosts = ["localhost", "app.primautomation.nl", "repl.co"];
    const isAllowed = allowedHosts.some((host) =>
      host.startsWith("*.") ? url.hostname.endsWith(host.slice(2)) : url.hostname === host
    );

    if (!isAllowed) return res.status(403).send("Untrusted target");

    const queryString = new URLSearchParams({ ...rest, state }).toString();
    return res.redirect(307, `${url.origin}/oauth2/callback?${queryString}`);
  } catch {
    return res.status(400).send("Invalid state");
  }
}
