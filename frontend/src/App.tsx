import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='home'></Navigate>}></Route>
      <Route path='/home' element={<Home></Home>} />
      <Route path='/login' element={<Login></Login>} />
      <Route path='/register' element={<Register></Register>} />
    </Routes>
  )
}

export default App