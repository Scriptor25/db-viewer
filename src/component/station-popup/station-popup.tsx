"use client";

import { StationData } from "@/api/stada";
import styles from "@/app/station/[id]/page.module.scss";
import { LngLat } from "@/component/map-view/map-view";
import { IconDefinition, faFireFlameCurved, faHouse, faTrain, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    openDialogAction: (location: LngLat) => void,

    station: StationData,
    center: LngLat,

    isMain: boolean,
    number: number,
    identifier: string,
    steamPermission: "restricted" | "unrestricted" | "entryBan",
    locationCode: string,
};

const STEAM_PERMISSION_LABEL: Record<"restricted" | "unrestricted" | "entryBan", IconDefinition> = {
    "unrestricted": faFireFlameCurved,
    "restricted": faTrain,
    "entryBan": faXmark,
} as const;

export function StationPopup({ openDialogAction, station, center, isMain, number, identifier, steamPermission, locationCode }: Readonly<Props>) {
    return (
        <div className={styles.popup}>
            <p className={styles.header}>
                {isMain && <FontAwesomeIcon icon={faHouse} />}
                <FontAwesomeIcon icon={STEAM_PERMISSION_LABEL[steamPermission]} title={steamPermission} />
                {station.name}
            </p>
            <p className={styles.content}>
                <span>{number}</span>
                <span>{identifier}</span>
                <span>{locationCode}</span>
            </p>
            <hr />
            <p className={styles.link}>
                <button className="link" onClick={() => openDialogAction(center)}>
                    {center[0]},&nbsp;{center[1]}
                </button>
            </p>
        </div>
    );
}
