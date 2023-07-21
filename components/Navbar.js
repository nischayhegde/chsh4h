import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';

function Navbar() {

  const [links, setLinks] = useState([
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Login', href: '/login' },
    { name: 'Signup', href: '/signup' },
    { name: 'Event Calendar', href: '/events' },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const token=window.localStorage.getItem("auth_token");
    if(token!=null){
      axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', {token : token}).then(response => {decideLinks(response.data.authenticated);})
    }
  }, [])

  const decideLinks = (authenticated) => {
    if(authenticated) {
      setLinks(links => links.filter(link => link.name !== "Login"));
      setLinks(links => links.filter(link => link.name !== "Signup"));
      setLinks(links => links.filter(link => link.name !== "Profile"));
      setLinks(links => [...links, { name: 'Profile', href: '/profile'}]);
    }
  };

  return (
    <nav className="flex items-center justify-between px-5 py-3 bg-blue-700 w-full fixed top-0 z-50">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <img src="/favicon.png" alt="Logo" className="h-12 cursor-pointer" />
        </Link>
        <a href="https://www.instagram.com/your_instagram_handle/" target="_blank" rel="noopener noreferrer">
          <img src="/assets/igicon.png" alt="Instagram" className="h-8 w-8 transform transition duration-500 ease-in-out hover:scale-110"/>
        </a>
      </div>
      <div className="md:hidden">
        <button type="button" className="block text-gray-500 hover:text-white focus:text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path fill-rule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.829-4.828 4.829a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 011.414 1.414l-4.828 4.829 4.828 4.828z" clip-rule="evenodd" />
            ) : (
              <path fill-rule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 110-2z" clip-rule="evenodd" />
            )}
          </svg>
        </button>
      </div>
      <div className={`${isOpen ? "" : "hidden"} md:flex space-x-4`}>
        {links.map((link, index) => (
          <Link href={link.href} key={index} className="text-gray-100 no-underline hover:text-gray-500">
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar;