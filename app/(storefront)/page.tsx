import { CategoriesSelection } from "../components/storefront/CategorySelection";
import { FeaturedProducts } from "../components/storefront/FeaturedProducts";
import { LandingHeader } from "../components/storefront/LandingHeader";
import { Hero } from "../components/storefront/Hero";
import { Navbar } from "../components/storefront/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";

export default function IndexPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* <Hero /> */}
      {/* <LandingHeader /> */}
      <LandingHeader />

      <div className="max-w-screen-2xl mx-auto hidden md:block my-12">
        <img src="./hero_banner.png" className=" md:w-full" />
      </div>
      <FeaturedProducts />
      <CategoriesSelection />
    </div>
  );
}
