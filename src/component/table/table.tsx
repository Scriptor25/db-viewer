"use client";

import {faCircle} from "@fortawesome/free-regular-svg-icons";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import {ComponentType, DetailedHTMLProps, ReactNode, TableHTMLAttributes} from "react";

import styles from "./table.module.scss";

type TableRowProps = {
    href?: string,
} & DetailedHTMLProps<TableHTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;

export function TableRow({href, ...props}: TableRowProps) {

    const router = useRouter();

    return (
        <tr onClick={() => {
            if (href) router.push(href);
        }} onKeyDown={event => {
            if (href && event.key === "Enter") {
                router.push(href);
            }
        }} {...props}/>
    );
}

type Field<T, K extends keyof T> = {
    key: K,
    label: string,
} & ({
    type: "boolean" | "tristate" | "number" | "string",
} | {
    type: "custom",
    render: ComponentType<T[K]>,
});

// type Template<T> = Field<T, keyof T>[];
type Fields<T> = readonly (keyof T)[];
type Template<T, F extends Fields<T>> = {
    [I in keyof F]: F[I] extends keyof T ? Field<T, F[I]> : never;
};

type DataTableFieldProps<T> = {
    field: Field<T, keyof T>,
    data: T[keyof T],
    active: boolean,
};

type DataTableRowProps<T, F extends Fields<T>> = {
    template: Template<T, F>,
    data: T,
};

type DataTableProps<T, F extends Fields<T>> = {
    template: Template<T, F>,
    data: T[],
};

export function TableData<T>({field, data, active}: DataTableFieldProps<T>) {

    let content: ReactNode;
    let className: string;

    switch (field.type) {
        case "boolean":
            content = <FontAwesomeIcon icon={data ? faCheck : faClose}/>;
            className = styles.boolean;
            break;
        case "number":
            content = <span>{data as number}</span>;
            className = styles.number;
            break;
        case "tristate":
            content = <FontAwesomeIcon icon={data === true ? faCheck : data === false ? faClose : faCircle}/>;
            className = styles.tristate;
            break;
        case "string":
            content = <span>{data as string}</span>;
            className = styles.string;
            break;
        case "custom":
            const Render = field.render as ComponentType<object>;
            content = <Render {...data as object}/>;
            className = styles.custom;
            break;
    }

    return <td className={`${className} ${active ? styles.active : ""}`}>{content}</td>;
}

export function TableDataRow<T, F extends Fields<T>>({template, data}: DataTableRowProps<T, F>) {
    return (
        <TableRow>
            {template.map(field => (
                <TableData key={String(field.key)} field={field} data={data[field.key]} active/>
            ))}
        </TableRow>
    );
}

export function Table<T, F extends Fields<T>>({template, data}: DataTableProps<T, F>) {
    return (
        <table>
            <thead>
            <tr>
                {template.map(field => (<th>{field.label}</th>))}
            </tr>
            </thead>
            <tbody>
            {data.map((data, index) => <TableDataRow key={index} template={template} data={data}/>)}
            </tbody>
        </table>
    );
}

const x: Template<{ foo: string, bar: number, world: object }, ["foo", "bar", "world"]> = [
    {key: "foo", label: "Foo", type: "string"},
    {key: "bar", label: "Bar", type: "number"},
    {key: "world", label: "World", type: "custom", render: props => <p>{JSON.stringify(props)}</p>},
];

const a = x[0];
const b = x[1];

// fields: [ { id: "foo", type: "string" }, { id: "bar", type: "number" }, ... ]
// mydata: { foo: string, bar: number, ... }[] = [...]
// <mytable fields={fields} mydata={mydata}/>
