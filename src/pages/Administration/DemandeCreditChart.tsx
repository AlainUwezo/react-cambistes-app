import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/helpers/superbaseClient";

const DemandeCreditChart = () => {
  const [demandeCredit, setDemandeCredit] = useState([]);
  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  useEffect(() => {
    const fetchDemandeCredit = async () => {
      const { data } = await supabase.from("DemandeCredit").select("statut");

      const groupedData = [
        {
          name: "VALIDÉ",
          value: data.filter((d) => d.statut === "VALIDE").length,
        },
        {
          name: "REJETÉ",
          value: data.filter((d) => d.statut === "REJETER").length,
        },
        {
          name: "ATTENTE",
          value: data.filter((d) => d.statut === "ATTENTE").length,
        },
      ];
      setDemandeCredit(groupedData);
    };

    fetchDemandeCredit();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={demandeCredit}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {demandeCredit.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DemandeCreditChart;
