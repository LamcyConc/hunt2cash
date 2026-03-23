import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'universal-cookie'
import AuthGuard from './authService/AuthGuard'


import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Landing from './pages/Landing'

import Dashboard from './pages/user/Dashboard'
import Transfer from './pages/user/Transfer'
import Crypto from './pages/user/Crypto'
import SellCrypto from './pages/user/SellCrypto'
import Transactions from './pages/user/Transactions'
import Profile from './pages/user/Profile'


import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminMessage from './pages/admin/AdminMessage'
import AdminExchange from './pages/admin/AdminExchange'
import Settings from './pages/user/Settings'
import ForgotPassword from './pages/auth/ForgotPassword'

const App = () => {
  const cookies = new Cookies()
  const token = cookies.get("token")

  // Decode token to check role
  const isAuth = !!token
  const isAdmin = token ? JSON.parse(atob(token.split(".")[1])).roles === "admin" : false

  return (
    <>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected user routes */}
        <Route element={<AuthGuard isAuth={isAuth} redirectPath="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/crypto" element={<Crypto />} />
          {/* <Route path="/crypto/sell" element={<SellCrypto />} /> */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Protected admin routes */}
        <Route element={<AuthGuard isAuth={isAuth && isAdmin} redirectPath="/login" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/message" element={<AdminMessage />} />
          <Route path="/admin/exchange" element={<AdminExchange />} />
        </Route>

      </Routes>
    </>
  )
}

export default App