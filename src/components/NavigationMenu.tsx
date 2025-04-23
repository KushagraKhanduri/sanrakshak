
import React from "react";
import { LayoutDashboard, BookOpen, Map, Bell, Search } from "lucide-react";
import { NavBar } from "./ui/tubelight-navbar";

const NavigationMenu = () => {
  const navigationItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Resources",
      url: "/resources",
      icon: BookOpen
    },
    {
      name: "Map",
      url: "/map",
      icon: Map
    },
    {
      name: "Alerts",
      url: "/alerts",
      icon: Bell
    }
  ];

  return (
    <NavBar 
      items={navigationItems}
      className="md:flex hidden"
    />
  );
};

export default NavigationMenu;
