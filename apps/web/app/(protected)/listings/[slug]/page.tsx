import { Button } from "@/components/ui/button";
import { BathIcon, BedIcon, LayoutGrid, RulerIcon, XIcon } from "lucide-react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent } from "@/components/ui/card";

import { Metadata, ResolvingMetadata } from "next";
import { createSlug, extractIdFromSlug } from "@/lib/utils";
import { getListing } from "@/data-access/listings/get-listing";
import { Share } from "./share";
import { GoToSite } from "./go-to-side";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PhotosCarousel } from "../photos-carousel";
import { Gallery } from "./gallery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type ListingDetailsProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: ListingDetailsProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = extractIdFromSlug(params.slug);
  const listing = await getListing(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${createSlug(listing.address)}-${listing.id}`,
    openGraph: {
      images: [...previousImages, listing.image],
    },
  };
}

export default async function ListingDetails({ params }: ListingDetailsProps) {
  const id = extractIdFromSlug(params.slug);
  const listing = await getListing(id!);

  return (
    <div className="flex flex-col min-h-dvh">
      <section className="bg-white">
        <div className="container px-4 py-8 md:px-8 md:py-12">
          <Breadcrumb className="pb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Imoveis</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{listing.ref}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl md:text-3xl font-bold">
              {listing.name || listing.address}
            </h1>

            <Share />
          </div>

          <div className="md:hidden">
            <PhotosCarousel
              photos={listing.photos}
              placeholderImage={listing.placeholderImage}
            />
          </div>

          <div className="hidden md:grid md:grid-cols-2 h-[400px] gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative h-auto rounded-lg overflow-hidden">
                  <Image
                    src={listing.image}
                    fill
                    className="object-cover"
                    alt="Main property image"
                  />
                </div>
              </DialogTrigger>

              <DialogContent className="h-full max-w-3xl bg-transparent outline-none shadow-none border-none">
                <DialogClose className="bg-white rounded h-fit w-fit z-50 ml-auto">
                  <XIcon />
                </DialogClose>

                <Image
                  src={listing.image}
                  fill
                  className="object-cover"
                  alt="Foto de um imovel"
                />
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-2 gap-4 relative">
              {listing.photos
                .slice(0, 4)
                .map((photo: { href: string; listingItemId: string }) => (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        key={photo.listingItemId}
                        className="relative h-auto w-full rounded-lg overflow-hidden"
                      >
                        <Image
                          src={photo.href}
                          fill
                          className="object-cover"
                          alt={`Imagem do imovel ${photo.listingItemId}`}
                        />
                      </div>
                    </DialogTrigger>

                    <DialogContent className="h-full max-w-3xl bg-transparent outline-none shadow-none border-none">
                      <DialogClose className="bg-white rounded h-fit w-fit z-50 ml-auto">
                        <XIcon />
                      </DialogClose>

                      <Image
                        src={photo.href}
                        fill
                        className="object-cover"
                        alt={`Imagem do imovel ${photo.listingItemId}`}
                      />
                    </DialogContent>
                  </Dialog>
                ))}

              <Link
                href="#gallery"
                className="hidden md:block absolute bottom-4 right-4"
              >
                <Button
                  variant="outline"
                  className=" hover:bg-white flex items-center gap-2"
                >
                  <LayoutGrid className="h-5 w-5" />
                  <Label className="cursor-pointer">
                    Mostre todas as fotos
                  </Label>
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">
                Entire place in {listing.address}
              </h2>
              {/* <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                <span>
                  {listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""}
                </span>
                <span>·</span>
                <span>
                  {listing.bathrooms} bathroom{listing.bathrooms > 1 ? "s" : ""}
                </span>
                {listing.area && (
                  <>
                    <span>·</span>
                    <span>{listing.area}</span>
                  </>
                )}
              </div> */}

              <div className="border-t border-b py-6 my-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <BedIcon className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Quartos</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.bedrooms} quarto
                        {listing.bedrooms > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <BathIcon className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Banheiros</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.bathrooms} banheiro
                        {listing.bathrooms > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {listing.area && (
                    <div className="flex items-center gap-4">
                      <RulerIcon className="w-6 h-6" />
                      <div>
                        <h3 className="font-semibold">Area</h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.area}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: listing.content.replace(
                    `<button class="bold button-ler-mais">Ler <!-- -->mais<div class="chevron-ler-mais selected"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(270deg)"><path fill-rule="evenodd" clip-rule="evenodd" stroke-width="1" d="M5.64645 2.64645C5.84171 2.45118 6.15829 2.45118 6.35355 2.64645L11.3536 7.64645C11.5488 7.84171 11.5488 8.15829 11.3536 8.35355L6.35355 13.3536C6.15829 13.5488 5.84171 13.5488 5.64645 13.3536C5.45118 13.1583 5.45118 12.8417 5.64645 12.6464L10.2929 8L5.64645 3.35355C5.45118 3.15829 5.45118 2.84171 5.64645 2.64645Z" stroke="currentColor"></path></svg></div></button>`,
                    ""
                  ),
                }}
              />
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold">
                      R$ {listing.price.toLocaleString()}
                    </div>
                  </div>

                  <GoToSite link={listing.link} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Gallery photos={listing.photos.map((photo: any) => photo.href)} />
    </div>
  );
}
