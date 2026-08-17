"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ContactCtx {
  open: boolean;
  expanded: boolean;
  show: () => void;
  hide: () => void;
  expand: () => void;
  collapse: () => void;
}

const Ctx = createContext<ContactCtx>({
  open: false,
  expanded: false,
  show: () => {},
  hide: () => {},
  expand: () => {},
  collapse: () => {},
});

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const show = useCallback(() => { setOpen(true); setExpanded(false); }, []);
  const hide = useCallback(() => { setOpen(false); setExpanded(false); }, []);
  const expand = useCallback(() => setExpanded(true), []);
  const collapse = useCallback(() => setExpanded(false), []);

  return (
    <Ctx.Provider value={{ open, expanded, show, hide, expand, collapse }}>
      {children}
    </Ctx.Provider>
  );
}

export function useContact() {
  return useContext(Ctx);
}
