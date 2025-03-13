/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  CircularProgress, // Import du loader
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AccountCircle, Lock } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // État pour gérer le loader
  const navigate = useNavigate();
  const { signIn, userInfo } = useAuth();

  // Fonction pour gérer la connexion via Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Activation du loader au début de la requête
    try {
      // Utilisation de la méthode signIn pour l'authentification via Supabase
      await signIn(email, password);

      if (userInfo) {
        if (userInfo.role == "ROLE_CLIENT") {
          navigate("/currency-check");
        } else {
          navigate("/home");
        }
      } else {
        setError("Adresse e-mail ou mot de passe incorrect");
      }
    } catch (err: any) {
      console.log(err);
      setError("Adresse e-mail ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box
        sx={{
          width: 400,
          p: 4,
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {/* Titre */}
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#1976d2", fontWeight: "bold" }}
        >
          Bienvenue !
        </Typography>
        <Typography variant="body2" gutterBottom>
          Connectez-vous pour accéder à votre espace utilisateur
        </Typography>

        {/* Formulaire */}
        <form onSubmit={handleLogin}>
          {/* Champ Email */}
          <TextField
            fullWidth
            label="Adresse e-mail"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          {/* Champ Mot de passe */}
          <TextField
            fullWidth
            label="Mot de passe"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />

          {/* Message d'erreur */}
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}

          {/* Bouton de soumission avec loader */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={loading} // Désactiver le bouton pendant le chargement
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Se connecter"
            )}{" "}
            {/* Affichage du loader ou du texte */}
          </Button>
        </form>

        {/* Texte additionnel */}
        <Typography
          variant="body2"
          style={{ marginTop: "16px", color: "#555" }}
        >
          Vous n'avez pas de compte ?{" "}
          <Link to={"/signup"}>
            <span style={{ color: "#1976d2", cursor: "pointer" }}>
              Inscrivez-vous
            </span>
          </Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Authentication;
