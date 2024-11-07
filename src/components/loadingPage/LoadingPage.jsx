import styles from "./page.module.css";
import Image from "next/image";

import { Spinner } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";


export default function MessageContainer({ text, callback }) {

  return (
    <div className={styles.container}>
        <div className={styles.logo_wrapper}>
            <Image className={styles.logo} src="/logo.jpg" alt="logo" width={80} height={80} priority/>
            <p className={styles.title}>LakshAI</p>
        </div>
       <div className={styles.loading}>
          <Spinner color="info" size="sm">
            </Spinner>
          <p>Loading LakshAI</p>
       </div>
    </div>

  );
}
