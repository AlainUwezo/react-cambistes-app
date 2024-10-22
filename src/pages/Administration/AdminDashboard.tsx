import { Grid, Box } from "@mui/material";
import DashboardKPI from "./DashboardKPI";
import BalanceHistoryChart from "./BalanceHistoryChart";
import TransactionChart from "./TransactionChart";
import DemandeCreditChart from "./DemandeCreditChart";

const AdminDashboard = () => {
  return (
    <Box>
      <Grid container spacing={0} className="mb-5">
        <DashboardKPI />
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BalanceHistoryChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionChart />
        </Grid>
        <Grid item xs={12}>
          <DemandeCreditChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
