import React, { useState, useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";

interface RepaymentFormProps {
  onRepayment: (amount: number) => void;
  onClose: () => void;
  remainingAmount: number; // Ajouter cette prop pour le montant restant
}

const RepaymentForm: React.FC<RepaymentFormProps> = ({
  onRepayment,
  onClose,
  remainingAmount,
}) => {
  const [repaymentAmount, setRepaymentAmount] = useState<number | null>(null);
  const [balanceAfterRepayment, setBalanceAfterRepayment] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (repaymentAmount !== null) {
      setBalanceAfterRepayment(remainingAmount - repaymentAmount);
    } else {
      setBalanceAfterRepayment(null);
    }
  }, [repaymentAmount, remainingAmount]);

  const handleSubmit = () => {
    if (repaymentAmount !== null) {
      onRepayment(repaymentAmount);
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
        disabled={balanceAfterRepayment != null && balanceAfterRepayment < 0}
        variant="contained"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Confirmer
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
