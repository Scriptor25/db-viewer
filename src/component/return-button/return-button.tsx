"use client";

import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ReturnButton() {
    const router = useRouter();
    const [hasReferrer, setHasReferrer] = useState<boolean>();

    useEffect(() => {
        setHasReferrer(globalThis.history.length > 1);
    }, []);

    return hasReferrer ? (
        <button className="link" onClick={() => router.back()} title="Back">
            <FontAwesomeIcon icon={faArrowLeftLong} size="2xl" />
        </button>
    ) : (
        <Link className="link" href="/" title="Back">
            <FontAwesomeIcon icon={faArrowLeftLong} size="2xl" />
        </Link>
    );
}
