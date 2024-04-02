import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './admin/Admin.js';
import Sale from './sale/Sale.js';
import SignIn from './onepirate/SignIn.js';
import SignUp from './onepirate/SignUp.js';
import ForgotPassword from './onepirate/ForgotPassword.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route exact path="/sign-in" element={<SignIn />} />
        <Route exact path="/sign-up" element={<SignUp />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/admin" element={<Admin />} />
        <Route exact path="/sale" element={<Sale />} />
      </Routes>
    </Router>
  );
}

export default App;
