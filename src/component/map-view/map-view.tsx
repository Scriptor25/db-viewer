"use client";

import {Marker, Popup} from "maplibre-gl";
import {DetailedHTMLProps, HTMLAttributes, useEffect, useState} from "react";
import {Map, MapRef} from "react-map-gl/maplibre";

export type LngLat = [number, number];
export type Pin = {
    location: LngLat,
    color?: string,
    html?: string,
};

type Props = {
    center?: LngLat,
    bounds?: [LngLat, LngLat],
    zoom?: number,
    pins?: Pin[],
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function MapView({center, bounds, zoom, pins, ...props}: Props) {

    const [mapRef, setMapRef] = useState<MapRef | null>(null);

    useEffect(() => {
        const markers: Marker[] = [];
        if (mapRef !== null) {
            const map = mapRef.getMap();
            pins?.forEach(pin => {
                const marker = new Marker({color: pin.color})
                    .setLngLat(pin.location)
                    .addTo(map);

                if (pin.html) {
                    const popup = new Popup({
                        closeButton: false,
                        closeOnMove: true,
                        closeOnClick: true,
                    }).setHTML(pin.html);

                    marker.setPopup(popup);
                }

                markers.push(marker);
            });
        }
        return () => markers.forEach(marker => marker.remove());
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
                 mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json">
            </Map>
        </div>
    );
}
