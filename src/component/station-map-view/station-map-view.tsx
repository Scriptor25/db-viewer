"use client";

import {StationFacilityStatusData} from "@/api/fasta";
import {StationData} from "@/api/stada";
import styles from "@/app/station/[id]/page.module.scss";
import {FacilityPopup} from "@/component/facility-popup/facility-popup";
import {LngLat, MapView, Pin} from "@/component/map-view/map-view";
import {ServiceDialogContext} from "@/component/service-dialog/service-dialog-context";
import {StationPopup} from "@/component/station-popup/station-popup";
import {useContext} from "react";

const PAD_X = 0.002;
const PAD_Y = 0.001;

type Props = {
    station: StationData | null,
    status: StationFacilityStatusData | null,
}

export function StationMapView({station, status}: Readonly<Props>) {

    const {openDialog} = useContext(ServiceDialogContext);

    const facilities = status?.facilities ?? [];

    let center: LngLat | undefined;
    let bounds: [LngLat, LngLat] | undefined;

    const eva = station?.evaNumbers.find(entry => entry.isMain);
    if (eva) {
        center = eva.geographicCoordinates.coordinates.slice(0, 2) as LngLat;
        bounds = [
            [center[0] - PAD_X, center[1] - PAD_Y],
            [center[0] + PAD_X, center[1] + PAD_Y],
        ];
    }

    const pins = facilities
        .filter(facility => facility.geocoordX !== undefined && facility.geocoordY !== undefined)
        .map(facility => {
            let color: string;
            switch (facility.state) {
                case "INACTIVE":
                    color = "#bc0d0d";
                    break;
                case "ACTIVE":
                    color = "#378725";
                    break;
                default:
                    color = "#cccccc";
                    break;
            }
            return {
                location: [facility.geocoordX!, facility.geocoordY!],
                content: <FacilityPopup openDialogAction={openDialog} facility={facility}/>,
                color: color,
            } as Pin;
        });

    if (center) {
        pins.push({
            location: center,
            content: <StationPopup openDialogAction={openDialog} station={station} center={center}/>,
        } as Pin);
    }

    if (!bounds && pins.length) {
        bounds = [
            [pins[0].location[0] - PAD_X, pins[0].location[1] - PAD_Y],
            [pins[0].location[0] + PAD_X, pins[0].location[1] + PAD_Y],
        ];
    }

    for (const pin of pins) {
        if (pin.location[0] - PAD_X < bounds![0][0])
            bounds![0][0] = pin.location[0] - PAD_X;
        if (pin.location[0] + PAD_X > bounds![1][0])
            bounds![1][0] = pin.location[0] + PAD_X;
        if (pin.location[1] - PAD_Y < bounds![0][1])
            bounds![0][1] = pin.location[1] - PAD_Y;
        if (pin.location[1] + PAD_Y > bounds![1][1])
            bounds![1][1] = pin.location[1] + PAD_Y;
    }

    return <MapView center={center} bounds={bounds} pins={pins} className={styles.map}/>;
}
