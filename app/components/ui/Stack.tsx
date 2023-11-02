import React from "react";
import styles from "./Stack.module.css";

type Props = { align?: { horizontally?: string; vertically?: string } };

export default function Stack({
  align,
  children,
}: React.PropsWithChildren<Props>) {
  const alignCss = {
    justifyContent: align?.horizontally,
    alignItems: align?.vertically,
  };

  return (
    <div
      className={`${styles.stack} ${align && styles.align}`}
      style={{ ...alignCss }}>
      {children}
    </div>
  );
}
