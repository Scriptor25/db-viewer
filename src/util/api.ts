import { XMLParser } from "fast-xml-parser";

export interface QueryResult<T> {
    limit: number,
    offset: number,
    total: number,
    items: T[],
};

export async function fetchAPI<E>(resource: string, accept: string, partialInit?: RequestInit, onError?: (response: Response) => Promise<E | undefined>): Promise<{
    error: false,
    response: Response
} | {
    error: true,
    response: E,
}> {
    if (!process.env.API_ENDPOINT || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
        throw new Error("missing API_ENDPOINT, CLIENT_ID or CLIENT_SECRET environment variables");
    }

    const init: RequestInit = partialInit ?? {};
    init.headers = {
        "Accept": accept,

        "DB-Client-Id": process.env.CLIENT_ID,
        "DB-Api-Key": process.env.CLIENT_SECRET,

        ...init.headers,
    };

    const response = await fetch(`${process.env.API_ENDPOINT}/${resource}`, init);

    if (!response.ok) {
        const result = onError ? await onError(response) : undefined;
        if (result === undefined) {
            throw new Error(`failed to fetch api resource ${resource}: ${response.url} - ${response.status} - ${response.statusText}`);
        }
        return { error: true, response: result };
    }

    return { error: false, response };
}

export async function fetchXML<T, E = never>(resource: string, partialInit?: RequestInit, onError?: (response: Response) => Promise<E | undefined>): Promise<T | E> {

    const { error, response } = await fetchAPI<E>(resource, "application/xml", partialInit, onError);

    if (error)
        return response;

    const xml = await response.text();

    const object = new XMLParser({
        parseTagValue: true,
        parseAttributeValue: true,
        allowBooleanAttributes: true,
        ignoreAttributes: false,
        attributeNamePrefix: "",
    }).parse(xml, {
        allowBooleanAttributes: true,
    });

    return object as T;
}

export async function fetchJSON<T, E = never>(resource: string, partialInit?: RequestInit, onError?: (response: Response) => Promise<E | undefined>): Promise<T | E> {

    const { error, response } = await fetchAPI(resource, "application/json", partialInit, onError);

    if (error) {
        return response;
    }

    return response.json();
}
