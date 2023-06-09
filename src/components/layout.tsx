import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren<object>) => {
  return (
    <main className="flex h-screen justify-center">
      <div
        className="w-full overflow-y-scroll border-x border-slate-400 md:max-w-2xl"
        id="main"
      >
        {props.children}
      </div>
    </main>
  );
};
