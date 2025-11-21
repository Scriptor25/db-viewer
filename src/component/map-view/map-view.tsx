"use client";

import { Marker, Popup, RequestParameters } from "maplibre-gl";
import { DetailedHTMLProps, HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Map, MapRef } from "react-map-gl/maplibre";

export type LngLat = [number, number];
export interface Pin {
    location: LngLat,
    content?: ReactNode,
    color?: string,
};

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    center?: LngLat,
    bounds?: [LngLat, LngLat],
    zoom?: number,
    pins?: Pin[],
};

export function MapView({ center, bounds, zoom, pins, ...props }: Readonly<Props>) {

    const [mapRef, setMapRef] = useState<MapRef | null>(null);

    useEffect(() => {
        const markers: Marker[] = [];

        if (mapRef !== null) {
            const map = mapRef.getMap();
            if (pins) {
                for (const pin of pins) {
                    const marker = new Marker({ color: pin.color })
                        .setLngLat(pin.location)
                        .addTo(map);

                    if (pin.content) {
                        const container = document.createElement("div");
                        const root = createRoot(container);
                        root.render(pin.content);

                        const popup = new Popup({
                            closeButton: false,
                            closeOnMove: true,
                            closeOnClick: true,
                            maxWidth: "none",
                        }).setDOMContent(container);

                        marker.setPopup(popup);
                    }

                    markers.push(marker);
                }
            }
        }

        return () => {
            for (const marker of markers) {
                marker.remove();
            }
        };
    }, [mapRef, pins]);

    return (
        <div {...props}>
            <Map ref={setMapRef}
                initialViewState={{
                    longitude: center ? center[0] : undefined,
                    latitude: center ? center[1] : undefined,
                    zoom: zoom,
                }}
                cancelPendingTileRequestsWhileZooming={false}
                maxBounds={bounds}
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                transformRequest={(url): RequestParameters | undefined => {
                    return {
                        url: `${globalThis.location.origin}/api/proxy?url=${encodeURIComponent(url)}`,
                    };
                }}>
            </Map>
        </div>
    );
}
