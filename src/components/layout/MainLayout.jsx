import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  PointOfSale,
  Inventory,
  LibraryBooks,
  Brightness4,
} from "@mui/icons-material";

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard /> },
    { text: "POS", icon: <PointOfSale /> },
    { text: "Inventory", icon: <Inventory /> },
    { text: "Khata", icon: <LibraryBooks /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "white",
          color: "#05192D",
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
            Hisab Book Shop
          </Typography>
          <IconButton color="inherit">
            <Brightness4 />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#05192D",
            color: "white",
          },
        }}
        anchor="left"
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ color: "#05D67D", fontWeight: "bold" }}
          >
            Hisab Book
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#05D67D" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: "#F8F9FA",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
