"use client";

import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ReturnButton() {
    const router = useRouter();
    const [hasReferrer, setHasReferrer] = useState<boolean>(false);

    useEffect(() => {
        setHasReferrer(globalThis.history.length > 1);
    }, [setHasReferrer]);

    return (
        <button className="link" onClick={() => hasReferrer ? router.back() : router.push("/")} title="Back">
            <FontAwesomeIcon icon={faArrowLeftLong} size="2xl" />
        </button>
    );
}
