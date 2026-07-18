import { cloneElement, isValidElement, type ReactNode } from "react";

/**
 * Slot minimalista: mescla as props recebidas no elemento filho (em vez de
 * renderizar um wrapper). Permite `<Button asChild><Link/></Button>`.
 */
export function Slot({
  children,
  ...props
}: { children?: ReactNode } & Record<string, unknown>) {
  if (isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return cloneElement(child, {
      ...props,
      ...child.props,
      className: [props.className, child.props.className]
        .filter(Boolean)
        .join(" "),
    });
  }
  return null;
}
