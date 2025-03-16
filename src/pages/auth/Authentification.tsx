/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AccountCircle, Lock } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, userInfo, fetchUserInfo } = useAuth(); // Ajout explicite

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Authentification utilisateur
      await signIn(email, password);

      // Attendre la récupération des informations utilisateur
      const userInfoFetched = await fetchUserInfo(email); // Utilisation d'async/await
      console.log("Informations utilisateur récupérées :", userInfoFetched);

      if (userInfoFetched) {
        // console.log("Informations utilisateur récupérées :", userInfoFetched);
        // Navigation en fonction du rôle utilisateur
        if (userInfoFetched.role === "ROLE_CLIENT") {
          navigate("/currency-check");
        } else {
          navigate("/home");
        }
      } else {
        setError("Erreur lors de la récupération des informations utilisateur");
      }
    } catch (err: any) {
      console.error("Erreur lors de la connexion :", err.message);
      setError("Adresse e-mail ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#1565c0", fontWeight: 700 }}
        >
          Bienvenue !
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 3, color: "#757575" }}>
          Connectez-vous pour accéder à votre espace utilisateur
        </Typography>

        <form onSubmit={handleLogin}>
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

          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: 2, fontSize: "0.875rem" }}
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              padding: "12px",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#125ca1" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        <Typography variant="body2" sx={{ marginTop: 2, color: "#757575" }}>
          Vous n'avez pas de compte ?{" "}
          <Link to={"/signup"} style={{ textDecoration: "none" }}>
            <span
              style={{
                color: "#1976d2",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Inscrivez-vous
            </span>
          </Link>
        </Typography>
      </Box>
    </div>
  );
};

export default Authentication;
