"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ContactCtx {
  open: boolean;
  show: () => void;
  hide: () => void;
}

const Ctx = createContext<ContactCtx>({
  open: false,
  show: () => {},
  hide: () => {},
});

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ open, show, hide }}>
      {children}
    </Ctx.Provider>
  );
}

export function useContact() {
  return useContext(Ctx);
}
