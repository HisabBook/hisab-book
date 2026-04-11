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

import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  const menuItems = [
    { text: t('layout.sidebar.dashboard'), icon: <Dashboard /> },
    { text: t('layout.sidebar.pos'), icon: <PointOfSale /> },
    { text: t('layout.sidebar.inventory'), icon: <Inventory /> },
    { text: t('layout.sidebar.khata'), icon: <LibraryBooks /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ color: "secondary.main", fontWeight: "bold" }}>
  {t('layout.navbar.title')}
</Typography>
          <IconButton color="inherit" disabled>
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
            bgcolor: "primary.main",
            color: "white",
          },
        }}
        anchor="left"
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ color: "secondary.main", fontWeight: "bold" }}
          >
           {t('layout.navbar.title')}
          </Typography>
        </Toolbar>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "secondary.main" }}>
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
