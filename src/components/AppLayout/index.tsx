"use client";

import { PropsWithChildren } from "react";
import AppHeader from "./AppHeader";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
