import HeroSection from '@/components/Hero/HeroSection';
import TrustBar from '@/components/TrustBar/TrustBar';
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts';
import About from '@/components/About/About';
import Testimonials from '@/components/Testimonials/Testimonials';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      <About />
      <Testimonials />
      {/* TODO: Instagram, Contact */}
    </main>
  );
}
