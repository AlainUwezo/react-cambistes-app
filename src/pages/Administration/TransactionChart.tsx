import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/helpers/superbaseClient";

const TransactionChart = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await supabase
        .from("Transaction")
        .select("amount, created_at");
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={transactions}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="created_at" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TransactionChart;
