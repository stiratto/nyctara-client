import clsx from "clsx";

export function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "leading-7 [&:not(:first-child)]:mt-2 text-pretty",
        className,
      )}
    >
      {children}
    </p>
  );
}
