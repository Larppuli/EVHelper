"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const pathname = usePathname();
  const pathnames = {
    '/new-charging': 'New Charging',
    '/chargings': 'Chargings',
    '/settings': 'Settings',
  }

  return (
    <div
      style={{
        backgroundColor: "#0e0e0e", 
        color: "#c7c7c7", 
        height: "60px",
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        borderBottom: "1px solid rgb(40, 40, 40)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        }}
    >
      <h3 style={{fontSize: '20px'}}>{pathnames[pathname as keyof typeof pathnames]}</h3>
    </div>
  );
};

export default Header;
