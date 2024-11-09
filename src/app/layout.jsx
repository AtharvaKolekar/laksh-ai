import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from '@next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Adjust weights as needed
  style: ['normal', 'italic'],
});
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LakshAI - Your AI Career Guide",
  description: "LakshAI is career guidance app designed to help users make informed career decisions and achieve their professional goals.",
  icons: [
    { rel: 'icon', url: '/logo.png' },  // Pointing to the logo.jpg file in the public folder
  ],
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.className}`}>{children}</body>
    </html>
  );
}
