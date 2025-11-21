"use client";

import { FacilityState, StationFacilityStatusData } from "@/api/fasta";
import { StationData } from "@/api/stada";
import styles from "@/app/station/[id]/page.module.scss";
import { FacilityPopup } from "@/component/facility-popup/facility-popup";
import { LngLat, MapView, Pin } from "@/component/map-view/map-view";
import { ServiceDialogContext } from "@/component/service-dialog/service-dialog-context";
import { StationPopup } from "@/component/station-popup/station-popup";
import { useContext } from "react";

const PAD_X = 0.002;
const PAD_Y = 0.001;

interface Props {
    station: StationData,
    status: StationFacilityStatusData,
};

const FACILITY_COLOR: Record<FacilityState, string> = {
    "INACTIVE": "#bc0d0d",
    "ACTIVE": "#378725",
    "UNKNOWN": "#cccccc",
} as const;

export function StationMapView({ station, status }: Readonly<Props>) {

    const { openDialog } = useContext(ServiceDialogContext);

    const facilities = status.facilities ?? [];
    const evaNumbers = station.evaNumbers ?? [];
    const rilIdentifiers = station.ril100Identifiers ?? [];

    let center: LngLat | undefined;
    let bounds: [LngLat, LngLat] | undefined;

    const eva = station.evaNumbers.find(entry => entry.isMain);
    if (eva) {
        center = eva.geographicCoordinates.coordinates.slice(0, 2) as LngLat;
        bounds = [
            [center[0] - PAD_X, center[1] - PAD_Y],
            [center[0] + PAD_X, center[1] + PAD_Y],
        ];
    }

    const pins: Pin[] = [];

    for (const facility of facilities) {
        if (!facility.geocoordX || !facility.geocoordY) {
            continue;
        }

        pins.push({
            location: [facility.geocoordX, facility.geocoordY],
            content: <FacilityPopup openDialogAction={openDialog} facility={facility} />,
            color: FACILITY_COLOR[facility.state],
        });
    }

    for (const index in evaNumbers) {
        const eva = evaNumbers[index];
        const ril = rilIdentifiers[index];
        if (eva.isMain !== ril.isMain) {
            continue;
        }

        const location = eva.geographicCoordinates.coordinates.slice(0, 2) as LngLat;
        pins.push({
            location,
            content: <StationPopup
                openDialogAction={openDialog}
                station={station}
                center={location}
                isMain={eva.isMain}
                number={eva.number}
                identifier={ril.rilIdentifier}
                steamPermission={ril.steamPermission}
                locationCode={ril.primaryLocationCode} />,
            color: eva.isMain ? "#3fb1ce" : "#3f59ce",
        });
    }

    if (!bounds && pins.length) {
        bounds = [
            [pins[0].location[0] - PAD_X, pins[0].location[1] - PAD_Y],
            [pins[0].location[0] + PAD_X, pins[0].location[1] + PAD_Y],
        ];
    }

    for (const pin of pins) {
        if (pin.location[0] - PAD_X < bounds![0][0]) {
            bounds![0][0] = pin.location[0] - PAD_X;
        }
        if (pin.location[0] + PAD_X > bounds![1][0]) {
            bounds![1][0] = pin.location[0] + PAD_X;
        }
        if (pin.location[1] - PAD_Y < bounds![0][1]) {
            bounds![0][1] = pin.location[1] - PAD_Y;
        }
        if (pin.location[1] + PAD_Y > bounds![1][1]) {
            bounds![1][1] = pin.location[1] + PAD_Y;
        }
    }

    return <MapView center={center} bounds={bounds} pins={pins} className={styles.map} />;
}
