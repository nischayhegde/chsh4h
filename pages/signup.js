import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust the path according to your folder structure
import {useRouter} from 'next/router'

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  React.useEffect(() => {
    const token=window.localStorage.getItem("auth_token");
    if(token!=null){
      axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', {token : token}).then(response => {if(response.data.authenticated){router.push("/profile")}})
    }
  }, []);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const token=window.localStorage.getItem("auth_token");

    axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/signup', { name, email, password, token }).then(response => {
        setMessage(response.data.message)
      }
    ).then(() => router.push("/login")).catch((err) => {
      setError(err.response.data.message);
    });
  };

  return (
    <div>
      <Navbar/>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSignup} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          {message && <p className="text-green-500 text-xs italic">{message}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;