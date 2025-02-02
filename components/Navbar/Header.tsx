"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const pathname = usePathname();
  const pathnames = {
    '/new-charging': 'New charging',
    '/chargings': 'Chargings',
    '/settings': 'Settings',
  }

  return (
    <div
      style={{
        backgroundColor: "#0e0e0e", 
        color: "#c7c7c7", 
        height: "70px",
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        borderBottom: "1px solid rgb(92, 92, 92)",
      }}
    >
      <p style={{fontSize: '20px'}}>{pathnames[pathname as keyof typeof pathnames]}</p>
    </div>
  );
};

export default Header;
