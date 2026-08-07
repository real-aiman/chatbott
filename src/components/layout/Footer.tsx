import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-4 mt-24 mb-6 lg:mx-auto lg:max-w-6xl">
      <div className="glass rounded-2xl px-6 py-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500">
                <Sparkles size={16} className="text-white" />
              </span>
              Chatty
            </Link>

            <p className="mt-3 text-sm text-zinc-400">
              A premium AI assistant that lives entirely in your browser — no
              servers, no waiting rooms, just you and the model.
            </p>

            <div className="mt-4 flex gap-3 text-zinc-400">
              <a
                href="#"
                aria-label="GitHub"
                className="transition-colors hover:text-violet-500"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="#"
                aria-label="X"
                className="transition-colors hover:text-violet-500"
              >
                <FaXTwitter size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="transition-colors hover:text-violet-500"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              ["Features", "/features"],
              ["Pricing", "/pricing"],
              ["Chat", "/chat"],
              ["Settings", "/settings"],
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              ["About", "/about"],
              ["FAQ", "/faq"],
              ["Contact", "/contact"],
            ]}
          />

          <FooterCol
            title="Legal"
            links={[
              ["Privacy", "/faq"],
              ["Terms", "/faq"],
              ["Security", "/faq"],
            ]}
          />
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Chatty. Crafted entirely on the
          frontend — no backend, no tracking.
        </div>
      </div>
    </footer>
  );
}

type FooterColProps = {
  title: string;
  links: [string, string][];
};

function FooterCol({ title, links }: FooterColProps) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-300">
        {title}
      </h4>

      <ul className="space-y-2 text-sm text-zinc-400">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link
              to={to}
              className="transition-colors hover:text-violet-500"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;