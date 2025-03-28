import { Avatar, Button, Typography } from "@mui/material";
import { Settings, Payment, Receipt, Add, Person } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Importer NavLink
import FundingDialog from "./FundingDialog"; // Assurez-vous d'importer votre composant de dialogue d'approvisionnement
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/helpers/superbaseClient";

const Sidebar = () => {
  const [openFundingDialog, setOpenFundingDialog] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentBalanceUsd, setCurrentBalanceUsd] = useState(0);
  const { userInfo, isBalanceChanged } = useAuth();

  useEffect(() => {
    fetchBalance();
  }, [openFundingDialog, isBalanceChanged]);

  const fetchBalance = async () => {
    // Récupérer la balance actuelle avant la mise à jour pour l'historique
    const { data: balanceData, error: balanceError } = await supabase
      .from("Balance")
      .select("*")
      .single();

    if (balanceError) throw balanceError;

    setCurrentBalance(balanceData.balance_cdf);
    setCurrentBalanceUsd(balanceData.balance_usd);
  };

  const handleOpenFundingDialog = () => {
    setOpenFundingDialog(true);
  };

  const handleCloseFundingDialog = () => {
    setOpenFundingDialog(false);
  };

  return (
    <div className="fixed min-h-[100vh] bg-white w-64 h-screen flex flex-col justify-between p-8">
      {/* Top Section */}
      <div>
        {/* Sidebar Menu */}
        <div className="flex items-center space-x-3 mb-5">
          <Avatar
            alt={userInfo?.user_name || "Invité"}
            src="/static/images/avatar/1.jpg"
          />
          <div className="flex flex-col">
            <Typography className="text-black font-bold">
              {userInfo?.user_name || "Invité"}
            </Typography>
            <Typography className="text-gray-500 text-sm">
              {userInfo?.role === "ROLE_ADMIN"
                ? "Administrateur"
                : userInfo?.role === "ROLE_MICROCREDIT"
                ? "Resp. Microcrédit"
                : userInfo?.role === "ROLE_CHANGE"
                ? "Resp. Change"
                : ""}
            </Typography>
          </div>
        </div>
        <div className="mb-5">
          <Typography variant="caption">Balance</Typography>
          <div className="flex items-center">
            <Typography className="font-bold font-mono text-[20px]">
              FC {currentBalance}
            </Typography>
            <Button
              onClick={handleOpenFundingDialog}
              startIcon={<Add className="text-green-500 w-4" />}
              sx={{
                minWidth: 0,
                padding: 0,
                marginLeft: 1,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            />
          </div>
          <Typography className="font-mono text-gray-700 text-[14px]">
            $ {currentBalanceUsd}
          </Typography>
        </div>
        <div className="flex flex-col gap-3">
          {/* Transactions */}
          {(userInfo.role === "ROLE_CHANGE" ||
            userInfo.role === "ROLE_ADMIN") && (
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center text-left justify-start w-full ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              <Receipt className="w-4" />
              <span className="ml-2 capitalize">Transactions</span>
            </NavLink>
          )}

          {/* Payments */}
          {(userInfo.role === "ROLE_MICROCREDIT" ||
            userInfo.role === "ROLE_ADMIN") && (
            <NavLink
              to="/credits"
              className={({ isActive }) =>
                `flex items-center text-left justify-start w-full ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              <Payment className="w-4" />
              <span className="ml-2 capitalize">Crédits</span>
            </NavLink>
          )}

          {/* Cards */}
          {(userInfo.role === "ROLE_ADMIN" ||
            userInfo.role === "ROLE_CHANGE") && (
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `flex items-center text-left justify-start w-full ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              <Person className="w-4" />
              <span className="ml-2 capitalize">Clients</span>
            </NavLink>
          )}

          {/* Administration */}
          {userInfo.role === "ROLE_ADMIN" && (
            <NavLink
              to="/administration"
              className={({ isActive }) =>
                `flex items-center text-left justify-start w-full ${
                  isActive ? "text-blue-500 font-bold" : "text-gray-700"
                }`
              }
            >
              <Settings className="w-4" />
              <span className="ml-2 capitalize">Administration</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Bottom Section - Promotional */}
      <div className="rounded-lg p-4">
        <p className="text-md text-gray-500 mb-2 font-bold">Gestion finances</p>
        <Typography className="text-gray-400 text-[12px]">
          Gérer vos finances de manière optimisée et raccourciée grâce à nos
          services
        </Typography>
      </div>

      {/* Dialog d'approvisionnement */}
      <FundingDialog
        open={openFundingDialog}
        onClose={handleCloseFundingDialog}
        currentBalance={currentBalance} // Passer la balance actuelle
      />
    </div>
  );
};

export default Sidebar;
