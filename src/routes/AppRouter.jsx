import React from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom"

// IMPORT PAGES 
import Dashboard from "../pages/Dashboard/Dashboard"
import Inventory from "../pages/Inventory/Inventory"
import Pos from "../pages/POS/POS"
import Khata from "../pages/Khata/Khata"
import Roznamcha from "../pages/Roznamcha/Roznamcha"
import Reports from "../pages/Reports/Reports"
import Settings from "../pages/Settings/Settings"

const AppRouter = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/inventory" element={<Inventory/>}/>
            <Route path="/pos" element={<Pos/>}/>
            <Route path="/khata" element={<Khata/>}/>
            <Route path="/roznamcha" element={<Roznamcha/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/settings" element={<Settings/>}/>
        </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;