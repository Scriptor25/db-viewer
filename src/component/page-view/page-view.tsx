"use server";

import { makeParams, SearchParams } from "@/util/params";

import { ComponentType, ReactNode, Suspense } from "react";

import Link from "next/link";
import styles from "./page-view.module.scss";

interface Props<T, E = undefined> {
  getPage: (
    index: number,
    extra: E,
  ) => Promise<{ count: number; elements: T[] }>;
  Page: ComponentType<{ elements: T[]; extra: E }>;
  extra: E;
  searchParams: SearchParams;
  className?: string;
}

const SKIP_PAGE_COUNT = 5;
const HALF_SKIP_PAGE_COUNT = 2;

async function PageButton({
  index,
  searchParams,
  className,
  children,
}: {
  index: number;
  searchParams: SearchParams;
  className?: string;
  children?: ReactNode;
}) {
  const params = makeParams(searchParams);
  params.set("page", `${index}`);

  return (
    <Link href={`?${params}`} className={className}>
      {children}
    </Link>
  );
}

export async function PageView<T, E>({
  getPage,
  Page,
  extra,
  searchParams,
  className,
}: Readonly<Props<T, E>>) {
  const params = makeParams(searchParams);
  const index = parseInt(params.get("page") ?? "0", 10);

  const { count, elements } = await getPage(index, extra);

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
    } else
      for (
        let i = index - HALF_SKIP_PAGE_COUNT;
        i <= index + HALF_SKIP_PAGE_COUNT;
        ++i
      ) {
        indices.push(i);
      }

    navigation = (
      <div className={styles.navigation}>
        <ul className={styles.navigation}>
          <PageButton
            index={Math.max(index - SKIP_PAGE_COUNT, 0)}
            searchParams={searchParams}
            className="button"
          >
            &laquo;
          </PageButton>
          {indices?.map((i) => (
            <li key={i}>
              <PageButton
                index={i}
                searchParams={searchParams}
                className={i === index ? "button selection" : "button"}
              >
                {i + 1}
              </PageButton>
            </li>
          ))}
          <PageButton
            index={Math.min(index + SKIP_PAGE_COUNT, count - 1)}
            searchParams={searchParams}
            className="button"
          >
            &raquo;
          </PageButton>
        </ul>
        <span>
          {indices[0] + 1} - {indices.at(-1)! + 1} / {count}
        </span>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div className={styles.content}>
        <Suspense fallback={<progress />}>
          <Page elements={elements} extra={extra} />
        </Suspense>
      </div>
      {navigation}
    </div>
  );
}
