import { tv } from "tailwind-variants";

const authStyles = tv({
  slots: {
    container: "min-h-screen flex flex-col justify-center items-center",
    content: "w-full max-w-md rounded-lg",
    linkItem:
      "group inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-lg px-2 py-1",
    icon: "transition-transform group-hover:-translate-x-1",
    containerLink: "absolute top-6 left-6",
  },
});

export { authStyles };
