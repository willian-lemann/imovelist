"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function LoginModal({ children }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-white">asdasd</DialogContent>
    </Dialog>
  );
}
