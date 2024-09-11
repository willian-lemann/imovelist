import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

type GalleryProps = {
  photos: string[];
};

export function Gallery({ photos }: GalleryProps) {
  return (
    <section id="gallery" className="container px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-6">Galeria</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-8">
        {photos.map((photo) => (
          <div
            key={photo}
            className="relative aspect-square rounded-lg overflow-hidden"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Image
                  src={photo}
                  fill
                  className="object-cover"
                  alt={`Imagem do apartamento ${photo}`}
                />
              </DialogTrigger>

              <DialogContent className="h-full max-w-3xl bg-transparent outline-none shadow-none border-none">
                <Image
                  src={photo}
                  fill
                  className="object-contain"
                  alt={`Imagem do apartamento ${photo}`}
                />
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </section>
  );
}