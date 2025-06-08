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
        "leading-7 not-first:mt-2 ",
        className,
      )}
    >
      {children}
    </p>
  );
}
