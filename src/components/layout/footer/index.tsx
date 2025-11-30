import { LinkScrollTo } from "@/components/landing/link";
import { COMPANY_LINKS } from "./constants";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-700">
            © {currentYear} quertc. Todos os direitos reservados.
          </p>
          <nav aria-label="Links de apoio">
            <ul className="flex items-center gap-6">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <LinkScrollTo
                    href={item.href}
                    isRedirect={item.isRedirect}
                    label={item.label}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
