import { useEffect, useState } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Settings as SettingsIcon, Add as AddIcon } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LoanForm from "./LoanForm"; // Importation de LoanForm
import ConfigurerTaux from "./ConfigurerTaux"; // Importation de ConfigurerTaux
import { DataGrid } from "@mui/x-data-grid";
import RepaymentDialog from "./RepaymentDialog"; // Importation du nouveau composant
import { supabase } from "../../lib/helpers/superbaseClient";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LoanRequestTab from "./LoanRequestTab";
import { useAuth } from "../../contexts/AuthContext";

const CreditManager = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfigurerTaux, setOpenConfigurerTaux] = useState(false);
  const [openRepaymentDialog, setOpenRepaymentDialog] = useState(false);
  const [credits, setCredits] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]); // État pour stocker les comptes
  const [exchangeRate, setExchangeRate] = useState<number>();
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChangedData, setIsChangedData] = useState(false);
  const { userInfo } = useAuth();

  const { setBalanceChanged } = useAuth();

  useEffect(() => {
    getExchangeRate();
    fetchAccounts(); // Récupérer les comptes au chargement
    fetchCredits();
  }, [openRepaymentDialog, isChangedData]);

  const getExchangeRate = async () => {
    const { data } = await supabase.from("config").select("*").single();
    setExchangeRate(data.interest_rate);
  };

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("Account").select("*");
    if (error) {
      console.error("Erreur lors de la récupération des comptes :", error);
    } else {
      setAccounts(data);
    }
  };

  const fetchCredits = async () => {
    setLoading(true); // Début du chargement
    const { data, error } = await supabase.from("Credit").select("*");

    if (error) {
      console.error("Erreur lors de la récupération des crédits :", error);
    } else {
      // Associer les noms des utilisateurs aux crédits en utilisant account_id
      const creditsWithNames = data.map((credit) => {
        const account = accounts.find((acc) => acc.id === credit.account_id); // Liaison par account_id
        return {
          ...credit,
          userName: account ? account.user_name : "Inconnu", // Utilisez "Inconnu" si aucun compte n'est trouvé
        };
      });
      setCredits(creditsWithNames);
    }
    setLoading(false); // Fin du chargement
  };

  const handleTabChange = (_event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenRepaymentDialog = (credit: any) => {
    setSelectedCredit(credit);
    setOpenRepaymentDialog(true);
  };

  const handleRepayment = async (amount: number) => {
    console.log("SELECTED CREDIT ", selectedCredit);

    if (selectedCredit) {
      const { data: balanceData, error: balanceError } = await supabase
        .from("Balance")
        .select("*")
        .single();

      const { data: configData, error: configError } = await supabase
        .from("config")
        .select("change_rate, interest_rate")
        .single();

      if (configError) throw new Error("Error fetching configuration");

      const oldBalanceUsd = balanceData.balance_usd;
      const newBalanceUsd = oldBalanceUsd + amount;

      // Mettre à jour la table Balance avec la nouvelle balance
      const { error: updateBalanceError } = await supabase
        .from("Balance")
        .update({ balance_usd: newBalanceUsd })
        .eq("id", balanceData.id);

      console.log("usd bal", balanceData.id);

      if (updateBalanceError) console.error(updateBalanceError);

      setBalanceChanged((prev: any) => !prev);

      setIsChangedData((prev) => !prev);
      setOpenRepaymentDialog(false);
    }
  };

  const handleOpenDeleteDialog = (credit: any) => {
    setSelectedCredit(credit);
    setOpenDeleteDialog(true);
  };

  const handleDeleteCredit = async () => {
    if (selectedCredit) {
      const { error } = await supabase
        .from("Credit")
        .delete()
        .eq("id", selectedCredit.id);

      if (error) {
        console.error("Erreur lors de la suppression du crédit :", error);
      } else {
        // Rafraîchir la liste des crédits après suppression
        fetchCredits();
      }
      setOpenDeleteDialog(false); // Ferme la boîte de dialogue après suppression
      setSelectedCredit(null);
    }
  };

  const columns = [
    {
      field: "created_at",
      headerName: "Date d'Attribution",
      width: 180,
    },
    {
      field: "amount",
      headerName: "Montant",
      width: 120,
    },
    {
      field: "interest",
      headerName: "Intérêt",
      width: 120,
    },
    {
      field: "reste",
      headerName: "Montant Restant",
      width: 180,
    },
    {
      field: "total",
      headerName: "Total à rembourser",
      width: 180,
    },
    {
      field: "userName",
      headerName: "Noms", // Nouvelle colonne pour les noms
      width: 180,
    },
    {
      field: "action",
      headerName: "Action",
      width: 260,
      renderCell: (params: any) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOpenRepaymentDialog(params.row)}
          >
            Rembourser
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleOpenDeleteDialog(params.row)}
            style={{ marginLeft: 8 }}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        {/* Tabs Section */}
        <AppBar
          position="static"
          className="bg-white shadow-none flex w-[400px]"
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Crédits" />
            {userInfo?.role === "ROLE_ADMIN" && (
              <Tab label="Demandes de prêts" />
            )}
          </Tabs>
        </AppBar>
        {/* Filter Elements - DatePickers and Buttons */}
        <div className="flex items-center gap-4 ml-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date de Début"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DateTimePicker
              label="Date de Fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>

          <IconButton
            color="secondary"
            style={{ backgroundColor: "#E1F5FE" }}
            onClick={handleOpenDialog}
            aria-label="ajouter"
          >
            <AddIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="paramètres"
            onClick={() => setOpenConfigurerTaux(true)}
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </div>

      {/* Loader while fetching credits */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {/* DataGrid for Credits */}
          {selectedTab === 0 ? (
            <DataGrid
              rows={credits}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight
              getRowId={(row) => row.id}
            />
          ) : (
            <LoanRequestTab />
          )}
        </div>
      )}

      {/* Dialogs for adding loans, configuring rates, and repayments */}
      <LoanForm
        open={openDialog}
        setIsChangedData={setIsChangedData}
        onClose={handleCloseDialog}
        exchangeRate={exchangeRate}
      />
      <ConfigurerTaux
        open={openConfigurerTaux}
        exchangeRate={exchangeRate || 0}
        setExchangeRate={setExchangeRate}
        onClose={() => setOpenConfigurerTaux(false)}
        setIsChangedData={setIsChangedData}
      />
      <RepaymentDialog
        open={openRepaymentDialog}
        onClose={() => setOpenRepaymentDialog(false)}
        onRepayment={handleRepayment}
        selectedCredit={selectedCredit}
      />

      {/* Dialog for delete confirmation */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmation de Suppression</DialogTitle>
        <DialogContent>
          <p>Êtes-vous sûr de vouloir supprimer ce crédit ?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteCredit} color="secondary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreditManager;
