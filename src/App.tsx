const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const PROJECTS = [
  {
    name: "Project name",
    description: "One or two sentences on what it does and what you used to build it.",
    href: "#",
  },
  {
    name: "Project name",
    description: "One or two sentences on what it does and what you used to build it.",
    href: "#",
  },
];

export function App() {
  return (
    <div className="page">
      <header className="site-header">
        <span className="site-brand">Jonah Karst</span>
        <nav className="site-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Jonah Karst</h1>
          <p className="hero-tagline">Your one-line professional tagline goes here.</p>
        </section>

        <section id="about" className="section">
          <h2>About</h2>
          <p>A short paragraph about your background, what you do, and what you're looking for.</p>
        </section>

        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="card-grid">
            {PROJECTS.map((project) => (
              <a key={project.name} className="card" href={project.href}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <h2>Contact</h2>
          <p>
            <a href="mailto:jonahkarst@gmail.com">jonahkarst@gmail.com</a>
          </p>
          <p>
            <a href="https://github.com/xMrMoose" target="_blank" rel="noreferrer">
              GitHub
            </a>
            {" · "}
            <a href="#" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Jonah Karst</p>
      </footer>
    </div>
  );
}
