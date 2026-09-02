import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#leadership", label: "Leadership" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const intersecting = new Map<string, boolean>();
    let atBottom = false;

    const recompute = () => {
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }
      setActive((prev) => {
        let result = prev;
        for (const id of ids) {
          if (intersecting.get(id)) result = id;
        }
        return result;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersecting.set(entry.target.id, entry.isIntersecting);
        });
        recompute();
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      recompute();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

function useFillProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (rect.height + vh);
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}

type Role = {
  title: string;
  period: string;
  bullets: string[];
};

type ExperienceEntry = {
  org: string;
  location: string;
  roles: Role[];
};

const EXPERIENCE: ExperienceEntry[] = [
  {
    org: "Microsoft",
    location: "Redmond, WA",
    roles: [
      {
        title: "FRP Financial Analyst Intern, MCAPS Core FP&A",
        period: "May 2026 – Aug 2026",
        bullets: [
          "Built an AI-powered forecasting model using GitHub Copilot for a $30 billion business unit, back-testing it against the prior forecast to cut error by roughly 34% and save 3,400 hours annually.",
          "Delivered a self-service platform with live dashboards, scenario building, and automated data queries for the forecasting model, driving adoption across the broader finance team and its stakeholders.",
          "Built an AI agent that automated the Power BI financial reporting commentary process on a monthly cadence, shaped by direct input from finance stakeholders, saving 25 hours annually.",
        ],
      },
    ],
  },
  {
    org: "Lockheed Martin",
    location: "Orlando, FL",
    roles: [
      {
        title: "Finance Intern, Missiles and Fire Control",
        period: "May 2025 – Aug 2025",
        bullets: [
          "Contributed to long-range planning by performing financial modeling, preparing management reports, and analyzing orders, sales, profit, cash, and cost on contracts totaling over $1 billion.",
          "Supported program budgeting, scheduling, and financial planning by tracking cost performance and implementing baseline adjustments to align with financial goals.",
          "Improved financial processes by building Excel automation tools, including PivotTables and VBA macros, to streamline data reporting, maintenance, migration, and metrics analysis.",
        ],
      },
    ],
  },
  {
    org: "Mid-Atlantic Federal Credit Union",
    location: "Germantown, MD",
    roles: [
      {
        title: "Operations Support Specialist",
        period: "May 2024 – Jun 2024",
        bullets: [
          "Verified the integrity and accuracy of checks deposited via kiosk, ATM, and mobile device, identifying fraudulent activity totaling $50,000.",
          "Reconciled ATM balancing, credit card balancing/adjustments, and returned-check notices.",
          "Trained new employees on the XP Banking Platform and Fiserv Credit Solutions, along with member correspondence and information processing.",
        ],
      },
      {
        title: "Operations & Asset Protection Intern",
        period: "Aug 2022 – Jun 2023",
        bullets: [
          "Supported Asset Protection by ensuring documentation compliance, administering loan payments, verifying litigation clients, and processing delinquent payments — reducing delinquencies by 15%.",
        ],
      },
    ],
  },
  {
    org: "AO People Partners",
    location: "Bethesda, MD",
    roles: [
      {
        title: "Database Administrator",
        period: "Jun 2021 – May 2022",
        bullets: [
          "Worked with the Director of Operations to identify CRM specifications and needs.",
          "Maintained the CRM database in Excel and prepared reports on large-scale data changes.",
          "Coordinated with the Director of Operations to create workflow rules and data validation.",
        ],
      },
    ],
  },
];

type LeadershipEntry = {
  org: string;
  title: string;
  period: string;
  bullets: string[];
};

const LEADERSHIP: LeadershipEntry[] = [
  {
    org: "Villanova Business Analytics Society",
    title: "Executive Board Member (Alumni Coordinator)",
    period: "Aug 2025 – Aug 2026",
    bullets: [
      "Facilitate alumni engagement by organizing events that provide students with career insights and direct lessons in analytics tools, fostering mentorship and professional growth for 375 students.",
      "Maintain and update the alumni database to streamline communication and support sustained professional relationships between alumni and students.",
    ],
  },
  {
    org: "Villanova University",
    title: "Resident Assistant",
    period: "Aug 2024 – Present",
    bullets: [
      "Facilitated a welcoming environment within the residence halls for 38 students.",
      "Planned events to promote community, diversity, and service while exploring career opportunities.",
      "Organized and maintained records of correspondence and community engagement to support residents' well-being.",
    ],
  },
  {
    org: "Villanova Blue Key",
    title: "Tour Guide",
    period: "Oct 2024 – Present",
    bullets: [
      "Lead campus tours for prospective students and families, showcasing Villanova's academics, resources, and student life as a student ambassador.",
      "Welcomed and assisted over 4,000 attendees during large-scale events such as Admitted Students Day.",
    ],
  },
  {
    org: "Boy Scouts of America",
    title: "Eagle Scout, Senior Patrol Leader",
    period: "2016 – 2022",
    bullets: [],
  },
];

type ProjectEntry = {
  name: string;
  role: string;
  org: string;
  period?: string;
  description: string;
};

const PROJECTS: ProjectEntry[] = [
  {
    name: "Campbell's Marketing Proposal",
    role: "Project Manager",
    org: "Villanova University",
    description:
      "I led a cross-functional team in developing a strategic marketing proposal, using consumer research and industry analysis to optimize brand positioning.",
  },
  {
    name: "Sustainability Consulting Project",
    role: "Engagement Analyst",
    org: "Villanova Consulting Group",
    period: "Jan 2025 – Aug 2025",
    description:
      "I analyzed survey data in Excel, built visualizations in Tableau, and presented insights directly to the client. Working as part of a 10-person team, I helped identify growth opportunities and increase student engagement with campus sustainability initiatives.",
  },
];

const SKILLS = [
  "Corporate Finance",
  "Financial Analysis",
  "Financial Modeling",
  "Data Analysis",
  "Data Visualization",
  "SQL",
  "Tableau",
  "Microsoft Excel",
  "Market Research",
  "Marketing Strategy",
  "Claude Code",
  "GitHub Copilot",
];

type Honor = {
  title: string;
  period: string;
  description?: string;
};

const HONORS: Honor[] = [
  {
    title: "Villanova IDEA Challenge Finalist",
    period: "Nov 2023",
    description:
      "Developed a business pitch for a new innovative product aimed at solving a common problem, with a team of six.",
  },
  {
    title: "Dean's List",
    period: "Fall 2023 – Present",
  },
  {
    title: "2025 Vanguard North Star Program",
    period: "May 2025",
  },
];

export function App() {
  const activeSection = useScrollSpy(NAV_LINKS.map((link) => link.href.slice(1)));
  const experienceLine = useFillProgress<HTMLDivElement>();
  const leadershipLine = useFillProgress<HTMLDivElement>();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 881px)");
    const closeIfWide = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", closeIfWide);
    return () => mq.removeEventListener("change", closeIfWide);
  }, []);

  return (
    <div>
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-brand">
            <span className="site-brand-name">Jonah Karst</span>
            <span className="site-brand-kicker">Finance &amp; Business Analytics</span>
          </div>
          <nav className="site-nav site-nav-desktop">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.slice(1) ? "active" : ""}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="site-utility site-utility-desktop">
            <a href="/resume.pdf" download>
              Resume ↗
            </a>
            <a href="https://www.linkedin.com/in/jonah-karst/" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-toggle-bar"></span>
            <span className="menu-toggle-bar"></span>
            <span className="menu-toggle-bar"></span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)} />
          <nav className="mobile-menu">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.slice(1) ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mobile-menu-divider" />
            <div className="mobile-menu-utility">
              <a href="/resume.pdf" download onClick={() => setMenuOpen(false)}>
                Resume ↗
              </a>
              <a
                href="https://www.linkedin.com/in/jonah-karst/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                LinkedIn ↗
              </a>
            </div>
          </nav>
        </>
      )}

      <main className="page">
        <section className="hero">
          <div className="hero-frame">
            <div className="chrome-strip">
              <span className="chrome-dot"></span>
              <span className="chrome-dot"></span>
              <span className="chrome-dot"></span>
            </div>
            <div className="hero-body">
              <div className="hero-text">
                <h1 className="hero-headline">
                  I build where finance meets <em>technology.</em>
                </h1>
                <div className="hero-meta">
                  <p className="line1">Finance &amp; Business Analytics student at Villanova.</p>
                  <p className="line2">
                    Background in financial analysis at Microsoft and Lockheed Martin.
                  </p>
                </div>
              </div>
              <img className="hero-photo" src="/headshot.png" alt="Jonah Karst" />
            </div>
          </div>
          <a className="scroll-arrow" href="#about" aria-label="Scroll to About">
            <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
              <path
                d="M9 1V24M9 24L1 16M9 24L17 16"
                stroke="var(--text-faint)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </section>

        <Reveal className="section" >
          <section id="about">
            <h2 className="section-heading">About</h2>
            <p>
              I'm a Finance &amp; Business Analytics student at Villanova University, driven by a
              commitment to growth, teamwork, and integrity. That commitment has taken shape
              through internships in FP&amp;A at Microsoft and corporate finance at Lockheed
              Martin, where I've built AI-powered forecasting tools and automation that save
              teams thousands of hours a year. I'm looking for full-time roles where I can keep
              building at the intersection of finance and technology.
            </p>
          </section>
        </Reveal>

        <Reveal className="section">
          <section id="experience">
            <h2 className="section-heading">Experience</h2>
            <div className="timeline" ref={experienceLine.ref}>
              <div className="timeline-track" />
              <div className="timeline-fill" style={{ height: `${experienceLine.progress * 100}%` }} />
              {EXPERIENCE.map((entry) => (
                <div key={entry.org} className="timeline-entry">
                  <span className="timeline-dot" />
                  <div className="timeline-entry-header">
                    <h3>{entry.org}</h3>
                    <span className="timeline-location">{entry.location}</span>
                  </div>
                  {entry.roles.map((role) => (
                    <div key={role.title} className="timeline-role">
                      <div className="timeline-role-header">
                        <span className="timeline-role-title">{role.title}</span>
                        <span className="timeline-period">{role.period}</span>
                      </div>
                      <ul>
                        {role.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal className="section">
          <section id="leadership">
            <h2 className="section-heading">Leadership</h2>
            <div className="timeline" ref={leadershipLine.ref}>
              <div className="timeline-track" />
              <div className="timeline-fill" style={{ height: `${leadershipLine.progress * 100}%` }} />
              {LEADERSHIP.map((entry) => (
                <div key={entry.title} className="timeline-entry">
                  <span className="timeline-dot" />
                  <div className="timeline-entry-header">
                    <h3>{entry.org}</h3>
                    <span className="timeline-location">{entry.period}</span>
                  </div>
                  <div className="timeline-role">
                    <span className="timeline-role-title">{entry.title}</span>
                    {entry.bullets.length > 0 && (
                      <ul>
                        {entry.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal className="section">
          <section id="projects">
            <h2 className="section-heading">Projects</h2>
            <div className="card-grid">
              {PROJECTS.map((project) => (
                <div key={project.name} className="card">
                  <h3>{project.name}</h3>
                  <p className="card-meta">
                    {project.role} · {project.org}
                    {project.period ? ` · ${project.period}` : ""}
                  </p>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal className="section">
          <section id="skills">
            <h2 className="section-heading">Skills</h2>
            <div className="pill-row">
              {SKILLS.map((skill) => (
                <span key={skill} className="pill">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal className="section">
          <section id="education">
            <h2 className="section-heading">Education</h2>
            <div className="timeline-entry">
              <div className="timeline-entry-header">
                <h3>Villanova University</h3>
                <span className="timeline-location">Aug 2023 – Dec 2026</span>
              </div>
              <p className="timeline-role-title">BBA in Finance &amp; Business Analytics · 4.0 GPA</p>
            </div>
            <ul className="honors-list">
              {HONORS.map((honor) => (
                <li key={honor.title}>
                  <span className="honors-title">{honor.title}</span>{" "}
                  <span className="timeline-location">({honor.period})</span>
                  {honor.description ? <p>{honor.description}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal className="section">
          <section id="contact">
            <h2 className="section-heading">Contact</h2>
            <div className="contact-cta">
              <p>The best way to reach me is LinkedIn — I'd be glad to connect.</p>
              <a
                className="contact-button"
                href="https://www.linkedin.com/in/jonah-karst/"
                target="_blank"
                rel="noreferrer"
              >
                Connect on LinkedIn ↗
              </a>
            </div>
          </section>
        </Reveal>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Jonah Karst</p>
      </footer>
    </div>
  );
}
