import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';

const AboutPage = () => {
  const images = Array.from({length: 10}, (_, i) => `/assets/habitat${i+1}.jpg`); // Replace with your actual path and image names
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((current) => (current + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center py-5 sm:py-10 px-2 sm:px-5">
      <Navbar />
      <div className="w-full max-w-4xl p-4 sm:p-6 mx-auto bg-white rounded-xl shadow-md space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 text-primary-green sm:mb-5">About Us</h1>
        <div className="relative w-full h-56 sm:h-[500px] mb-4 sm:mb-5">
          <Image src={images[activeImage]} alt={`Slideshow image ${activeImage+1}`} layout="fill" objectFit="contain" className="rounded-lg" />
          <button onClick={prevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">Prev</button>
          <button onClick={nextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">Next</button>
        </div>
        <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-5">
          Welcome to CHS Habitat - a vibrant and dynamic family where your time, talent, and passion transform into impactful actions. At our core, we believe in the power of volunteering and the magic of collective effort. As one of the most significant clubs at Clements High School, we take immense pride in our initiatives that leave a positive impact on our community and offer enriching experiences for our members.
        </p>
        <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-5">
          CHS Habitat isn't just a club - it's a platform for you to exhibit your dedication to teamwork, cultivate leadership skills, and make a tangible difference. From building furniture for those in need to lending a hand at high-energy marathons, our wide range of events offers you a chance to earn volunteer hours and enjoy the process. We are a community that thrives on diversity, inclusivity, and mutual support, always putting the needs and growth of our members first.
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          No strenuous applications or prior experience is needed to join our journey of personal growth and community upliftment. We open our arms wide to everyone, always ready to facilitate seamless integration. Embark on an unforgettable journey with us - be part of the change, be part of CHS Habitat.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;