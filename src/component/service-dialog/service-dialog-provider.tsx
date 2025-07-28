"use client";

import {DialogForm, DialogFormRef} from "@/component/dialog-form/dialog-form";
import {ServiceDialogContext} from "@/component/service-dialog/service-dialog-context";
import {faApple, faGoogle, faMicrosoft} from "@fortawesome/free-brands-svg-icons";
import {faMap, faMobile} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PropsWithChildren, useRef} from "react";

import styles from "./service-dialog.module.scss";

export function ServiceDialogProvider({children}: Readonly<PropsWithChildren>) {
    const dialogFormRef = useRef<DialogFormRef>(null);

    return (
        <>
            <DialogForm ref={dialogFormRef} className={styles.dialog}>
                <h3>Select Map Service</h3>
                <button type="submit" value="open-street-maps">
                    <span><FontAwesomeIcon icon={faMap}/></span>
                    <span>Open Street Maps</span>
                </button>
                <button type="submit" value="google-maps">
                    <span><FontAwesomeIcon icon={faGoogle}/></span>
                    <span>Google Maps</span>
                </button>
                <button type="submit" value="apple-maps">
                    <span><FontAwesomeIcon icon={faApple}/></span>
                    <span>Apple Maps</span>
                </button>
                <button type="submit" value="bing-maps">
                    <span><FontAwesomeIcon icon={faMicrosoft}/></span>
                    <span>Bing Maps</span>
                </button>
                <button type="submit" value="native">
                    <span><FontAwesomeIcon icon={faMobile}/></span>
                    <span>Native</span>
                </button>
            </DialogForm>
            <ServiceDialogContext value={{
                openDialog: location => {
                    dialogFormRef.current?.open(value => {
                        let href: string;
                        switch (value) {
                            case "open-street-maps":
                                href = `https://www.openstreetmap.org/?mlat=${location[1]}&mlon=${location[0]}`;
                                break;
                            case "google-maps":
                                href = `https://www.google.com/maps?q=${location[1]},${location[0]}`;
                                break;
                            case "apple-maps":
                                href = `https://maps.apple.com/?ll=${location[1]},${location[0]}`;
                                break;
                            case "bing-maps":
                                href = `https://www.bing.com/maps?cp=${location[1]}~${location[0]}`;
                                break;
                            case "native":
                                href = `geo:${location[1]},${location[0]}`;
                                break;
                            default:
                                return;
                        }
                        window.open(href, "_blank", "noopener,noreferrer");
                    });
                },
            }}>
                {children}
            </ServiceDialogContext>
        </>
    );
}
