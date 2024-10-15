import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AccountCircle, Lock } from "@mui/icons-material";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction pour gérer la connexion
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "utilisateur@example.com" && password === "motdepasse123") {
      navigate("/home");
    } else {
      setError("Adresse e-mail ou mot de passe incorrect");
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

          {/* Bouton de soumission */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
              marginTop: "16px",
              padding: "12px",
              backgroundColor: "#1976d2",
            }}
          >
            Se connecter
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
