import Link from "next/link";
import styles from "./not-found.module.scss";

export default async function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h1>404</h1>
                <div/>
                <h2>Not Found</h2>
            </div>
            <p>Seems like this page does not exist. Please return to the <Link href="/">Home Page</Link> and try again.
            </p>
        </div>
    );
}
