import { authStyles } from "./styles";


export function AuthContainer({ children }: { children: React.ReactNode }) {
  const { container, content } = authStyles();
  return (
    <div className={container()}>
      <div className={content()}>
        {children}
      </div>
    </div>
  );
}