import Navbar from "@/components/Client/Navbar";
import Hero from "@/sections/Hero/Index";
import Introduction from "@/sections/Introduction";

const Home = () => {
  return (
    <main className="min-h-[200vh]">
      <Navbar />
      <Hero />
      <Introduction />
    </main>
  );
};

export default Home;