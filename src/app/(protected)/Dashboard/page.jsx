"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/chat/header/Header";

import { signOut, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";

import { getDatabase, ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";
import { Button, Modal } from "antd";
import { WechatOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const app = initFirebase();
  const database = getDatabase(app);
  const user = useUser();

  const [name, setName] = useState("");
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setLoading(false);
  };
  return (
    <main>
      {children}
      {/* <Header title={"Welcome " + name + "!"} profile logout={signOut} /> */}
      <div className={styles.container}>
        <Button
          shape="circle"
          className={styles.btn}
          variant="outlined"
          icon={<WechatOutlined />}
          onClick={showLoading}
          size={"large"}
        />
        <Modal
          width={400}
          title={<p>LakshAI</p>}
          style={{
            position: "fixed",

            top: 10,
            right: 20,
          }}
          loading={loading}
          footer={null}
          open={open}
          onCancel={() => setOpen(false)}
        >
          <Search
            placeholder="Ask me anything"
            allowClear
            enterButton="Send"
            size="large"
            onSearch={() => {}}
          />
        </Modal>
      </div>
    </main>
  );
}
