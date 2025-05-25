import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.scss";
import Loader from "../Loader/Loader";
import { useLoading } from "../../context/LoadingContext.jsx";

/**
 * Layout Component
 * Provides the main page structure with header, footer, and routed content.
 * Uses React Router's Outlet to render nested routes.
 * Displays Loader when global loading is active.
 *
 * @returns {JSX.Element} The rendered Layout component.
 */
export default function Layout() {
  const { loading } = useLoading();

  return (
    <div className={styles.layout}>
      <Header />
      {loading && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
