import { OctagonAlert } from "lucide-react"
import { TypographyH1 } from "../Typography/h1";
import { FallbackProps } from "react-error-boundary";
import { Button } from "../ui/button";

export function ErrorFallback(props: FallbackProps) {
   // Call resetErrorBoundary() to reset the error boundary and retry the render.
   const { error, resetErrorBoundary } = props

   return (
      <div className="h-screen flex flex-col justify-center items-center gap-8">
         <OctagonAlert color={'red'} size={40} />
         <TypographyH1 className="text-red-500">Algo no fue bien :( </TypographyH1>
         <p style={{ color: "red" }}>{error.message}</p>
         <Button className="bg-black hover:bg-black/50" onClick={resetErrorBoundary}>Reintentar</Button>
      </div>
   );
}
