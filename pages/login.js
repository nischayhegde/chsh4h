import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust the path according to your folder structure
import {useRouter} from 'next/router'
import Link from 'next/link';

const LoginPage = () => {

  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    const token=window.localStorage.getItem("auth_token");

    axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/login', {email: email, password: password, token: token}).then( response => {
        setError()
        window.localStorage.setItem('auth_token', response.data.token)
        router.push("/profile")
      }
    ).catch((err) => {
      setError(err.response.data.message);
    });
  };

  React.useEffect(() => {
    const token=window.localStorage.getItem("auth_token");
    if(token!=null){
      axios.post('https://h4api-9d2bafe7d30a.herokuapp.com/api/isauthenticated', {token : token}).then(response => {if(response.data.authenticated){router.push("/profile")}})
    }
  }, []);

  return (
    <div>
      <Navbar/>
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
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
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <Link href="/signup" className="hover:text-blue-600 focus:text-blue-600">
            <p className="margin w-96 mt-3 text-s bg-gray-100 rounded-md">
              Don't have an account? Click Here!{' '}
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;