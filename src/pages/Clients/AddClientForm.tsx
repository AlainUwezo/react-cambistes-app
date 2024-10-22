/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import { Person, Email, Lock, Phone } from "@mui/icons-material";
import { supabase } from "../../lib/helpers/superbaseClient";

interface AddClientFormProps {
  open: boolean;
  onClose: () => void;
  onAddClient: (clientData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({
  open,
  onClose,
  onAddClient,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        throw new Error(
          `Erreur lors de l'inscription : ${signUpError.message}`
        );
      }

      const newUser = signUpData?.user;
      if (!newUser) {
        throw new Error("Utilisateur non créé.");
      }

      // Étape 2: Ajouter des informations supplémentaires dans la table Client
      const { error: insertError } = await supabase.from("Account").insert({
        user_name: name,
        telephone: phone,
        auth_id: newUser.id,
        email: email,
        role: "ROLE_CLIENT",
      });

      if (insertError) {
        throw new Error(
          `Erreur lors de l'ajout du client : ${insertError.message}`
        );
      }

      // Étape 3: Récupérer l'ID du nouveau client
      const { data: newAccount, error: accountError } = await supabase
        .from("Account")
        .select("id")
        .eq("auth_id", newUser.id)
        .single();

      if (accountError) {
        throw new Error(
          `Erreur lors de la récupération de l'ID du client : ${accountError.message}`
        );
      }

      // Étape 4: Ajouter un enregistrement dans la table Fidelite
      const { error: fidelityError } = await supabase.from("Fidelite").insert({
        amount: 0,
        account_id: newAccount.id,
      });

      if (fidelityError) {
        throw new Error(
          `Erreur lors de l'ajout du bonus de fidélité : ${fidelityError.message}`
        );
      }

      // Réinitialiser les champs après la soumission
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      onAddClient({ name, email, password, phone });
      onClose();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un Nouveau Client</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <Person />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <Email />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <Lock />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <Phone />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClientForm;
