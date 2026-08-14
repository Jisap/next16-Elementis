import Navbar from "@/components/Client/Navbar";
import Hero from "@/sections/Hero/Index";
import Introduction from "@/sections/Introduction";
import WellnessSanctuary from "@/sections/WellnessSanctuary";

const Home = () => {
  return (
    <main className="min-h-[200vh]">
      <Navbar />
      <Hero />
      <Introduction />
      <WellnessSanctuary />
    </main>
  );
};

export default Home;