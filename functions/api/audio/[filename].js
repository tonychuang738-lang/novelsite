const GITHUB_OWNER = "tonychuang738-lang";
const GITHUB_REPO = "novelsite";
const GITHUB_TAG = "audio-v1";

export async function onRequest(context) {
  const { request, params } = context;
  const filename = params.filename;

  if (!filename || !/^[a-zA-Z0-9_.-]+\.mp3$/.test(filename)) {
    return new Response("Invalid filename", { status: 400 });
  }

  const githubUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${GITHUB_TAG}/${filename}`;

  const headers = new Headers();
  const rangeHeader = request.headers.get("Range");
  if (rangeHeader) headers.set("Range", rangeHeader);

  try {
    const upstream = await fetch(githubUrl, {
      method: "GET",
      headers,
      redirect: "follow",
    });

    const respHeaders = new Headers();
    respHeaders.set("Content-Type", "audio/mpeg");
    respHeaders.set("Accept-Ranges", "bytes");
    respHeaders.set("Access-Control-Allow-Origin", "*");
    respHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

    const contentLength = upstream.headers.get("Content-Length");
    const contentRange = upstream.headers.get("Content-Range");
    if (contentLength) respHeaders.set("Content-Length", contentLength);
    if (contentRange) respHeaders.set("Content-Range", contentRange);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: respHeaders,
    });
  } catch (e) {
    return new Response("Upstream error: " + e.message, { status: 502 });
  }
}
