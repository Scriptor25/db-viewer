"use client";

import { ReactNode, useEffect, useState } from "react";

import styles from "./page-view.module.scss";

type Props<T, E = undefined> = {
    pageAction(index: number, extra: E): Promise<{ count: number, elements: T[] }>,
    renderAction(elements: T[], extra: E): Promise<ReactNode>,
    extra: E,
    className?: string,
};

const SKIP_PAGE_COUNT = 5;
const HALF_SKIP_PAGE_COUNT = 2;

export function PageView<T, E>({ pageAction, renderAction, extra, className }: Readonly<Props<T, E>>) {

    const [index, setIndex] = useState(0);
    const [data, setData] = useState<{ count: number, content: ReactNode }>();

    const [extraState, setExtraState] = useState<E>(extra);

    if (JSON.stringify(extraState) !== JSON.stringify(extra)) {
        setIndex(0);
        setExtraState(extra);
    }

    useEffect(() => {
        pageAction(index, extra).then(({ count, elements }) => {
            renderAction(elements, extra).then(content => {
                setData({ count, content });
            });
        });
        return () => {
            setData(undefined);
        };
    }, [pageAction, renderAction, extra, index, setData]);

    const count = data?.count ?? 0;

    let navigation: ReactNode | undefined;
    if (count > 1) {
        const indices: number[] = [];
        if (index <= HALF_SKIP_PAGE_COUNT) {
            for (let i = 0; i < Math.min(SKIP_PAGE_COUNT, count); ++i) {
                indices.push(i);
            }
        } else if (index >= count - HALF_SKIP_PAGE_COUNT) {
            for (let i = Math.max(count - SKIP_PAGE_COUNT, 0); i < count; ++i) {
                indices.push(i);
            }
        } else for (let i = index - HALF_SKIP_PAGE_COUNT; i <= index + HALF_SKIP_PAGE_COUNT; ++i) {
            indices.push(i);
        }

        navigation = (
            <div className={styles.navigation}>
                <ul className={styles.navigation}>
                    <button onClick={() => setIndex(index => Math.max(index - SKIP_PAGE_COUNT, 0))}>
                        &laquo;
                    </button>
                    {indices?.map(i => (
                        <li key={i}>
                            <button onClick={() => setIndex(i)} className={i === index ? "selection" : ""}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <button onClick={() => setIndex(index => Math.min(index + SKIP_PAGE_COUNT, count - 1))}>
                        &raquo;
                    </button>
                </ul>
                <span>{indices[0] + 1} - {indices.at(-1)! + 1} / {count}</span>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${className ?? ""}`}>
            <div className={styles.content}>{data?.content ?? <progress />}</div>
            {navigation}
        </div>
    );
}
