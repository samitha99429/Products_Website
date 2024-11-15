import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Favorites from './pages/Favorites';
import SearchResults from './pages/SearchResults';
import Login from './components/Login';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/Favorites';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');  

  return (
    <div>
      {isAuthenticated && <Navbar />} 
      <div className="container mt-4">
        <Routes>
         
          <Route path="/" element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/homepage" /> : <RegisterPage />} />
         
          
       
          <Route path="/add-product" element={isAuthenticated ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/edit-product/:id" element={isAuthenticated ? <EditProduct /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <SearchResults /> : <Navigate to="/login" />} />

          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
