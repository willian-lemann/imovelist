"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface GalleryItem {
  id: string;
  originalImage: string;
  editedImage: string | null;
  prompt: string | null;
  listingId: string;
  userId: string;
  listing?: { name: string | null; image: string | null };
  createdAt: string;
  updatedAt: string;
}

export function useGallery(listingId?: string) {
  return useQuery<GalleryItem[]>({
    queryKey: ["gallery", listingId],
    queryFn: async () => {
      const params = listingId ? `?listingId=${listingId}` : "";
      const res = await fetch(`/api/gallery${params}`);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return res.json();
    },
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      originalImage: string;
      editedImage?: string;
      prompt?: string;
      listingId: string;
    }) => {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create gallery item");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete gallery item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useEditImage() {
  return useMutation({
    mutationFn: async (data: { imageUrl: string; prompt: string }) => {
      const res = await fetch("/api/ai/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to edit image");
      }
      return res.json();
    },
  });
}
