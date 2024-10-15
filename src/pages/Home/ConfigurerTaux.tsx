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
} from "@mui/material";

interface ConfigurerTauxProps {
  open: boolean;
  onClose: () => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
}

const ConfigurerTaux: React.FC<ConfigurerTauxProps> = ({
  open,
  onClose,
  exchangeRate,
  setExchangeRate,
}) => {
  const [newRate, setNewRate] = useState(exchangeRate);

  const handleSave = () => {
    setExchangeRate(newRate); // Mettre à jour le taux de change
    onClose(); // Fermer le dialogue
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Configurer Taux de Change
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "#f9f9f9" }}>
        <Typography variant="subtitle2" className="mb-4">
          Taux de change actuel :{" "}
          <span style={{ color: "#3f51b5", fontWeight: "600" }}>
            {exchangeRate}
          </span>
        </Typography>
        <TextField
          label="Nouveau taux de change"
          variant="outlined"
          size="small"
          type="number"
          value={newRate}
          onChange={(e) => setNewRate(Number(e.target.value))}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" variant="contained">
          Enregistrer
        </Button>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurerTaux;
