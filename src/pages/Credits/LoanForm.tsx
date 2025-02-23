/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
import { supabase } from "../../lib/helpers/superbaseClient";
import { useAuth } from "../../contexts/AuthContext";

interface LoanFormProps {
  open: boolean;
  onClose: () => void;
  exchangeRate: number;
  setIsChangedData: any;
}

const LoanForm: React.FC<LoanFormProps> = ({
  open,
  onClose,
  exchangeRate,
  setIsChangedData,
}) => {
  const [borrower, setBorrower] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | "">(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  const [borrowers, setBorrowers] = useState<{ name: string; id: string }[]>(
    []
  );
  const [balance, setBalance] = useState<number>(0); // Stocker la balance disponible
  const [loading, setLoading] = useState(false);
  const { setBalanceChanged } = useAuth();

  // Fetch les emprunteurs valides et la balance au chargement
  useEffect(() => {
    const fetchBorrowersAndBalance = async () => {
      // Récupérer les account_id avec statut VALIDE
      const { data: validRequests, error: requestError } = await supabase
        .from("DemandeCredit")
        .select("account_id")
        .eq("statut", "VALIDE");

      if (requestError) {
        console.error(
          "Erreur lors de la récupération des demandes valides :",
          requestError
        );
        return;
      }

      const accountIds = validRequests.map((request) => request.account_id);

      // Récupérer les comptes associés à ces account_ids
      const { data: accounts, error: accountError } = await supabase
        .from("Account")
        .select("id, user_name")
        .eq("role", "ROLE_CLIENT")
        .in("id", accountIds);

      if (accountError) {
        console.error(
          "Erreur lors de la récupération des emprunteurs :",
          accountError
        );
      } else if (accounts) {
        setBorrowers(
          accounts.map((account) => ({
            name: account.user_name,
            id: account.id,
          }))
        );
      }

      // Récupérer la balance actuelle
      const { data: balanceData, error: balanceError } = await supabase
        .from("Balance")
        .select("balance_cdf")
        .single(); // On suppose qu'il y a une seule balance

      if (balanceError) {
        console.error(
          "Erreur lors de la récupération de la balance :",
          balanceError
        );
      } else if (balanceData) {
        setBalance(balanceData.balance_cdf);
      }
    };

    if (open) {
      fetchBorrowersAndBalance();
    }
  }, [open]);

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value);
    setAmount(numericValue);

    if (!isNaN(numericValue)) {
      const total = numericValue + (numericValue * exchangeRate) / 100;
      setTotalRepayment(total);
    } else {
      setTotalRepayment(0);
    }
  };

  const handleSubmit = async () => {
    if (amount > balance) {
      alert("Le montant du crédit dépasse la balance disponible.");
      return;
    }

    setLoading(true);

    const { error: creditError } = await supabase.from("Credit").insert([
      {
        amount,
        reste: totalRepayment,
        interest: totalRepayment - +amount,
        total: totalRepayment,
        account_id: borrower,
      },
    ]);

    if (creditError) {
      console.error("Erreur lors de l'ajout du crédit :", creditError);
    } else {
      console.log("Crédit ajouté avec succès :", {
        borrower,
        amount,
        totalRepayment,
      });

      // Mise à jour de la balance
      const { error: balanceError } = await supabase
        .from("Balance")
        .update({ balance_cdf: balance - +amount })
        .eq("id", 1);

      setBalanceChanged((prev) => !prev);

      if (balanceError) {
        console.error(
          "Erreur lors de la mise à jour de la balance :",
          balanceError
        );
      } else {
        console.log("Balance mise à jour avec succès");
      }
    }

    setLoading(false);
    setBorrower(null);
    setIsChangedData((prev) => !prev);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setBorrower(null);
        onClose();
      }}
    >
      <DialogTitle>Formulaire de Prêt</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={borrowers}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) =>
            setBorrower(newValue ? newValue.id : null)
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
        <Typography variant="body2" color="error" marginTop={2}>
          Balance disponible : {balance.toFixed(2)} FC
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setBorrower(null);
            onClose();
          }}
          color="secondary"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={!borrower || +amount <= 0 || loading || +amount > balance}
        >
          {loading ? "Ajout en cours..." : "Soumettre"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanForm;
