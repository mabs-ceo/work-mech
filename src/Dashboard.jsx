import React from 'react'
import { Link, Outlet } from 'react-router'

export default function Dashboard() {
  return (
  <div className="w-full min-h-screen bg-amber-100 flex flex-col items-center p-6">
  <h1 className="text-xl font-semibold mt-4">Dashboard</h1>

  <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-sm">
    <Link to="pm" className="p-5 rounded-2xl bg-white shadow-md text-center font-medium hover:scale-95 active:scale-90 transition cursor-pointer">
      PM
    </Link>

    <Link to='fsor' className="p-5 rounded-2xl bg-white shadow-md text-center font-medium hover:scale-95 active:scale-90 transition cursor-pointer">
      FSOR
    </Link>

    <Link to='service' className="p-5 rounded-2xl bg-white shadow-md text-center font-medium hover:scale-95 active:scale-90 transition cursor-pointer col-span-2">
      SERVICE
    </Link>
    <Link to='cal' className="mb-10 p-5 rounded-2xl bg-white shadow-md text-center font-medium hover:scale-95 active:scale-90 transition cursor-pointer col-span-2">
      CALCULATOR
    </Link>
  </div>
  <Outlet />
</div>

  )
}
