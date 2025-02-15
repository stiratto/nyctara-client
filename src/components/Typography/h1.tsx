import { cn } from "@/lib/utils";

export function TypographyH1({ children, classNames }: { children: React.ReactNode, classNames?: string }) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", classNames)}>
      {children}
    </h1>
  );
}
