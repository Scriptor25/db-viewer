"use client";

import {StationData} from "@/api/stada";
import styles from "@/app/station/[id]/page.module.scss";
import {LngLat} from "@/component/map-view/map-view";
import {faHouse} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type Props = {
    openDialogAction: (location: LngLat) => void,

    station: StationData,
    center: LngLat,
}

export function StationPopup({openDialogAction, station: {name}, center}: Props) {
    return (
        <div className={styles.popup}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={faHouse}/>
                <h3>{name}</h3>
            </div>
            <hr/>
            <a onClick={() => openDialogAction(center)}>{center[0]}, {center[1]}</a>
        </div>
    );
}
