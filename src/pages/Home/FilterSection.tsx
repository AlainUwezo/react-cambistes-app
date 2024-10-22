/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  IconButton,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Settings as SettingsIcon, Add as AddIcon } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TransactionsTable from "./TransactionTable";
import ExchangeForm from "./ExchangeForm";
import ConfigurerTaux from "./ConfigurerTaux"; // Importer le nouveau composant
import { supabase } from "../../lib/helpers/superbaseClient";

const FilterSection = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [exchangeRate, setExchangeRate] = useState();
  const [isChangedData, setIsChangedData] = useState(false);

  useEffect(() => {
    getExchangeRate();
  }, []);

  const getExchangeRate = async () => {
    const { data } = await supabase.from("config").select("*").single();
    setExchangeRate(data.change_rate);
  };

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenRateDialog = () => {
    setOpenRateDialog(true);
  };

  const handleCloseRateDialog = () => {
    setOpenRateDialog(false);
  };

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
            <Tab label="Liste des transactions" />
          </Tabs>
        </AppBar>
        {/* Filter Elements - DatePickers and Buttons */}
        <div className="flex items-center gap-4 ml-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date de début"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
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
                      fontSize: "16px", // Augmenter la taille de la police
                    },
                  }}
                />
              )}
            />
            <DateTimePicker
              label="Date de fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
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
              )}
            />
          </LocalizationProvider>

          {/* Button for Settings */}
          <IconButton
            color="primary"
            aria-label="paramètres"
            onClick={handleOpenRateDialog}
          >
            <SettingsIcon />
          </IconButton>

          <IconButton
            color="secondary"
            style={{ backgroundColor: "#E1F5FE" }}
            onClick={handleOpenDialog} // Ouvrir le dialogue d'échange
            aria-label="ajouter"
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>

      {/* Dialog for Exchange Form */}
      <ExchangeForm
        open={openDialog}
        onClose={handleCloseDialog}
        setIsChangedData={setIsChangedData}
      />
      {/* Dialog for Configurer Taux */}
      <ConfigurerTaux
        open={openRateDialog}
        onClose={handleCloseRateDialog}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
      />

      {/* Container for Filter Elements and Tabs */}
      <div className="flex items-center justify-between mt-4">
        {/* Tabs Content */}
        <Box display="flex" alignItems="center" className="flex-grow">
          {selectedTab === 0 && (
            <div>
              <TransactionsTable isChange={isChangedData} />
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default FilterSection;
