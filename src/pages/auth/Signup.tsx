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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction pour gérer l'inscription
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    // Ici, vous pourriez ajouter la logique pour l'inscription (API, etc.)
    // Après une inscription réussie, on redirige l'utilisateur
    navigate("/home");
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
          Créez votre compte
        </Typography>
        <Typography variant="body2" gutterBottom>
          Inscrivez-vous pour accéder à votre espace utilisateur
        </Typography>

        {/* Formulaire */}
        <form onSubmit={handleSignup}>
          {/* Champ Nom d'utilisateur */}
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

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

          {/* Champ Confirmation mot de passe */}
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            variant="outlined"
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            S'inscrire
          </Button>
        </form>

        {/* Texte additionnel */}
        <Typography
          variant="body2"
          style={{ marginTop: "16px", color: "#555" }}
        >
          Vous avez déjà un compte ?{" "}
          <Link to={"/"}>
            <span style={{ color: "#1976d2", cursor: "pointer" }}>
              Connectez-vous
            </span>
          </Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Signup;
