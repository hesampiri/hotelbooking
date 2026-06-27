import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-foreground">HotelBooking</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
              A better way to find and book hotels in Iran. Built for travelers
              who care about where they stay.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/hotel"
                  className="hover:text-foreground transition-colors"
                >
                  All Hotels
                </Link>
              </li>
              <li>
                <Link
                  href="/hotel/search?destination=Tehran"
                  className="hover:text-foreground transition-colors"
                >
                  Tehran
                </Link>
              </li>
              <li>
                <Link
                  href="/hotel/search?destination=Kish"
                  className="hover:text-foreground transition-colors"
                >
                  Kish
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-foreground transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} HotelBooking.com</span>
          <span>Made by Hesam</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
