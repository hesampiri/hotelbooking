import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import HomeContent from "@/components/homeContent";
import Footer from "@/components/Footer";

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative bg-muted overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hotels/Abbasi_Hotel_202606211254.jpeg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              HotelBooking
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
              Stay somewhere
              <br />
              <span className="text-muted-foreground">worth remembering.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Handpicked hotels in Tehran and Kish. No fluff, just great places
              to sleep.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-lg">
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                10
              </span>
              <span className="text-sm text-muted-foreground mt-1">Hotels</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                5
              </span>
              <span className="text-sm text-muted-foreground mt-1">Cities</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                4.5
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Avg. Rating
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                24/7
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dynamic content (search, hotels) ── */}
      <HomeContent />

      {/* ── Split section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/images/hotels/Dariush_Grand_Hotel_202606211251.jpeg"
              alt="Kish Island"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Why us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              No middlemen.
              <br />
              <span className="text-muted-foreground">No hidden fees.</span>
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-sm font-bold text-muted-foreground shrink-0 pt-0.5">
                  01
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Direct booking
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Book straight with the hotel. No third-party markups.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-sm font-bold text-muted-foreground shrink-0 pt-0.5">
                  02
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Real photos only
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Every image is from the actual property. What you see is
                    what you get.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-sm font-bold text-muted-foreground shrink-0 pt-0.5">
                  03
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Cancel freely
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Plans change. Most bookings let you cancel up to 24 hours
                    before check-in.
                  </p>
                </div>
              </div>
            </div>
            <Button asChild className="mt-2">
              <Link href="/hotel">
                Find your hotel <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Marquee banner ── */}
      <div className="border-y bg-muted overflow-hidden py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="mx-6 text-sm font-medium tracking-wide text-muted-foreground"
            >
              TEHRAN &nbsp;·&nbsp; KISH &nbsp;·&nbsp; DIRECT BOOKING
              &nbsp;·&nbsp; NO FEES &nbsp;·&nbsp; 24/7 SUPPORT &nbsp;·&nbsp;
              FREE CANCELLATION &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
