import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  Car,
  MapPin,
  Maximize,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function PublicListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id, published: true },
    include: {
      agent: { select: { name: true, image: true } },
    },
  });

  if (!listing) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-semibold">EstateHub</span>
          </Link>
          <Link href="/search">
            <Button variant="ghost" size="sm">
              Procurar Imóveis
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Back */}
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para busca
        </Link>

        {/* Hero image */}
        {listing.image ? (
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-muted">
            <Image
              src={listing.image}
              alt={listing.name || ""}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge
                variant={listing.forSale ? "default" : "secondary"}
                className="shadow-sm"
              >
                {listing.forSale ? "Venda" : "Aluguel"}
              </Badge>
              {listing.type && (
                <Badge variant="secondary" className="capitalize shadow-sm">
                  {listing.type}
                </Badge>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-[21/9] rounded-2xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Nenhuma imagem disponível</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {listing.name || "Imóvel"}
              </h1>
              {listing.address && (
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {listing.address}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Bedrooms", value: listing.bedrooms, icon: Bed },
                { label: "Bathrooms", value: listing.bathrooms, icon: Bath },
                {
                  label: "Area",
                  value: listing.area ? `${listing.area}m²` : null,
                  icon: Maximize,
                },
                { label: "Parking", value: listing.parking, icon: Car },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-4 rounded-xl bg-muted/50 border"
                >
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xl font-semibold">{item.value ?? "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Description */}
            {listing.content && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Sobre este imóvel
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.content}
                </p>
              </div>
            )}

            {/* Photos */}
            {listing.photos.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Fotos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {listing.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted"
                    >
                      <Image src={photo} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-3xl font-bold text-primary">
                  {listing.price
                    ? `R$ ${listing.price.toLocaleString("pt-BR")}`
                    : "Consultar valor"}
                </p>

                {listing.agency && (
                  <p className="text-sm text-muted-foreground">
                    {listing.agency}
                  </p>
                )}
                {listing.ref && (
                  <p className="text-xs text-muted-foreground">
                    Ref: {listing.ref}
                  </p>
                )}

                {/* Agent */}
                {listing.agent && (
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      {listing.agent.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {listing.agent.name || "Corretor"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Corretor de Imóveis
                      </p>
                    </div>
                  </div>
                )}

                <Button className="w-full">Contatar Corretor</Button>
                <Button variant="outline" className="w-full gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Compartilhar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
