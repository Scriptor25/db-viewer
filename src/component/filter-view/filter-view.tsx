"use client";

import {useRouter} from "next/navigation";

import styles from "./filter-view.module.scss";

const STATES: [string, string][] = [
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

const ATTRIBUTES: [string, string][] = [
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

type Props = {
    query?: string,
    states: string[],
    attributes: string[],
    mode?: "and" | "or",
    className?: string,
}

export function FilterView({query, states, attributes, mode, className}: Readonly<Props>) {

    const router = useRouter();

    return (
        <form className={`${styles.container} ${className ?? ""}`}
              onSubmit={event => {
                  event.preventDefault();

                  const data = new FormData(event.currentTarget);
                  const params = new URLSearchParams();

                  if (data.get("query"))
                      params.append("query", data.get("query") as string);
                  if (data.get("mode"))
                      params.append("mode", data.get("mode") as string);
                  for (const state of data.getAll("states"))
                      params.append("states", state as string);
                  for (const attribute of data.getAll("attributes"))
                      params.append("attributes", attribute as string);

                  router.push(`?${params}`);
              }}
              onReset={() => router.replace("?")}
              suppressHydrationWarning>
            <fieldset className={styles.group}>
                <legend>Station Name</legend>
                <label>
                    <span>Filter Station Name</span>
                    <input type="text"
                           name="query"
                           defaultValue={query}
                           enterKeyHint="search"
                           placeholder="filter station by name"/>
                </label>
            </fieldset>
            <fieldset className={styles.group}>
                <legend>Federal States</legend>
                {STATES.map(([value, label]) => (
                    <label key={value}>
                        <input type="checkbox"
                               name="states"
                               defaultChecked={states.includes(value)}
                               value={value}/>
                        <span>{label}</span>
                    </label>
                ))}
            </fieldset>
            <fieldset className={styles.group}>
                <legend>Attributes</legend>
                {ATTRIBUTES.map(([value, label]) => (
                    <label key={value}>
                        <input type="checkbox"
                               name="attributes"
                               defaultChecked={attributes.includes(value)}
                               value={value}/>
                        <span>{label}</span>
                    </label>
                ))}
            </fieldset>
            <label>
                <input type="checkbox"
                       name="mode"
                       defaultChecked={mode === "or"}
                       value="or"/>
                <span>OR Attribute Filter</span>
            </label>
            <div className={styles.group}>
                <button type="submit">Apply Filter</button>
                <button type="reset">Clear Filter</button>
            </div>
        </form>
    );
}
