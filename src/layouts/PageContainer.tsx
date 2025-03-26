import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./../components/Sidebar";
import Header from "../components/AppBarHeader";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-[100vh] flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow ms-64">
        {/* AppBar */}
        <Header />

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
