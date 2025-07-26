"use client";

import {useRouter} from "next/navigation";
import {DetailedHTMLProps, KeyboardEventHandler, MouseEventHandler, TableHTMLAttributes, useCallback} from "react";

export type TableRowProps = {
    href?: string,
} & DetailedHTMLProps<TableHTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

export function TableRow({href, ...props}: TableRowProps) {

    const router = useRouter();

    const open = useCallback(() => {
        if (href)
            router.push(href);
    }, [href, router]);

    const openExternal = useCallback(() => {
        if (href)
            window.open(href, "_blank", "noopener,noreferrer");
    }, [href]);

    const handleClick: MouseEventHandler = useCallback(event => {
        event.preventDefault();
        switch (event.button) {
            case 0:
                if (event.ctrlKey)
                    openExternal();
                else
                    open();
                break;
            case 1:
                openExternal();
                break;
        }
    }, [open, openExternal]);

    const handleKeyDown: KeyboardEventHandler = useCallback(event => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (event.ctrlKey)
                openExternal();
            else
                open();
        }
    }, [open, openExternal]);

    return (
        <tr onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0} {...props}/>
    );
}