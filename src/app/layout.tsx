import "@fortawesome/fontawesome-svg-core/styles";
import "maplibre-gl/dist/maplibre-gl.css";

import "./globals.scss";

import {Metadata} from "next";

import {Fira_Sans} from "next/font/google";
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: "DB Viewer",
    description: "Ein inoffizieller Viewer für Infos rund um die Bahn.",
};

const font = Fira_Sans({
    style: ["normal", "italic"],
    subsets: ["latin", "latin-ext"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="de" className={font.className}>
        <head>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}
