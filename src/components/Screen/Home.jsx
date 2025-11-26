import React from 'react'
import { Link } from 'react-router'

export default function Home() {
  return (
    <Link to="dashboard" className='w-screen h-screen flex justify-center items-center bg-amber-300 font-bold text-3xl'><span className=' animate-bounce text-green-500 hover:scale-200 transition-all ease-in-out'>GO</span></Link>
  )
}
