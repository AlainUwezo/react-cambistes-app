import { useState } from "react";
import { TextField, Typography, Button, Box, Alert } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Importer l'icône
import UserPageContainer from "../../layouts/UserPageContainer";

const CurrencyCheckPage = () => {
  const [usdAmount, setUsdAmount] = useState("");
  const [cdfAmount, setCdfAmount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const availableCdf = 1000000; // Montant disponible en CDF
  const exchangeRate = 2800; // Taux de conversion fixe

  const handleConvert = () => {
    const usd = parseFloat(usdAmount);
    const cdf = usd * exchangeRate;

    // Vérifier si le montant dépasse ce qui est disponible
    if (cdf > availableCdf) {
      const remainingUsd = availableCdf / exchangeRate;
      setErrorMessage(
        `Le montant demandé dépasse le montant disponible. Il reste ${availableCdf} CDF (${remainingUsd.toFixed(
          2
        )} USD) disponibles.`
      );
      setCdfAmount(null);
    } else {
      setCdfAmount(cdf);
      setErrorMessage(null);
    }
  };

  return (
    <UserPageContainer>
      <Box
        sx={{
          mt: 4,
          textAlign: "center",
          maxWidth: "600px",
          mx: "auto",
          px: { xs: 2, sm: 3 }, // Ajout de marges horizontales pour mobile
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Vérifier la disponibilité de la monnaie
        </Typography>

        {/* Ajout d'une description */}
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontSize: { xs: "0.9rem", sm: "1rem" }, // Ajustement de la taille du texte
            color: "gray",
            lineHeight: "1.5",
          }}
        >
          Utilisez cette section pour convertir un montant en dollars américains
          (USD) en Francs Congolais (CDF) en fonction du taux de change actuel.
          Si le montant en francs demandé dépasse le montant disponible, nous
          vous indiquerons ce qui est encore disponible.
        </Typography>

        {/* Input pour le montant en USD */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            label="Montant en USD"
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            sx={{
              mb: 2,
              width: "100%", // Utilisation de 100% pour les petits écrans
              maxWidth: "400px", // Limite la largeur sur les écrans plus grands
              "& input": { fontSize: "1.2rem", padding: "12px" },
              "& label": { fontSize: "1.2rem" },
            }}
            fullWidth
            error={!!errorMessage}
          />

          {/* Bouton de conversion avec icône */}
          <Button
            variant="contained"
            onClick={handleConvert}
            className="capitalize"
            sx={{
              width: "80%", // Utilisation de 80% pour les petits écrans
              maxWidth: "300px", // Limite la largeur sur les écrans plus grands
              fontSize: "1.1rem",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
              display: "flex",
              alignItems: "center", // Aligner l'icône et le texte
              justifyContent: "center", // Centrer le contenu
            }}
          >
            <AttachMoneyIcon sx={{ mr: 1 }} />{" "}
            {/* Ajout de l'icône avec un espacement */}
            Convertir (CDF)
          </Button>
        </Box>

        {/* Message d'erreur si le montant dépasse ce qui est disponible */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, fontSize: "1rem" }}>
            {errorMessage}
          </Alert>
        )}

        {/* Affichage du montant converti si valide */}
        {cdfAmount !== null && (
          <Typography
            variant="h6"
            color="primary"
            sx={{
              mt: 2,
              fontSize: { xs: "1.1rem", sm: "1.2rem" },
              fontWeight: "bold",
            }}
          >
            {usdAmount} USD = {cdfAmount} CDF
          </Typography>
        )}
      </Box>
    </UserPageContainer>
  );
};

export default CurrencyCheckPage;
