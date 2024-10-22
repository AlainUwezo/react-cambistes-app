import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../lib/helpers/superbaseClient";

const BalanceHistoryChart = () => {
  const [balanceHistory, setBalanceHistory] = useState([]);

  useEffect(() => {
    const fetchBalanceHistory = async () => {
      const { data } = await supabase
        .from("BalanceHistory")
        .select("balance_cdf, created_at");
      setBalanceHistory(data);
    };

    fetchBalanceHistory();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={balanceHistory}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="created_at" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="balance_cdf"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceHistoryChart;
