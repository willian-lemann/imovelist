"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listingSchema, type ListingFormValues } from "@/lib/validations";
import { useCreateListing, useUpdateListing } from "@/lib/queries/use-listings";

interface ListingFormProps {
  initialData?: Partial<ListingFormValues> & { id?: string };
  mode: "create" | "edit";
}

const propertyTypes = [
  { label: "Apartamento", value: "apartment" },
  { label: "Casa", value: "house" },
  { label: "Condomínio", value: "condo" },
  { label: "Sobrado", value: "townhouse" },
  { label: "Comercial", value: "commercial" },
  { label: "Terreno", value: "land" },
  { label: "Mansão", value: "villa" },
];

export function ListingForm({ initialData, mode }: ListingFormProps) {
  const router = useRouter();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      price: initialData?.price || undefined,
      area: initialData?.area || undefined,
      bedrooms: initialData?.bedrooms || undefined,
      bathrooms: initialData?.bathrooms || undefined,
      parking: initialData?.parking || undefined,
      type: initialData?.type || "",
      forSale: initialData?.forSale ?? true,
      content: initialData?.content || "",
      image: initialData?.image || "",
      agency: initialData?.agency || "",
      ref: initialData?.ref || "",
      link: initialData?.link || "",
      published: initialData?.published ?? false,
    },
  });

  const forSale = watch("forSale");

  async function onSubmit(data: ListingFormValues) {
    try {
      if (mode === "edit" && initialData?.id) {
        await updateListing.mutateAsync({ id: initialData.id, data });
      } else {
        await createListing.mutateAsync(data);
      }
      router.push("/listings");
    } catch (error) {
      console.error("Failed to save listing:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="name">Nome do Imóvel *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Lindo apartamento no centro"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Rua Principal, 123, Cidade, Estado"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="250000"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="area">Área (m²)</Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              {...register("area")}
              placeholder="120"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type">Tipo de Imóvel</Label>
            <select
              id="type"
              {...register("type")}
              className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Selecione o tipo</option>
              {propertyTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Finalidade</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={forSale ? "default" : "outline"}
                size="sm"
                onClick={() => setValue("forSale", true)}
              >
                Venda
              </Button>
              <Button
                type="button"
                variant={!forSale ? "default" : "outline"}
                size="sm"
                onClick={() => setValue("forSale", false)}
              >
                Aluguel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Características</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="bedrooms">Quartos</Label>
            <Input
              id="bedrooms"
              type="number"
              {...register("bedrooms")}
              placeholder="3"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bathrooms">Banheiros</Label>
            <Input
              id="bathrooms"
              type="number"
              {...register("bathrooms")}
              placeholder="2"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="parking">Vagas</Label>
            <Input
              id="parking"
              type="number"
              {...register("parking")}
              placeholder="1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mídia e Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="image">URL da Imagem de Capa</Label>
            <Input
              id="image"
              {...register("image")}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Descrição</Label>
            <Textarea
              id="content"
              {...register("content")}
              rows={6}
              placeholder="Descreva este imóvel..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="agency">Imobiliária</Label>
              <Input
                id="agency"
                {...register("agency")}
                placeholder="Nome da imobiliária"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ref">Referência</Label>
              <Input id="ref" {...register("ref")} placeholder="REF-001" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link">Link Externo</Label>
            <Input
              id="link"
              {...register("link")}
              placeholder="https://example.com/listing"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : mode === "create"
              ? "Criar Imóvel"
              : "Atualizar Imóvel"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue("published", true);
            handleSubmit(onSubmit)();
          }}
          disabled={isSubmitting}
        >
          {mode === "create" ? "Criar e Publicar" : "Atualizar e Publicar"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
