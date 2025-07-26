import {fetchJSON, QueryResult} from "@/util/api";

export type TimePeriod = {
    /**
     * ^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]
     */
    fromTime: string,
    /**
     * ^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]
     */
    toTime: string,
};

export type Schedule = {
    monday: TimePeriod,
    tuesday: TimePeriod,
    wednesday: TimePeriod,
    thursday: TimePeriod,
    friday: TimePeriod,
    saturday: TimePeriod,
    sunday: TimePeriod,
    holiday: TimePeriod,
};

export type ScheduleRange = {
    monday1: TimePeriod,
    monday2: TimePeriod,
    tuesday1: TimePeriod,
    tuesday2: TimePeriod,
    wednesday1: TimePeriod,
    wednesday2: TimePeriod,
    thursday1: TimePeriod,
    thursday2: TimePeriod,
    friday1: TimePeriod,
    friday2: TimePeriod,
    saturday1: TimePeriod,
    saturday2: TimePeriod,
    sunday1: TimePeriod,
    sunday2: TimePeriod,
};

export type Address = {
    city: string,
    houseNumber?: string,
    street: string,
    zipcode: string,
};

/**
 * GEOJSON object of type point. By default, WGS84 is the coordinate system in GEOJSON.
 */
export type Location = {
    /**
     * first value is longitude, second latitude, third altitude (currently not provided)
     */
    coordinates: [number, number, number],
    /**
     * the type of the GEOJSON Object e.g. point. Currently only point coordinates without altitude are provided.
     */
    type: string,
};

export type RegionalDepartmentData = {
    number: number,
    name: string,
    shortName: string,
};

export type StationManagementData = {
    number: number,
    name: string,
};

/**
 * 3-S-Centers are 7/24 hours operating centers for german railway stations
 */
export type SCenterData = {
    number: number,
    /**
     * unique identifier of 3-S-Center
     */
    name: string,
    address?: Address,
    /**
     @deprecated
     * email adress of the 3-S-Center (no longer supported!)
     */
    email?: string,
    internalFaxNumber?: string,
    internalPhoneNumber?: string,
    /**
     @deprecated
     * mobile phone number (no longer supported!)
     */
    mobilePhoneNumber?: string,
    publicFaxNumber?: string,
    publicPhoneNumber?: string,
    regionalbereich?: RegionalDepartmentData,
    stationManagement?: StationManagementData,
};

export type StationData = {
    DBinformation?: {
        availability: Schedule,
    },
    /**
     * local public sector entity, responsible for short distance public transport in a specific area
     */
    aufgabentraeger: {
        name: string,
        shortName: string,
    },
    /**
     * the stations category (-1...7). Stations with category -1 or 0 are not in production,
     * e.g. planned, saled, without train stops.
     */
    category: number,
    /**
     * station related EVA-Numbers
     */
    evaNumbers: {
        /**
         * EVA identifier
         */
        number: number,
        geographicCoordinates: Location,
        /**
         * isMain is supported for compatibility reasons only. The attribute has no business background
         * in terms of DB InfraGo AG.
         */
        isMain: boolean,
    }[],
    federalState: string,
    hasBicycleParking: boolean,
    hasCarRental: boolean,
    hasDBLounge: boolean,
    hasLocalPublicTransport: boolean,
    hasLockerSystem: boolean,
    hasLostAndFound: boolean,
    /**
     * values are 'no'
     * OR 'Nur nach Voranmeldung unter 030 65 21 28 88 (Ortstarif)'
     * OR 'Ja, um Voranmeldung unter 030 65 21 28 88 (Ortstarif) wird gebeten'
     */
    hasMobilityService: "no" | "Nur nach Voranmeldung unter 030 65 21 28 88 (Ortstarif)" | "Ja, um Voranmeldung unter 030 65 21 28 88 (Ortstarif) wird gebeten",
    hasParking: boolean,
    hasPublicFacilities: boolean,
    hasRailwayMission: boolean,
    hasSteplessAccess: "yes" | "no" | "partial" | null,
    hasTaxiRank: boolean,
    hasTravelCenter: boolean,
    hasTravelNecessities: boolean,
    hasWiFi: boolean,
    /**
     * the stations IFOPT number
     */
    ifopt: string,
    /**
     * a weekly schedule
     */
    localServiceStaff?: Schedule,
    mailingAddress: Address,
    mobilityServiceStaff?: {
        /**
         * a weekly schedule with 2 ranges
         */
        availability: {
            availability: ScheduleRange,
        },
        /**
         * mobility service on behalf of a railway company, advanced notification necessary
         */
        serviceOnBehalf: boolean,
        /**
         * staff is on site
         */
        staffOnSite: boolean,
    },
    name: string,
    /**
     * unique identifier representing a specific railway station
     */
    number: number,
    /**
     * determines in some respect the price for train stops at a specific station (1..7)
     */
    priceCategory: number,
    /**
     * reference object. an internal organization type of DB InfraGo AG, regional department.
     */
    regionalbereich: RegionalDepartmentData,
    /**
     * station related Ril100s
     */
    ril100Identifiers: {
        /**
         * Unique identifier of 'Betriebsstelle' according to Ril100
         */
        rilIdentifier: string,
        /**
         * is stations main Ril100. Determination of DB InfraGo AG
         */
        isMain: boolean,
        /**
         @deprecated
         * permission for steam engines y/n
         */
        hasSteamPermission: boolean,
        /**
         * Indicates whether the entry for a steam engine is restricted (eingeschränkt),
         * unrestricted (uneingeschränkt) or has an entryBan (Einfahrverbot).
         */
        steamPermission: "restricted" | "unrestricted" | "entryBan",
        geographicCoordinates: Location,
        /**
         * UIC Primary Location Code PLC
         */
        primaryLocationCode: string,
    }[],
    stationManagement: StationManagementData,
    szentrale: SCenterData,
    timeTableOffice: {
        email: string,
        name: string,
    },
    wirelessLan: {
        /**
         * amount of access points
         */
        amount: number,
        installDate: string,
        product: string,
    },
    productLine: {
        productLine: string,
        segment: string,
    },
};

export async function getAllStationsData(query?: {
    /**
     * The maximum number of hits to be returned by that query. If 'limit' is set greater than 10000, it will be reset
     * to 10000 internally and only 10000 hits will be returned.
     */
    limit?: number,
    /**
     * Offset of the first hit returned in the QueryResult object with respect to all hits returned by the query.
     * If this parameter is omitted, it will be set to 0 internally.
     */
    offset?: number,
    /**
     * String to search for a station name.
     * The wildcards * (indicating an arbitrary number of characters) and ? (indicating one single character)
     * can be used in the search pattern. A comma separated list of station names is also supported
     * (e.g. searchstring=hamburg*,berlin*).
     */
    searchstring?: string | string[],
    /**
     * Filter by station category. Category ranges are supported as well as lists of categories
     * (e.g. category=2-4 or category=1,3-5). The category must be between 1 and 7 otherwise a parameter exception
     * is returned.
     */
    category?: number | string | (number | string)[],
    /**
     * Filter by German federal state. Lists of federal states are also supported (e.g. federalstate=bayern,hamburg).
     * Wildcards are not allowed here.
     */
    federalstate?: string | string[],
    /**
     * Filter by EVA number. Wildcards are not allowed here.
     */
    eva?: number,
    /**
     * Filter by Ril100-identifier. Wildcards are not allowed here.
     */
    ril?: string,
    /**
     * Logical operator to combine query parameters (default=AND). See above for further details.
     * Allowed values: or, and
     */
    logicaloperator?: "or" | "and",
}): Promise<QueryResult<StationData>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.limit !== undefined)
            params.set("limit", query.limit.toString(10));
        if (query.offset !== undefined)
            params.set("offset", query.offset.toString(10));
        if (query.searchstring !== undefined) {
            if (typeof query.searchstring === "string")
                params.set("searchstring", query.searchstring);
            else for (const value of query.searchstring)
                params.append("searchstring", value);
        }
        if (query.category !== undefined) {
            if (typeof query.category === "string")
                params.set("category", query.category);
            else if (typeof query.category === "number")
                params.set("category", query.category.toString(10));
            else for (const value of query.category)
                    params.append("category", typeof value === "number" ? value.toString(10) : value);
        }
        if (query.federalstate !== undefined) {
            if (typeof query.federalstate === "string")
                params.set("federalstate", query.federalstate);
            else for (const value of query.federalstate)
                params.append("federalstate", value);
        }
        if (query.eva !== undefined)
            params.set("eva", query.eva.toString(10));
        if (query.ril !== undefined)
            params.set("ril", query.ril);
        if (query.logicaloperator !== undefined)
            params.set("logicaloperator", query.logicaloperator);
    }

    const result = await fetchJSON<{
        limit: number,
        offset: number,
        total: number,
        result: StationData[],
    }, null>(
        `station-data/v2/stations?${params}`, {
            next: {revalidate: 3600},
        }, async response => {
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
        limit: result.limit,
        offset: result.offset,
        total: result.total,
        items: result.result,
    };
}

export async function getStationData(id: number) {
    const result = await fetchJSON<{
        limit: number,
        offset: number,
        total: number,
        result: StationData[],
    }, null>(
        `station-data/v2/stations/${id}`, {
            next: {revalidate: 3600},
        }, async response => {
            if (response.status === 404) {
                return null;
            }
        });

    if (!result)
        return null;

    return result.result[0];
}

export async function getAll3SCentersData(query?: {
    /**
     * The maximum number of hits to be returned by that query. If 'limit' is set greater than 10000,
     * it will be reset to 10000 internally and only 100 hits will be returned.
     */
    limit?: number,
    /**
     * Offset of the first hit returned in the QueryResult object with respect to all hits returned by the query.
     * If this parameter is omitted, it will be set to 0 internally.
     */
    offset?: number,
}): Promise<QueryResult<SCenterData>> {
    const params = new URLSearchParams();

    if (query) {
        if (query.limit)
            params.set("limit", query.limit.toString(10));
        if (query.offset)
            params.set("offset", query.offset.toString(10));
    }

    const result = await fetchJSON<{
        limit: number,
        offset: number,
        total: number,
        result: SCenterData[],
    }, null>(
        `station-data/v2/szentralen?${params}`, {
            next: {revalidate: 3600},
        }, async response => {
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
        limit: result.limit,
        offset: result.offset,
        total: result.total,
        items: result.result,
    };
}

export async function get3SCenterData(id: number) {
    const result = await fetchJSON<{
        limit: number,
        offset: number,
        total: number,
        result: SCenterData[],
    }, null>(
        `station-data/v2/szentralen/${id}`, {
            next: {revalidate: 3600},
        }, async response => {
            if (response.status === 404) {
                return null;
            }
        });

    if (!result)
        return null;

    return result.result[0];
}
