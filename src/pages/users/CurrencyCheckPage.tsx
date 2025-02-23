import { useState, useEffect } from "react";
import { TextField, Typography, Button, Box, Alert } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import UserPageContainer from "../../layouts/UserPageContainer";
import { supabase } from "../../lib/helpers/superbaseClient";

const CurrencyCheckPage = () => {
  const [usdAmount, setUsdAmount] = useState("");
  const [cdfAmount, setCdfAmount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableCdf, setAvailableCdf] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalanceAndRate = async () => {
      // Récupérer le solde CDF
      const { data: balanceData, error: balanceError } = await supabase
        .from("Balance")
        .select("balance_cdf")
        .single();

      // Récupérer le taux de change
      const { data: configData, error: configError } = await supabase
        .from("config")
        .select("change_rate")
        .single();

      if (balanceError || configError) {
        console.error(
          "Erreur lors de la récupération des données :",
          balanceError || configError
        );
      } else {
        setAvailableCdf(balanceData.balance_cdf);
        setExchangeRate(configData.change_rate);
      }
    };

    fetchBalanceAndRate();
  }, []);

  const handleConvert = () => {
    if (exchangeRate === null) return; // Assurez-vous que le taux de change est chargé

    const usd = parseFloat(usdAmount);
    const cdf = usd * exchangeRate;

    // Vérifier si le montant dépasse ce qui est disponible
    if (availableCdf !== null && cdf > availableCdf) {
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
          px: { xs: 2, sm: 3 },
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
            fontSize: { xs: "0.9rem", sm: "1rem" },
            color: "gray",
            lineHeight: "1.5",
          }}
        >
          Utilisez cette section pour convertir un montant en dollars américains
          (USD) en Francs Congolais (CDF) en fonction du taux de change actuel.
          Si le montant en francs demandé dépasse le montant disponible, nous
          vous indiquerons ce qui est encore disponible.
        </Typography>
        <Typography className="mb-4">
          Taux de change: <strong>{exchangeRate}</strong>
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
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 1 || e.target.value === "") {
                setUsdAmount(e.target.value);
                setErrorMessage("");
              } else {
                setErrorMessage("Le montant doit être supérieur ou égal à 1");
              }
            }}
            sx={{
              mb: 2,
              width: "100%",
              maxWidth: "400px",
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
              width: "80%",
              maxWidth: "300px",
              fontSize: "1.1rem",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AttachMoneyIcon sx={{ mr: 1 }} />
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
