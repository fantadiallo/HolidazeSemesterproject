import styles from "./TopBanner.module.scss";

/**
 * TopBanner Component
 * Displays a prominent banner section with a subtitle message.
 * @returns {JSX.Element} The rendered TopBanner component.
 */
export default function TopBanner() {
  return (
    <section className={styles.topBanner}>
      <p className={styles.subtitle}>Find your perfect BnB stay in minutes</p>
    </section>
  );
}
