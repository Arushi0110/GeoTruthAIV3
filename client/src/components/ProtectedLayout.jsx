import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;

