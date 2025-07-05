"use client";

import {useRouter} from "next/navigation";
import {FormEventHandler, useCallback, useState} from "react";

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

type Params = {
    query?: string,
    states: string[],
    attributes: string[],
    mode?: "and" | "or",
}

function setChecked<T>(array: T[], setArray: (supplier: (array: T[]) => T[]) => void, value: T, checked: boolean) {
    const included = array.includes(value);
    setArray(array => (checked && !included)
        ? [...array, value]
        : (!checked && included)
            ? array.filter(x => x !== value)
            : array);
}

export function FilterView(params: Params) {

    const router = useRouter();

    const [query, setQuery] = useState(() => params.query);
    const [states, setStates] = useState(() => params.states);
    const [attributes, setAttributes] = useState(() => params.attributes);
    const [mode, setMode] = useState(() => params.mode);

    const setStateChecked = useCallback((value: string, checked: boolean) => {
        setChecked(states, setStates, value, checked);
    }, [states, setStates]);

    const setAttributeChecked = useCallback((value: string, checked: boolean) => {
        setChecked(attributes, setAttributes, value, checked);
    }, [attributes, setAttributes]);

    const submit: FormEventHandler = useCallback(event => {
        event.preventDefault();

        const searchParams = new URLSearchParams();

        if (query)
            searchParams.set("query", query);
        for (const state of states)
            searchParams.append("states", state);
        for (const attribute of attributes)
            searchParams.append("attributes", attribute);
        if (mode)
            searchParams.set("mode", mode);

        router.push(`?${searchParams}`, {scroll: false});
    }, [query, states, attributes, mode, router]);

    const reset: FormEventHandler = useCallback(event => {
        event.preventDefault();

        setQuery(undefined);
        setStates([]);
        setAttributes([]);
        setMode(undefined);
    }, [setQuery, setStates, setAttributes, setMode]);

    return (
        <form className={styles.container} onSubmit={submit} onReset={reset}>
            <input type="text"
                   enterKeyHint="search"
                   placeholder="filter station by name"
                   value={query}
                   onChange={event => setQuery(event.target.value)}/>
            <fieldset className={styles.group}>
                <legend>Federal States</legend>
                {STATES.map(([value, label]) => (
                    <label key={value} className={styles.label}>
                        <input type="checkbox"
                               checked={states.includes(value)}
                               onChange={event => setStateChecked(value, event.target.checked)}/>
                        <span>{label}</span>
                    </label>
                ))}
            </fieldset>
            <fieldset className={styles.group}>
                <legend>Attributes</legend>
                {ATTRIBUTES.map(([value, label]) => (
                    <label key={value} className={styles.label}>
                        <input type="checkbox"
                               checked={attributes.includes(value)}
                               onChange={event => setAttributeChecked(value, event.target.checked)}/>
                        <span>{label}</span>
                    </label>
                ))}
            </fieldset>
            <label className={styles.label}>
                <input type="checkbox"
                       checked={mode === "or"}
                       onChange={event => setMode(event.target.checked ? "or" : "and")}/>
                <span>OR Attribute Filter</span>
            </label>
            <div className={styles.buttonGroup}>
                <button type="submit">Apply Filter</button>
                <button type="reset">Clear Filter</button>
            </div>
        </form>
    );
}
