import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface ConfigurerTauxProps {
  open: boolean;
  onClose: () => void;
  exchangeRate: number; // Taux d'intérêt actuel
  setExchangeRate: (rate: number) => void; // Fonction pour mettre à jour le taux
}

const ConfigurerTaux: React.FC<ConfigurerTauxProps> = ({
  open,
  onClose,
  exchangeRate,
  setExchangeRate,
}) => {
  const [rate, setRate] = useState<number>(exchangeRate); // État pour le taux

  const handleRateChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setRate(numericValue); // Mettre à jour le taux
    } else {
      setRate(0); // Réinitialiser si la valeur n'est pas valide
    }
  };

  const handleSubmit = () => {
    setExchangeRate(rate); // Mettre à jour le taux d'intérêt dans le parent
    onClose(); // Fermer le dialogue après soumission
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configurer le Taux d'Intérêt</DialogTitle>
      <DialogContent>
        <Typography variant="body1" marginBottom={2}>
          Définissez le taux d'intérêt appliqué aux prêts. Ce taux sera utilisé
          pour calculer le montant total à rembourser.
        </Typography>
        <TextField
          label="Taux d'intérêt (%)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={rate}
          onChange={(e) => handleRateChange(e.target.value)}
          required
          inputProps={{ min: 0 }} // Valeur minimale
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={rate < 0}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurerTaux;
