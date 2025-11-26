import { useState } from 'react'

import './App.css'
import {  BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './Dashboard'
import PM from './components/PM'
import Home from './components/Screen/Home'
import FSOR from './components/FSOR'
import About from './components/About'
import Service from './components/Service'

function App() {
  const [count, setCount] = useState(0)

  return (
  
  <BrowserRouter>
  <Routes>
  <Route path='/' element={<Home />} />
  <Route path={"about"} element={<About />} />
  <Route path={"dashboard"} element={<Dashboard />} >
  <Route path={"pm"} element={<PM />} />
  <Route path={"fsor"} element={<FSOR />} />
  <Route path={"service"} element={<Service />} />
  
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
