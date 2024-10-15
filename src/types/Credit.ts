// types/Credit.ts
export interface Credit {
  id: number;
  submissionDate: Date;
  amount: number;
  allocationDate: Date | null; // La date d'attribution peut être nulle au début
  status: "Pending" | "Approved" | "Rejected"; // Statut du crédit
}
