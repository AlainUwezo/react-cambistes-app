/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Fade } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import EmailIcon from "@mui/icons-material/Email";
import { AttachMoney } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete"; // Importer l'icône de suppression
import IconButton from "@mui/material/IconButton"; // Importer le composant IconButton
import Dialog from "@mui/material/Dialog"; // Importer le composant Dialog
import DialogActions from "@mui/material/DialogActions"; // Importer le composant DialogActions
import DialogContent from "@mui/material/DialogContent"; // Importer le composant DialogContent
import DialogContentText from "@mui/material/DialogContentText"; // Importer le composant DialogContentText
import DialogTitle from "@mui/material/DialogTitle"; // Importer le composant DialogTitle
import { supabase } from "../../lib/helpers/superbaseClient";
import dayjs from "dayjs";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "user_name", headerName: "Noms", width: 150 },
  { field: "email", headerName: "Email", width: 180 },
  { field: "created_at", headerName: "Date", width: 150 },
  { field: "amount", headerName: "Montant ($)", type: "number", width: 110 },
  {
    field: "amount_changed",
    headerName: "Montant modifié ($)",
    type: "number",
    width: 150,
  },
];

export default function TransactionTable({ isChange }: any) {
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  // État pour gérer la boîte de dialogue de confirmation
  const [openDialog, setOpenDialog] = React.useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Transaction").select(
        `id, created_at, amount, amount_changed, 
            Account:account_id (user_name, email, role)`
      );

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        // Transformer les données pour correspondre aux colonnes
        const formattedData = data.map((transaction: any) => ({
          id: transaction.id,
          user_name: transaction.Account.user_name,
          email: transaction.Account.email,
          created_at: transaction.created_at,
          amount: transaction.amount,
          amount_changed: transaction.amount_changed,
        }));
        setRows(formattedData);
      }
      setLoading(false);
    };

    fetchData();
  }, [isChange]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params.row);
    setTransactionToDelete(params.row); // Stocker la transaction à supprimer
  };

  const handleDeleteClick = () => {
    setOpenDialog(true); // Ouvrir la boîte de dialogue
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Fermer la boîte de dialogue
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      const { error } = await supabase
        .from("Transaction")
        .delete()
        .eq("id", transactionToDelete.id); // Supprimer la transaction par ID

      if (error) {
        console.error("Error deleting transaction:", error);
      } else {
        // Mettre à jour les données après la suppression
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== transactionToDelete.id)
        );
        setSelectedRow(null); // Réinitialiser la ligne sélectionnée
      }
    }
    setOpenDialog(false); // Fermer la boîte de dialogue
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Tableau des transactions */}
      <div className="col-span-3">
        <Paper elevation={0} sx={{ padding: 0 }} className="flex-grow w-[100%]">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <CircularProgress />
            </div>
          ) : (
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
          )}
        </Paper>
      </div>

      {/* Zone d'affichage des détails */}
      <div className="grid colums-1">
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
                  <Typography variant="subtitle2">
                    {selectedRow.user_name}
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
                  <EmailIcon fontSize="small" />
                  <Typography variant="subtitle2">
                    {selectedRow.email}
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
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="subtitle2">
                    {dayjs(selectedRow.created_at).format("DD/MM/YYYY")}
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
                    Montant en CDF: {selectedRow.amount_changed}
                  </Typography>
                </Box>

                {/* Bouton de suppression */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 1.5,
                    gap: 1.5,
                  }}
                >
                  <IconButton onClick={handleDeleteClick}>
                    <DeleteIcon fontSize="small" className="fill-red-500" />
                  </IconButton>
                  <Typography variant="subtitle2">
                    Supprimer cette transaction
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

      {/* Boîte de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette transaction ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
