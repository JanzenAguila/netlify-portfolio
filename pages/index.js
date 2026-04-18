import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaFacebookF, FaGithub, FaLinkedinIn, FaMailBulk, FaMoon, FaSkype, FaSun } from 'react-icons/fa';
import styles from '@styles/Portfolio.module.css';

const experiences = require('components/JSONFiles/Experience.json');
const projects = require('components/JSONFiles/Projects.json');
const education = require('components/JSONFiles/Education.json');
const affiliations = require('components/JSONFiles/Affiliations.json');
const contacts = require('components/JSONFiles/ContactInfo.json');

const OFFICIAL_EXCLUDE_IDS = new Set(['/#freelance', '/#ics-uplb']);
const RESUME_DOWNLOAD_PATH = '/docs/JCDAguila_Resume.pdf';
const CV_DOWNLOAD_PATH = '/docs/JCDAguila_CV.pdf';

function formatDate(dateObj) {
  if (!dateObj) return 'Present';
  return `${dateObj.month} ${dateObj.year}`;
}

function formatDateRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getExperienceYears() {
  const officialExperiences = experiences.filter((item) => !OFFICIAL_EXCLUDE_IDS.has(item.id));
  const earliestYear = officialExperiences
    .map((item) => item?.start?.year)
    .filter(Boolean)
    .reduce((minYear, currentYear) => Math.min(minYear, currentYear), new Date().getFullYear());

  return Math.max(1, new Date().getFullYear() - earliestYear + 1);
}

function getTopSkills(limit = 12) {
  const counts = {};

  experiences.forEach((item) => {
    (item.technologies || []).forEach((tech) => {
      counts[tech] = (counts[tech] || 0) + 1;
    });
  });

  projects.forEach((item) => {
    (item.technologies || []).forEach((tech) => {
      counts[tech] = (counts[tech] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tech]) => tech);
}

function isShowcaseProject(project) {
  const hasPlaceholderContent = (project.description_detailed || []).some((line) => line.includes('String Test'));
  const hasSolidDescription = (project.description_detailed || []).length > 0;
  return hasSolidDescription && !hasPlaceholderContent;
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  const yearsOfExperience = getExperienceYears();
  const coreRolesCount = experiences.filter((item) => !OFFICIAL_EXCLUDE_IDS.has(item.id)).length;
  const topSkills = getTopSkills();
  const featuredProjects = projects.filter(isShowcaseProject).slice(0, 6);

  const primaryLinks = {
    email: contacts.find((item) => item.name === 'Email')?.url || 'mailto:janzenaguila@gmail.com',
    linkedin: contacts.find((item) => item.name === 'LinkedIn')?.url || 'https://www.linkedin.com/in/janzenaguila/',
    github: contacts.find((item) => item.name === 'GitHub')?.url || 'https://github.com/JanzenAguila',
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = window.localStorage.getItem('site-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const nextTheme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem('site-theme', nextTheme);
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-reveal-id');
            if (!id) return;
            setVisibleSections((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    Object.values(sectionRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const iconPicker = (icon, size = 20) => {
    if (icon === 'FaMailBulk') return <FaMailBulk size={size} />;
    if (icon === 'FaGithub') return <FaGithub size={size} />;
    if (icon === 'FaLinkedinIn') return <FaLinkedinIn size={size} />;
    if (icon === 'FaSkype') return <FaSkype size={size} />;
    if (icon === 'FaFacebookF') return <FaFacebookF size={size} />;
    return null;
  };

  const revealClass = (id) => `${styles.reveal} ${visibleSections[id] ? styles.inView : ''}`;
  const registerReveal = (id) => (node) => {
    if (node) {
      sectionRefs.current[id] = node;
    }
  };

  const heroActions = useMemo(
    () => (
      <div className={styles.heroActions}>
        <a className={styles.primaryAction} href={primaryLinks.email}>
          Email Me
        </a>
        <a className={styles.secondaryAction} href={primaryLinks.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className={styles.secondaryAction} href={primaryLinks.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className={styles.secondaryAction} href={RESUME_DOWNLOAD_PATH} download>
          Download Resume
        </a>
        <a className={styles.secondaryAction} href={CV_DOWNLOAD_PATH} download>
          Download CV
        </a>
      </div>
    ),
    [primaryLinks.email, primaryLinks.github, primaryLinks.linkedin]
  );

  return (
    <>
      <Head>
        <title>Janzen Aguila | Software Engineer</title>
        <meta
          name="description"
          content="Janzen Aguila portfolio: Software Engineer with cross-industry experience in automation, full-stack web apps, and enterprise delivery."
        />
      </Head>

      <button
        type="button"
        className={styles.themePin}
        onClick={() => setIsDarkMode((prev) => !prev)}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className={styles.themePinBalloon}>
          <FaSun className={`${styles.themeIcon} ${styles.sunIcon} ${!isDarkMode ? styles.iconVisible : ''}`} />
          <FaMoon className={`${styles.themeIcon} ${styles.moonIcon} ${isDarkMode ? styles.iconVisible : ''}`} />
        </span>
        <span className={styles.themePinLabel}>{isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}</span>
      </button>

      <div className={styles.page} data-theme={isDarkMode ? 'dark' : 'light'}>
        <main className={styles.main}>
          <section
            ref={registerReveal('hero')}
            data-reveal-id="hero"
            className={`${styles.hero} ${revealClass('hero')}`}
          >
            <div className={styles.heroIntro}>
              <p className={styles.kicker}>Software Engineer | Automation Consultant | Builder</p>
              <h1>Janzen Christian Aguila</h1>
              <p className={styles.heroCopy}>
                I design and build practical software solutions that help teams move faster, reduce repetitive work,
                and ship reliably. I blend engineering, automation, and business context to deliver useful products
                from idea to production.
              </p>
              {heroActions}
            </div>
            <div className={styles.heroImageWrap}>
              <img className={styles.heroImage} src="/profile.jpg" alt="Janzen Aguila portrait" />
            </div>
          </section>

          <section
            ref={registerReveal('stats')}
            data-reveal-id="stats"
            className={`${styles.stats} ${revealClass('stats')}`}
          >
            <article style={{ '--delay': '40ms' }}>
              <h2>{yearsOfExperience}+</h2>
              <p>years of professional software experience</p>
            </article>
            <article style={{ '--delay': '120ms' }}>
              <h2>{coreRolesCount}</h2>
              <p>core full-time roles (excluding internship and freelance)</p>
            </article>
            <article style={{ '--delay': '200ms' }}>
              <h2>Cross-Industry</h2>
              <p>delivery spanning media, enterprise, and consulting</p>
            </article>
          </section>

          <section ref={registerReveal('skills')} data-reveal-id="skills" className={`${styles.section} ${revealClass('skills')}`}>
            <h2>Core Strengths</h2>
            <p className={styles.sectionLead}>
              I work best at the intersection of software engineering, process automation, and cross-functional
              delivery.
            </p>
            <div className={styles.skillCloud}>
              {topSkills.map((skill, idx) => (
                <span key={skill} className={styles.skillChip} style={{ '--delay': `${idx * 45}ms` }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section
            ref={registerReveal('experience')}
            data-reveal-id="experience"
            className={`${styles.section} ${revealClass('experience')}`}
          >
            <h2>Recent Experience</h2>
            <div className={styles.cardGrid}>
              {experiences.map((item, idx) => (
                <article key={item.id} className={styles.card} style={{ '--delay': `${idx * 90}ms` }}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3>{item.role}</h3>
                      <p>
                        <strong>{item.name}</strong>
                      </p>
                      <p className={styles.subtle}>{formatDateRange(item.start, item.end)}</p>
                    </div>
                    <img src={`/${item.logo || 'janzen-aguila.png'}`} alt={`${item.name} logo`} className={styles.companyLogo} />
                  </div>
                  <ul>
                    {(item.description || []).map((line) => (
                      <li key={line}>
                        <span dangerouslySetInnerHTML={{ __html: line }} />
                      </li>
                    ))}
                  </ul>
                  <p className={styles.tags}>{(item.technologies || []).slice(0, 8).join(' | ')}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            ref={registerReveal('projects')}
            data-reveal-id="projects"
            className={`${styles.section} ${revealClass('projects')}`}
          >
            <h2>Selected Projects</h2>
            <div className={styles.cardGrid}>
              {featuredProjects.map((project, idx) => (
                <article key={project.name} className={styles.card} style={{ '--delay': `${idx * 90}ms` }}>
                  <h3>{project.name}</h3>
                  {project.description ? <p className={styles.subtle}>{project.description}</p> : null}
                  <ul>
                    {(project.description_detailed || []).slice(0, 2).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className={styles.tags}>{(project.technologies || []).slice(0, 6).join(' | ')}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            ref={registerReveal('edu')}
            data-reveal-id="edu"
            className={`${styles.splitSection} ${revealClass('edu')}`}
          >
            <article className={styles.panel} style={{ '--delay': '20ms' }}>
              <h2>Education</h2>
              {education.map((item, idx) => (
                <div key={item.id} className={styles.listItem} style={{ '--delay': `${(idx + 1) * 60}ms` }}>
                  <div className={styles.listWithLogo}>
                    <img src={`/${item.logo}`} alt={`${item.name} logo`} className={styles.listLogo} />
                    <div>
                      <p>
                        <strong>{item.degree}</strong>
                      </p>
                      <p>{item.name}</p>
                      <p className={styles.subtle}>{formatDateRange(item.start, item.end)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </article>

            <article className={styles.panel} style={{ '--delay': '110ms' }}>
              <h2>Leadership & Affiliations</h2>
              {affiliations.map((group, idx) => (
                <div key={group.id} className={styles.listItem} style={{ '--delay': `${(idx + 1) * 70}ms` }}>
                  <div className={styles.listWithLogo}>
                    <img src={`/${group.logo}`} alt={`${group.name} logo`} className={styles.listLogo} />
                    <div>
                      <p>
                        <strong>{group.acronym || group.name}</strong>
                      </p>
                      {(group.positions || []).map((role) => (
                        <p key={`${group.id}-${role.position}`} className={styles.subtle}>
                          {role.position} ({formatDateRange(role.duration?.start, role.duration?.end)})
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </article>
          </section>

          <section
            ref={registerReveal('contact')}
            data-reveal-id="contact"
            className={`${styles.contactSection} ${revealClass('contact')}`}
          >
            <h2>Let's Build Something Useful</h2>
            <p>
              If your team needs someone who can turn messy requirements into reliable software and automation
              workflows, I would love to connect.
            </p>
            <div className={styles.contactRow}>
              {contacts.map((item, idx) => (
                <a
                  key={item.name}
                  href={item.url}
                  target={item.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.url.startsWith('mailto:') ? undefined : 'noreferrer'}
                  aria-label={item.description}
                  title={item.description}
                  className={styles.iconButton}
                  style={{ '--delay': `${idx * 60}ms` }}
                >
                  {iconPicker(item.icon)}
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
