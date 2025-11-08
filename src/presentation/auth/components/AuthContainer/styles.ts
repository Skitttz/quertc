import { tv } from "tailwind-variants";

const authStyles = tv({
  slots: {
    container: "min-h-screen flex flex-col justify-center items-center",
    content: "w-full max-w-md rounded-lg",
  },
});

export { authStyles };
