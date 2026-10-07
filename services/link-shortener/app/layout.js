import "./globals.css";

export const metadata = {
  title: "Nim Dvir Links",
  description: "Private branded link shortener for Nim Dvir.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
