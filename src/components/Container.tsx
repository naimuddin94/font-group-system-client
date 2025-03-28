import { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-8">{children}</div>
  );
}

export default Container;
