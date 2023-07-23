import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar.js'
import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2">
      <div className="absolute inset-0 bg-cover bg-center"
           style={{backgroundImage: "url('/assets/homepagebg.jpg')"}}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <Navbar />

      <main className="relative flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-white">
          Welcome to the Clements High School Habitat for Humanity Chapter
        </h1>

        <p className="mt-3 text-2xl text-white">
          Building homes, communities, and hope.
        </p>

        <div className="flex items-center justify-center mt-6">
          <Link href="/signup">
            <button className="px-6 py-3 font-bold text-white bg-primary-green hover:bg-dark-green rounded-md">
              Join Us
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
