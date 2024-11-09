"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { signOut, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";
import { Button, Modal, Empty, Typography, Steps } from "antd";

const progresses = [
    {
        type: "Roadmap",
        title: "Web Development",
        subTitle: "Step",
        completedStep: 2,
        totalSteps: 5,
    },
    {
        type: "Virtual Internship",
        title: "Backend Development Internship",
        subTitle: "Task",
        completedStep: 3,
        totalSteps: 7,
    },
    {
        type: "Roadmap",
        title: "Data Science Path",
        subTitle: "Step",
        completedStep: 0,
        totalSteps: 6,
    },
    {
        type: "Virtual Internship",
        title: "Machine Learning Internship",
        subTitle: "Task",
        completedStep: 1,
        totalSteps: 4,
    },
];

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [isStarted, setIsStarted] = useState(false);

    const app = initFirebase();
    const database = getDatabase(app);
    const user = useUser();

    useEffect(() => {
        setIsStarted(progresses.length > 0);
    }, []);

    return (
        <main>
            {children}
            <div className={styles.container}>
                <h4 className={styles.conTitle}>Quick Access</h4>
                <div className={styles.modules}>
                    <div
                        className={styles.module}
                        onClick={() =>
                            router.push("/Dashboard/RecommendCareer")
                        }
                    >
                        <img src="/career.png" alt="career" />
                        <div className={styles.module_title}>
                            Career Recommendation
                        </div>
                    </div>
                    <div
                        className={styles.module}
                        onClick={() => router.push("/Dashboard/Roadmaps")}
                    >
                        <img src="/roadmap.png" alt="roadmap" />
                        <div className={styles.module_title}>
                            Roadmap Builder
                        </div>
                    </div>
                    <div
                        className={styles.module}
                        onClick={() => router.push("/Dashboard/Internship")}
                    >
                        <img src="/internship.png" alt="internship" />
                        <div className={styles.module_title}>
                            Virtual Internship
                        </div>
                    </div>
                    <div
                        className={styles.module}
                        onClick={() => router.push("/Dashboard/Mentors")}
                    >
                        <img src="/mentor.png" alt="mentor" />
                        <div className={styles.module_title}>
                            Mentor Guidance{" "}
                        </div>
                    </div>
                </div>
                <h4 className={styles.conTitle + " " + styles.topC}>Top Career Opportunities</h4>
                <div className={styles.topCareers + " " + styles.topC}>
                    <div className={styles.careers}>
                        <div className={styles.career + " " + styles.a}>
                            <p>1. Data Scientist</p>
                        </div>
                        <div className={styles.career + " " + styles.b}>
                            <p>2. Cloud Architect</p>
                        </div>
                        <div className={styles.career + " " + styles.c}>
                            <p>3. AI/Machine Learning Engineer</p>
                        </div>
                        <div className={styles.career + " " + styles.d}>
                            <p>4. Cybersecurity Engineer</p>
                        </div>
                        <div className={styles.career + " " + styles.e}>
                            <p>5. DevOps Engineer</p>
                        </div>
                    </div>
                    <img src="/pie.png" alt="pie" />
                </div>

                <h4 className={styles.conTitle}>Your Progress</h4>
                {!isStarted ? (
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{ height: 60 }}
                        description={
                            <Typography.Text>
                                You have not yet started any course.
                            </Typography.Text>
                        }
                    >
                        <Button type="primary" onClick={() => router.push("#GetStarted")}>Get Started</Button>
                    </Empty>
                ) : (
                    progresses.map((progress, index) => {
                        const currentStep = progress.completedStep - 1;

                        return (
                            <div key={index} className={styles.progress}>
                                <h5>
                                    {progress.type}: {progress.title}
                                </h5>
                                <Steps
                                    direction="horizontal"
                                    current={currentStep}
                                    items={Array.from(
                                        { length: progress.totalSteps },
                                        (_, i) => ({
                                            title: `${progress.subTitle} ${
                                                i + 1
                                            }`,
                                            description:
                                                i < progress.completedStep - 1
                                                    ? "Completed"
                                                    : i === currentStep
                                                    ? "In Progress"
                                                    : "Pending",
                                        })
                                    )}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}
