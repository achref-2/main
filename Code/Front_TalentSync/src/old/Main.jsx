import React, { useState, useEffect } from "react";
import { Navigation } from "../components/Example/navigation";
import { Header } from "../components/Example/header";
import { Features } from "../components/Example/features";
import { About } from "../components/Example/about";
import { Services } from "../components/Example/services";
import { Gallery } from "../components/Example/gallery";
import { Testimonials } from "../components/Example/testimonials";
import { Team } from "../components/Example/Team";
import { Contact } from "../components/Example/contact";
import JsonData from "../data/data.json";
import SmoothScroll from "smooth-scroll";



export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Main = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      
      <Navigation />
      
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} />
      
    </div>
  );
};

export default Main;
