import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { FaBell } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); // État pour gérer l'ouverture de la boîte de dialogue

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  // Fonction pour ouvrir la boîte de dialogue
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Fonction pour fermer la boîte de dialogue
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <AppBar position="static" elevation={0} className="bg-white pt-6">
      <Toolbar className="flex justify-between">
        {/* Left: Avatar and User Info */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <Typography className="text-black font-bold text-xl">
              Transactions
            </Typography>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex bg-gray-100 rounded-lg p-2 items-center w-1/2">
          <SearchIcon className="text-gray-500" />
          <InputBase
            placeholder="Search..."
            className="ml-2 w-full text-black"
            inputProps={{ "aria-label": "search" }}
          />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <IconButton>
            <FaBell size={20} className="text-black" />
          </IconButton>
          {/* Logout Icon */}
          <IconButton onClick={handleOpenDialog} className="text-black">
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmer la déconnexion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => {
              handleLogout(); // Déclenche la déconnexion
              handleCloseDialog(); // Ferme la boîte de dialogue
            }}
            color="primary"
            autoFocus
          >
            Déconnexion
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header;
