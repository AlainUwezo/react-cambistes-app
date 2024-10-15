import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
} from "@mui/material";

interface FundingDialogProps {
  open: boolean;
  onClose: () => void;
  currentBalance: number; // Propriété pour la balance actuelle
}

const FundingDialog: React.FC<FundingDialogProps> = ({
  open,
  onClose,
  currentBalance,
}) => {
  const [amount, setAmount] = useState(0);

  const handleFunding = () => {
    console.log(`Approvisionnement de: FC ${amount}`);
    // Logique pour traiter l'approvisionnement
    setAmount(0); // Réinitialiser le montant après traitement
    onClose(); // Fermer le dialogue
  };

  // Calculer le montant total attendu après approvisionnement
  const expectedTotal = currentBalance + amount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Approvisionnement
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Entrez le montant à approvisionner :
        </Typography>
        <TextField
          label="Montant"
          variant="outlined"
          size="small"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          fullWidth
        />
        {/* Afficher le montant total attendu */}
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Montant attendu après approvisionnement : FC {expectedTotal}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFunding} color="primary" variant="contained">
          Approvisionner
        </Button>
        <Button onClick={onClose} color="secondary">
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FundingDialog;
