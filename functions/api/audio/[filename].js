const GITHUB_OWNER = "tonychuang738-lang";
const GITHUB_REPO = "novelsite";

function getTag(filename) {
  if (filename.startsWith("santi_v2_")) return "audio-santi-v2";
  if (filename.startsWith("renshijian_v2_")) return "audio-renshijian-v2";
  if (filename.startsWith("renshijian_")) return "audio-renshijian-v1";
  if (filename.startsWith("2001space_")) return "audio-2001space-v1";
  if (filename.startsWith("qiuzhuang_")) return "audio-qiuzhuang-v1";
  if (filename.startsWith("beijing_")) return "audio-beijing-v1";
  if (filename.startsWith("wandering_")) return "audio-wandering-v1";
  if (filename.startsWith("liulang_")) return "audio-liulang-v1";
  if (filename.startsWith("huozhe_")) return "audio-huozhe-v1";
  if (filename.startsWith("weicheng_")) return "audio-weicheng-v1";
  if (filename.startsWith("xiangcun_")) return "audio-xiangcun-v1";
  if (filename.startsWith("chaowendao_")) return "audio-chaowendao-v1";
  if (filename.startsWith("daishang_")) return "audio-daishang-v1";
  if (filename.startsWith("chaoxinxing_")) return "audio-chaoxinxing-v1";
  if (filename.startsWith("pingfan_")) return "audio-pingfan-v1";
  if (filename.startsWith("bailuyuan_")) return "audio-bailuyuan-v1";
  if (filename.startsWith("yhjidi_")) return "audio-yhjidi-v1";
  return "audio-v1"; // 三体原版
}

export async function onRequest(context) {
  const { request, params } = context;
  const filename = params.filename;
  if (!filename || !/^[a-zA-Z0-9_.-]+\.mp3$/.test(filename)) {
    return new Response("Invalid filename", { status: 400 });
  }
  const tag = getTag(filename);
  const githubUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${tag}/${filename}`;
  const headers = new Headers();
  const range = request.headers.get("Range");
  if (range) headers.set("Range", range);
  const response = await fetch(githubUrl, { headers });
  if (response.status === 302 || response.status === 301) {
    const redirectResponse = await fetch(response.headers.get("Location"), { headers });
    const h = new Headers(redirectResponse.headers);
    h.set("Access-Control-Allow-Origin", "*");
    h.set("Cache-Control", "public, max-age=31536000, immutable");
    h.set("Content-Type", "audio/mpeg");
    return new Response(redirectResponse.body, { status: redirectResponse.status, headers: h });
  }
  const h = new Headers(response.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Cache-Control", "public, max-age=31536000, immutable");
  h.set("Content-Type", "audio/mpeg");
  return new Response(response.body, { status: response.status, headers: h });
}
