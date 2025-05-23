import Hero from "../../components/herohompage/hero";
import TopBanner from "../../components/TopBanner/TopBanner";
import VenueSection from "../../components/VenueSection/VenueSection";

/**
 * HomePage Component
 * Renders the main homepage with a top banner, hero section, and venue listings.
 * @returns {JSX.Element} The rendered HomePage component.
 */
export default function HomePage() {
  return (
    <div>
      <TopBanner />
      <Hero />
      {/* other homepage content */}
      <VenueSection />
    </div>
  );
}