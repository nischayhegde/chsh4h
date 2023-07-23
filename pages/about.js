import React from 'react';
import Navbar from '../components/Navbar'; // Adjust the path according to your folder structure

const AboutPage = () => {

  return (
    <div className="bg-gray-200">
      <Navbar/>
      <div className="flex flex-col items-center justify-center w-9/12 mx-auto my-10 py-9 text-dark-grey">
        <h1 className="text-4xl font-bold mb-5 text-dark-grey">About Us</h1>
        <img src="/path-to-image.jpg" alt="About us" className="rounded-lg shadow-lg mb-5"/>
        <p className="text-lg text-gray-700 mb-5 text-dark-grey">
        At our core, we believe in the power of volunteering and working together to provide much-needed construction services. We stand as one of the most significant clubs at Clements High School, taking great pride in our events that both positively impact our community and create enjoyable experiences for our valued members. 

Infused with youthful energy and the strength of camaraderie, every event we organize represents our commitment to support our community and foster an enriching environment for our club members. We see our club as a source of positive change, but also as a place for fun, friendship and memory making. Together, we are building a better world, one event at a time.
        </p>
        <img src="/path-to-another-image.jpg" alt="More about us" className="rounded-lg shadow-lg mb-5"/>
        <p className="text-lg text-gray-700 mb-5 text-dark-grey">
        Join the vibrant and dynamic CHS Habitat family, where your time, talent, and passion transform into meaningful impacts. Secure your chance to earn volunteer hours by participating in our engaging events ranging from building furniture for those in need to offering a helping hand at high-energy marathons. Our club thrives on diversity, inclusivity, and fostering a supportive community, always prioritizing the needs and growth of our members.

CHS Habitat is more than just a club; it's a platform that empowers you to showcase your commitment to teamwork, develop impeccable leadership skills, and make a difference. No strenuous applications or prior experience is needed to join this adventure - we welcome everyone with open arms, always ready to facilitate your seamless integration. Simply arrive at one of our meetings, and embark on an unforgettable journey towards personal growth and community upliftment. Be part of the change, be part of CHS Habitat.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;