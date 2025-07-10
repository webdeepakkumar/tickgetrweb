export const dynamic = 'force-dynamic'; 

export async function GET(req) {
  try {
    const base = req.headers.get("host") ? `https://${req.headers.get("host")}` : 'https://example.com';
    const { searchParams } = new URL(req.url || '', base);
    const url = searchParams.get("url");

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing file URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(url);
    if (!response.ok) console.error("Failed to fetch file");

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const filename = url.split("/").pop().split("?")[0] || "downloaded-file";

    return new Response(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new Response(JSON.stringify({ error: "Error fetching file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
