/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
  CircularProgress, // Importer CircularProgress
} from "@mui/material";
import { supabase } from "../lib/helpers/superbaseClient";

interface FundingDialogProps {
  open: boolean;
  onClose: () => void;
  currentBalance: number;
}

const FundingDialog: React.FC<FundingDialogProps> = ({
  open,
  onClose,
  currentBalance,
}) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFunding = async () => {
    setLoading(true); // Démarrer le loader
    try {
      const { error: approError } = await supabase
        .from("Approvisionnement")
        .insert([{ montant_cdf: amount }]);

      if (approError) throw approError;

      // Récupérer la balance actuelle avant la mise à jour pour l'historique
      const { data: balanceData, error: balanceError } = await supabase
        .from("Balance")
        .select("*")
        .single();

      if (balanceError) throw balanceError;

      const oldBalanceCdf = balanceData.balance_cdf;
      const newBalanceCdf = oldBalanceCdf + amount;
      // Mettre à jour la table Balance avec la nouvelle balance
      const { error: updateBalanceError } = await supabase
        .from("Balance")
        .update({ balance_cdf: newBalanceCdf })
        .eq("id", balanceData.id);

      if (updateBalanceError) throw updateBalanceError;

      // Enregistrer l'ancien et le nouveau solde dans Balance_History
      const { error: balanceHistoryError } = await supabase
        .from("BalanceHistory")
        .insert([
          {
            balance_cdf: newBalanceCdf,
            balance_usd: balanceData.balance_usd,
            amount: amount,
            description: `Approvisionnement de FC ${amount}`,
          },
        ]);

      if (balanceHistoryError) throw balanceHistoryError;

      console.log("Historique de balance enregistré avec succès");

      // Réinitialiser le montant après traitement
      setAmount(0);
      onClose(); // Fermer le dialogue
    } catch (error: any) {
      console.error("Erreur lors de l'approvisionnement:", error);
    } finally {
      setLoading(false); // Arrêter le loader, qu'il y ait une erreur ou non
    }
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
        <Button
          onClick={handleFunding}
          color="primary"
          variant="contained"
          disabled={loading} // Désactiver le bouton pendant le chargement
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Approvisionner"
          )}
        </Button>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Annuler
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FundingDialog;
