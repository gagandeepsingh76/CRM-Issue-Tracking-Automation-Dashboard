import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { useCurrentRoute } from "../hooks/useCurrentRoute";

const ProtectedLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentRoute = useCurrentRoute();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-72">
        <Navbar
          currentRoute={currentRoute}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
