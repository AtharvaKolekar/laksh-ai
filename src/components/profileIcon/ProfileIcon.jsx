import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import styles from "./page.module.css";

export default function ProfileIcon({ logout }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Close the navigation popup whenever the route changes
        setIsNavOpen(false);
    }, [pathname]); // This effect runs every time the pathname changes

    return (
        <label className={styles.popup}>
            <input
                type="checkbox"
                checked={isNavOpen}
                onChange={() => setIsNavOpen(!isNavOpen)}
            />
                    <div tabIndex="-1" className={styles.burger}>
        <svg width="128" height="128" viewBox="0 0 256 256"><g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none"><path fill="#fff" d="M64 14c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50-22.386-50-50-50z" transform="scale(2)"/><path fill="#6100ff" d="M64 117c-29.2 0-53-23.8-53-53s23.8-53 53-53 53 23.8 53 53-23.8 53-53 53zm0-100c-25.9 0-47 21.1-47 47s21.1 47 47 47 47-21.1 47-47-21.1-47-47-47z" transform="scale(2)"/><path fill="#6100ff" d="M86.5 52h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3s-1.3 3-3 3zm0 15h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3s-1.3 3-3 3zM86.5 82h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3s-1.3 3-3 3z" transform="scale(2)"/></g></svg>

        </div>
            <nav className={styles.popup_window}>
                <legend>Navigation Panel</legend>
                <ul>
                    <li>
                        <Link href="/Dashboard">
                            <button>
                                <span>Dashboard</span>
                            </button>
                        </Link>
                    </li>
                    <hr />
                    <li>
                        <Link href="/Dashboard/RecommendCareer">
                            <button>
                                <span>Careers</span>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/Dashboard/Roadmaps">
                            <button>
                                <span>Roadmaps</span>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/internship">
                            <button>
                                <span>Internships</span>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/Dashboard/Mentors">
                            <button>
                                <span>Mentors</span>
                            </button>
                        </Link>
                    </li>
                    <hr />
                    <li>
                        <Link href="/Dashboard/Profile">
                            <button>
                                <span>Profile</span>
                            </button>
                        </Link>
                    </li>
                    <hr />
                    <li>
                        <button onClick={logout}>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </label>
    );
}
