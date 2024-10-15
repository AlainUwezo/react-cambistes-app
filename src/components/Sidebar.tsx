import { Avatar, Button, Typography } from "@mui/material";
import { Settings, Payment, Receipt, Add, Person } from "@mui/icons-material";

import { useState } from "react";
import { NavLink } from "react-router-dom"; // Importer NavLink
import FundingDialog from "./FundingDialog"; // Assurez-vous d'importer votre composant de dialogue d'approvisionnement

const Sidebar = () => {
  const [openFundingDialog, setOpenFundingDialog] = useState(false);
  const currentBalance = 232000; // Montant actuel de la balance

  const handleOpenFundingDialog = () => {
    setOpenFundingDialog(true);
  };

  const handleCloseFundingDialog = () => {
    setOpenFundingDialog(false);
  };

  return (
    <div className="bg-white w-64 h-screen flex flex-col justify-between p-8">
      {/* Top Section */}
      <div>
        {/* Sidebar Menu */}
        <div className="flex items-center space-x-3 mb-5">
          <Avatar alt="Jennie C." src="/static/images/avatar/1.jpg" />
          <div className="flex flex-col">
            <Typography className="text-black font-bold">Jennie C.</Typography>
            <Typography className="text-gray-500 text-sm">
              Rocket GmbH
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
        </div>
        <div className="flex flex-col gap-3">
          {/* Transactions */}
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

          {/* Payments */}
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

          {/* Cards */}
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

          {/* Administration */}
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
