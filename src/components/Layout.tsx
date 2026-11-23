import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Toast />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
