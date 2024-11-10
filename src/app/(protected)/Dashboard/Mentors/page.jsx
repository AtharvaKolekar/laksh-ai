"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

import { useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";

import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";

import Cal, { getCalApi } from "@calcom/embed-react";
import { Button, Modal, Empty, Skeleton, Typography } from "antd";
import { ExportOutlined } from '@ant-design/icons';

export default function Dashboard() {

    const app = initFirebase();
    const database = getDatabase(app);
    const user = useUser();
    const [showCal, setShowCal] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [bookingData, setBookingData] = useState({});
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("");
    const [meetingUrl, setMeetingUrl] = useState("");
    useEffect(() => {
        if (isBooked) {
            const data = bookingData;
            const startDate = new Date(data.startTime), endDate = new Date(data.endTime);
            const date = startDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: data.timeZone });
            const startTimeFormatted = startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: data.timeZone });
            const endTimeFormatted = endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: data.timeZone });
            const timeZoneName = startDate.toLocaleTimeString("en-US", { timeZone: data.timeZone, timeZoneName: "long" }).split(' ').slice(-3).join(' ');
            const duration = `${startTimeFormatted} - ${endTimeFormatted} (${timeZoneName})`;
        
            setDate(date);
            setDuration(duration);
            setMeetingUrl(data.meetingUrl);
        }
    }, [isBooked, bookingData]);

    useEffect(() => {
        (async function () {
            const cal = await getCalApi({
                namespace: "connect-with-expert-mentor",
            });
            cal("ui", {
                theme: "light",
                styles: { branding: { brandColor: "#1677ff" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
            cal("on", {
                action: "bookingSuccessful",
                callback: (e) => {
                    setIsBooked(true);
                    const bookedData = {
                        startTime : e.detail.data.booking.startTime,
                        endTime : e.detail.data.booking.endTime,
                        timeZone : e.detail.data.eventType.schedule.timeZone,
                        meetingUrl : e.detail.data.booking.references[0].meetingUrl
                    }
                    setBookingData(bookedData);
                },
            });
        })();
    }, []);

    return (
        <main>
            <div className={styles.container}>
                <MainScreen isVisible={showCal} callback={() => setShowCal(true)} isBooked={isBooked} bookedData={bookingData} date={date} duration={duration} meetingUrl={meetingUrl}/>
                <CalScreen isVisible={showCal} callback={() => setShowCal(false)} isBooked={isBooked} />
            </div>
        </main>
    );
}

function MainScreen({ isVisible, callback, isBooked, bookedData, date, duration, meetingUrl }) {
    const router = useRouter();
    return (
      <div style={{ display: isVisible ? "none" : "block" }}>
        {isBooked && bookedData ? (
         <div>   <div className={styles.booking}>
                <img src="/meet.webp" alt="meet" />
                <div className={styles.bookingContent}>    
                    <h3>Meeting Scheduled</h3>
                    <p>{date}</p>
                    <p>{duration}</p>
                    <Button type="primary" size="middle" onClick={() => window.open(meetingUrl, "_blank")}><strong>Join Meeting <ExportOutlined /></strong></Button>
                </div>
                <Button onClick={()=>router.push("/Dashboard/Virtual-Internship/virtual/test")}>Continue to internship</Button>
            </div>
                
                </div>
        ): (
            <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 60 }}
                description={
                    <Typography.Text>
                        No meetings scheduled
                    </Typography.Text>
                }
            >
                <Button type="primary" onClick={callback}>Schedule Now</Button>
            </Empty>
        )}
      </div>
    )
}

function CalScreen({ isVisible, callback, isBooked }) {
    return (
        <div style={{ display: isVisible ? "block" : "none" }}>
            <Button style={{ marginBottom: 15, display: isBooked ? "none" : "block" }} type="primary" onClick={callback}><strong>Back</strong></Button>
            <Cal
                namespace="connect-with-expert-mentor"
                calLink="lashai-testing/connect-with-expert-mentor"
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "scroll",
                    display: isVisible ? "block" : "none",
                }}
                config={{ layout: "month_view", theme: "light" }}
            />
            <div style={{ width: "100%", display: isBooked ? "flex" : "none", justifyContent: 'center' }}> 
              <Button style={{ width: "100%", maxWidth: 576}} type="primary" onClick={callback}><strong>Continue</strong></Button>
            </div>


        </div>
    );
}
