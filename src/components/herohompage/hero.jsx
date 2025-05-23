import styles from './Hero.module.scss';

/**
 * Hero Component
 * Displays a hero section with a background image, headline, and call-to-action button.
 * @returns {JSX.Element} The rendered Hero component.
 */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <img
        src="../assets/heroimage.jpg"
        alt="Stylish apartment"
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay}>
        <h1>Find Your Perfect Stay</h1>
        <a href="/accommodations" className="btn btn-primary btn-lg">
          Explore Stays
        </a>
      </div>
    </section>
  );
}
