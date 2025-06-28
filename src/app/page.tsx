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

async function StationView(element: StationData) {
    return (
        <Link key={element.number} href={`/station/${element.number}`} className={styles.station}>
            <span>{element.name}</span>
            <span>{element.federalState}</span>
            <FontAwesomeIcon icon={element.hasBicycleParking ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasCarRental ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasDBLounge ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasLocalPublicTransport ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasLockerSystem ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasLostAndFound ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasParking ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasPublicFacilities ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasRailwayMission ? faCheck : faClose}/>
            <FontAwesomeIcon icon={
                element.hasSteplessAccess === "yes"
                    ? faCheck
                    : element.hasSteplessAccess === "no"
                        ? faClose
                        : faCircle
            }/>
            <FontAwesomeIcon icon={element.hasTaxiRank ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasTravelCenter ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasTravelNecessities ? faCheck : faClose}/>
            <FontAwesomeIcon icon={element.hasWiFi ? faCheck : faClose}/>
            <span>{element.category}</span>
            <span>{element.priceCategory}</span>
        </Link>
    );
}

type Props = {
    searchParams: Promise<SearchParams>,
}

export default async function Page({searchParams}: Props) {

    const {query, state, attribute} = await searchParams;

    const queryFilter = (typeof query === "string") ? query.split(/\s+/).map(value => `*${value}*`) : undefined;
    const stateFilter = (typeof state === "string") ? [state] : state;
    const attributeFilter = (typeof attribute === "string") ? [attribute] : attribute;

    async function page(index: number, {queryFilter, stateFilter, attributeFilter}: {
        queryFilter?: string[],
        stateFilter?: string[],
        attributeFilter?: string[]
    }) {
        "use server";

        if (!attributeFilter) {
            const {total, items} = await getAllStationsData({
                limit: ITEMS_PER_PAGE,
                offset: index * ITEMS_PER_PAGE,
                searchstring: queryFilter,
                federalstate: stateFilter,
            });

            return {
                count: Math.ceil(total / ITEMS_PER_PAGE),
                elements: items,
            };
        }

        const {total} = await getAllStationsData({
            limit: 1,
            offset: 0,
            searchstring: queryFilter,
            federalstate: stateFilter,
        });

        const filtered: StationData[] = [];

        for (let i = 0; i < total; i += 1000) {
            const {items} = await getAllStationsData({
                limit: 1000,
                offset: i,
                searchstring: queryFilter,
                federalstate: stateFilter,
            });

            for (const item of items)
                for (const attribute of attributeFilter)
                    if ((item as { [key: string]: unknown })[attribute] === true) {
                        filtered.push(item);
                        break;
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
                </div>
                {elements.map(StationView)}
            </div>
        );
    }

    return (
        <main>
            <FilterView/>
            <PageView pageAction={page} renderAction={render} extra={{queryFilter, stateFilter, attributeFilter}}/>
        </main>
    );
}
