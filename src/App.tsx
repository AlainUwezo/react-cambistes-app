import { StyledEngineProvider, CircularProgress, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./layouts/ProtectedRoute";
import React, { Suspense, lazy } from "react";

// Lazy loading des pages
const Home = lazy(() => import("./pages/Home/Home"));
const Credits = lazy(() => import("./pages/Credits/Credits"));
const Clients = lazy(() => import("./pages/Clients/Clients"));
const Authentication = lazy(() => import("./pages/auth/Authentification"));
const CurrencyCheckPage = lazy(() => import("./pages/users/CurrencyCheckPage"));
const LoanRequestPage = lazy(() => import("./pages/users/LoanRequestPage"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Administration = lazy(() => import("./pages/Administration"));

// Loader personnalisé
const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Authentication />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/credits"
                element={
                  <ProtectedRoute>
                    <Credits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                }
              />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/administration"
                element={
                  <ProtectedRoute>
                    <Administration />
                  </ProtectedRoute>
                }
              />
              <Route path="/currency-check" element={<CurrencyCheckPage />} />
              <Route path="/loan-request" element={<LoanRequestPage />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </StyledEngineProvider>
  );
}

export default App;
