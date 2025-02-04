"use client";
import React from "react";
import { Paper, Group, Button, Stack } from "@mantine/core";
import Link from "next/link";
import { IconSettings, IconList, IconCircleDashedPlus } from '@tabler/icons-react';
import styles from './Navbar.module.css';
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Group
      grow
      style={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        height: '11vh',
        paddingBottom: 45,
        borderRadius: 0,
        borderTop: "1px solid rgb(92, 92, 92)",
        backgroundColor: "#0e0e0e",
      }}
    >
      <Link 
        href="/new-charging" 
        passHref
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          textDecoration: 'none',
        }}
        >
        <Button className={styles.button} style={{ height: '70px' }} variant="subtle" size='sm' color={pathname === "/new-charging" ? "#fffb00" : "#c7c7c7"}>
          <Stack align="center">
            <IconCircleDashedPlus style={{marginBottom: '-8px'}} color={pathname === "/new-charging" ? "#fffb00" : "#c7c7c7"} />
            <span>Add new</span>
          </Stack>
        </Button>
      </Link>
      <Link 
        href="/chargings"
        passHref
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          textDecoration: 'none',
        }}
        >
        <Button className={styles.button} style={{ height: '70px' }} variant="subtle" size="sm" color={pathname === "/chargings" ? "#fffb00" : "#c7c7c7"}>
          <Stack align="center" >
            <IconList style={{marginBottom: '-8px'}} color={pathname === "/chargings" ? "#fffb00" : "#c7c7c7"} />
            <span>Chargings</span>
          </Stack>
        </Button>
      </Link>
      <Link 
        href="/settings" 
        passHref
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          textDecoration: 'none',
        }}
        >
        <Button className={styles.button} style={{ height: '70px' }} variant="subtle" size="sm" color={pathname === "/settings" ? "#fffb00" : "#c7c7c7"}>
          <Stack align="center"  >
            <IconSettings style={{marginBottom: '-8px'}} color={pathname === "/settings" ? "#fffb00" : "#c7c7c7"} />
            <span>Settings</span>
          </Stack>
        </Button>
      </Link>
    </Group>
  );
}