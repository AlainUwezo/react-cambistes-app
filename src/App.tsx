import { StyledEngineProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Importer les composants de routage
import Home from "./pages/Home/Home"; // Assurez-vous d'importer vos pages
import Credits from "./pages/Credits/Credits";
import Clients from "./pages/Clients/Clients";
import Authentication from "./pages/auth/Authentification";
import CurrencyCheckPage from "./pages/users/CurrencyCheckPage";
import LoanRequestPage from "./pages/users/LoanRequestPage";
import Signup from "./pages/auth/Signup";
import Administration from "./pages/Administration";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Router>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/home" element={<Home />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/signup" element={<Signup />} />{" "}
          <Route path="/administration" element={<Administration />} />
          <Route path="/currency-check" element={<CurrencyCheckPage />} />
          <Route path="/loan-request" element={<LoanRequestPage />} />
        </Routes>
      </Router>
    </StyledEngineProvider>
  );
}

export default App;
