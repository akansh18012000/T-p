import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getScreenIdFromPathname,
  getInitialSidebarExpanded,
} from "../config/menuConfig.js";

export interface SidebarContextValue {
  dataInputExpanded: boolean;
  setDataInputExpanded: (v: boolean) => void;
  masterMaintenanceExpanded: boolean;
  setMasterMaintenanceExpanded: (v: boolean) => void;
  adminExpanded: boolean;
  setAdminExpanded: (v: boolean) => void;
  currentScreenId: string | undefined;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const currentScreenId = getScreenIdFromPathname(pathname);

  const [dataInputExpanded, setDataInputExpanded] = useState(false);
  const [masterMaintenanceExpanded, setMasterMaintenanceExpanded] =
    useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (currentScreenId) {
      const {
        dataInputExpanded: di,
        masterMaintenanceExpanded: mm,
        adminExpanded: ad,
      } = getInitialSidebarExpanded(currentScreenId);
      setDataInputExpanded(di);
      setMasterMaintenanceExpanded(mm);
      setAdminExpanded(ad);
    }
  }, [currentScreenId]);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const value: SidebarContextValue = {
    dataInputExpanded,
    setDataInputExpanded,
    masterMaintenanceExpanded,
    setMasterMaintenanceExpanded,
    adminExpanded,
    setAdminExpanded,
    currentScreenId,
    sidebarOpen,
    openSidebar,
    closeSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (ctx == null) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}

export function useSidebarOptional(): SidebarContextValue | null {
  return useContext(SidebarContext);
}
