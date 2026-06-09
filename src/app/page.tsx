"use server";

import { StationData, getAllStationsData } from "@/api/stada";
import { FilterView } from "@/component/filter-view/filter-view";
import { PageView } from "@/component/page-view/page-view";
import { DataTable, DataTableRowProps } from "@/component/table/table";
import { makeParams } from "@/util/params";

import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./page.module.scss";

const ITEMS_PER_PAGE = 20;

interface StationProps extends StationData {
  hasQuery: boolean;
  hasState: boolean;
  attribute: string[];
}

interface Filter {
  query: string[];
  states: string[];
  attributes: string[];
  mode: "and" | "or";
}

function applyFilter<T>(mode: "and" | "or", attributes: (keyof T)[], item: T) {
  let ok = true;
  let any = false;
  for (const attribute of attributes) {
    const hasAttribute = item[attribute] === true;

    if (mode === "and") {
      if (!hasAttribute) {
        ok = false;
        break;
      }
      any = true;
      continue;
    }

    if (mode === "or" && hasAttribute) {
      any = true;
      break;
    }
  }
  return ok && any;
}

async function getPage(
  index: number,
  { query, states, attributes, mode }: Filter,
) {
  if (!attributes.length) {
    const { total, items } = await getAllStationsData({
      limit: ITEMS_PER_PAGE,
      offset: index * ITEMS_PER_PAGE,
      searchstring: query.length ? query : undefined,
      federalstate: states.length ? states : undefined,
    });

    return {
      count: Math.ceil(total / ITEMS_PER_PAGE),
      elements: items,
    };
  }

  const { total } = await getAllStationsData({
    limit: 1,
    offset: 0,
    searchstring: query.length ? query : undefined,
    federalstate: states.length ? states : undefined,
  });

  const filtered: StationData[] = [];

  for (let i = 0; i < total; i += 100) {
    const { items } = await getAllStationsData({
      limit: 100,
      offset: i,
      searchstring: query.length ? query : undefined,
      federalstate: states.length ? states : undefined,
    });

    for (const item of items) {
      if (applyFilter(mode, attributes as (keyof StationData)[], item)) {
        filtered.push(item);
      }
    }
  }

  return {
    count: Math.ceil(filtered.length / ITEMS_PER_PAGE),
    elements: filtered.slice(
      index * ITEMS_PER_PAGE,
      (index + 1) * ITEMS_PER_PAGE,
    ),
  };
}

async function Details({
  elements,
  extra: { query, states, attributes, mode },
}: {
  elements: StationData[];
  extra: Filter;
}) {
  const active: (keyof StationProps)[] = [];
  if (query.length) {
    active.push("name");
  }
  if (states.length) {
    active.push("federalState");
  }
  if (attributes.length) {
    active.push(...(attributes as (keyof StationProps)[]));
  }

  return (
    <DataTable<
      StationProps,
      [
        "name",
        "federalState",
        "hasBicycleParking",
        "hasCarRental",
        "hasDBLounge",
        "hasLocalPublicTransport",
        "hasLockerSystem",
        "hasLostAndFound",
        "hasParking",
        "hasPublicFacilities",
        "hasRailwayMission",
        "hasSteplessAccess",
        "hasTaxiRank",
        "hasTravelCenter",
        "hasTravelNecessities",
        "hasWiFi",
        "hasMobilityService",
        "category",
        "priceCategory",
      ]
    >
      template={
        [
          { key: "name", label: "Name", type: "string" },
          { key: "federalState", label: "Federal State", type: "string" },
          {
            key: "hasBicycleParking",
            label: "Bicycle Parking",
            type: "boolean",
          },
          { key: "hasCarRental", label: "Car Rental", type: "boolean" },
          { key: "hasDBLounge", label: "DB Lounge", type: "boolean" },
          {
            key: "hasLocalPublicTransport",
            label: "Local Public Transport",
            type: "boolean",
          },
          { key: "hasLockerSystem", label: "Locker System", type: "boolean" },
          { key: "hasLostAndFound", label: "Lost and Found", type: "boolean" },
          { key: "hasParking", label: "Parking", type: "boolean" },
          {
            key: "hasPublicFacilities",
            label: "Public Facilities",
            type: "boolean",
          },
          {
            key: "hasRailwayMission",
            label: "Railway Mission",
            type: "boolean",
          },
          {
            key: "hasSteplessAccess",
            label: "Stepless Access",
            type: "tristate",
            "0": "no",
            "1": "yes",
            "2": "partial",
          },
          { key: "hasTaxiRank", label: "Taxi Rank", type: "boolean" },
          { key: "hasTravelCenter", label: "Travel Center", type: "boolean" },
          {
            key: "hasTravelNecessities",
            label: "Travel Necessities",
            type: "boolean",
          },
          { key: "hasWiFi", label: "WiFi", type: "boolean" },
          {
            key: "hasMobilityService",
            label: "Mobility Service",
            type: "custom",
            render: async ({ data }) => {
              "use server";

              let text;
              switch (data) {
                case "Nur nach Voranmeldung unter 030 65 21 28 88 (Ortstarif)":
                  text = <span>only by appointment</span>;
                  break;
                case "Ja, um Voranmeldung unter 030 65 21 28 88 (Ortstarif) wird gebeten":
                  text = <span>advance registration is requested</span>;
                  break;
                default:
                  text = undefined;
                  break;
              }

              return (
                <span className={styles.custom}>
                  <FontAwesomeIcon icon={data === "no" ? faClose : faCheck} />
                  {text}
                </span>
              );
            },
          },
          { key: "category", label: "Category", type: "number" },
          { key: "priceCategory", label: "Price Category", type: "number" },
        ] as const
      }
      id="number"
      active={active}
      data={elements.map(
        (element) =>
          ({
            value: {
              hasQuery: !!query.length,
              hasState: !!states.length,
              attribute: attributes,
              ...element,
            },
            row: {
              href: `/station/${element.number}`,
            },
          }) satisfies DataTableRowProps<StationProps>,
      )}
      className={styles.stations}
    />
  );
}

export default async function Page(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const params = makeParams(searchParams);

  const query = params.get("query");
  const querySegments = query
    ? query.split(/\s+/).map((value) => `*${value}*`)
    : [];
  const states = params.getAll("states");
  const attributes = params.getAll("attributes");

  const mode = params.get("mode") ?? "and";
  if (mode !== "and" && mode !== "or") return;

  return (
    <main>
      <div className={styles.heading}>
        <h1>DB Viewer</h1>
      </div>
      <FilterView
        query={query}
        states={states}
        attributes={attributes}
        mode={mode}
        className={styles.paging}
      />
      <PageView
        getPage={getPage}
        Page={Details}
        className={styles.paging}
        searchParams={searchParams}
        extra={{
          query: querySegments,
          states,
          attributes,
          mode,
        }}
      />
    </main>
  );
}
