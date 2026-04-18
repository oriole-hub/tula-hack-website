import { PropsWithChildren } from "react";
import { cn } from "../lib/cn";

export const Card = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <section className={cn("card", className)}>{children}</section>
);
