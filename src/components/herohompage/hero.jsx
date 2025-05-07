import styles from './Hero.module.scss';

export default function Hero() {
  return (
    <section className={`${styles.hero} position-relative`}>
   <img
        src="../assets/heroimage.jpg"
        alt="Stylish apartment"
        className="img-fluid w-100"
      />
  <div className={`${styles.heroOverlay} position-absolute top-50 start-50 translate-middle text-center text-white`}>
  <h1 className="mb-3">Find Your Perfect Stay</h1>
        <a href="/accommodations" className="btn btn-primary btn-lg">
          Explore Stays
        </a>
      </div>
    </section>
  );
}

  