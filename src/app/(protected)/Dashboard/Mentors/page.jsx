"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/chat/header/Header";

import { signOut, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";

import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";

import Cal, { getCalApi } from "@calcom/embed-react";


export default function Dashboard() {
    const router = useRouter();
    const app = initFirebase();
    const database = getDatabase(app);
    const user = useUser();

    const [name, setName] = useState("");

    if (user) {
        console.log(user);
        get(child(ref(database), `UserData/${user.uid}/details`)).then(
            (snapshot) => {
                if (snapshot.exists()) {
                    setName(snapshot.val().name);
                } else {
                    console.log("No data available");
                }
            }
        );
    }

    useEffect(() => {
        (async function () {
            const cal = await getCalApi({
                namespace: "connect-with-expert-mentor",
            });
            cal("ui", {
                theme: "light",
                styles: { branding: { brandColor: "#6100FF" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        })();
    }, []);

    return (
        <main>
            <div className={styles.container}>
                <Cal
                    namespace="connect-with-expert-mentor"
                    calLink="lashai-testing/connect-with-expert-mentor"
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "scroll",
                    }}
                    config={{ layout: "month_view", theme: "light" }}
                />
            </div>
        </main>
    );
}
