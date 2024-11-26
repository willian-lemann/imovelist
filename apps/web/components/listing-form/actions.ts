"use server";

import sharp from "sharp";
import { createListing, Input } from "@/data-access/listings/create-listing";
import { getUser } from "@/data-access/user/get-user";
import { supabaseDB } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const listingSchema = z.object({
  photos: z
    .array(z.string())
    .min(1, { message: "Pelo menos uma foto é obrigatória" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  type: z.string().min(1, { message: "Selecione um tipo de imóvel válido" }),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  bedrooms: z.coerce
    .number()
    .min(1, { message: "O número de quartos deve ser 0 ou mais" })
    .transform((value) => +value),
  bathrooms: z.coerce
    .number()
    .min(1, { message: "O número de banheiros deve ser 0 ou mais" })
    .transform((value) => +value),
  area: z.coerce
    .number()
    .min(1, { message: "A área deve ser um número positivo" }),
  ref: z
    .string()
    .min(1, { message: "Referência ou código do imóvel não pode ser vazio." }),
  price: z.coerce.number().min(1, { message: "Preço não pode ser vazio." }),
  content: z
    .string()
    .min(1, { message: "Descrição não pode ser um número vazio." })
    .max(1000, { message: "A descrição deve ter no máximo 1000 caracteres" }),
  forSale: z.boolean().default(false),
});

export type ListingData = z.infer<typeof listingSchema>;

export async function createListingAction(prevstate: any, formData: FormData) {
  const { userId } = await auth();
  const loggedUser = await getUser({ id: userId! });

  const rawData = Object.fromEntries(formData.entries());

  const photosString = formData.get("photos") as string;

  const photos = photosString.split(",");

  const data = { ...rawData, photos };

  const validationResult = listingSchema.safeParse(data);

  if (!validationResult.success) {
    let errorMap: any = {};
    validationResult.error.errors.forEach((error) => {
      const errorKey = String(error.path[0]);
      errorMap[errorKey] = error.message;
    });

    return {
      success: false,
      errors: errorMap,
      fields: rawData as any,
    };
  }

  const result = validationResult.data;

  const image = result.photos[0]!;

  const createListingInput: Input = {
    ...result,
    agent_id: loggedUser.agent.id,
    area: String(result.area),
    image,
    placeholderImage: "",
  };

  try {
    const { data, error } = await createListing(createListingInput);
    const listingCreated = data as any;

    if (error) {
      return {
        success: false,
        errors: { server: "Error trying to create listing" },
      };
    }

    const placeholderBlob = await createPlaceholder(image, { size: 50 });

    await savePlaceholderImage(listingCreated.id, placeholderBlob);

    return { success: true, errors: null };
  } catch (error) {
    return {
      success: false,
      errors: {
        server: "Failed to save listing. Please try again.",
      },
    };
  }
}

async function createPlaceholder(image: string, { size }: { size: number }) {
  const compressImage = async (imageSrc: string) => {
    return sharp(imageSrc).resize(50, 50).png({ quality: 70 });
  };

  const compressedBlob = await compressImage(image);
  return compressedBlob.toBuffer();
}

async function savePlaceholderImage(listingId: number, file: Buffer) {
  const fileName = `${listingId}.png`;

  await supabaseDB.storage.from("images").upload(fileName, file);

  const url = `https://digdpilwqusbkpnnbejk.supabase.co/storage/v1/object/public/images/${fileName}`;

  await supabaseDB
    .from("listings")
    .update({ placeholderImage: url })
    .eq("id", listingId);
}
