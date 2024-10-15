import React, { useState } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  IconButton,
  TextField,
  Typography,
  Box,
  Button,
  Modal,
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

const CreditManager = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [openLoanForm, setOpenLoanForm] = useState(false);
  const [openConfigurerTaux, setOpenConfigurerTaux] = useState(false);
  const [openRepaymentDialog, setOpenRepaymentDialog] = useState(false);
  const [credits, setCredits] = useState<any[]>([
    {
      id: 1,
      submissionDate: "19-05-2024",
      amount: 500,
      interest: 50,
      remainingAmount: 550,
      attributionDate: "19-05-2024",
      status: "Approved",
    },
    {
      id: 2,
      submissionDate: "19-05-2024",
      amount: 300,
      interest: 30,
      remainingAmount: 330,
      attributionDate: "19-05-2024",
      status: "Pending",
    },
  ]);
  const [exchangeRate, setExchangeRate] = useState<number>(5);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddCredit = () => {
    const newCredit = {
      id: credits.length + 1,
      submissionDate: startDate,
      amount: Math.random() * 1000,
      interest: Math.random() * 100,
      remainingAmount: Math.random() * 1000 + Math.random() * 100,
      attributionDate: endDate,
      status: "Pending",
    };
    setCredits([...credits, newCredit]);
    handleCloseDialog();
  };

  const handleOpenRepaymentDialog = (credit: any) => {
    setSelectedCredit(credit);
    setOpenRepaymentDialog(true);
  };

  const handleRepayment = (amount: number) => {
    if (selectedCredit) {
      console.log(
        `Rembourser: ${amount} $ pour le crédit ID ${selectedCredit.id}`
      );
      const updatedCredits = credits.map((c) => {
        if (c.id === selectedCredit.id) {
          return {
            ...c,
            remainingAmount: c.remainingAmount - amount,
            status: c.remainingAmount - amount <= 0 ? "Paid" : c.status,
          };
        }
        return c;
      });
      setCredits(updatedCredits);
      setOpenRepaymentDialog(false); // Ferme le dialogue après le remboursement
    }
  };

  const columns = [
    {
      field: "submissionDate",
      headerName: "Date de Soumission",
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
      field: "remainingAmount",
      headerName: "Montant Restant",
      width: 180,
    },
    {
      field: "attributionDate",
      headerName: "Date d'Attribution",
      width: 180,
    },
    { field: "status", headerName: "Statut", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleOpenRepaymentDialog(params.row)}
        >
          Rembourser
        </Button>
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
            <Tab label="Historique" />
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

      {/* DataGrid for Credits */}
      <div className="grid grid-cols-1">
        <DataGrid
          rows={credits}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      <LoanForm
        open={openDialog}
        onClose={handleCloseDialog}
        exchangeRate={exchangeRate}
      />
      {/* Modal for Repayment */}
      <RepaymentDialog
        open={openRepaymentDialog}
        onClose={() => setOpenRepaymentDialog(false)}
        selectedCredit={selectedCredit}
        onRepayment={handleRepayment}
      />

      {/* Modal for Configuring Interest Rate */}
      <ConfigurerTaux
        open={openConfigurerTaux}
        onClose={() => setOpenConfigurerTaux(false)}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
      />
    </div>
  );
};

export default CreditManager;
