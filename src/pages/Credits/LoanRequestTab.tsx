import React, { useState, useEffect } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { supabase } from "../../lib/helpers/superbaseClient";
import axios from "axios";

const LoanRequestTab = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditRequests();
  }, []);

  const fetchCreditRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("DemandeCredit").select("*");
    if (error) {
      console.error(
        "Erreur lors de la récupération des demandes de crédit :",
        error
      );
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const sendEmail = async (
    clientEmail: string,
    status: "0" | "1",
    clientName: string,
    loanAmount: number,
    repaymentDate: Date | string
  ) => {
    const data = {
      clientEmail: clientEmail,
      status: status,
      clientName: clientName,
      loanAmount: loanAmount,
      repaymentDate: repaymentDate,
      senderEmail: "20au004@esisalama.org",
    };

    console.log("Voici la data de email : ", data);

    try {
      const response = await axios.post(
        "http://localhost:3000/send-email",
        data
      );
      console.log(response);
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error);
    }
  };

  const handleValidateRequest = async (request: any) => {
    const { error } = await supabase
      .from("DemandeCredit")
      .update({ statut: "VALIDE" })
      .eq("id", request.id);

    sendEmail(
      request.email,
      "1",
      `${request.prenom} ${request.nom}`,
      request.montant,
      request.date_remboursement
    );

    if (error) {
      console.error(
        "Erreur lors de la validation de la demande de crédit :",
        error
      );
    } else {
      fetchCreditRequests(); // Rafraîchir la liste après la validation
    }
  };

  const handleRejectRequest = async (request: any) => {
    const { error } = await supabase
      .from("DemandeCredit")
      .update({ statut: "REJETER" })
      .eq("id", request.id);

    sendEmail(
      request.email,
      "0",
      `${request.prenom} ${request.nom}`,
      request.montant,
      request.date_remboursement
    );

    if (error) {
      console.error(
        "Erreur lors de la mise à jour de la demande de crédit :",
        error
      );
    } else {
      fetchCreditRequests(); // Rafraîchir la liste après la mise à jour
    }
  };

  const getStatusStyle = (statut: string) => {
    switch (statut) {
      case "VALIDE":
        return { backgroundColor: "#e0f7fa" }; // Couleur claire pour "VALIDE"
      case "REJETER":
        return { backgroundColor: "#ffebee" }; // Couleur claire pour "REJETÉ"
      default:
        return { backgroundColor: "#ffffff" }; // Couleur par défaut
    }
  };

  return (
    <div>
      {/* Loader while fetching requests */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <Paper>
          <List>
            {requests.map((request) => (
              <div key={request.id}>
                <ListItem style={getStatusStyle(request.statut)}>
                  <ListItemText
                    primary={`${request.prenom} ${request.nom} (${request.email})`}
                    secondary={
                      <>
                        <div>Montant: {request.montant} FC</div>
                        <div>Statut: {request.statut}</div>
                        <div>
                          Date de Remboursement: {request.date_remboursement}
                        </div>
                        <div>Activité: {request.activite}</div>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {request.statut !== "VALIDE" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleValidateRequest(request)}
                        style={{ marginRight: 8 }}
                      >
                        Valider
                      </Button>
                    )}
                    {request.statut !== "REJETER" && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRejectRequest(request)}
                      >
                        Rejeter
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default LoanRequestTab;
