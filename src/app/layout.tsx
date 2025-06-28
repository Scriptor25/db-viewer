import "@fortawesome/fontawesome-svg-core/styles";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.scss";

import {Metadata} from "next";
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: "DB Viewer",
    description: "Ein inoffizieller Viewer für Infos rund um die Bahn.",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="de">
        <head>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}
