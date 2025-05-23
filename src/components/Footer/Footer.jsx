import styles from './Footer.module.scss';

/**
 * Footer Component
 * Renders the site footer with copyright information.
 * @returns {JSX.Element} The rendered Footer component.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2025 Holidaze. All rights reserved.</p>
    </footer>
  );
}
