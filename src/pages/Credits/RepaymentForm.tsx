/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../../lib/helpers/superbaseClient"; // Assurez-vous d'importer Supabase

interface RepaymentFormProps {
  onRepayment: (amount: number) => void;
  onClose: () => void;
  remainingAmount: number; // Ajouter cette prop pour le montant restant
  creditId: number; // Ajoutez cette prop pour l'ID du crédit
}

const RepaymentForm: React.FC<RepaymentFormProps> = ({
  onRepayment,
  onClose,
  creditId,
}) => {
  const [repaymentAmount, setRepaymentAmount] = useState<number | null>(null);
  const [balanceAfterRepayment, setBalanceAfterRepayment] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [credit, setCredit] = useState<any>();

  useEffect(() => {
    getCredit();
  }, []);

  useEffect(() => {
    if (credit) {
      if (repaymentAmount !== null) {
        setBalanceAfterRepayment(credit.reste - repaymentAmount);
      } else {
        setBalanceAfterRepayment(null);
      }
    } else {
      setBalanceAfterRepayment(null);
    }
  }, [repaymentAmount, credit]);

  const getCredit = async () => {
    const { data } = await supabase
      .from("Credit")
      .select("*")
      .eq("id", creditId);
    if (data) setCredit(data[0]);
  };
  const handleSubmit = async () => {
    if (repaymentAmount !== null) {
      setLoading(true); // Active le loader
      // Mettre à jour la table Credit avec le nouveau montant restant
      const { data, error } = await supabase
        .from("Credit")
        .update({ reste: credit.reste - repaymentAmount })
        .eq("id", creditId);

      if (error) {
        console.error("Erreur lors du remboursement:", error);
      } else {
        console.log("Remboursement enregistré:", data);
        onRepayment(repaymentAmount); // Appel de la fonction de remboursement
      }
      setLoading(false); // Désactive le loader après le traitement
    }
  };

  return (
    <div className="flex flex-col items-center">
      <TextField
        type="number"
        label="Montant à rembourser"
        value={repaymentAmount || ""}
        onChange={(e) => setRepaymentAmount(Number(e.target.value))}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
        Montant restant après remboursement :{" "}
        {balanceAfterRepayment && balanceAfterRepayment.toFixed(2)} $
      </Typography>
      <Button
        onClick={handleSubmit}
        color="primary"
        disabled={
          (balanceAfterRepayment != null && balanceAfterRepayment < 0) ||
          loading
        }
        variant="contained"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Confirmer"}
      </Button>
      <Button
        onClick={onClose}
        color="secondary"
        variant="outlined"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Annuler
      </Button>
    </div>
  );
};

export default RepaymentForm;
