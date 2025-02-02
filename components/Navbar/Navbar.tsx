"use client";
import React from "react";
import { Paper, Group, Button } from "@mantine/core";
import Link from "next/link";
import { IconSettings, IconList, IconCircleDashedPlus } from '@tabler/icons-react';
import styles from './navbar.module.css';
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Paper
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        paddingBottom: 20,
        borderRadius: 0,
        borderTop: "1px solid rgb(92, 92, 92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0e0e0e",
      }}
    >
      <Group
        justify="center"
        align="center"
        style={{
          width: "100%",
        }}
      >
        <Link href="/new-charging" passHref>
          <Button className={styles.button} variant="subtle" size="sm" color={pathname === "/new-charging" ? "#fffb00" : "#c7c7c7"}>
            <IconCircleDashedPlus color={pathname === "/new-charging" ? "#fffb00" : "#c7c7c7"} />
            New charging
          </Button>
        </Link>
        <Link href="/chargings" passHref>
          <Button className={styles.button} variant="subtle" size="sm" color={pathname === "/chargings" ? "#fffb00" : "#c7c7c7"}>
            <IconList color={pathname === "/chargings" ? "#fffb00" : "#c7c7c7"} />
            Chargings
          </Button>
        </Link>
        <Link href="/settings" passHref>
          <Button className={styles.button} variant="subtle" size="sm" color={pathname === "/settings" ? "#fffb00" : "#c7c7c7"}>
            <IconSettings color={pathname === "/settings" ? "#fffb00" : "#c7c7c7"} />
            Settings
          </Button>
        </Link>
      </Group>
    </Paper>
  );
}