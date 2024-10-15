/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ClientTable from "./ClientTable";
import { Button } from "@mui/material";
import PageContainer from "../../layouts/PageContainer";
import { Add as AddIcon } from "@mui/icons-material";
import AddClientForm from "./AddClientForm";

const Clients = () => {
  const [clients, setClients] = useState<any[]>([
    {
      id: 1,
      registrationDate: "2023-01-15",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      currencyExchangeCount: 5,
      loanCount: 2,
      loyaltyBonus: 100,
    },
    {
      id: 2,
      registrationDate: "2023-03-10",
      name: "Marie Curie",
      email: "marie.curie@example.com",
      currencyExchangeCount: 3,
      loanCount: 1,
      loyaltyBonus: 50,
    },
    // Ajoutez d'autres clients ici...
  ]);

  const [openAddClient, setOpenAddClient] = useState(false);

  const handleOpenAddClient = () => {
    setOpenAddClient(true);
  };

  const handleCloseAddClient = () => {
    setOpenAddClient(false);
  };

  const handleAddClient = (clientData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    // Ajoutez la logique pour ajouter le client dans le tableau des clients
    setClients((prevClients) => [
      ...prevClients,
      {
        ...clientData,
        id: prevClients.length + 1,
        registrationDate: new Date().toISOString().split("T")[0],
        currencyExchangeCount: 0,
        loanCount: 0,
        loyaltyBonus: 0,
      },
    ]);
  };

  const handleAssignBonus = (clientId: number) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === clientId
          ? { ...client, loyaltyBonus: client.loyaltyBonus + 10 }
          : client
      )
    );
  };

  return (
    <PageContainer>
      <div>
        <div className="flex items-center justify-end mb-4">
          <Button
            color="primary"
            variant="outlined"
            style={{ backgroundColor: "#E1F5FE" }}
            startIcon={<AddIcon />}
            onClick={handleOpenAddClient}
            aria-label="ajouter"
          >
            Nouveau client
          </Button>
        </div>
        <ClientTable clients={clients} onUpdateBonus={handleAssignBonus} />
        <AddClientForm
          open={openAddClient}
          onClose={handleCloseAddClient}
          onAddClient={handleAddClient}
        />
      </div>
    </PageContainer>
  );
};

export default Clients;
