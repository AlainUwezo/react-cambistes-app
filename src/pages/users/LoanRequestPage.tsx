import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import UserPageContainer from "../../layouts/UserPageContainer";
import {
  Email,
  Home,
  MonetizationOn,
  Work,
  Phone,
  Send,
  Person,
} from "@mui/icons-material";

const LoanRequestPage = () => {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationality, setNationality] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [activity, setActivity] = useState("");
  const [repaymentDate, setRepaymentDate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // Validation des champs requis
    if (!phone) newErrors.push("Le numéro de téléphone est requis.");
    if (!firstName) newErrors.push("Le prénom est requis.");
    if (!lastName) newErrors.push("Le nom est requis.");
    if (!email) newErrors.push("L'adresse email est requise.");
    if (!address) newErrors.push("L'adresse domiciliaire est requise.");
    if (!profession) newErrors.push("La profession est requise.");
    if (!birthDate) newErrors.push("La date de naissance est requise.");
    if (!nationality) newErrors.push("La nationalité est requise.");
    if (!loanAmount) newErrors.push("Le montant du prêt est requis.");
    if (!activity) newErrors.push("L'activité à effectuer est requise.");
    if (!repaymentDate) newErrors.push("La date de remboursement est requise.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      // Réinitialiser les erreurs
      setErrors([]);
      // Afficher la boîte de dialogue de félicitations
      setOpenDialog(true);
      console.log({
        phone,
        firstName,
        lastName,
        middleName,
        email,
        address,
        profession,
        birthDate,
        nationality,
        loanAmount,
        activity,
        repaymentDate,
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <UserPageContainer>
      <Box
        sx={{
          mt: 4,
          textAlign: "center",
          maxWidth: 800,
          mx: "auto",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom className="font-bold">
          Demande de Prêt
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          className="my-4 text-slate-500"
        >
          Veuillez remplir le formulaire ci-dessous pour soumettre votre demande
          de prêt. Assurez-vous que toutes les informations sont correctes.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Person style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Person style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Post-nom"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                InputProps={{
                  startAdornment: <Person style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Adresse Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Email style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Numéro de Téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Phone style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Work style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Adresse Domiciliaire"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Home style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date de remboursement"
                type="date"
                value={repaymentDate}
                onChange={(e) => setRepaymentDate(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Date de Naissance"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Nationalité"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Montant en Francs Congolais (CDF)"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
                InputProps={{
                  startAdornment: <MonetizationOn style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Activité à effectuer"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 2 }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                startIcon={<Send />}
              >
                Soumettre la demande
              </Button>
            </Grid>

            {errors.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ color: "red", textAlign: "left", mb: 2 }}>
                  {errors.map((error, index) => (
                    <Typography key={index}>{`* ${error}`}</Typography>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </form>

        {/* Boîte de dialogue de félicitations */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Félicitations !</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Votre demande de prêt a été soumise avec succès. Nous vous
              contacterons bientôt.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </UserPageContainer>
  );
};

export default LoanRequestPage;
