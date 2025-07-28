"use server";

import {getAllStationsData, StationData} from "@/api/stada";
import {FilterView} from "@/component/filter-view/filter-view";
import {PageView} from "@/component/page-view/page-view";
import {DataTable, DataTableRowProps} from "@/component/table/table";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SearchParams} from "next/dist/server/request/search-params";

import styles from "./page.module.scss";

const ITEMS_PER_PAGE = 20;

type StationProps = StationData & {
    hasQueryFilter?: boolean,
    hasStateFilter?: boolean,
    attributeFilter?: string[],
};

type PageProps = {
    searchParams: Promise<SearchParams>,
};

export default async function Page({searchParams}: Readonly<PageProps>) {

    const {query, states, attributes, mode} = await searchParams;

    const filterQuery = (query as string | undefined)?.split(/\s+/).map(value => `*${value}*`);
    const filterStates = (typeof states === "string") ? [states] : states;
    const filterAttributes = (typeof attributes === "string") ? [attributes] : attributes;
    const filterMode = mode as "and" | "or" | undefined;

    async function page(index: number, {
        filterQuery,
        filterStates,
        filterAttributes,
        filterMode,
    }: {
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

        const active: (keyof StationProps)[] = [];
        if (filterQuery)
            active.push("name");
        if (filterStates)
            active.push("federalState");
        if (filterAttributes)
            active.push(...(filterAttributes as (keyof StationProps)[]));

        return (
            <DataTable<StationProps, [
                "name",
                "federalState",
                "hasBicycleParking",
                "hasCarRental",
                "hasDBLounge",
                "hasLocalPublicTransport",
                "hasLockerSystem",
                "hasLostAndFound",
                "hasParking",
                "hasPublicFacilities",
                "hasRailwayMission",
                "hasSteplessAccess",
                "hasTaxiRank",
                "hasTravelCenter",
                "hasTravelNecessities",
                "hasWiFi",
                "hasMobilityService",
                "category",
                "priceCategory",
            ]>
                template={[
                    {key: "name", label: "Name", type: "string"},
                    {key: "federalState", label: "Federal State", type: "string"},
                    {key: "hasBicycleParking", label: "Bicycle Parking", type: "boolean"},
                    {key: "hasCarRental", label: "Car Rental", type: "boolean"},
                    {key: "hasDBLounge", label: "DB Lounge", type: "boolean"},
                    {key: "hasLocalPublicTransport", label: "Local Public Transport", type: "boolean"},
                    {key: "hasLockerSystem", label: "Locker System", type: "boolean"},
                    {key: "hasLostAndFound", label: "Lost and Found", type: "boolean"},
                    {key: "hasParking", label: "Parking", type: "boolean"},
                    {key: "hasPublicFacilities", label: "Public Facilities", type: "boolean"},
                    {key: "hasRailwayMission", label: "Railway Mission", type: "boolean"},
                    {
                        key: "hasSteplessAccess",
                        label: "Stepless Access",
                        type: "tristate",
                        "0": "no",
                        "1": "yes",
                        "2": "partial",
                    },
                    {key: "hasTaxiRank", label: "Taxi Rank", type: "boolean"},
                    {key: "hasTravelCenter", label: "Travel Center", type: "boolean"},
                    {key: "hasTravelNecessities", label: "Travel Necessities", type: "boolean"},
                    {key: "hasWiFi", label: "WiFi", type: "boolean"},
                    {
                        key: "hasMobilityService",
                        label: "Mobility Service",
                        type: "custom",
                        render: async ({data}) => {
                            "use server";

                            let text;
                            switch (data) {
                                case "Nur nach Voranmeldung unter 030 65 21 28 88 (Ortstarif)":
                                    text = <span>only by appointment</span>;
                                    break;
                                case "Ja, um Voranmeldung unter 030 65 21 28 88 (Ortstarif) wird gebeten":
                                    text = <span>advance registration is requested</span>;
                                    break;
                                default:
                                    text = undefined;
                                    break;
                            }

                            return (
                                <span className={styles.custom}>
                                    <FontAwesomeIcon icon={data === "no" ? faClose : faCheck}/>
                                    {text}
                                </span>
                            );
                        },
                    },
                    {key: "category", label: "Category", type: "number"},
                    {key: "priceCategory", label: "Price Category", type: "number"},
                ] as const}
                id="number"
                active={active}
                data={elements.map(element => ({
                    value: {
                        hasQueryFilter: filterQuery !== undefined,
                        hasStateFilter: filterStates !== undefined,
                        attributeFilter: filterAttributes,
                        ...element,
                    },
                    row: {
                        href: `/station/${element.number}`,
                    },
                } as DataTableRowProps<StationProps>))}
                className={styles.stations}/>
        );
    }

    return (
        <main>
            <div className={styles.heading}><h1>DB Viewer</h1></div>
            <FilterView query={query as string | undefined}
                        states={filterStates ?? []}
                        attributes={filterAttributes ?? []}
                        mode={filterMode}
                        className={styles.paging}/>
            <PageView pageAction={page}
                      renderAction={render}
                      className={styles.paging}
                      extra={{
                          filterQuery,
                          filterStates,
                          filterAttributes,
                          filterMode,
                      }}/>
        </main>
    );
}
