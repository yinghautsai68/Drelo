import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login></Login>}></Route>
      <Route path='/home' element={<Home></Home>} />
    </Routes>
  )
}

export default App