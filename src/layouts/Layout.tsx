import { Toaster } from "@/components/ui/sonner.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { Navbar } from "../components/Navbar/FloatingNav.tsx";
import { FloatingWhatsapp } from "../components/Other/FloatingWhatsapp.tsx";
import Footer from "../pages/Footer.tsx";
import { useEffect, Suspense } from "react";
import LoadingPage from "@/components/Other/LoadingPage.tsx";
import { RootState } from "@/store/store.ts"
import { useSelector } from "react-redux"
import { toast } from "sonner"

const Layout = () => {

  return (
    <div>
      <Navbar />
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
