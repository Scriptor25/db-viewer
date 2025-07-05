import {fetchJSON, QueryResult} from "@/util/api";

export type FacilityType = "ESCALATOR" | "ELEVATOR";
export type FacilityState = "ACTIVE" | "INACTIVE" | "UNKNOWN";

/**
 * A facility provided by this API is either a public elevator or escalator located at a German railway station.
 */
export type FacilityStatusData = {
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

export type StationFacilityStatusData = {
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

export async function getAllFacilitiesStatus(query?: {
    type?: FacilityType[],
    state?: FacilityState[],
    equipmentnumbers?: number[],
    stationnumber?: number,
    area?: [string, string, string, string],
}): Promise<QueryResult<FacilityStatusData>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.type)
            for (const value of query.type)
                params.append("type", value);
        if (query.state)
            for (const value of query.state)
                params.append("state", value);
        if (query.equipmentnumbers)
            for (const value of query.equipmentnumbers)
                params.append("equipmentnumbers", value.toString(10));
        if (query.stationnumber)
            params.set("stationnumber", query.stationnumber.toString(10));
        if (query.area)
            params.set("area", query.area.join(","));
    }

    const result = await fetchJSON<FacilityStatusData[], null>(
        `fasta/v2/facilities?${params}`,
        undefined,
        async response => {
            if (response.status === 404) {
                return null;
            }
        });

    if (!result)
        return {
            limit: 0,
            offset: 0,
            total: 0,
            items: [],
        };

    return {
        limit: result.length,
        offset: 0,
        total: result.length,
        items: result,
    };
}

export async function getFacilityStatus(id: number) {
    return await fetchJSON<FacilityStatusData, null>(
        `fasta/v2/facilities/${id}`,
        undefined,
        async response => {
            if (response.status === 404) {
                return null;
            }
        });
}

export async function getStationFacilityStatus(id: number) {
    return await fetchJSON<StationFacilityStatusData, null>(
        `fasta/v2/stations/${id}`, {
            next: {revalidate: 3600},
        }, async response => {
            if (response.status === 404) {
                return null;
            }
        });
}
