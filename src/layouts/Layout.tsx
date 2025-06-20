import { Toaster } from "@/components/ui/sonner.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar.tsx";
import { FloatingWhatsapp } from "../components/Other/FloatingWhatsapp.tsx";
import Footer from "../pages/Footer.tsx";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/Other/ErrorFallback.tsx";
import { LoadingScreen } from "./LoadingScreen.tsx";
import { TestPage } from "@/components/Other/TestPage.tsx";

const Layout = () => {
  return (
    <div className="relative">
      <Navbar />
      <FloatingWhatsapp />
      <Toaster theme="dark" position="top-center" toastOptions={{
        style: { background: '#ecefdc', border: 'none', color: 'black' }
      }} />
      <TestPage />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingScreen />}>
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
