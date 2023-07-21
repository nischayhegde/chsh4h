import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar.js'
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Navbar/>
      
      <main className="flex flex-col items-center justify-center w-9/12 flex-1 text-center">
        <h1 className="margin h-40 text-6xl font-bold">
          Empower Your Community, Shape Your Future!
        </h1>
        <Link href="/signup" className="hover:text-blue-600 focus:text-blue-600">
          <p className="margin w-96 mt-3 text-xl bg-gray-100 rounded-md">
            Join the CHS Habitat Chapter Today!{' '}
          </p>
        </Link>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          {/* Placeholder for images. You can duplicate this section for multiple images. */}
          <Link href="/path-to-image-page" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Your Image Title &rarr;</h3>
            <p className="mt-4 text-xl">
              Description for the image.
            </p>
            <img className="mt-4 w-full" src="/path-to-image" alt="Image description" />
          </Link>
        </div>
      </main>
    </div>
  );
}
