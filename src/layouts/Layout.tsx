import { Toaster } from "@/components/ui/sonner.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar.tsx";
import { FloatingWhatsapp } from "../components/Other/FloatingWhatsapp.tsx";
import Footer from "../pages/Footer.tsx";
import { Suspense, useEffect } from "react";
import LoadingPage from "@/components/Other/LoadingPage.tsx";
import { ErrorFallback } from "@/components/Other/ErrorFallback.tsx";

const Layout = () => {
  return (
    <div className="relative">
      <Navbar />
      <FloatingWhatsapp />
      <Toaster theme="dark" position="top-center" toastOptions={{
        style: { background: '#ecefdc', border: 'none', color: 'black' }
      }} />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingPage />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
      <ScrollRestoration />
      <ReactQueryDevtools initialIsOpen={false} />
      <Footer />
    </div >
  );
};

export default Layout;
