import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.scss";

/**
 * Layout Component
 * Provides the main page structure with header, footer, and routed content.
 * Uses React Router's Outlet to render nested routes.
 * @returns {JSX.Element} The rendered Layout component.
 */
export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
