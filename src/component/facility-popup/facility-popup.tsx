"use client";

import {FacilityStatusData} from "@/api/fasta";
import styles from "@/app/station/[id]/page.module.scss";
import {LngLat} from "@/component/map-view/map-view";
import {faElevator, faStairs} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type Props = {
    facility: FacilityStatusData,
    openDialogAction: (location: LngLat) => void,
}

export function FacilityPopup(
    {
        facility: {
            type,
            description,
            stateExplanation,
            operatorname,
            geocoordX,
            geocoordY,
        },
        openDialogAction,
    }: Readonly<Props>,
) {
    return (
        <div className={styles.popup}>
            <p className={styles.header}>
                <FontAwesomeIcon icon={type === "ELEVATOR" ? faElevator : faStairs}/>
                {description}
            </p>
            <p className={styles.content}>
                <span>{stateExplanation}</span>
                <span className={styles.italic}>{operatorname}</span>
            </p>
            <hr/>
            <p className={styles.link}>
                <button className="link" onClick={() => openDialogAction([geocoordX!, geocoordY!])}>
                    {geocoordX}, {geocoordY}
                </button>
            </p>
        </div>
    );
}
