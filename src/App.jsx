import { useState } from 'react'

import './App.css'
import {  BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './Dashboard'

import Home from './components/Screen/Home'
import FSOR from './components/FSOR'

import Service from './components/Service'
import PumpCalSuite from './components/PumpCal'
import MobilePm from './components/Screen/MobilePm'
import ParentPage from './components/ParentPage'

function App() {
  const [count, setCount] = useState(0)

  return (
  
  <BrowserRouter>
  <Routes>
  <Route path='/' element={<Home />} />
  <Route path={"dashboard"} element={<Dashboard />} >
  <Route path={"pm"} element={<ParentPage />} />
  <Route path={"fsor"} element={<FSOR />} />
  <Route path={"service"} element={<Service />} />
  <Route path={"cal"} element={<PumpCalSuite />} />
  
  </Route>
  {/* 
  <Route element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>

  <Route path="concerts">
    <Route index element={<ConcertsHome />} />
    <Route path=":city" element={<City />} />
    <Route path="trending" element={<Trending />} />
  </Route> */}
</Routes>

  </BrowserRouter>
  )
}

export default App
