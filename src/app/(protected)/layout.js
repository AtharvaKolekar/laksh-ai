"use client";

import { useState, useEffect } from "react";
import { signOut, useUser } from "@/lib/auth";

import Header from "@/components/chat/header/Header";
import { useRouter, usePathname } from "next/navigation";
import { initFirebase } from "@/lib/firebase";
import { getDatabase, ref, set, get, child } from "firebase/database";

import LoadingPage from "@/components/loadingPage/LoadingPage";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useUser();
  const database = getDatabase(initFirebase());

  
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");



  useEffect(() => {
    const myfun = async () => {
      
      if (user === null) {
        router.replace("/");
      }
         switch (pathname) {
        case "/Dashboard":
          setTitle("Dashboard");
          break;
        case "/Dashboard/Profile":
          setTitle("Profile");
          break;
        case "/Dashboard/RecommendCareer":
          setTitle("Recommend Career");
          break;
        case "/Dashboard/Mentors":
          setTitle("Mentors");
          break;
        case "/Dashboard/Roadmaps":
          setTitle("Roadmaps");
          break;
        default:
          break;
      }
      if (user) {
        get(child(ref(database), `UserData/${user.uid}`)).then((snapshot) => {
          if (!snapshot.exists()) {
            router.replace("/GetStarted");
            return <LoadingPage />;
          } else {
                  

            setName(snapshot.val().name);
          }
        });
      }
    }

    myfun();
   
  }, [pathname, user,  router]);


  if (user === false) return <LoadingPage />;

  if (!user) return null; // Return null or a loading component until the user state is resolved

 



  return (
    <main>
      <Header
        title={title}
        subtitle={"Welcome " + name + "!"}
        profile
        logout={signOut}
      />
      {children}
    </main>
  );
}
