import Link from "next/link";
import styles from "./page.module.css";
import ProfileIcon from "@/components/profileIcon/ProfileIcon";
import Image from "next/image";

export default function Header(props) {
    return (
        <div className={styles.header + " " + (!props.profile ? styles.bg : "")}  >
                <div className={styles.in + " " + (!props.profile ? styles.inc : "")}>
                    <div className={styles.left}>
                            <div className={styles.title }>{props.title}</div>
                            <div className={styles.subtitle}>{props.subtitle}</div>
                    </div>
                    {props.profile && (
                        <div className={styles.right}>
                            <ProfileIcon logout={props.logout} />
                        </div>
                    )}
            </div>

        </div>
    );
}