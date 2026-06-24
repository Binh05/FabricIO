import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function AppCarousel({
  images,
  alt = "image",
}: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div className="bg-card border-border rounded-lg border">
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute right-5 bottom-5 z-10 flex gap-2.5">
          <Button variant="icon" onClick={() => api?.scrollPrev()}>
            <ChevronLeft size={20} />
          </Button>

          <Button variant="icon" onClick={() => api?.scrollNext()}>
            <ChevronRight size={20} />
          </Button>
        </div>
      </Carousel>
    </div>
  );
}
