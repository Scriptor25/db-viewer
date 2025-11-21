import { QueryResult, fetchXML } from "@/util/api";
import { TimestampString } from "@/util/type";
import { unstable_cache } from "next/cache";

/**
 * An additional message to a given station-based disruption by a specific distributor.
 */
export interface DistributorMessage {
    /**
     * Internal text.
     */
    int: string,
    /**
     * Distributor name.
     */
    n: string,
    /**
     * Distributor type.
     * * s - CITY
     * * r - REGION
     * * f - LONG DISTANCE
     * * x - OTHER
     */
    t: "s" | "r" | "f" | "x",
    /**
     * Timestamp. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    ts: TimestampString,
};

/**
 * A message that is associated with an event, a stop or a trip.
 */
export interface Message {
    /**
     * Code.
     */
    c?: number,
    /**
     * Category.
     */
    cat?: string,
    /**
     * Deleted.
     */
    del?: number,
    /**
     * Distributor message.
     */
    dm?: DistributorMessage | DistributorMessage[],
    /**
     * External category.
     */
    ec?: string,
    /**
     * External link associated with the message.
     */
    elnk?: string,
    /**
     * External text.
     */
    ext?: string,
    /**
     * Valid from. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    from?: TimestampString,
    /**
     * Message id.
     */
    id: string,
    /**
     * Internal text.
     */
    int?: string,
    /**
     * Owner.
     */
    o?: string,
    /**
     * Priority. * 1 - HIGH * 2 - MEDIUM * 3 - LOW * 4 - DONE
     */
    pr?: "1" | "2" | "3" | "4",
    /**
     * Message status
     * * h - HIM A HIM message (generated through the Hafas Information Manager).
     * * q - QUALITY CHANGE A message about a quality change.
     * * f - FREE A free text message.
     * * d - CAUSE OF DELAY A message about the cause of a delay.
     * * i - IBIS An IBIS message (generated from IRIS-AP).
     * * u - UNASSIGNED IBIS MESSAGE An IBIS message (generated from IRIS-AP) not yet assigned to a train.
     * * r - DISRUPTION A major disruption.
     * * c - CONNECTION A connection.
     */
    t: "h" | "q" | "f" | "d" | "i" | "u" | "r" | "c",
    /**
     * Trip label.
     */
    tl?: TripLabel | TripLabel[],
    /**
     * Valid to. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    to?: TimestampString,
    /**
     * Timestamp. The time, in ten digit 'YYMMddHHmm' format, e.g. "1404011437" for 14:37 on April the 1st of 2014.
     */
    ts: TimestampString,
};

/**
 * It's a compound data type that contains common data items that characterize a Trip.
 * The contents are represented as a compact 6-tuple in XML.
 */
export interface TripLabel {
    /**
     * Category. Trip category, e.g. "ICE" or "RE".
     */
    c: string,
    /**
     * Filter flags.
     */
    f?: string,
    /**
     * Trip/train number, e.g. "4523".
     */
    n: string,
    /**
     * Owner. A unique short-form and only intended to map a trip to specific evu.
     */
    o: string,
    /**
     * Trip type
     */
    t?: "p" | "e" | "z" | "s" | "h" | "n",
};

/**
 * An event (arrival or departure) that is part of a stop.
 */
export interface Event {
    /**
     * Changed distant endpoint.
     */
    cde?: string,
    /**
     * Cancellation time. Time when the cancellation of this stop was created.
     * The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    clt?: TimestampString,
    /**
     * Changed platform.
     */
    cp?: string,
    /**
     * Changed path.
     */
    cpth?: string,
    /**
     * Event status.
     * * p - PLANNED The event was planned. This status is also used when the cancellation of an event has been revoked.
     * * a - ADDED The event was added to the planned data (new stop).
     * * c - CANCELLED The event was canceled (as changedstatus, can apply to planned and added stops).
     */
    cs?: "p" | "a" | "c",
    /**
     * Changed time. New estimated or actual departure or arrival time.
     * The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    ct?: TimestampString,
    /**
     * Distant change.
     */
    dc?: number,
    /**
     * Hidden.1 if the event should not be shown on WBT
     * because travellers are not supposed to enter or exit the train at this stop.
     */
    hi?: number,
    /**
     * Line. The line indicator (e.g. "3" for an S-Bahn or "45S" for a bus).
     */
    l?: string,
    /**
     * List of messages.
     */
    m?: Message | Message[],
    /**
     * Planned distant endpoint.
     */
    pde?: string,
    /**
     * Planned platform.
     */
    pp?: string,
    /**
     * Planned Path. A sequence of station names separated by the pipe symbols ('|').
     * E.g.: 'Mainz Hbf|Rüsselsheim|Frankfrt(M) Flughafen'. For arrival, the path indicates the stations that come
     * before the current station. The first element then is the trip's start station. For departure, the path
     * indicates the stations that come after the current station. The last element in the path then is the
     * trip's destination station. Note that the current station is never included in the path
     * (neither for arrival nor for departure).
     */
    ppth?: string,
    /**
     * Event status.
     * * p - PLANNED The event was planned. This status is also used when the cancellation of an event has been revoked.
     * * a - ADDED The event was added to the planned data (new stop).
     * * c - CANCELLED The event was canceled (as changedstatus, can apply to planned and added stops).
     */
    ps?: "p" | "a" | "c",
    /**
     * Planned time. Planned departure or arrival time.
     * The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    pt?: TimestampString,
    /**
     * Transition. Trip id of the next or previous train of a shared train. At the start stop this references
     * the previous trip, at the last stop it references the next trip. E.g. '2016448009055686515-1403311438-1'
     */
    tra?: string,
    /**
     * Wing. A sequence of trip id separated by the pipe symbols ('|'). E.g. '-906407760000782942-1403311431'.
     */
    wings?: string,
};

/**
 * It's information about a connected train at a particular stop.
 */
export interface Connection {
    /**
     * Connection status.
     * * w - WAITING This (regular) connection is waiting.
     * * n - TRANSITION This (regular) connection CANNOT wait.
     * * a - ALTERNATIVE This is an alternative (unplanned) connection that has been introduced as a replacement
     * for one regular connection that cannot wait. The connections "tl" (triplabel) attribute might in this case
     * refer to the replaced connection (or more specifi-cally the trip from that connection). Alternative
     * connections are always waiting (they are re-moved otherwise).
     */
    cs: "w" | "n" | "a",
    /**
     * EVA station number.
     */
    eva?: number,
    /**
     * Id.
     */
    id: string,
    /**
     * A stop is a part of a Timetable.
     */
    ref?: TimetableStop,
    /**
     * A stop is a part of a Timetable.
     */
    s: TimetableStop,
    /**
     * Time stamp.
     * The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    ts: TimestampString,
};

/**
 * It's the history of all delay-messages for a stop. This element extends HistoricChange.
 */
export interface HistoricDelay {
    /**
     * The arrival event. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    ar?: TimestampString,
    /**
     * Detailed description of delay cause.
     */
    cod?: string,
    /**
     * The departure event. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    dp?: TimestampString,
    /**
     * Delay source.
     * * L - LEIBIT LeiBit/LeiDis.
     * * NA - RISNE AUT IRIS-NE (automatisch).
     * * NM - RISNE MAN IRIS-NE (manuell).
     * * V - VDV Prognosen durch dritte EVU über VDVin.
     * * IA - ISTP AUT ISTP automatisch.
     * * IM - ISTP MAN ISTP manuell.
     * * A - AUTOMATIC PROGNOSIS Automatische Prognose durch Prognoseautomat.
     */
    src?: "L" | "NA" | "NM" | "V" | "IA" | "IM" | "A",
    /**
     * Timestamp. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    ts: TimestampString,
};

/**
 * It's the history of all platform-changes for a stop. This element extends HistoricChange.
 */
export interface HistoricPlatformChange {
    /**
     * Arrival platform.
     */
    ar?: string,
    /**
     * Detailed cause of track change.
     */
    cot?: string,
    /**
     * Departure platform.
     */
    dp?: string,
    /**
     * Timestamp. The time, in ten digit 'YYMMddHHmm' format, e.g. '1404011437' for 14:37 on April the 1st of 2014.
     */
    ts: TimestampString,
};

/**
 * A reference trip is another real trip, but it doesn't have its own stops and events. It refers only to its
 * referenced regular trip. The reference trip collects mainly all different attributes of the referenced regular trip.
 */
export interface ReferenceTrip {
    /**
     * The cancellation flag. True means, the reference trip is cancelled.
     */
    c: boolean,
    /**
     * It's a compound data type that contains common data items that characterize a reference trip stop.
     * The contents are represented as a compact 4-tuple in XML.
     */
    ea: ReferenceTripStop,
    /**
     * An id that uniquely identifies the reference trip. It consists of the following two elements separated by dashes:
     * * A 'daily trip id' that uniquely identifies a reference trip within one day. This id is typically reused on
     * subsequent days. This could be negative.
     * * A 10-digit date specifier (YYMMddHHmm) that indicates the planned departure date of the referenced regular
     * trip from its start station. Example: '-7874571842864554321-1403311221' would be used for a trip with daily trip
     * id '-7874571842864554321' that starts on March the 31st 2014.
     */
    id: `${number}-${TimestampString}`,
    /**
     * It's a compound data type that contains common data items that characterize a reference trip.
     * The contents are represented as a compact 3-tuple in XML.
     */
    rtl: ReferenceTripLabel,
    /**
     * It's a compound data type that contains common data items that characterize a reference trip stop.
     * The contents are represented as a compact 4-tuple in XML.
     */
    sd: ReferenceTripStop,
};

/**
 * It's a compound data type that contains common data items that characterize a reference trip.
 * The contents are represented as a compact 3-tuple in XML.
 */
export interface ReferenceTripLabel {
    /**
     * Category. Trip category, e.g. "ICE" or "RE".
     */
    c: string,
    /**
     * Trip/train number, e.g. "4523".
     */
    n: string,
};

/**
 * It's a compound data type that contains common data items that characterize a reference trip stop.
 * The contents are represented as a compact 4-tuple in XML.
 */
export interface ReferenceTripStop {
    /**
     * The eva number of the correspondent stop of the regular trip.
     */
    eva: number,
    /**
     * The index of the correspondent stop of the regular trip.
     */
    i: number,
    /**
     * The (long) name of the correspondent stop of the regular trip.
     */
    n: string,
    /**
     * The planned time of the correspondent stop of the regular trip.
     */
    pt: string,
};

/**
 * A reference trip relation holds how a reference trip is related to a stop, for instance the reference
 * trip starts after the stop. Stop contains a collection of that type, only if reference trips are available.
 */
export interface ReferenceTripRelation {
    /**
     * A reference trip is another real trip, but it doesn't have its own stops and events. It refers only to its
     * referenced regular trip. The reference trip collects mainly all different attributes of the referenced regular
     * trip.
     */
    rt: ReferenceTrip,
    /**
     * The reference trips relation to the stop, which contains it.
     * * b - BEFORE The reference trip ends before that stop.
     * * e - END The reference trips ends at that stop.
     * * c - BETWEEN The stop is between reference trips start and end, in other words, the stop is contained within
     * its travel path.
     * * s - START The reference trip starts at that stop.
     * * a - AFTER The reference trip starts after that stop.
     */
    rts: "b" | "e" | "c" | "s" | "a",
};

/**
 * A stop is a part of a Timetable.
 */
export interface TimetableStop {
    /**
     * Arrival.
     */
    ar?: Event,
    /**
     * Connection element.
     */
    conn?: Connection | Connection[],
    /**
     * Departure.
     */
    dp?: Event,
    /**
     * The eva code of the station of this stop. Example '8000105' for Frankfurt(Main)Hbf.
     */
    eva: number,
    /**
     * Historic delay element.
     */
    hd?: HistoricDelay | HistoricDelay[],
    /**
     * Historic platform change element.
     */
    hpc?: HistoricPlatformChange | HistoricPlatformChange[],
    /**
     * An id that uniquely identifies the stop. It consists of the following three elements separated by dashes
     * * a 'daily trip id' that uniquely identifies a trip within one day. This id is typically reused on
     * subsequent days. This could be negative.
     * * a 6-digit date specifier (YYMMdd) that indicates the planned departure date of the trip from its start station.
     * * an index that indicates the position of the stop within the trip (in rare cases, one trip may arrive
     * multiple times at one station). Added trips get indices above 100. Example '-7874571842864554321-1403311221-11'
     * would be used for a trip with daily trip id '-7874571842864554321' that starts on march the 31th 2014 and
     * where the current station is the 11th stop.
     */
    id: string,
    /**
     * Message element.
     */
    m?: Message | Message[],
    /**
     * It's a reference to another trip, which holds its label and reference trips, if available.
     */
    ref?: {
        /**
         * The referred trips reference trip elements.
         */
        rt?: TripLabel | TripLabel[],
        /**
         * It's a compound data type that contains common data items that characterize a Trip.
         * The contents are represented as a compact 6-tuple in XML.
         */
        tl: TripLabel,
    },
    /**
     * Reference trip relation element.
     */
    rtr?: ReferenceTripRelation | ReferenceTripRelation[],
    /**
     * It's a compound data type that contains common data items that characterize a Trip.
     * The contents are represented as a compact 6-tuple in XML.
     */
    tl?: TripLabel,
};

/**
 * A timetable is made of a set of TimetableStops and a potential Disruption.
 */
export interface TimetableData {
    /**
     * EVA station number.
     */
    eva: number,
    /**
     * List of Message.
     */
    m?: Message | Message[],
    /**
     * List of TimetableStop.
     */
    s?: TimetableStop | TimetableStop[],
    /**
     * Station name.
     */
    station?: string,
};

export interface TimetableStationData {
    ds100: string,
    eva: number,
    meta?: string,
    name: string,
    p?: string,
};

export interface MultipleTimetableStationData {
    station: TimetableStationData | TimetableStationData[],
};

/**
 * @param id station eva number
 */
export const getKnownChanges = (id: number) => unstable_cache(async () => {
    const result = await fetchXML<{ timetable: TimetableData }>(`timetables/v1/fchg/${id}`);

    if (!result) {
        return null;
    }

    return result.timetable;
}, [`${id}`])();

/**
 * @param id station eva number
 */
export const getRecentChanges = (id: number) => unstable_cache(async () => {
    const result = await fetchXML<{ timetable: TimetableData }>(`timetables/v1/rchg/${id}`);

    if (!result) {
        return null;
    }

    return result.timetable;
}, [`${id}`])();

/**
 * @param id station eva number
 * @param date format YYMMDD
 * @param hour format HH
 */
export const getPlan = (id: number, date: string, hour: string) => unstable_cache(async () => {
    const result = await fetchXML<{ timetable: TimetableData }>(`timetables/v1/plan/${id}/${date}/${hour}`);

    if (!result) {
        return null;
    }

    return result.timetable;
}, [`${id}`, date, hour])();

/**
 * @param pattern station name (prefix), eva number, ds100 / rl100 code, wildcard (*)
 */
export const getStationsForPattern = (pattern: string): Promise<QueryResult<TimetableStationData>> => unstable_cache(async () => {
    const result = await fetchXML<{ stations: MultipleTimetableStationData }>(`timetables/v1/station/${pattern}`);

    if (!result) {
        return {
            limit: 0,
            offset: 0,
            total: 0,
            items: [],
        };
    }

    if (Array.isArray(result.stations.station)) {
        return {
            limit: result.stations.station.length,
            offset: 0,
            total: result.stations.station.length,
            items: result.stations.station,
        };
    }

    return {
        limit: 1,
        offset: 0,
        total: 1,
        items: [result.stations.station],
    };
}, [pattern])();
