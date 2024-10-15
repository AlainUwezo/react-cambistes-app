import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./../components/Sidebar";
import Header from "../components/AppBarHeader";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <Header />

        {/* Content */}
        <Box sx={{ padding: 3, background: "white", minHeight: "630px" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PageContainer;
