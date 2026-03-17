import { Mail, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const contacts = [
  { icon: Mail, label: "Email", value: "bandirajashree744@gmail.com", href: "mailto:bandirajashree744@gmail.com", color: "text-primary" },
  { icon: Github, label: "GitHub", value: "View my repositories", href: "/github-repos", color: "text-foreground", isInternal: true },
  { icon: Linkedin, label: "LinkedIn", value: "Connect with me", href: "https://www.linkedin.com/in/bandi-rajashree-a45062207/", color: "text-primary" },
];

const Contact = () => {

  return (
    <div className="content-width page-section space-y-6">
      <div className="animate-fade-in">
        <h1>Contact</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {contacts.map(({ icon: Icon, label, value, href, color, isInternal }: any) => {
          const content = (
            <>
              <div className={`p-2 rounded-lg bg-primary/10 ${color} group-hover:bg-primary/20 transition-colors`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{value}</p>
              </div>
            </>
          );

          if (isInternal) {
            return (
              <Link
                key={label}
                to={href}
                className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel={label !== "Email" ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Contact;
