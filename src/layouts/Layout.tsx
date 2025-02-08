import { Toaster } from "@/components/ui/sonner.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { FloatingNav } from "../components/Navbar/FloatingNav.tsx";
import { FloatingWhatsapp } from "../components/Other/FloatingWhatsapp.tsx";
import Footer from "../pages/Footer.tsx";
import { Suspense } from "react";
import LoadingPage from "@/components/Other/LoadingPage.tsx";

const Layout = () => {
  return (
    <div>
      <FloatingNav />
      <FloatingWhatsapp />
      <Toaster theme="dark" position="top-center" toastOptions={{
        style: { background: '#ecefdc', border: 'none', color: 'black' }
      }} />

      <Suspense fallback={<LoadingPage />}>


        <Outlet />
      </Suspense>
      <ScrollRestoration />
      <ReactQueryDevtools initialIsOpen={false} />
      <Footer />
    </div >
  );
};

export default Layout;
