"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type EditButtonProps = {
  id: string;
};

export function EditButton({ id }: EditButtonProps) {
  const router = useRouter();

  function goEdit(listingId: string) {
    router.push(`/${listingId}/editar`);
  }

  return (
    <div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goEdit(id);
        }}
        variant="secondary"
        className="h-6 hover:brightness-90 py-4 transition-all duration-200 font-semibold"
      >
        Editar
      </Button>
    </div>
  );
}
