import Image from "next/image";
import Hero from "@/components/home/Hero";
import ProductCategories from "@/components/home/ProductCategories";
import AboutFarm from "@/components/home/AboutFarm";
import Products from "@/components/products/Products";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OrderCTA from "@/components/home/OrderCTA";

export default function Home() {
  return (
    <div>
      <Hero />
      <ProductCategories />
      <AboutFarm />
      <Products />
      <WhyChooseUs />
      <OrderCTA />
    </div>
  );
}

    