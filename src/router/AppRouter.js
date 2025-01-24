import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginScreen } from '../components/auth/LoginScreen'
import { RegisterScreen } from '../components/auth/RegisterScreen'
import { CalendarScreen } from '../components/calendar/CalendarScreen'
import { useDispatch, useSelector } from 'react-redux'
import { startChecking } from '../actions/auth';
import { PublicRoute } from './PublicRoutes'
import { PrivateRoute } from './PrivateRoutes'

export const AppRouter = () => {

  const dispatch = useDispatch();
  const { checking, uid } = useSelector( state => state.auth );

  useEffect(() => {
    dispatch( startChecking() );
  }, [dispatch]);
  
  if ( checking ) {
    return <h5>Wait...</h5>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login' 
          element={
            <PublicRoute isAuthenticated={!!uid} element={LoginScreen} />
          }
        />
        <Route 
          path='/register' 
          element={
            <PublicRoute isAuthenticated={!!uid} element={RegisterScreen} />
          } 
          
        />
        <Route  
          path='/' 
          element={
            <PrivateRoute isAuthenticated={ !!uid } element={CalendarScreen} />
          } 
        />
        <Route 
          path='*'
          element={
            !!uid
              ? <Navigate to="/" />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
