import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supreme Trucking Insurance",
  description: "Fast Quotes. No Runaround. Specializing in owner operators, small fleets, and new authority.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-[#0f2044] text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">Supreme Trucking Insurance</div>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:text-[#f97316]">Home</a></li>
              <li className="relative group">
                <span className="cursor-pointer hover:text-[#f97316]">Services</span>
                <ul className="absolute hidden group-hover:block bg-[#0f2044] text-white mt-2 space-y-2 p-2 rounded shadow-lg">
                  <li><a href="/owner-operator" className="block hover:text-[#f97316]">Owner Operator Insurance</a></li>
                  <li><a href="/fleet" className="block hover:text-[#f97316]">Small Fleet Insurance</a></li>
                  <li><a href="/new-venture" className="block hover:text-[#f97316]">New Venture Insurance</a></li>
                  <li><a href="/cargo" className="block hover:text-[#f97316]">Cargo Insurance</a></li>
                </ul>
              </li>
              <li><a href="/loss-runs" className="hover:text-[#f97316]">Loss Run Help</a></li>
              <li><a href="/about" className="hover:text-[#f97316]">About</a></li>
              <li><a href="/contact" className="hover:text-[#f97316]">Contact</a></li>
              <li><a href="/quote" className="bg-[#f97316] text-white px-4 py-2 rounded hover:bg-orange-600">Get a Quote</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-[#0f2044] text-white p-8 text-center">
          <div className="container mx-auto">
            <p>Phone: (555) 000-0000 | Email: info@supremetruckinginsurance.com</p>
            <p className="mt-2">© 2025 Supreme Trucking Insurance</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
