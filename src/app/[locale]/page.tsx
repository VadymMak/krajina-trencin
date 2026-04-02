import HeroSection from '@/components/Hero/HeroSection';
import TrustBar from '@/components/TrustBar/TrustBar';
import FeaturedProducts from '@/components/FeaturedProducts/FeaturedProducts';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      {/* TODO: About, Instagram, Contact */}
    </main>
  );
}
