"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { CompanySettingsData } from "@/lib/company/companySettings";

interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string;
  logoName?: string;
}

interface CompanyThemeContextType {
  theme: CompanySettingsData | null;
  setTheme: (settings: CompanySettingsData) => void;
  applyThemeLive: (colors: Partial<ThemeColors>) => void;
}

const CompanyThemeContext = createContext<CompanyThemeContextType | undefined>(undefined);

const DEFAULT_THEME: CompanySettingsData = {
  companyId: "",
  logo: "/images/logo.png",
  logoName: "logo.png",
  primaryColor: "#ffb162",
  secondaryColor: "#2c3b4d",
  accentColor: "#a35139",
  selectedLocale: "en-AU",
  selectedTimezone: "Australia/Sydney",
};

export function CompanyThemeProvider({
  initialSettings,
  children,
}: {
  initialSettings?: CompanySettingsData | null;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<CompanySettingsData>(initialSettings || DEFAULT_THEME);

  // Apply theme variables to document root for portals and dialogs, and cleanup on unmount
  useEffect(() => {
    const root = document.documentElement;
    if (theme.primaryColor) {
      root.style.setProperty("--burning-flame", theme.primaryColor);
    }
    if (theme.secondaryColor) {
      root.style.setProperty("--blue-fantastic", theme.secondaryColor);
    }
    if (theme.accentColor) {
      root.style.setProperty("--truffle-trouble", theme.accentColor);
    }

    return () => {
      root.style.removeProperty("--burning-flame");
      root.style.removeProperty("--blue-fantastic");
      root.style.removeProperty("--truffle-trouble");
    };
  }, [theme.primaryColor, theme.secondaryColor, theme.accentColor]);

  const applyThemeLive = (colors: Partial<ThemeColors>) => {
    setThemeState((prev) => ({
      ...prev,
      ...colors,
    }));
  };

  const setTheme = (settings: CompanySettingsData) => {
    setThemeState(settings);
  };

  const dynamicStyles = useMemo<React.CSSProperties>(() => {
    const styleObj: Record<string, string> = {};
    if (theme.primaryColor) styleObj["--burning-flame"] = theme.primaryColor;
    if (theme.secondaryColor) styleObj["--blue-fantastic"] = theme.secondaryColor;
    if (theme.accentColor) styleObj["--truffle-trouble"] = theme.accentColor;
    return styleObj as React.CSSProperties;
  }, [theme.primaryColor, theme.secondaryColor, theme.accentColor]);

  return (
    <CompanyThemeContext.Provider value={{ theme, setTheme, applyThemeLive }}>
      <div className="company-theme-scope min-h-screen flex flex-col flex-1" style={dynamicStyles}>
        {children}
      </div>
    </CompanyThemeContext.Provider>
  );
}

export function useCompanyTheme() {
  const context = useContext(CompanyThemeContext);
  if (!context) {
    return {
      theme: null,
      setTheme: () => {},
      applyThemeLive: () => {},
    };
  }
  return context;
}
