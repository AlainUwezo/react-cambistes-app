import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Client {
  id: number;
  registrationDate: string;
  name: string;
  email: string;
  currencyExchangeCount: number;
  loanCount: number;
  loyaltyBonus: number;
}

interface ClientTableProps {
  clients: Client[];
  onUpdateBonus: (clientId: number, amount: number) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onUpdateBonus,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const handleClickOpen = (clientId: number) => {
    setSelectedClientId(clientId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAmount(0); // Réinitialiser le montant après la fermeture
  };

  const handleConfirm = () => {
    if (selectedClientId !== null) {
      // Log l'ID du client et le montant retiré
      console.log(`Client ID: ${selectedClientId}, Montant retiré: ${amount}`);

      // Mettez à jour le bonus de fidélité du client
      onUpdateBonus(selectedClientId, amount);
      handleClose();
    }
  };

  const columns: GridColDef[] = [
    { field: "registrationDate", headerName: "Date d'inscription", width: 180 },
    { field: "name", headerName: "Noms", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "currencyExchangeCount",
      headerName: "Nb change",
      width: 100,
    },
    { field: "loanCount", headerName: "Prêts octroyés", width: 150 },
    { field: "loyaltyBonus", headerName: "Bonus de fidélité", width: 150 },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleClickOpen(params.row.id)}
        >
          Retirer
        </Button>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1">
      <DataGrid
        rows={clients}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection={false}
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Attribuer Bonus de Fidélité</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez entrer le montant du bonus de fidélité que vous souhaitez
            retirer.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Montant"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Entrer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientTable;
