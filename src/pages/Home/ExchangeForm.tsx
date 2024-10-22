import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  DialogActions,
  Button,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"; // Importez Snackbar et Alert
import { supabase } from "../../lib/helpers/superbaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface Client {
  id: number;
  user_name: string;
}

interface ExchangeFormProps {
  open: boolean;
  onClose: () => void;
  setIsChangedData: any;
}

const ExchangeForm: React.FC<ExchangeFormProps> = ({
  open,
  onClose,
  setIsChangedData,
}) => {
  const [amount, setAmount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | undefined>(
    undefined
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const { setBalanceChanged } = useAuth();

  // État pour le Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // Récupère le taux de change au chargement du composant
  useEffect(() => {
    getExchangeRate();
    getClients();
  }, []);

  // Fonction pour récupérer le taux de change depuis la table 'config'
  const getExchangeRate = async () => {
    const { data, error } = await supabase.from("config").select("*").single();
    if (error) {
      console.error(
        "Erreur lors de la récupération du taux de change :",
        error
      );
    } else {
      setExchangeRate(data.change_rate);
    }
  };

  // Fonction pour récupérer les clients depuis la table 'Account'
  const getClients = async () => {
    const { data, error } = await supabase
      .from("Account")
      .select("id, user_name")
      .eq("role", "ROLE_CLIENT");
    if (error) {
      console.error("Erreur lors de la récupération des clients :", error);
    } else {
      setClients(data);
    }
  };

  // Fonction pour ajouter une transaction
  const handleConvert = async () => {
    if (!selectedClient || !exchangeRate || amount <= 0) return;

    // Afficher le loader pendant l'insertion
    setLoading(true);

    const convertedAmount = amount * exchangeRate;

    // Récupérer la balance actuelle du client
    const { data: balanceData, error: balanceError } = await supabase
      .from("Balance")
      .select("balance_cdf, balance_usd")
      .eq("id", 1)
      .single();

    if (balanceError) {
      console.error(
        "Erreur lors de la récupération de la balance :",
        balanceError
      );
      setLoading(false);
      return;
    }

    if (balanceData) {
      // Vérifier si la balance_cdf est suffisante
      if (balanceData.balance_cdf < convertedAmount) {
        setSnackbarMessage("Fonds insuffisants pour l'échange.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      // Procéder à l'ajout de la transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from("Transaction")
        .insert({
          account_id: selectedClient.id,
          amount: amount,
          amount_changed: convertedAmount,
        });

      if (transactionError) {
        console.error(
          "Erreur lors de l'ajout de la transaction :",
          transactionError
        );
        setLoading(false);
        return;
      }

      // Calculer le bonus de fidélité (1% du montant de la transaction)
      const loyaltyBonus = convertedAmount * 0.01;

      // Vérifier si l'utilisateur a déjà un bonus de fidélité
      const { data: fidelityData, error: fidelityError } = await supabase
        .from("Fidelite")
        .select("*")
        .eq("account_id", selectedClient.id)
        .single();

      if (fidelityError) {
        console.error(
          "Erreur lors de la vérification du bonus de fidélité :",
          fidelityError
        );
      } else if (fidelityData) {
        // Si le client existe déjà, mettre à jour le montant de fidélité
        const newAmount = fidelityData.amount + loyaltyBonus;
        const { error: updateError } = await supabase
          .from("Fidelite")
          .update({ amount: newAmount })
          .eq("account_id", selectedClient.id);

        if (updateError) {
          console.error(
            "Erreur lors de la mise à jour du bonus de fidélité :",
            updateError
          );
        }
      } else {
        // Sinon, insérer un nouveau bonus de fidélité
        const { error: insertError } = await supabase.from("Fidelite").insert({
          account_id: selectedClient.id,
          amount: loyaltyBonus,
        });
        if (insertError) {
          console.error(
            "Erreur lors de l'ajout du bonus de fidélité :",
            insertError
          );
        }
      }

      // Mettre à jour les balances en CDF et USD
      const newBalanceCdf = balanceData.balance_cdf - convertedAmount;
      const newBalanceUsd = balanceData.balance_usd + amount;

      const { error: updateBalanceError } = await supabase
        .from("Balance")
        .update({
          balance_cdf: newBalanceCdf,
          balance_usd: newBalanceUsd,
        })
        .eq("id", 1);

      if (updateBalanceError) {
        console.error(
          "Erreur lors de la mise à jour de la balance :",
          updateBalanceError
        );
        setLoading(false);
        return;
      }

      setSnackbarMessage(
        "Transaction ajoutée et balances mises à jour avec succès."
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setIsChangedData((prev) => !prev);
      // Fermer le dialogue après conversion
      onClose();
      // Réinitialiser les champs
      setAmount(0);
      setSelectedClient(null);
    }

    setLoading(false);
  };

  // Gérer la fermeture du Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
          Formulaire de Change
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f9f9f9" }}>
          {/* Champ Autocomplete pour sélectionner le client */}
          <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.user_name}
            onChange={(event, newValue) => setSelectedClient(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sélectionner un client"
                variant="outlined"
                size="small"
                sx={{
                  marginBottom: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: "#ccc",
                    "&:hover fieldset": {
                      borderColor: "#3f51b5",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3f51b5",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "8px 12px",
                    fontSize: "16px",
                  },
                }}
              />
            )}
          />
          <TextField
            label="Montant"
            variant="outlined"
            size="small"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                borderColor: "#ccc",
                "&:hover fieldset": {
                  borderColor: "#3f51b5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3f51b5",
                },
              },
              "& .MuiInputBase-input": {
                padding: "8px 12px",
                fontSize: "16px",
              },
            }}
          />
          <Typography variant="body1" className="mt-2">
            Taux de change :{" "}
            <span style={{ color: "#3f51b5", fontWeight: "bold" }}>
              {exchangeRate}
            </span>
          </Typography>
          <Typography
            variant="body1"
            className="mt-2"
            sx={{ fontWeight: "600" }}
          >
            Montant Converti :{" "}
            <span style={{ color: "#3f51b5", fontWeight: "bold" }}>
              {amount * (exchangeRate || 0)}
            </span>
          </Typography>
          {loading && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button onClick={handleConvert} color="primary">
            Échanger
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar pour afficher les messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExchangeForm;
