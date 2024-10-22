import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Logout as LogoutIcon,
  AttachMoney as MoneyIcon,
  AccountBalance as LoanIcon,
} from "@mui/icons-material"; // Importation des icônes
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const { signOut } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <AppBar position="static" elevation={0} className="bg-white pt-6">
      <Toolbar className="flex justify-between">
        {/* Left: Logo et titre */}
        <div className="flex items-center space-x-3">
          <img src="/path-to-your-logo.png" alt="Logo" className="h-10" />
          <Typography className="text-black font-bold text-xl">
            Transactions
          </Typography>
        </div>

        {/* Right: Boutons de navigation et déconnexion */}
        <div className="flex items-center space-x-4">
          {/* Lien vers la page de Vérification de la Monnaie avec icône */}
          <Button
            component={Link}
            to="/currency-check"
            className="text-black capitalize flex items-center hover:bg-gray-100 p-2 rounded-lg"
          >
            <MoneyIcon className="mr-2" />
            Vérifier Monnaie
          </Button>

          {/* Lien vers la page de Demande de Prêt avec icône */}
          <Button
            component={Link}
            to="/loan-request"
            className="text-black capitalize flex items-center hover:bg-gray-100 p-2 rounded-lg"
          >
            <LoanIcon className="mr-2" />
            Demande de Prêt
          </Button>

          {/* Bouton de déconnexion avec icône */}
          <IconButton
            onClick={handleLogout}
            className="text-black hover:bg-red-100 p-2 rounded-lg"
            title="Déconnexion"
          >
            <LogoutIcon />
            <Typography className="ml-2 text-black font-semibold capitalize">
              Déconnexion
            </Typography>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
