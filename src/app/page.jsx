"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { signOut, useUser } from "@/lib/auth"
import ProfileIcon from "@/components/profileIcon/ProfileIcon";
import LoadingPage from "@/components/loadingPage/LoadingPage";

export default function Home() {
  const user = useUser();
  if(user === false)  return <LoadingPage />
  return (
    <main>
      <div className={styles.header}>
        <Image src="/logo.jpg" alt="logo" width={70} height={60} priority/>
        <div className={styles.nav}>
          <Link href="#products">Products</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/mentors">Explore Mentors</Link>
          <Link href="/blogs">Blogs</Link>

          <Link href="#">
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              LakshAI
              <svg
                fill="#ba0ffd"
                viewBox="0 0 24 24"
              >
                <path d="M16 20L17.6 14.6L23 13L17.6 11.4L16 5.99999L14.4 11.4L9 13L14.4 14.6L16 20Z"></path>
                <path d="M7.5 21L8.3 18.3L11 17.5L8.3 16.7L7.5 14L6.7 16.7L4 17.5L6.7 18.3L7.5 21Z"></path>
                <path d="M7.5 10.8L8.07143 8.87142L10 8.29999L8.07143 7.72856L7.5 5.79999L6.92857 7.72856L5 8.29999L6.92857 8.87142L7.5 10.8Z"></path>
              </svg>
            </div>
          </Link>
        </div>
        <div className={styles.auth}>
          {user ? ( 
              <ProfileIcon logout={signOut} />
          ) : (
            <div>
              <Link className={styles.loginBtn} href="/Login">Login</Link>
              <Link className={styles.signupBtn} href="/GetStarted">Get Started</Link>
            </div>
            
          )}


        </div>
      </div>

      <div className={styles.sec1_wrapper}>
        <div className={styles.sec1}>
          <Image
            style={{ objectFit: "cover", mixBlendMode: "multiply" }}
            src="/ai.gif"
            alt="logo"
            width={200}
            height={100}
            priority
          />
          <p className={styles.title}>
            Hi I'm
            <span className={styles.ai}>
              LakshAI
              <svg fill="#ba0ffd" viewBox="0 0 24 24">
                <path d="M16 20L17.6 14.6L23 13L17.6 11.4L16 5.99999L14.4 11.4L9 13L14.4 14.6L16 20Z"></path>
                <path d="M7.5 21L8.3 18.3L11 17.5L8.3 16.7L7.5 14L6.7 16.7L4 17.5L6.7 18.3L7.5 21Z"></path>
                <path d="M7.5 10.8L8.07143 8.87142L10 8.29999L8.07143 7.72856L7.5 5.79999L6.92857 7.72856L5 8.29999L6.92857 8.87142L7.5 10.8Z"></path>
              </svg>
            </span>
          </p>

          <h1>Your Personal AI Mentor</h1>
          <p className={styles.subtitle}>
            Share your passions and interests with us, and we'll help you find
            the best career path tailored just for you!
          </p>
          <Link className={styles.tryBtn} href="/GetStarted">
            <b>✩</b> Get started for free!
          </Link>
        </div>
      </div>
    </main>
  );
}
