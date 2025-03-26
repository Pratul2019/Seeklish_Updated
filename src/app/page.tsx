// import GlassCardsContainer from "@/components/UIComp/Glasscontainer";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HiHomeModern } from "react-icons/hi2";
import { MdAppShortcut } from "react-icons/md";
import { SiWpexplorer } from "react-icons/si";
import Logo from "./(main)/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <div className=" flex items-center justify-center my-4">
        <Logo />
      </div>

      <Carousel className="border rounded-lg max-w-xl min-h-64">
        <CarouselContent>
          <CarouselItem>
            <div>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center p-6 lg:p-8 ">
              <div>
                <SiWpexplorer size={40} className="text-teal-400" />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-bold mb-2">Local Insights</h2>
                <p className="">
                  Discover hidden gems and popular spots in your new city,
                  curated by locals
                </p>
              </div>
              
            </div>
            <Button asChild size='lg'>
              <Link href="/discover">Discover</Link>
            </Button>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center p-6 lg:p-8">
              <div>
                <HiHomeModern size={40} className="text-teal-400" />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-bold mb-2">Housing Solutions</h2>
                <p className="">
                  Find the perfect home with our community-driven rental
                  listings and insights.
                </p>
              </div>
            </div>
            <Button asChild size='lg'>
              <Link href="/rental">Rentals</Link>
            </Button>
            </div>
          </CarouselItem>

          <CarouselItem>
          <div>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center p-6 lg:p-8 ">
              <div>
                <MdAppShortcut size={40} className="text-teal-400" />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-bold mb-2">Essential Apps</h2>
                <p className="">
                  Get a curated list of must-have apps used by locals for
                  seamless city living.
                </p>
              </div>
            </div>
            <Button asChild size='lg'>
              <Link href="/application">Application</Link>
            </Button>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>
    </div>
  );
}
