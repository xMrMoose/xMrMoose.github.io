import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollMotion } from "./useScrollMotion.js";
import type { MotionRefs, ScrubEntry } from "./useScrollMotion.js";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#leadership", label: "Leadership" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

type BulletPart = string | { impact: string };
type Bullet = BulletPart[];

type Role = {
  title: string;
  period: string;
  bullets: Bullet[];
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
          [
            "Built an AI-powered forecasting model using GitHub Copilot for a ",
            { impact: "$30 billion" },
            " business unit, back-testing it against the prior forecast to cut error by roughly ",
            { impact: "34%" },
            " and save ",
            { impact: "400 hours" },
            " annually.",
          ],
          [
            "Delivered a self-service platform with live dashboards, scenario building, and automated data queries for the forecasting model, driving adoption across the broader finance team and its stakeholders.",
          ],
          [
            "Built an AI agent that automated the Power BI financial reporting commentary process on a monthly cadence, shaped by direct input from finance stakeholders, saving ",
            { impact: "25 hours" },
            " annually.",
          ],
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
          [
            "Contributed to long-range planning by performing financial modeling, preparing management reports, and analyzing orders, sales, profit, cash, and cost on contracts totaling over ",
            { impact: "$1 billion" },
            ".",
          ],
          [
            "Supported program budgeting, scheduling, and financial planning by tracking cost performance and implementing baseline adjustments to align with financial goals.",
          ],
          [
            "Improved financial processes by building Excel automation tools, including PivotTables and VBA macros, to streamline data reporting, maintenance, migration, and metrics analysis.",
          ],
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
          [
            "Verified the integrity and accuracy of checks deposited via kiosk, ATM, and mobile device, identifying fraudulent activity totaling ",
            { impact: "$50,000" },
            ".",
          ],
          ["Reconciled ATM balancing, credit card balancing/adjustments, and returned-check notices."],
          [
            "Trained new employees on the XP Banking Platform and Fiserv Credit Solutions, along with member correspondence and information processing.",
          ],
        ],
      },
      {
        title: "Operations & Asset Protection Intern",
        period: "Aug 2022 – Jun 2023",
        bullets: [
          [
            "Supported Asset Protection by ensuring documentation compliance, administering loan payments, verifying litigation clients, and processing delinquent payments — reducing delinquencies by ",
            { impact: "15%" },
            ".",
          ],
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
          ["Worked with the Director of Operations to identify CRM specifications and needs."],
          ["Maintained the CRM database in Excel and prepared reports on large-scale data changes."],
          ["Coordinated with the Director of Operations to create workflow rules and data validation."],
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
  tone: "red" | "green";
};

const PROJECTS: ProjectEntry[] = [
  {
    name: "Campbell's Marketing Proposal",
    role: "Project Manager",
    org: "Villanova University",
    description:
      "I led a cross-functional team in developing a strategic marketing proposal, using consumer research and industry analysis to optimize brand positioning.",
    tone: "red",
  },
  {
    name: "Sustainability Consulting Project",
    role: "Engagement Analyst",
    org: "Villanova Consulting Group",
    period: "Jan 2025 – Aug 2025",
    description:
      "I analyzed survey data in Excel, built visualizations in Tableau, and presented insights directly to the client. Working as part of a 10-person team, I helped identify growth opportunities and increase student engagement with campus sustainability initiatives.",
    tone: "green",
  },
];

const SKILLS_ROW_1 = ["Corporate Finance", "Financial Analysis", "Financial Modeling", "Data Analysis", "Data Visualization", "SQL"];
const SKILLS_ROW_2 = ["Tableau", "Microsoft Excel", "Market Research", "Marketing Strategy", "Claude Code", "GitHub Copilot"];

const EDU_CHIPS: { text: string; tone: "blue" | "green" | "red" }[] = [
  { text: "Dean's List · Fall 2023 – Present", tone: "blue" },
  { text: "IDEA Challenge Finalist · Nov 2023", tone: "green" },
  { text: "Vanguard North Star Program · May 2025", tone: "red" },
];

const EXP_CARD_SCRUB_INDEX = [0.2, 0.35, 0.5, 0.65];

const EDU_FOOTNOTE =
  "Villanova IDEA Challenge: developed a business pitch for a new innovative product aimed at solving a common problem, with a team of six.";

function renderBullet(parts: Bullet) {
  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <strong key={i} className="impact-figure">
        {part.impact}
      </strong>
    ),
  );
}

function arrayRef<T>(ref: { current: (T | null)[] }, index: number) {
  return (el: T | null) => {
    ref.current[index] = el;
  };
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileActive, setMobileActive] = useState("about");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const closeIfWide = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", closeIfWide);
    return () => mq.removeEventListener("change", closeIfWide);
  }, []);

  const navRef = useRef<HTMLElement>(null);
  const navProgressRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const heroPhotoRef = useRef<HTMLImageElement>(null);
  const scrollArrowRef = useRef<HTMLAnchorElement>(null);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrubsRef = useRef<Map<string, ScrubEntry>>(new Map());
  const expTimelineRef = useRef<HTMLDivElement>(null);
  const expFillRef = useRef<HTMLDivElement>(null);
  const expDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const expCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eduSectionRef = useRef<HTMLElement | null>(null);
  const eduSweepRef = useRef<HTMLDivElement>(null);
  const gpaRef = useRef<HTMLDivElement>(null);
  const skillDriftRef = useRef<HTMLDivElement>(null);
  const skillRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const projGridRef = useRef<HTMLDivElement>(null);
  const projCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());

  const motionRefs = useMemo<MotionRefs>(
    () => ({
      nav: navRef,
      navProgress: navProgressRef,
      navLinks: navLinksRef,
      heroFrame: heroFrameRef,
      heroPhoto: heroPhotoRef,
      scrollArrow: scrollArrowRef,
      glows: glowRefs,
      scrubs: scrubsRef,
      expTimeline: expTimelineRef,
      expFill: expFillRef,
      expDots: expDotRefs,
      expCards: expCardRefs,
      eduSection: eduSectionRef,
      eduSweep: eduSweepRef,
      gpa: gpaRef,
      skillDrift: skillDriftRef,
      skillRows: skillRowRefs,
      projGrid: projGridRef,
      projCards: projCardRefs,
      sections: sectionsRef,
    }),
    [],
  );

  useScrollMotion(motionRefs, setMobileActive);

  function sectionRef(id: string) {
    return (el: HTMLElement | null) => {
      if (el) sectionsRef.current.set(id, el);
      else sectionsRef.current.delete(id);
    };
  }

  function navLinkRef(id: string) {
    return (el: HTMLAnchorElement | null) => {
      if (el) navLinksRef.current.set(id, el);
      else navLinksRef.current.delete(id);
    };
  }

  function scrubRef(key: string, index: number, win = 0.7) {
    return (el: HTMLElement | null) => {
      if (el) scrubsRef.current.set(key, { el, index, window: win });
      else scrubsRef.current.delete(key);
    };
  }

  return (
    <div>
      <div className="backdrop">
        <div className="backdrop-layer backdrop-layer-1" ref={arrayRef(glowRefs, 0)} />
        <div className="backdrop-layer backdrop-layer-2" ref={arrayRef(glowRefs, 1)} />
        <div className="backdrop-layer backdrop-layer-3" ref={arrayRef(glowRefs, 2)} />
        <div className="backdrop-layer backdrop-layer-grid" ref={arrayRef(glowRefs, 3)} />
      </div>

      <header className="site-header" ref={navRef}>
        <div className="site-header-inner">
          <div className="site-nav-progress" ref={navProgressRef} />
          <div className="site-brand">
            <span className="site-brand-name">Jonah Karst</span>
            <span className="site-brand-kicker">Finance &amp; Business Analytics</span>
          </div>
          <nav className="site-nav site-nav-desktop">
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              return (
                <a key={link.href} href={link.href} ref={navLinkRef(id)}>
                  {link.label}
                </a>
              );
            })}
          </nav>
          <div className="site-utility site-utility-desktop">
            <a className="resume-link" href="/resume.pdf" download>
              Resume ↗
            </a>
            <a className="linkedin-link" href="https://www.linkedin.com/in/jonah-karst/" target="_blank" rel="noreferrer">
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
            {NAV_LINKS.map((link) => {
              const id = link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={mobileActive === id ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
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

      <main>
        <section className="hero-stage">
          <div className="hero-sticky">
            <div className="hero-frame-wrap">
              <div className="hero-frame" ref={heroFrameRef}>
                <div className="hero-chrome">
                  <span className="hero-chrome-dot red" />
                  <span className="hero-chrome-dot green" />
                  <span className="hero-chrome-dot blue" />
                  <span className="hero-ticker">
                    <span className="hero-ticker-fin">FIN</span> × <span className="hero-ticker-tech">TECH</span>
                  </span>
                </div>
                <div className="hero-body">
                  <div className="hero-text">
                    <h1 className="hero-headline">
                      <span className="hero-headline-line hero-headline-line-1">I build where finance meets</span>
                      <span className="hero-headline-line hero-headline-line-2">
                        <em>technology.</em>
                      </span>
                    </h1>
                    <div className="hero-subcopy">
                      <p className="line1">Finance &amp; Business Analytics student at Villanova.</p>
                      <p className="line2">Background in financial analysis at Microsoft and Lockheed Martin.</p>
                    </div>
                  </div>
                  <img className="hero-photo" src="/headshot.png" alt="Jonah Karst" ref={heroPhotoRef} />
                </div>
              </div>
            </div>
            <a className="scroll-arrow" href="#about" aria-label="Scroll to About" ref={scrollArrowRef}>
              <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
                <path
                  d="M9 1V24M9 24L1 16M9 24L17 16"
                  stroke="oklch(60% 0.006 250)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>

        <section id="about" className="content-section" ref={sectionRef("about")}>
          <h2 className="section-heading" ref={scrubRef("about-h2", 0)}>
            <span className="section-chip blue" />
            About
          </h2>
          <p className="about-copy" ref={scrubRef("about-p", 1)}>
            I'm a Finance &amp; Business Analytics student at Villanova University, driven by a commitment to
            growth, teamwork, and integrity. That commitment has taken shape through internships in FP&amp;A at
            Microsoft and corporate finance at Lockheed Martin, where I've built AI-powered forecasting tools and
            automation that save teams thousands of hours a year. I'm looking for full-time roles where I can keep
            building at the intersection of finance and technology.
          </p>
        </section>

        <section
          id="education"
          className="content-section content-section-tall"
          ref={(el: HTMLElement | null) => {
            sectionRef("education")(el);
            eduSectionRef.current = el;
          }}
        >
          <h2 className="section-heading" ref={scrubRef("edu-h2", 0)}>
            <span className="section-chip red" />
            Education
          </h2>

          <div className="edu-card" ref={scrubRef("edu-card", 0.6)}>
            <div className="edu-sweep" ref={eduSweepRef} />
            <div className="edu-card-top">
              <div>
                <p className="edu-kicker">Senior · Graduating Dec 2026</p>
                <h3 className="edu-school">Villanova University</h3>
                <p className="edu-degree">
                  BBA in <em>Finance &amp; Business Analytics</em>
                </p>
              </div>
              <div className="edu-stats">
                <div>
                  <div className="edu-stat-value blue" ref={gpaRef}>
                    0.0
                  </div>
                  <div className="edu-stat-label">Cumulative GPA</div>
                </div>
                <div>
                  <div className="edu-stat-value red">6</div>
                  <div className="edu-stat-label">Semesters Dean's List</div>
                </div>
              </div>
            </div>
            <div className="edu-honors">
              {EDU_CHIPS.map((chip, i) => (
                <span key={chip.text} className={`edu-chip ${chip.tone}`} ref={scrubRef(`edu-chip-${i}`, 1 + i * 0.3)}>
                  {chip.text}
                </span>
              ))}
            </div>
          </div>

          <p className="edu-footnote" ref={scrubRef("edu-footnote", 2)}>
            {EDU_FOOTNOTE}
          </p>
        </section>

        <section
          id="experience"
          className="content-section content-section-tall"
          ref={sectionRef("experience")}
        >
          <div className="experience-header">
            <h2 className="section-heading" ref={scrubRef("exp-h2", 0)}>
              <span className="section-chip blue" />
              Experience
            </h2>
            <span className="experience-count" ref={scrubRef("exp-count", 0.25)}>
              04 ROLES · 2021 – 2026
            </span>
          </div>
          <div className="timeline" ref={expTimelineRef}>
            <div className="timeline-track" />
            <div className="timeline-fill" ref={expFillRef} />
            {EXPERIENCE.map((entry, cardIndex) => (
              <article
                key={entry.org}
                className="exp-card"
                ref={(el: HTMLDivElement | null) => {
                  expCardRefs.current[cardIndex] = el;
                  scrubRef(`exp-card-${cardIndex}`, EXP_CARD_SCRUB_INDEX[cardIndex], 1.35)(el);
                }}
              >
                <span className="exp-dot" ref={arrayRef(expDotRefs, cardIndex)} />
                <div className="exp-card-top">
                  <h3>{entry.org}</h3>
                  <span className="exp-location">{entry.location}</span>
                </div>
                {entry.roles.map((role) => (
                  <div key={role.title} className="exp-role">
                    <div className="exp-role-header">
                      <span className="exp-role-title">{role.title}</span>
                      <span className="exp-period">{role.period}</span>
                    </div>
                    <ul>
                      {role.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{renderBullet(bullet)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section id="leadership" className="content-section" ref={sectionRef("leadership")}>
          <h2 className="section-heading" ref={scrubRef("lead-h2", 0)}>
            <span className="section-chip green" />
            Leadership
          </h2>
          <div className="leadership-list">
            {LEADERSHIP.map((entry, i) => (
              <div key={entry.title} className="leadership-entry" ref={scrubRef(`lead-entry-${i}`, i + 1)}>
                <span className="leadership-date">{entry.period}</span>
                <div>
                  <h3 className="leadership-role">{entry.title}</h3>
                  <p className="leadership-org">{entry.org}</p>
                  {entry.bullets.length > 0 && (
                    <ul className="leadership-bullets">
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

        <section id="projects" className="content-section" ref={sectionRef("projects")}>
          <h2 className="section-heading" ref={scrubRef("proj-h2", 0)}>
            <span className="section-chip red" />
            Projects
          </h2>
          <div className="project-grid" ref={projGridRef}>
            {PROJECTS.map((project, i) => (
              <div key={project.name} className={`project-card ${project.tone}`} ref={arrayRef(projCardRefs, i)}>
                <h3>{project.name}</h3>
                <p className={`project-kicker ${project.tone}`}>
                  {project.role} · {project.org}
                  {project.period ? ` · ${project.period}` : ""}
                </p>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="content-section" ref={sectionRef("skills")}>
          <h2 className="section-heading" ref={scrubRef("skills-h2", 0)}>
            <span className="section-chip green" />
            Skills
          </h2>
          <div className="skills-wrap" ref={skillDriftRef}>
            <div className="skills-row skills-row-0" ref={arrayRef(skillRowRefs, 0)}>
              {SKILLS_ROW_1.map((skill, i) => (
                <span key={skill} className="skill-chip" ref={scrubRef(`skill-${skill}`, 1 + i * 0.4)}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="skills-row skills-row-1" ref={arrayRef(skillRowRefs, 1)}>
              {SKILLS_ROW_2.map((skill, i) => (
                <span key={skill} className="skill-chip" ref={scrubRef(`skill-${skill}`, 3.4 + i * 0.4)}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="content-section" ref={sectionRef("contact")}>
          <h2 className="section-heading" ref={scrubRef("contact-h2", 0)}>
            <span className="section-chip red" />
            Contact
          </h2>
          <div className="contact-block">
            <p className="contact-copy" ref={scrubRef("contact-p", 1)}>
              The best way to reach me is LinkedIn — I'd be glad to connect.
            </p>
            <a
              className="contact-button"
              href="https://www.linkedin.com/in/jonah-karst/"
              target="_blank"
              rel="noreferrer"
              ref={scrubRef("contact-a", 2)}
            >
              Connect on LinkedIn ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Jonah Karst</p>
      </footer>
    </div>
  );
}
