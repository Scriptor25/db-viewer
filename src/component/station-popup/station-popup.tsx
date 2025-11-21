"use client";

import { StationData } from "@/api/stada";
import styles from "@/app/station/[id]/page.module.scss";
import { LngLat } from "@/component/map-view/map-view";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    openDialogAction: (location: LngLat) => void,

    station: StationData | null,
    center: LngLat,
};

export function StationPopup({ openDialogAction, station, center }: Readonly<Props>) {
    return (
        <div className={styles.popup}>
            <p className={styles.header}>
                <FontAwesomeIcon icon={faHouse} />
                {station?.name}
            </p>
            <hr />
            <p className={styles.link}>
                <button className="link" onClick={() => openDialogAction(center)}>
                    {center[0]}, {center[1]}
                </button>
            </p>
        </div>
    );
}
