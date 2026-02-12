"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ListingFormValues } from "@/lib/validations";

export interface Listing {
  id: string;
  name: string | null;
  link: string | null;
  image: string | null;
  address: string | null;
  price: number | null;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  type: string | null;
  forSale: boolean;
  content: string | null;
  photos: string[];
  agency: string | null;
  ref: string | null;
  placeholderImage: string | null;
  published: boolean;
  agentId: string;
  agent?: { id: string; name: string | null; image: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}

interface ListingFilters {
  published?: boolean;
  type?: string;
  forSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  search?: string;
  agentId?: string;
  page?: number;
  limit?: number;
}

function buildSearchParams(filters: ListingFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function useListings(filters: ListingFilters = {}) {
  return useQuery<ListingsResponse>({
    queryKey: ["listings", filters],
    queryFn: async () => {
      const qs = buildSearchParams(filters);
      const res = await fetch(`/api/listings?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
  });
}

export function useListing(id: string) {
  return useQuery<Listing>({
    queryKey: ["listing", id],
    queryFn: async () => {
      const res = await fetch(`/api/listings/${id}`);
      if (!res.ok) throw new Error("Failed to fetch listing");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ListingFormValues) => {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create listing");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ListingFormValues>;
    }) => {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update listing");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete listing");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
