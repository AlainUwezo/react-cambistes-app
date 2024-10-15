/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import EmailIcon from "@mui/icons-material/Email";
import { Fade } from "@mui/material";
import { AttachMoney } from "@mui/icons-material";

// Taux de conversion Euro -> Francs Congolais
const EURO_TO_CDF_RATE = 2500;

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Noms",
    width: 150,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 180,
    editable: true,
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    editable: true,
  },
  {
    field: "amount",
    headerName: "Montant ($)",
    type: "number",
    width: 110,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: "Snow Jon",
    email: "jon.snow@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 2,
    name: "Lannister Cersei",
    email: "cersei.lannister@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 3,
    name: "Lannister Jaime",
    email: "jaime.lannister@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 4,
    name: "Stark Arya",
    email: "arya.stark@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 5,
    name: "Targaryen Daenerys",
    email: "daenerys.targaryen@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 6,
    name: "Melisandre",
    email: "melisandre@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 7,
    name: "Clifford Ferrara",
    email: "clifford.ferrara@example.com",
    date: "19-01-2024 12:00",
    amount: 19.2,
  },
  {
    id: 8,
    name: "Frances Rossini",
    email: "frances.rossini@example.com",
    date: "19-02-2024 14:00",
    amount: 19.2,
  },
  {
    id: 9,
    name: "Roxie Harvey",
    email: "roxie.harvey@example.com",
    date: "19-02-2024 14:00",
    amount: 19.2,
  },
];

export default function TransactionTable() {
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params.row);
  };

  return (
    <div className="flex gap-6">
      {/* Tableau des transactions */}
      <Paper elevation={0} sx={{ padding: 0 }} className="flex-grow w-[100%]">
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </Paper>

      {/* Zone d'affichage des détails */}
      <Paper
        elevation={0}
        sx={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
        className="border-l border-l-[#cacaca] pl-4"
      >
        {selectedRow ? (
          <Fade in={Boolean(selectedRow)} timeout={600}>
            <Box sx={{ textAlign: "left", width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 1.5,
                  gap: 1.5,
                }}
                className="py-10"
              >
                <FingerprintIcon fontSize="small" />
                <Typography variant="body1">ID: {selectedRow.id}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 1.5,
                  gap: 1.5,
                }}
              >
                <AccountCircleIcon fontSize="small" />
                <Typography variant="subtitle2">{selectedRow.name}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 1.5,
                  gap: 1.5,
                }}
              >
                <EmailIcon fontSize="small" />
                <Typography variant="subtitle2">{selectedRow.email}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 1.5,
                  gap: 1.5,
                }}
              >
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="subtitle2">{selectedRow.date}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 1.5,
                  gap: 1.5,
                }}
              >
                <AttachMoney fontSize="small" />
                <Typography variant="subtitle2">
                  Montant: {selectedRow.amount} $
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 1.5,
                  gap: 1.5,
                }}
              >
                <AttachMoney fontSize="small" />
                <Typography variant="subtitle2">
                  Montant en CDF:
                  {(selectedRow.amount * EURO_TO_CDF_RATE).toFixed(2)} CDF
                </Typography>
              </Box>
            </Box>
          </Fade>
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <Typography variant="caption" className="text-center">
              Cliquez sur une transaction pour voir les détails.
            </Typography>
          </div>
        )}
      </Paper>
    </div>
  );
}
