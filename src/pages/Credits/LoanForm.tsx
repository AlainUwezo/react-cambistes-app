import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Typography,
} from "@mui/material";

interface LoanFormProps {
  open: boolean;
  onClose: () => void;
  exchangeRate: number; // Taux d'intérêt fixe
}

const LoanForm: React.FC<LoanFormProps> = ({ open, onClose, exchangeRate }) => {
  const [borrower, setBorrower] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | "">(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);

  // Liste d'exemple pour l'autocomplétion
  const borrowers = [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
    { name: "David" },
  ];

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value);
    setAmount(numericValue);

    if (!isNaN(numericValue)) {
      // Calculer le montant total à rembourser
      const total = numericValue + (numericValue * exchangeRate) / 100;
      setTotalRepayment(total);
    } else {
      setTotalRepayment(0);
    }
  };

  const handleSubmit = () => {
    // Logique pour soumettre le formulaire (API ou autre)
    console.log("Détails du prêt :", {
      borrower,
      amount,
      totalRepayment,
    });
    onClose(); // Fermer le dialogue après soumission
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Formulaire de Prêt</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={borrowers}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) =>
            setBorrower(newValue ? newValue.name : null)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nom de l'emprunteur"
              variant="outlined"
              required
            />
          )}
        />
        <TextField
          label="Montant"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          required
        />
        <Typography variant="body1" marginTop={2}>
          Taux d'intérêt : {exchangeRate}%
        </Typography>
        <Typography variant="subtitle2" marginTop={2}>
          Montant total à rembourser :{" "}
          <strong>{totalRepayment.toFixed(2)} FC</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!borrower || +amount <= 0}
        >
          Soumettre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanForm;
