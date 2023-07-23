import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust the path according to your folder structure
import {useRouter} from 'next/router'
import Head from 'next/head';

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
    <div className="bg-gray-200">
      <Head>
        <title>Signup Page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar/>
      <div className="flex justify-center items-center min-h-screen px-4">
        <form onSubmit={handleSignup} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
          <h2 className="mb-4 text-xl font-bold text-center text-dark-gray">Sign Up</h2>
          {renderInput("name", "Full Name", name, setName)}
          {renderInput("email", "Email", email, setEmail)}
          {renderInput("password", "Password", password, setPassword, true)}
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          {message && <p className="text-green-500 text-xs italic">{message}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-primary-green hover:bg-dark-green text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
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

export default SignupPage;