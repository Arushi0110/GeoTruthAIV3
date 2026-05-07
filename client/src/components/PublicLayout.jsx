import React from 'react';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
      <main className="flex min-h-screen items-center justify-center p-4 py-12">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;

