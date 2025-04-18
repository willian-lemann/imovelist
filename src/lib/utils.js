import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMoney(money) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    maximumFractionDigits: 3,
    currency: "BRL",
  });

  return formatter.format(Number(money));
}

export function createSlug(propertyName) {
  return propertyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractIdFromSlug(url) {
  const parts = url.split("/");
  const slug = parts[parts.length - 1];
  if (!slug) {
    return 0;
  }
  const id = slug.split("-")[0];
  return +id;
}

export function Capitalize(value) {
  if (!value) return;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
