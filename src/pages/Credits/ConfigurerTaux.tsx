/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../lib/helpers/superbaseClient";

interface ConfigurerTauxProps {
  open: boolean;
  onClose: () => void;
  exchangeRate: number; // Taux d'intérêt actuel
  setExchangeRate: (rate: number) => void; // Fonction pour mettre à jour le taux
  setIsChangedData: any;
}

const ConfigurerTaux: React.FC<ConfigurerTauxProps> = ({
  open,
  onClose,
  exchangeRate,
}) => {
  const [rate, setRate] = useState<number>(exchangeRate);
  const [isLoading, setIsLoading] = useState(false);

  const handleRateChange = (value: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setRate(numericValue); // Mettre à jour le taux
    } else {
      setRate(0); // Réinitialiser si la valeur n'est pas valide
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await supabase.from("config").update({ interest_rate: rate }).eq("id", 1);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configurer le Taux d'Intérêt</DialogTitle>
      <DialogContent>
        <Typography variant="body1" marginBottom={2}>
          Définissez le taux d'intérêt appliqué aux prêts. Ce taux sera utilisé
          pour calculer le montant total à rembourser.
        </Typography>
        <Typography variant="body1" marginBottom={2}>
          Taux actuel : <strong>{exchangeRate}%</strong>
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
          {!isLoading ? (
            <span>Enregistrer</span>
          ) : (
            <CircularProgress size={20} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurerTaux;
