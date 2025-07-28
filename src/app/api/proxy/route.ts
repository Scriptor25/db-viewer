import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest): Promise<Response> {

    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
        return NextResponse.json({error: "missing url parameter"}, {status: 400});
    }

    try {
        const response = await fetch(url, {method: "GET", headers: request.headers, cache: "force-cache"});

        const bytes = await response.bytes();

        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") ?? "application/json");
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        console.log(headers);

        return new NextResponse(bytes, {
            url: url,
            status: response.status,
            statusText: response.statusText,
            headers: headers,
        });
    } catch (error) {
        return NextResponse.json({
            error: "proxy request failed",
            details: (error as { message: string }).message,
        }, {
            status: 500,
        });
    }
}

export const OPTIONS = async () => NextResponse.json({}, {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
});
