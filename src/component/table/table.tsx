import {TableRow, TableRowProps} from "@/component/table/table-row";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faCircle} from "@fortawesome/free-regular-svg-icons";
import {faCheck, faClose} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ComponentType, ReactNode} from "react";

import styles from "./table.module.scss";

export type Field<T, K extends keyof T> = {
    key: K,
    label: string,
} & ({
    type: "boolean" | "number" | "string",
} | {
    type: "tristate",
    "0": T[K],
    "1": T[K],
    "2": T[K],
} | {
    type: "custom",
    render: ComponentType<{ data: T[K] }>,
});

export type Order<T> = readonly (keyof T)[];

export type Template<T, O extends Order<T>> = {
    [I in keyof O]: O[I] extends keyof T ? Field<T, O[I]> : never
};

export type DataTableFieldProps<T> = {
    field: Field<T, keyof T>,
    data?: T[keyof T],
    active?: boolean,
};

export type DataTableRowProps<T> = {
    value: T,
    row?: TableRowProps,
};

export type DataTableProps<T, O extends Order<T>> = {
    template: Template<T, O>,
    data: DataTableRowProps<T>[],
    className?: string,
};

export function DataTableField<T>({field, data, active}: DataTableFieldProps<T>) {

    let content: ReactNode;
    let className: string | undefined;

    if (data !== undefined)
        switch (field.type) {
            case "boolean":
                content = <FontAwesomeIcon icon={data ? faCheck : faClose}/>;
                className = styles.boolean;
                break;
            case "number":
                content = <span>{data as number}</span>;
                className = styles.number;
                break;
            case "tristate": {
                let icon: IconProp;
                switch (data) {
                    case field[0]:
                        icon = faClose;
                        break;
                    case field[1]:
                        icon = faCheck;
                        break;
                    case field[2]:
                        icon = faCircle;
                        break;
                    default:
                        throw new Error(`invalid tristate data ${data} for states ${field[0]} -> ${field[1]} -> ${field[2]}`);
                }
                content = <FontAwesomeIcon icon={icon}/>;
                className = styles.tristate;
                break;
            }
            case "string":
                content = <span>{data as string}</span>;
                className = styles.string;
                break;
            case "custom": {
                const Render = field.render;
                content = <Render data={data}/>;
                className = styles.custom;
                break;
            }
        }

    return <td className={`${className ?? ""} ${active ? styles.active : ""}`}>{content}</td>;
}

export function DataTable<T, O extends Order<T>>(
    {template, data, className}: DataTableProps<T, O>,
) {
    return (
        <table className={className}>
            <thead>
            <tr>
                {template.map(field => (
                    <th key={String(field.key)}>
                        <span>{field.label}</span>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map(({value, row}, index) => (
                <TableRow key={index} {...row}>
                    {template.map(field => (
                        <DataTableField key={String(field.key)} field={field} data={value[field.key]} active/>
                    ))}
                </TableRow>
            ))}
            </tbody>
        </table>
    );
}
