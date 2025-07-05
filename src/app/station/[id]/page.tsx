import {getStationFacilityStatus} from "@/api/fasta";
import {getStationData} from "@/api/stada";

import {ServiceDialogProvider} from "@/component/service-dialog/service-dialog-provider";
import {StationMapView} from "@/component/station-map-view/station-map-view";

import {faArrowLeftLong} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Link from "next/link";
import {notFound} from "next/navigation";

import styles from "./page.module.scss";

type Props = {
    params: Promise<{ id: number }>,
};

export default async function Page({params}: Props) {

    const {id} = await params;

    const station = await getStationData(id);
    const status = await getStationFacilityStatus(id);

    if (!station || !status) {
        notFound();
    }

    return (
        <>
            <main className={styles.container}>
                <div className={styles.heading}>
                    <Link href="/" title="Back to Home Page"><FontAwesomeIcon icon={faArrowLeftLong} size="2xl"/></Link>
                    <h1>{station.name}</h1>
                </div>
                <fieldset>
                    <legend><h2>Map</h2></legend>
                    <ServiceDialogProvider>
                        <StationMapView station={station} status={status}/>
                    </ServiceDialogProvider>
                </fieldset>
                <fieldset>
                    <legend><h2>Description</h2></legend>
                    <p>
                        Bavaria ipsum dolor sit amet damischa iabaroi wos Leonhardifahrt Ledahosn aasgem Fünferl
                        Watschnpladdla. Kimmt Fingahaggln i hob di narrisch gean Bradwurschtsemmal, Biazelt Weißwiaschd
                        fei
                        i moan scho aa Haberertanz Edlweiss Servas. Obandeln hallelujah sog i ham wolpern eam muass
                        Haferl
                        Foidweg. Schneid Steckerleis so schee umma, Schdarmbeaga See Habedehre obacht Schaung kost nix
                        Reiwadatschi owe. Heimatland da Gamsbart Haberertanz wos von Vergeltsgott: G’hupft wia gsprunga
                        wea
                        ko, dea ko Mongdratzal Mamalad Schuabladdla Brodzeid dahoam kimmt dringma aweng. Wann griagd ma
                        nacha wos z’dringa ghupft wia gsprunga dahoam, Habedehre. Semmlkneedl i hob di liab Almrausch a
                        ganze eana Schmankal Biagadn dahoam sammawiedaguad sammawiedaguad. Nois Marei Mongdratzal aasgem
                        Bussal Breihaus, Sauwedda do aasgem. Wui Zidern Graudwiggal .
                    </p>
                    <p>
                        Is gscheckate liberalitas Bavariae Gamsbart luja aau di hera, samma meara, Stubn fensdaln es
                        Freibia. Auf gehds beim Schichtl Schaung kost nix Ohrwaschl, Engelgwand mechad no a Maß. Iwan
                        Tisch
                        ziagn kimmt Lewakaas, Hendl wos! I von Ledahosn hinter’m Berg san a no Leit, ja leck mi?
                        Guglhupf da
                        vui de a Hoiwe Hetschapfah gwihss Sepp no Sepp blärrd? Ja mei du dadst ma scho daugn ma Spezi
                        geh,
                        sauba aba. Vui huift vui mehra Prosd Schneid di obandln Vergeltsgott es Graudwiggal, heitzdog
                        nia
                        need. Hob i an Suri blärrd sog i, hoggd naa Brodzeid. Weiznglasl Stubn glacht, g’hupft wia
                        gsprunga
                        Bradwurschtsemmal Auffisteign sodala Klampfn Marei ebba! Kummd oans, zwoa, gsuffa wann griagd ma
                        nacha wos z’dringa i moan oiwei, des wiad a Mordsgaudi owe Wurschtsolod jedza jedza.
                    </p>
                    <p>
                        Kneedl unbandig Schbozal Gstanzl mei trihöleridi dijidiholleri gscheid so: Hob bitt Landla zwoa
                        Prosd Marterl Radi Greichats Fünferl ozapfa! Damischa des is schee des basd scho midanand
                        Wurschtsolod oba Watschnbaam Auffisteign, spernzaln Biazelt Kuaschwanz? Sowos barfuaßat da hog
                        di hi
                        eana no a Maß a fescha Bua, allerweil. Hod greaßt eich nachad Vergeltsgott Watschnbaam weida
                        Schaung
                        kost nix i hob di liab hogg di hera anbandeln ned woar dei. Wann griagd ma nacha wos z’dringa
                        Griasnoggalsubbm es pfundig wos Wiesn Schneid Hendl, Jodler auffi! Wiesn großherzig umananda ned
                        woar a ganze du dadst ma scho daugn, des is schee wolln hoid. Fias Oibadrischl weida hogg ma uns
                        zamm in da ja mei. Gelbe Rüam mogsd a Bussal i hab an ma wo hi oans, owe Guglhupf.
                    </p>
                    <p>
                        Musi is des liab hea, helfgod Greichats aasgem helfgod Resi. Ramasuri und dahoam da gschwinde
                        braune
                        Fuchs hupft quea üba’n faulen Dackl da und nix Gwiss woass ma ned, umananda Meidromml. Dringma
                        aweng
                        a Hoiwe hob, des is hoid aso umma nix Gwiass woass ma ned wea ko, dea ko. Ebba Maibam Schmankal
                        wolln amoi i hob di liab Kirwa. Om auf’n Gipfe eana umma, Gidarn do kummd Marterl mi noch da
                        Giasinga Heiwog Heimatland Maderln. Naa nix Gwiss woass ma ned blärrd, i pfenningguat obandeln
                        des
                        basd scho. Da hog di hi i mog di fei soi baddscher Servas, wea nia ausgähd, kummt nia hoam is ma
                        Wuascht! So nix bitt Diandldrahn Brotzeit, fias om auf’n Gipfe. Do i hob Breihaus Schdeckalfisch
                        Biawambn a Hoiwe, nia need Biakriagal fias? I sog ja nix, i red ja bloß Gams pfundig sog i
                        nackata
                        nia, Greichats.
                    </p>
                    <p>
                        — da Blindtext kimmt von bavaria-ipsum.de
                    </p>
                </fieldset>
            </main>
        </>
    );
}
