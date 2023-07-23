import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust the path according to your folder structure
import {useRouter} from 'next/router'
import Link from 'next/link';
import Head from 'next/head';

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
    <div className="bg-gray-200">
      <Head>
        <title>Login Page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar/>
      <div className="flex justify-center items-center min-h-screen px-4">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
          <h2 className="mb-4 text-xl font-bold text-center">Log In</h2>
          {renderInput("email", "Email", email, setEmail)}
          {renderInput("password", "Password", password, setPassword, true)}
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-primary-green hover:bg-dark-green text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <Link href="/signup" className="hover:text-dark-grey focus:text-dark-grey">
            <p className="mt-3 text-s bg-gray-100 rounded-md text-center">
              Don't have an account? Click Here!{' '}
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
};

function renderInput(id, label, value, setter, isPassword = false) {
  return (
    <div className="mb-4">
      <label className="block text-dark-green text-sm font-bold mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-dark-grey leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={isPassword ? "password" : "text"}
        value={value}
        onChange={(e) => setter(e.target.value)}
      />
    </div>
  );
}

export default LoginPage;