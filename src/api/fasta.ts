import { QueryResult, fetchJSON } from "@/util/api";
import { createQuery } from "@/util/query";
import { unstable_cache } from "next/cache";

export type FacilityType = "ESCALATOR" | "ELEVATOR";
export type FacilityState = "ACTIVE" | "INACTIVE" | "UNKNOWN";

/**
 * A facility provided by this API is either a public elevator or escalator located at a German railway station.
 */
export interface FacilityStatusData {
    /**
     * Textual description of the facility.
     */
    description?: string,
    /**
     * Unique identifier of the facility.
     */
    equipmentnumber: number,
    /**
     * Longitude component of geocoordinate in WGS84 format.
     */
    geocoordX?: number,
    /**
     * Latitude component of geocoordinate in WGS84 format.
     */
    geocoordY?: number,
    /**
     * The name of the operator of the facility.
     */
    operatorname?: string,
    /**
     * Operational state of the facility.
     */
    state: FacilityState,
    /**
     * Detailed description of the state.
     */
    stateExplanation?: string,
    /**
     * Number of the station the facility belongs to.
     */
    stationnumber: number,
    /**
     * Type of the facility.
     */
    type: FacilityType,
};

export interface StationFacilityStatusData {
    /**
     * Unique identifier of the station.
     */
    stationnumber: number,
    /**
     * Name of the station.
     */
    name: string,
    facilities?: FacilityStatusData[],
};

export const getAllFacilitiesStatus = (query?: {
    type?: FacilityType[],
    state?: FacilityState[],
    equipmentnumbers?: number[],
    stationnumber?: number,
    area?: [string, string, string, string],
}): Promise<QueryResult<FacilityStatusData>> => unstable_cache(async () => {
    const params = new URLSearchParams();

    query && createQuery(params, query, (query, key) => {
        switch (key) {
            case "type":
            case "state":
                return query[key];
            case "equipmentnumbers":
                return query[key]?.map(value => value.toString(10));
            case "stationnumber":
                return query[key]?.toString(10);
            case "area":
                return query[key]?.join(",");
        }
    });

    const result = await fetchJSON<FacilityStatusData[], null>(
        `fasta/v2/facilities?${params}`,
        undefined,
        async response => {
            if (response.status === 404) {
                return null;
            }
        });

    if (!result) {
        return {
            limit: 0,
            offset: 0,
            total: 0,
            items: [],
        };
    }

    return {
        limit: result.length,
        offset: 0,
        total: result.length,
        items: result,
    };
}, [JSON.stringify(query)])();

export const getFacilityStatus = (id: number) => unstable_cache(async () => {
    return fetchJSON<FacilityStatusData, null>(
        `fasta/v2/facilities/${id}`,
        undefined,
        async response => {
            if (response.status === 404) {
                return null;
            }
        });
}, [`${id}`])();

export const getStationFacilityStatus = (id: number) => unstable_cache(async () => {
    return fetchJSON<StationFacilityStatusData, null>(
        `fasta/v2/stations/${id}`, {
        next: { revalidate: 3600 },
    }, async response => {
        if (response.status === 404) {
            return null;
        }
    });
}, [`${id}`])();
