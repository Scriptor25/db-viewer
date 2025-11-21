import { getStationFacilityStatus } from "@/api/fasta";
import { Schedule, ScheduleRange, getStationData } from "@/api/stada";
import { ReturnButton } from "@/component/return-button/return-button";

import { ServiceDialogProvider } from "@/component/service-dialog/service-dialog-provider";
import { StationMapView } from "@/component/station-map-view/station-map-view";

import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";

interface Props {
    params: Promise<{ id: number }>,
};

function ScheduleView({ schedule }: Readonly<{ schedule?: Schedule }>) {

    if (!schedule) {
        return;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>day</th>
                    <th>from</th>
                    <th>to</th>
                </tr>
            </thead>
            <tbody>
                {schedule.monday && <tr><td>monday</td><td>{schedule.monday.fromTime}</td><td>{schedule.monday.toTime}</td></tr>}
                {schedule.tuesday && <tr><td>tuesday</td><td>{schedule.tuesday.fromTime}</td><td>{schedule.tuesday.toTime}</td></tr>}
                {schedule.wednesday && <tr><td>wednesday</td><td>{schedule.wednesday.fromTime}</td><td>{schedule.wednesday.toTime}</td></tr>}
                {schedule.thursday && <tr><td>thursday</td><td>{schedule.thursday.fromTime}</td><td>{schedule.thursday.toTime}</td></tr>}
                {schedule.friday && <tr><td>friday</td><td>{schedule.friday.fromTime}</td><td>{schedule.friday.toTime}</td></tr>}
                {schedule.saturday && <tr><td>saturday</td><td>{schedule.saturday.fromTime}</td><td>{schedule.saturday.toTime}</td></tr>}
                {schedule.sunday && <tr><td>sunday</td><td>{schedule.sunday.fromTime}</td><td>{schedule.sunday.toTime}</td></tr>}
                {schedule.holiday && <tr><td>holiday</td><td>{schedule.holiday.fromTime}</td><td>{schedule.holiday.toTime}</td></tr>}
            </tbody>
        </table>
    );
}

function ScheduleRangeView({ schedule }: Readonly<{ schedule?: ScheduleRange }>) {

    if (!schedule) {
        return;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>day</th>
                    <th>from</th>
                    <th>to</th>
                </tr>
            </thead>
            <tbody>
                {schedule.monday1 && <tr><td>monday</td><td>{schedule.monday1.fromTime}</td><td>{schedule.monday1.toTime}</td></tr>}
                {schedule.tuesday1 && <tr><td>tuesday</td><td>{schedule.tuesday1.fromTime}</td><td>{schedule.tuesday1.toTime}</td></tr>}
                {schedule.wednesday1 && <tr><td>wednesday</td><td>{schedule.wednesday1.fromTime}</td><td>{schedule.wednesday1.toTime}</td></tr>}
                {schedule.thursday1 && <tr><td>thursday</td><td>{schedule.thursday1.fromTime}</td><td>{schedule.thursday1.toTime}</td></tr>}
                {schedule.friday1 && <tr><td>friday</td><td>{schedule.friday1.fromTime}</td><td>{schedule.friday1.toTime}</td></tr>}
                {schedule.saturday1 && <tr><td>saturday</td><td>{schedule.saturday1.fromTime}</td><td>{schedule.saturday1.toTime}</td></tr>}
                {schedule.sunday1 && <tr><td>sunday</td><td>{schedule.sunday1.fromTime}</td><td>{schedule.sunday1.toTime}</td></tr>}
            </tbody>
        </table>
    );
}

function cleanTel(tel: string): string {
    tel = tel.replaceAll(/\D/g, "");
    if (tel.startsWith("0")) {
        tel = `+49${tel.slice(1)}`;
    }
    return tel;
}

export default async function Page({ params }: Readonly<Props>) {

    const { id } = await params;

    const station = await getStationData(id);
    const status = await getStationFacilityStatus(id);

    if (!station || !status) {
        notFound();
    }

    return (
        <main className={styles.container}>
            <div className={styles.heading}>
                <ReturnButton />
                <h1>{station.name}</h1>
            </div>
            <fieldset>
                <legend><h2>Map</h2></legend>
                <ServiceDialogProvider>
                    <StationMapView station={station} status={status} />
                </ServiceDialogProvider>
            </fieldset>
            <fieldset className={styles.status}>
                <legend><h2>Status</h2></legend>

                <p>responsibility: {station.aufgabentraeger.name} ({station.aufgabentraeger.shortName})</p>

                <p>ifopt: {station.ifopt}</p>

                <p>mailing address: {station.mailingAddress.street} {station.mailingAddress.houseNumber} {station.mailingAddress.zipcode} {station.mailingAddress.city}</p>

                <p>product line: {station.productLine.productLine} / {station.productLine.segment}</p>

                <p>time table office: <Link href={`mailto:${station.timeTableOffice.email}`}>{station.timeTableOffice.name}</Link></p>

                <p>station management: #{station.stationManagement.number} &mdash; {station.stationManagement.name}</p>

                <p>service center: #{station.szentrale.number} &mdash; {station.szentrale.name} {station.szentrale.publicPhoneNumber && <>(<Link href={`tel:${cleanTel(station.szentrale.publicPhoneNumber)}`}>{station.szentrale.publicPhoneNumber}</Link>)</>}</p>

                {station.wirelessLan && <p>wireless lan: {station.wirelessLan.product} {station.wirelessLan.amount} {station.wirelessLan.installDate}</p>}

                <fieldset>
                    <legend>eva</legend>
                    <table>
                        <thead>
                            <tr>
                                <th>number</th>
                                <th>type</th>
                                <th>coordinates</th>
                            </tr>
                        </thead>
                        <tbody>
                            {station.evaNumbers.map(item => (
                                <tr key={item.number}>
                                    <td>{item.number}</td>
                                    <td>{item.isMain ? "main" : "other"}</td>
                                    <td>{item.geographicCoordinates.coordinates[0]}&nbsp;{item.geographicCoordinates.coordinates[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </fieldset>

                <fieldset>
                    <legend>ril100</legend>
                    <table>
                        <thead>
                            <tr>
                                <th>identifier</th>
                                <th>type</th>
                                <th>coordinates</th>
                                <th>location code</th>
                                <th>steam permission</th>
                            </tr>
                        </thead>
                        <tbody>
                            {station.ril100Identifiers.map(item => (
                                <tr key={item.primaryLocationCode}>
                                    <td>{item.rilIdentifier}</td>
                                    <td>{item.isMain ? "main" : "other"}</td>
                                    {item.geographicCoordinates ? (
                                        <td>{item.geographicCoordinates.coordinates[0]}&nbsp;{item.geographicCoordinates.coordinates[1]}</td>
                                    ) : (
                                        <td></td>
                                    )}
                                    <td>{item.primaryLocationCode}</td>
                                    <td>{item.steamPermission}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </fieldset>

                <fieldset>
                    <legend>db information</legend>
                    <ScheduleView schedule={station.DBinformation?.availability} />
                </fieldset>

                <fieldset>
                    <legend>local service staff</legend>
                    <ScheduleView schedule={station.localServiceStaff?.availability} />
                </fieldset>

                <fieldset>
                    <legend>mobility service staff</legend>
                    <p>service on behalf: {station.mobilityServiceStaff?.serviceOnBehalf ? "yes" : "no"}</p>
                    <p>staff on site: {station.mobilityServiceStaff?.staffOnSite ? "yes" : "no"}</p>
                    <p>meeting point: {station.mobilityServiceStaff?.meetingPoint}</p>
                    <ScheduleRangeView schedule={station.mobilityServiceStaff?.availability} />
                </fieldset>
            </fieldset>
        </main>
    );
}
