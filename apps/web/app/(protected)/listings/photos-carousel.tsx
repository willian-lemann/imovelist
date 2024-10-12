import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type PhotosCarouselProps = {
  photos: { href: string }[];
  placeholderImage: string;
};

export function PhotosCarousel({
  photos,
  placeholderImage,
}: PhotosCarouselProps) {
  return (
    <Carousel className="group relative  z-40  w-full md:max-w-xs">
      <CarouselPrevious className="absolute  md:group-hover:flex-initial  left-2 top-1/2 z-50  -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
      <CarouselContent className="">
        {photos.map(({ href }) => (
          <CarouselItem key={href} className="">
            <div className="w-auto h-[300px] brightness-90 hover:brightness-100 transition-all duration-300 relative rounded-lg overflow-hidden">
              <Image
                src={href!}
                blurDataURL={placeholderImage}
                placeholder="blur"
                alt="Property Image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="absolute md:hidden md:group-hover:flex animate-fadeIn right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-0 hover:bg-white" />
    </Carousel>
  );
}
