
export async function GET(request: Request): Promise<Response> {

    const url = new URL(request.url).searchParams.get("url");
    if (!url) {
        return Response.json({ error: "missing url parameter" }, { status: 400 });
    }

    try {
        const response = await fetch(url, { method: "GET", headers: request.headers });

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                "Content-Type": response.headers.get("Content-Type") ?? "application/json",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        return Response.json({
            error: "proxy request failed",
            details: (error as { message: string }).message,
        }, {
            status: 500,
        });
    }
}

export const OPTIONS = async () => Response.json({}, {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
});
