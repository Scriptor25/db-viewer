"use server";

import {getAllStationsData, StationData} from "@/api/stada";
import {FilterView} from "@/component/filter-view/filter-view";
import {PageView} from "@/component/page-view/page-view";
import {TableRow} from "@/component/table/table";
import {faCircle} from "@fortawesome/free-regular-svg-icons";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SearchParams} from "next/dist/server/request/search-params";

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
        <TableRow href={`/station/${element.number}`}>
            <td className={hasQueryFilter ? styles.filter : undefined}>{element.name}</td>
            <td className={hasStateFilter ? styles.filter : undefined}>{element.federalState}</td>
            <td className={filterIf("hasBicycleParking")}>
                <FontAwesomeIcon icon={element.hasBicycleParking ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasCarRental")}>
                <FontAwesomeIcon icon={element.hasCarRental ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasDBLounge")}>
                <FontAwesomeIcon icon={element.hasDBLounge ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasLocalPublicTransport")}>
                <FontAwesomeIcon icon={element.hasLocalPublicTransport ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasLockerSystem")}>
                <FontAwesomeIcon icon={element.hasLockerSystem ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasLostAndFound")}>
                <FontAwesomeIcon icon={element.hasLostAndFound ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasParking")}>
                <FontAwesomeIcon icon={element.hasParking ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasPublicFacilities")}>
                <FontAwesomeIcon icon={element.hasPublicFacilities ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasRailwayMission")}>
                <FontAwesomeIcon icon={element.hasRailwayMission ? faCheck : faClose}/>
            </td>
            <td>
                <FontAwesomeIcon icon={
                    element.hasSteplessAccess === "yes"
                        ? faCheck
                        : element.hasSteplessAccess === "no"
                            ? faClose
                            : faCircle
                }/>
            </td>
            <td className={filterIf("hasTaxiRank")}>
                <FontAwesomeIcon icon={element.hasTaxiRank ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasTravelCenter")}>
                <FontAwesomeIcon icon={element.hasTravelCenter ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasTravelNecessities")}>
                <FontAwesomeIcon icon={element.hasTravelNecessities ? faCheck : faClose}/>
            </td>
            <td className={filterIf("hasWiFi")}>
                <FontAwesomeIcon icon={element.hasWiFi ? faCheck : faClose}/>
            </td>
            <td>{element.category}</td>
            <td>{element.priceCategory}</td>
            <td>
                <FontAwesomeIcon icon={element.hasMobilityService === "no" ? faClose : faCheck}/>
                {element.hasMobilityService === "Nur nach Voranmeldung unter 030 65 21 28 88 (Ortstarif)"
                    ? <span>only by appointment</span>
                    : element.hasMobilityService === "Ja, um Voranmeldung unter 030 65 21 28 88 (Ortstarif) wird gebeten"
                        ? <span>advance registration is requested</span>
                        : undefined}
            </td>
            {/*</Link>*/}
        </TableRow>
    );
}

type Props = {
    searchParams: Promise<SearchParams>,
}

export default async function Page({searchParams}: Readonly<Props>) {

    const {query, states, attributes, mode} = await searchParams;

    const filterQuery = (query as string | undefined)?.split(/\s+/).map(value => `*${value}*`);
    const filterStates = (typeof states === "string") ? [states] : states;
    const filterAttributes = (typeof attributes === "string") ? [attributes] : attributes;
    const filterMode = mode as "and" | "or" | undefined;

    async function page(index: number, {filterQuery, filterStates, filterAttributes, filterMode}: {
        filterQuery?: string[],
        filterStates?: string[],
        filterAttributes?: string[],
        filterMode?: "and" | "or",
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
            <table className={styles.stations}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Federal State</th>
                    <th>Bicycle Parking</th>
                    <th>Car Rental</th>
                    <th>DB Lounge</th>
                    <th>Local Public Transport</th>
                    <th>Locker System</th>
                    <th>Lost And Found</th>
                    <th>Parking</th>
                    <th>Public Facilities</th>
                    <th>Railway Mission</th>
                    <th>Stepless Access</th>
                    <th>Taxi Rank</th>
                    <th>Travel Center</th>
                    <th>Travel Necessities</th>
                    <th>WiFi</th>
                    <th>Category</th>
                    <th>Price Category</th>
                    <th>Mobility Service</th>
                </tr>
                </thead>
                <tbody>
                {elements.map(element => (
                    <StationView key={element.number}
                                 hasQueryFilter={filterQuery !== undefined}
                                 hasStateFilter={filterStates !== undefined}
                                 attributeFilter={filterAttributes} {...element}/>
                ))}
                </tbody>
            </table>
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
