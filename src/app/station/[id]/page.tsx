import {getStationFacilityStatus} from "@/api/fasta";
import {getStationData} from "@/api/stada";
import {LngLat, MapView, Pin} from "@/component/map-view/map-view";
import {faArrowLeftLong} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";

import styles from "./page.module.scss";

type Props = {
    params: Promise<{ id: number }>,
};

export default async function Page({params}: Props) {

    const {id} = await params;

    const station = await getStationData(id);
    const status = await getStationFacilityStatus(id);
    const facilities = status?.facilities ?? [];

    const center: LngLat = [0, 0];

    const eva = station?.evaNumbers?.find(entry => entry.isMain);
    if (eva) {
        center[0] = eva.geographicCoordinates.coordinates[0];
        center[1] = eva.geographicCoordinates.coordinates[1];
    }

    const padx = 0.002;
    const pady = 0.001;
    const bounds: [LngLat, LngLat] = [[center[0] - padx, center[1] - pady], [center[0] + padx, center[1] + pady]];

    const pins = facilities
        .filter(facility => facility.geocoordX !== undefined && facility.geocoordY !== undefined)
        .map(facility => ({
            location: [facility.geocoordX!, facility.geocoordY!],
            html: `<span>${facility.type}</span>
                   <span>${facility.description ?? "no description"}</span>
                   <span>${facility.state}</span>
                   <span>${facility.stateExplanation ?? "no reason"}</span>
                   <span>${facility.operatorname}</span>
                   <span>${facility.geocoordX}, ${facility.geocoordY}</span>`,
            color: facility.state === "INACTIVE" ? "#bc0d0d" : facility.state === "ACTIVE" ? "#378725" : "#cccccc",
        } as Pin));
    pins.push({location: center});

    for (const pin of pins) {
        if (pin.location[0] - padx < bounds[0][0])
            bounds[0][0] = pin.location[0] - padx;
        if (pin.location[0] + padx > bounds[1][0])
            bounds[1][0] = pin.location[0] + padx;
        if (pin.location[1] - pady < bounds[0][1])
            bounds[0][1] = pin.location[1] - pady;
        if (pin.location[1] + pady > bounds[1][1])
            bounds[1][1] = pin.location[1] + pady;
    }

    return (
        <main className={styles.container}>
            <div className={styles.heading}>
                <Link href="/"><FontAwesomeIcon icon={faArrowLeftLong} size="2xl"/></Link>
                <h1>{station?.name}</h1>
            </div>
            <MapView center={center} bounds={bounds} pins={pins} className={styles.map}/>
        </main>
    );
}
