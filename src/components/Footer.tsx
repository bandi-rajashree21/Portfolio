const Footer = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="content-width py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Bandi Rajashree. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/bandi-rajashree21"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/bandi-rajashree-a45062207/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
