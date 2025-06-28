"use client";

import {useRouter, useSearchParams} from "next/navigation";
import styles from "./filter-view.module.scss";

export function FilterView() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const action = (data: FormData) => {

        const params = new URLSearchParams();

        for (const [key, value] of data)
            if (value as string)
                params.append(key, value as string);

        router.push(`?${params}`, {scroll: false});
    };

    const states: [string, string][] = [
        ["baden-württemberg", "Baden-Württemberg"],
        ["bayern", "Bayern"],
        ["berlin", "Berlin"],
        ["brandenburg", "Brandenburg"],
        ["bremen", "Bremen"],
        ["hamburg", "Hamburg"],
        ["hessen", "Hessen"],
        ["mecklenburg-vorpommern", "Mecklenburg-Vorpommern"],
        ["niedersachsen", "Niedersachsen"],
        ["nordrhein-westfalen", "Nordrhein-Westfalen"],
        ["rheinland-pfalz", "Rheinland-Pfalz"],
        ["saarland", "Saarland"],
        ["sachsen", "Sachsen"],
        ["sachsen-anhalt", "Sachsen-Anhalt"],
        ["schleswig-holstein", "Schleswig-Holstein"],
        ["thüringen", "Thüringen"],
    ];

    const attributes: [string, string][] = [
        ["hasBicycleParking", "Bicycle Parking"],
        ["hasCarRental", "Car Rental"],
        ["hasDBLounge", "DB Lounge"],
        ["hasLocalPublicTransport", "Local Public Transport"],
        ["hasLockerSystem", "Locker System"],
        ["hasLostAndFound", "Lost And Found"],
        ["hasParking", "Parking"],
        ["hasPublicFacilities", "Public Facilities"],
        ["hasRailwayMission", "Railway Mission"],
        ["hasTaxiRank", "Taxi Rank"],
        ["hasTravelCenter", "Travel Center"],
        ["hasTravelNecessities", "Travel Necessities"],
        ["hasWiFi", "WiFi"],
    ];

    return (
        <form className={styles.search} action={action}>
            <input name="query"
                   type="text"
                   enterKeyHint="search"
                   placeholder="filter station by name"
                   defaultValue={searchParams.get("query") ?? ""}/>
            <fieldset className={styles.group}>
                <legend>Federal States</legend>
                {states.map(([value, label]) => (
                    <label key={value}>
                        <input name="state"
                               type="checkbox"
                               value={value}
                               defaultChecked={searchParams.getAll("state").find(x => x === value) !== undefined}/>
                        <span>{label}</span>
                    </label>
                ))}
            </fieldset>
            <fieldset className={styles.group}>
                <legend>Attributes</legend>
                {attributes.map(([value, label]) => (
                    <label key={value}>
                        <input name="attribute"
                               type="checkbox"
                               value={value}
                               defaultChecked={searchParams.getAll("attribute").find(x => x === value) !== undefined}/>
                        <span>{label}</span>
                    </label>
                ))}
            </fieldset>
            <button type="submit">Apply Filter</button>
        </form>
    );
}
