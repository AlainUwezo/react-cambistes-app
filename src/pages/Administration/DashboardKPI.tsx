import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { supabase } from "../../lib/helpers/superbaseClient";

const DashboardKPI = () => {
  const [balanceCdf, setBalanceCdf] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalFidelityBonus, setTotalFidelityBonus] = useState<number | null>(
    null
  );
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecastDate, setForecastDate] = useState<string>("");
  const [forecastAmount, setForecastAmount] = useState<number | null>(null);
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]); // Historique des balances

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const { data: balanceActuelle, error: errorBalance } = await supabase
          .from("Balance")
          .select("*")
          .single();

        if (errorBalance) throw errorBalance;

        if (balanceActuelle) {
          setBalanceCdf(balanceActuelle.balance_cdf);
          setTotalAmount(balanceActuelle.balance_usd);
        }

        // Fetch balance actuelle
        const { data: balanceData, error: balanceError } = await supabase
          .from("BalanceHistory")
          .select("balance_cdf, created_at")
          .order("created_at", { ascending: false }); // Assurez-vous d'obtenir l'historique

        if (balanceError) throw new Error("Error fetching balance");

        if (balanceData && balanceData.length > 0) {
          setBalanceHistory(balanceData); // Stocke l'historique des balances
        }

        // Fetch total fidelity bonus
        const { data: fidelityData, error: fidelityError } = await supabase
          .from("Fidelite")
          .select("amount");

        if (fidelityError) throw new Error("Error fetching fidelity bonus");

        if (fidelityData) {
          const totalFidelityValue = fidelityData.reduce(
            (acc, row) => acc + row.amount,
            0
          );
          setTotalFidelityBonus(totalFidelityValue);
        }

        // Fetch taux de change et taux d'intérêt à partir de la table config
        const { data: configData, error: configError } = await supabase
          .from("config")
          .select("change_rate, interest_rate")
          .single();

        if (configError) throw new Error("Error fetching configuration");

        if (configData) {
          setExchangeRate(configData.change_rate);
          setInterestRate(configData.interest_rate);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  const calculateForecast = () => {
    if (balanceHistory.length === 0 || forecastDate === "") return;

    // Convertir la date prévisionnelle en objet Date
    const futureDate = new Date(forecastDate);
    const today = new Date();

    // Calculer le nombre de mois entre la date actuelle et la date future
    const monthsDiff =
      (futureDate.getFullYear() - today.getFullYear()) * 12 +
      (futureDate.getMonth() - today.getMonth());

    // Calculer la tendance en utilisant l'historique des balances
    const latestBalance = balanceHistory[0].balance_cdf;
    const oldestBalance = balanceHistory[balanceHistory.length - 1].balance_cdf;

    // Taux de changement (croissance/décroissance)
    const changeRate = (latestBalance - oldestBalance) / balanceHistory.length; // Changement moyen par mois

    // Calculer la prévision
    const predictedBalance = latestBalance + changeRate * monthsDiff;
    setForecastAmount(predictedBalance);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {/* Balance CDF */}
      <Grid item xs={12} md={3}>
        <Card className="p-3">
          <Typography variant="caption">Balance Actuelle (CDF)</Typography>
          <Typography variant="h6" className="font-semibold text-blue-500">
            {balanceCdf}
          </Typography>
        </Card>
      </Grid>

      {/* Total Amount (USD) */}
      <Grid item xs={12} md={3}>
        <Card className="p-3">
          <Typography variant="caption">
            Total Montant Transactions (USD)
          </Typography>
          <Typography variant="h6">{totalAmount}</Typography>
        </Card>
      </Grid>

      {/* Total Fidelity Bonus */}
      <Grid item xs={12} md={3}>
        <Card className="p-3">
          <Typography variant="caption">Total Bonus Fidélité</Typography>
          <Typography variant="h6">{totalFidelityBonus}</Typography>
        </Card>
      </Grid>

      {/* Exchange Rate */}
      <Grid item xs={12} md={3}>
        <Card className="p-3">
          <Typography variant="caption">Taux de Change</Typography>
          <Typography variant="h6">{exchangeRate}</Typography>
        </Card>
      </Grid>

      {/* Interest Rate */}
      <Grid item xs={12} md={3}>
        <Card className="p-3">
          <Typography variant="caption">Taux d'Intérêt</Typography>
          <Typography variant="h6">{interestRate}%</Typography>
        </Card>
      </Grid>

      {/* Budget Forecast */}
      <Grid item xs={12} md={6}>
        <Card className="p-3">
          <Typography variant="subn===" className="mb-3">
            Prévision du Budget
          </Typography>
          <TextField
            label="Date Prévisionnelle"
            type="date"
            className="mt-3"
            value={forecastDate}
            onChange={(e) => setForecastDate(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="success"
            className="my-3"
            onClick={calculateForecast}
          >
            Calculer
          </Button>
          {forecastAmount !== null && (
            <Typography variant="h6" className="mt-2">
              Prévision de la Balance à {forecastDate}: {forecastAmount}
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardKPI;
