import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { FaBell } from "react-icons/fa";

const Header = () => {
  return (
    <AppBar position="static" elevation={0} className="bg-white pt-6">
      <Toolbar className="flex justify-between">
        {/* Left: Avatar and User Info */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <Typography className="text-black font-bold text-xl">
              Transactions
            </Typography>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex bg-gray-100 rounded-lg p-2 items-center w-1/2">
          <SearchIcon className="text-gray-500" />
          <InputBase
            placeholder="Search..."
            className="ml-2 w-full text-black"
            inputProps={{ "aria-label": "search" }}
          />
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <IconButton>
            <FaBell size={20} className="text-black" />
          </IconButton>
          <IconButton>
            <MoreIcon className="text-black" />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
