"use client";

import {faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PropsWithChildren, Ref, useImperativeHandle, useRef, useState} from "react";
import styles from "./dialog-form.module.scss";

export type DialogFormRef = {
    open: (onSubmit: (value: string) => void) => void,
}

type Props = {
    ref?: Ref<DialogFormRef>,
    className?: string,
}

export function DialogForm({ref, className, children}: PropsWithChildren<Props>) {

    const dialogRef = useRef<HTMLDialogElement>(null);
    const [consumer, setConsumer] = useState<(value: string) => void>();

    useImperativeHandle(ref, () => ({
        open: consumer => {
            setConsumer(() => consumer);
            dialogRef.current?.showModal();
        },
    }));

    return (
        <dialog ref={dialogRef} className={`${styles.dialog} ${className ?? ""}`} onClose={event => {
            const value = event.currentTarget.returnValue;
            if (value.length > 0) {
                consumer?.(value);
            }
        }}>
            <form method="dialog">
                <button className={styles.close} type="submit" value="">
                    <FontAwesomeIcon icon={faClose} size="xl"/>
                </button>
                {children}
            </form>
        </dialog>
    );
}
