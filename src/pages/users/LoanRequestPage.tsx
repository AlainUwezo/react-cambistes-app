import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert, // Importer le composant Alert
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
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/helpers/superbaseClient";

const LoanRequestPage = () => {
  const { userInfo } = useAuth();
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // État pour le message d'alerte
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "error"
  ); // État pour le type d'alerte

  useEffect(() => {
    const checkPendingRequest = async () => {
      const { data, error } = await supabase
        .from("DemandeCredit")
        .select("*")
        .eq("account_id", userInfo.id)
        .eq("statut", "ATTENTE");

      if (error) {
        console.error(
          "Erreur lors de la vérification de la demande : ",
          error.message
        );
      } else {
        setHasPendingRequest(data.length > 0);
      }
    };

    checkPendingRequest();
  }, [userInfo.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (hasPendingRequest) {
      newErrors.push(
        "Vous avez déjà une demande en attente. Vous ne pouvez pas soumettre une nouvelle demande tant que celle-ci n'a pas été traitée."
      );
      setAlertMessage("Vous avez déjà une demande en attente."); // Définir le message d'alerte
      setAlertSeverity("error"); // Définir le type d'alerte
      return; // Ne pas continuer si une demande est en attente
    }

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
      setErrors([]);
      setLoading(true);
      setAlertMessage(""); // Réinitialiser le message d'alerte

      const { data, error } = await supabase.from("DemandeCredit").insert([
        {
          prenom: firstName,
          nom: lastName,
          post_nom: middleName,
          email,
          adresse: address,
          telephone: phone,
          date_remboursement: repaymentDate,
          date_naissance: birthDate,
          nationalite: nationality,
          montant: loanAmount,
          statut: "ATTENTE",
          activite: activity,
          account_id: userInfo.id,
        },
      ]);

      if (error) {
        console.error("Erreur lors de l'enregistrement : ", error.message);
        setErrors(["Une erreur s'est produite lors de la soumission."]);
      } else {
        setOpenDialog(true);
        setAlertMessage("Votre demande a été soumise avec succès."); // Message d'alerte de succès
        setAlertSeverity("success");
      }

      setLoading(false);
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

        {alertMessage && ( // Afficher le message d'alerte si présent
          <Alert severity={alertSeverity} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

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
                label="Montant du Prêt"
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
                label="Activité"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                sx={{ mb: 2 }}
                fullWidth
                required
              />
            </Grid>
            {hasPendingRequest && (
              <div className="bg-orange-700 p-4 rounded-md ms-4">
                <Typography className="text-white">
                  Vous ne pouvez pas soumettre une demande pour le moment. Vous
                  avez une demande en cours de traitement...
                </Typography>
              </div>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                disabled={loading || hasPendingRequest}
              >
                Soumettre
              </Button>
            </Grid>
          </Grid>
        </form>

        {errors.length > 0 && (
          <Box sx={{ mt: 2, color: "red" }}>
            {errors.map((error, index) => (
              <Typography key={index}>{error}</Typography>
            ))}
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Demande Soumise</DialogTitle>
          <DialogContent>
            <Typography>Votre demande a été soumise avec succès.</Typography>
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
