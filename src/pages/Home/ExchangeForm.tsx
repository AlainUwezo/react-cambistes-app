/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  DialogActions,
  Button,
  Autocomplete,
} from "@mui/material";

interface Client {
  id: number;
  name: string;
}

interface ExchangeFormProps {
  open: boolean;
  onClose: () => void;
}

const ExchangeForm: React.FC<ExchangeFormProps> = ({ open, onClose }) => {
  const [amount, setAmount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const exchangeRate = 2800; // Exemple de taux de change

  // Liste d'exemple de clients
  const clients: Client[] = [
    { id: 1, name: "Client 1" },
    { id: 2, name: "Client 2" },
    { id: 3, name: "Client 3" },
    { id: 4, name: "Client 4" },
  ];

  const handleConvert = () => {
    console.log({
      client: selectedClient,
      amount,
      convertedAmount: amount * exchangeRate,
      exchangeRate,
    });
    onClose(); // Fermer le dialogue après conversion
    setAmount(0); // Réinitialiser le montant
    setSelectedClient(null); // Réinitialiser le client sélectionné
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Formulaire de Change
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#f9f9f9" }}>
        {/* Champ Autocomplete pour sélectionner le client */}
        <Autocomplete
          options={clients}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            setSelectedClient(newValue);
          }}
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
        <Typography variant="body1" className="mt-2" sx={{ fontWeight: "600" }}>
          Montant Converti :{" "}
          <span style={{ color: "#3f51b5" }}>
            {(amount * exchangeRate).toFixed(2)} FC
          </span>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConvert} color="primary" variant="contained">
          Convertir
        </Button>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExchangeForm;
