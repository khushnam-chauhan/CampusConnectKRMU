import React, { useEffect } from 'react';

import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";
import HiringSection from '../components/HiringSection';
import FAQ from '../components/FAQ';
import Placed from '../components/Placed';

const LandingPage = () => {



  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HiringSection/>
      <FAQ/>
      <Footer />
    </>
  );
};

export default LandingPage;