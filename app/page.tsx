import Innovation from "@/components/Client/Innovation";
import Navbar from "@/components/Client/Navbar";
import ElementisStory from "@/sections/ElementisStory";
import Footer from "@/sections/Footer";
import Form from "@/sections/Form";
import Hero from "@/sections/Hero/Index";
import Introduction from "@/sections/Introduction";
import SustainableRetreat from "@/sections/SustainableRetreat";
import WellnessSanctuary from "@/sections/WellnessSanctuary";

const Home = () => {
  return (
    <main className="min-h-[200vh]">
      <Navbar />
      <Hero />
      <Introduction />
      <WellnessSanctuary />
      <Innovation />
      <ElementisStory />
      <SustainableRetreat />
      <Form />
      <Footer />
    </main>
  );
};

export default Home;