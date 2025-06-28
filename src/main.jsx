import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Planning from "./pages/Planning.jsx";
import Drivers from "./pages/Drivers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Recovery from "./pages/Recovery.jsx";
import Parking from "./pages/Parking.jsx";
import DashboardScreen from "./pages/DashboardScreen.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import Contact from "./pages/Contact.jsx";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import SuiviGeoPage from "./pages/SuiviGeoPage.jsx";
import { DriversProvider } from "./context/DriversContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalConnexion from "./components/modalConnexion.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
      // rediriger après 20 secondes si pas d'action
      const timer = setTimeout(() => setRedirect(true), 100000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    if (redirect) return <Navigate to="/" />;

    return (
      <ModalConnexion isOpen={showModal} onClose={() => setRedirect(true)} />
    );
  }

  return children;
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/planning",
        element: (
          <ProtectedRoute>
            <Planning />
            </ProtectedRoute>
        ),
      },
      { path: "/drivers", element: <Drivers /> },
      { path: "/parking", element: <Parking /> },
      {
        path: "/recovery",
        element: (
          <ProtectedRoute>
            <Recovery />
          </ProtectedRoute>
        ),
      },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/about", element: <About /> },
      { path: "/SuiviGeoPage", element: <SuiviGeoPage /> },
      { path: "/mentionsLegales", element: <MentionsLegales /> },
      {
        path: "/politiqueConfidentialite",
        element: <PolitiqueConfidentialite />,
      },
      { path: "/contact", element: <Contact /> },
      {
        path: "/admin/validation",
        element: (
          <ProtectedRoute>
            <AdminPage />
            </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/dashboardScreen", element: <DashboardScreen /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <DriversProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </DriversProvider>
    </ThemeProvider>
  </StrictMode>
);
