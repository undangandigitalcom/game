import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { GuestView } from './pages/GuestView';
import { Pricing } from './pages/Pricing';
import { Auth } from './pages/Auth';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Guest Public View without standard SaaS layout */}
      <Route path="/i/:slug" element={<GuestView />} />

      {/* Pages with standard SaaS layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Landing />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/editor"
        element={
          <Layout>
            <Editor />
          </Layout>
        }
      />
      <Route
        path="/pricing"
        element={
          <Layout>
            <Pricing />
          </Layout>
        }
      />
      <Route
        path="/auth/login"
        element={
          <Layout>
            <Auth />
          </Layout>
        }
      />
      <Route
        path="/auth/register"
        element={
          <Layout>
            <Auth />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
};
