import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { supabase } from "../../lib/helpers/superbaseClient";

interface Client {
  id: number;
  registrationDate: string;
  user_name: string;
  email: string;
  currencyExchangeCount: number; // Remplacez par la logique pour obtenir ces données si nécessaire
  loanCount: number; // Remplacez par la logique pour obtenir ces données si nécessaire
  loyaltyBonus: number; // Bonus de fidélité récupéré de la table Fidelite
}

const ClientTable: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false); // État pour le loader des données
  const [loyaltyBonus, setLoyaltyBonus] = useState<number>(0); // État pour le bonus de fidélité disponible
  const [dataLoading, setDataLoading] = useState<boolean>(true); // État pour le chargement des données

  useEffect(() => {
    const fetchClients = async () => {
      setDataLoading(true); // Démarrer le loader des données

      const { data, error } = await supabase
        .from("Account")
        .select("id, user_name, email, role")
        .eq("role", "ROLE_CLIENT");

      if (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } else {
        const enrichedClients = await Promise.all(
          data.map(async (client) => {
            // Récupérer les données supplémentaires pour chaque client
            const { count: currencyExchangeCount } = await supabase
              .from("Transaction")
              .select("id", { count: "exact", head: true })
              .eq("account_id", client.id);

            const { count: loanCount } = await supabase
              .from("Credit")
              .select("id", { count: "exact", head: true })
              .eq("account_id", client.id);

            // Récupérer le bonus de fidélité depuis la table Fidelite
            const { data: fidelityData, error: fidelityError } = await supabase
              .from("Fidelite")
              .select("amount")
              .eq("account_id", client.id)
              .single(); // Récupère un seul enregistrement

            return {
              id: client.id,
              registrationDate: new Date().toISOString(), // Ajoutez une logique pour obtenir la date d'inscription
              user_name: client.user_name,
              email: client.email,
              currencyExchangeCount: currencyExchangeCount || 0,
              loanCount: loanCount || 0,
              loyaltyBonus: fidelityData?.amount || 0, // Utiliser le montant de fidélité de la table Fidelite
            };
          })
        );

        setClients(enrichedClients);
      }

      setDataLoading(false); // Arrêter le loader des données
    };

    fetchClients();
  }, []);

  const handleClickOpen = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setLoyaltyBonus(client.loyaltyBonus); // Mettre à jour le bonus de fidélité disponible
      setSelectedClientId(clientId);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAmount(0); // Réinitialiser le montant après la fermeture
  };

  const handleConfirm = async () => {
    if (selectedClientId !== null && amount <= loyaltyBonus) {
      setLoading(true); // Démarrer le loader

      // Mettre à jour le bonus de fidélité du client
      const { error } = await supabase
        .from("Fidelite")
        .update({ amount: loyaltyBonus - amount }) // Réduire le montant de fidélité
        .eq("account_id", selectedClientId);

      if (error) {
        console.error(
          "Erreur lors de la mise à jour du bonus de fidélité:",
          error
        );
      } else {
        // Mettre à jour le tableau des clients
        const updatedClients = clients.map((client) =>
          client.id === selectedClientId
            ? { ...client, loyaltyBonus: loyaltyBonus - amount } // Mettre à jour le montant dans l'état local
            : client
        );
        setClients(updatedClients);
      }

      handleClose();
      setLoading(false); // Arrêter le loader
    } else {
      alert(
        "Le montant ne peut pas être supérieur au bonus de fidélité disponible."
      );
    }
  };

  const columns: GridColDef[] = [
    { field: "registrationDate", headerName: "Date d'inscription", width: 180 },
    { field: "user_name", headerName: "Noms", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "currencyExchangeCount", headerName: "Nb change", width: 100 },
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
      {dataLoading ? ( // Afficher le loader pendant le chargement des données
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={clients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Retirer Bonus de Fidélité</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez entrer le montant du bonus de fidélité que vous souhaitez
            retirer. Montant disponible : {loyaltyBonus}
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
            inputProps={{
              max: loyaltyBonus, // Limite le montant maximal
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={loading}>
            {loading ? "Chargement..." : "Entrer"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClientTable;
