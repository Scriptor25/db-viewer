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
    }: Props,
) {
    return (
        <div className={styles.popup}>
            <div className={styles.header}>
                <FontAwesomeIcon icon={type === "ELEVATOR" ? faElevator : faStairs}/>
                <h3>{description}</h3>
            </div>
            <div className={styles.content}>
                <span>{stateExplanation}</span>
                <span className={styles.italic}>{operatorname}</span>
            </div>
            <hr/>
            <a onClick={() => openDialogAction([geocoordX!, geocoordY!])}>{geocoordX}, {geocoordY}</a>
        </div>
    );
}
