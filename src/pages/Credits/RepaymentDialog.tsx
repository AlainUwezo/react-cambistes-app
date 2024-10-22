/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import RepaymentForm from "./RepaymentForm"; // Assurez-vous d'importer le bon chemin

interface RepaymentDialogProps {
  open: boolean;
  onClose: () => void;
  selectedCredit: any; // Changez cela avec un type plus approprié si possible
  onRepayment: (amount: number) => void;
}

const RepaymentDialog: React.FC<RepaymentDialogProps> = ({
  open,
  onClose,
  selectedCredit,
  onRepayment,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Rembourser le Crédit ID {selectedCredit?.id}
        </Typography>
        <RepaymentForm
          onRepayment={onRepayment}
          onClose={onClose}
          creditId={selectedCredit?.id}
        />
      </Box>
    </Modal>
  );
};

export default RepaymentDialog;
