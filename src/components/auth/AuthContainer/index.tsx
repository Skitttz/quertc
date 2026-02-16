import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AppRoutesEnum } from "@/shared/route";
import { authStyles } from "./styles";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  const { container, content, linkItem, containerLink, icon } = authStyles();
  return (
    <div className={container()}>
      <div className={containerLink()}>
        <Link href={AppRoutesEnum.HOME} className={linkItem()}>
          <ArrowLeft size={18} className={icon()} />
          Voltar para Página Inicial
        </Link>
      </div>

      <div className={content()}>{children}</div>
    </div>
  );
}
