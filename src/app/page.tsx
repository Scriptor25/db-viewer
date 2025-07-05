"use server";

import {getAllStationsData, StationData} from "@/api/stada";
import {FilterView} from "@/component/filter-view/filter-view";
import {PageView} from "@/component/page-view/page-view";
import {faCircle} from "@fortawesome/free-regular-svg-icons";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SearchParams} from "next/dist/server/request/search-params";
import Link from "next/link";

import styles from "./page.module.scss";

const ITEMS_PER_PAGE = 20;

async function StationView({hasQueryFilter, hasStateFilter, attributeFilter, ...element}: StationData & {
    hasQueryFilter?: boolean,
    hasStateFilter?: boolean,
    attributeFilter?: string[],
}) {
    const filterIf = (id: string) => attributeFilter?.includes(id)
        ? styles.filter
        : undefined;

    return (
        <Link href={`/station/${element.number}`} className={styles.station}>
            <span className={hasQueryFilter ? styles.filter : undefined}>{element.name}</span>
            <span className={hasStateFilter ? styles.filter : undefined}>{element.federalState}</span>
            <span className={filterIf("hasBicycleParking")}>
                <FontAwesomeIcon icon={element.hasBicycleParking ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasCarRental")}>
                <FontAwesomeIcon icon={element.hasCarRental ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasDBLounge")}>
                <FontAwesomeIcon icon={element.hasDBLounge ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasLocalPublicTransport")}>
                <FontAwesomeIcon icon={element.hasLocalPublicTransport ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasLockerSystem")}>
                <FontAwesomeIcon icon={element.hasLockerSystem ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasLostAndFound")}>
                <FontAwesomeIcon icon={element.hasLostAndFound ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasParking")}>
                <FontAwesomeIcon icon={element.hasParking ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasPublicFacilities")}>
                <FontAwesomeIcon icon={element.hasPublicFacilities ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasRailwayMission")}>
                <FontAwesomeIcon icon={element.hasRailwayMission ? faCheck : faClose}/>
            </span>
            <span>
                <FontAwesomeIcon icon={
                    element.hasSteplessAccess === "yes"
                        ? faCheck
                        : element.hasSteplessAccess === "no"
                            ? faClose
                            : faCircle
                }/>
            </span>
            <span className={filterIf("hasTaxiRank")}>
                <FontAwesomeIcon icon={element.hasTaxiRank ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasTravelCenter")}>
                <FontAwesomeIcon icon={element.hasTravelCenter ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasTravelNecessities")}>
                <FontAwesomeIcon icon={element.hasTravelNecessities ? faCheck : faClose}/>
            </span>
            <span className={filterIf("hasWiFi")}>
                <FontAwesomeIcon icon={element.hasWiFi ? faCheck : faClose}/>
            </span>
            <span>{element.category}</span>
            <span>{element.priceCategory}</span>
            <span>
                <FontAwesomeIcon icon={element.hasMobilityService === "no" ? faClose : faCheck}/>
                {element.hasMobilityService === "Nur nach Voranmeldung unter 030 65 21 28 88 (Ortstarif)"
                    ? "only by appointment"
                    : element.hasMobilityService === "Ja, um Voranmeldung unter 030 65 21 28 88 (Ortstarif) wird gebeten"
                        ? "advance registration is requested"
                        : undefined}
            </span>
        </Link>
    );
}

type Props = {
    searchParams: Promise<SearchParams>,
}

export default async function Page({searchParams}: Props) {

    const {query, states, attributes, mode} = await searchParams;

    const filterQuery = (query as string | undefined)?.split(/\s+/).map(value => `*${value}*`);
    const filterStates = (typeof states === "string") ? [states] : states;
    const filterAttributes = (typeof attributes === "string") ? [attributes] : attributes;
    const filterMode = mode as "and" | "or" | undefined;

    async function page(index: number, {filterQuery, filterStates, filterAttributes, filterMode}: {
        filterQuery?: string[],
        filterStates?: string[],
        filterAttributes?: string[],
        filterMode?: "and" | "or" | undefined,
    }) {
        "use server";

        if (!filterAttributes) {
            const {total, items} = await getAllStationsData({
                limit: ITEMS_PER_PAGE,
                offset: index * ITEMS_PER_PAGE,
                searchstring: filterQuery,
                federalstate: filterStates,
            });

            return {
                count: Math.ceil(total / ITEMS_PER_PAGE),
                elements: items,
            };
        }

        const {total} = await getAllStationsData({
            limit: 1,
            offset: 0,
            searchstring: filterQuery,
            federalstate: filterStates,
        });

        const filtered: StationData[] = [];

        for (let i = 0; i < total; i += 1000) {
            const {items} = await getAllStationsData({
                limit: 1000,
                offset: i,
                searchstring: filterQuery,
                federalstate: filterStates,
            });

            for (const item of items) {
                let ok = true;
                let any = false;
                for (const attribute of filterAttributes) {
                    const hasAttribute = (item as { [key: string]: unknown })[attribute] === true;
                    if (!filterMode || filterMode === "and") {
                        if (!hasAttribute) {
                            ok = false;
                            break;
                        }
                        any = true;
                    } else if (filterMode === "or") {
                        if (hasAttribute) {
                            any = true;
                            break;
                        }
                    }
                }
                if (ok && any)
                    filtered.push(item);
            }
        }

        return {
            count: Math.ceil(filtered.length / ITEMS_PER_PAGE),
            elements: filtered.slice(index * ITEMS_PER_PAGE, (index + 1) * ITEMS_PER_PAGE),
        };
    }

    async function render(elements: StationData[]) {
        "use server";

        return (
            <div className={styles.stations}>
                <div className={`${styles.station} ${styles.header}`}>
                    <span>Name</span>
                    <span>Federal State</span>
                    <span>Bicycle Parking</span>
                    <span>Car Rental</span>
                    <span>DB Lounge</span>
                    <span>Local Public Transport</span>
                    <span>Locker System</span>
                    <span>Lost And Found</span>
                    <span>Parking</span>
                    <span>Public Facilities</span>
                    <span>Railway Mission</span>
                    <span>Stepless Access</span>
                    <span>Taxi Rank</span>
                    <span>Travel Center</span>
                    <span>Travel Necessities</span>
                    <span>WiFi</span>
                    <span>Category</span>
                    <span>Price Category</span>
                    <span>Mobility Service</span>
                </div>
                {elements.map(element => (
                    <StationView key={element.number}
                                 hasQueryFilter={filterQuery !== undefined}
                                 hasStateFilter={filterStates !== undefined}
                                 attributeFilter={filterAttributes} {...element}/>
                ))}
            </div>
        );
    }

    return (
        <main>
            <FilterView query={query as string | undefined}
                        states={filterStates ?? []}
                        attributes={filterAttributes ?? []}
                        mode={filterMode}/>
            <PageView pageAction={page}
                      renderAction={render}
                      extra={{
                          filterQuery,
                          filterStates,
                          filterAttributes,
                          filterMode,
                      }}/>
        </main>
    );
}
