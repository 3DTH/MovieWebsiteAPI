import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 flex-grow">{children}</main>
      <Footer />
    </>
  );
}