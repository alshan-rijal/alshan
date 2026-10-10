import { useMemo } from 'react'
import ContactForm from '../components/ContactForm'
import profile from '../data/profile.json'
import projects from '../data/projects.json'
import education from '../data/education.json'
import techStack from '../data/techStack.json'

const formatProjectLinks = (project) => {
  const links = []
  if (project.liveUrl && project.liveUrl !== '#') links.push({ label: 'Live', href: project.liveUrl })
  if (project.githubUrl && project.githubUrl !== '#') links.push({ label: 'Code', href: project.githubUrl })
  return links
}

function SectionKicker({ label }) {
  return <p className="section-kicker">{label}</p>
}

function InlineMark() {
  return (
    <span className="mark" aria-hidden="true">
      <span className="dot" />
    </span>
  )
}

function SocialLink({ platform, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={platform} className="social-link">
      {platform}
    </a>
  )
}

function ProjectPreview({ project }) {
  return (
    <article className="project-row" key={project.id}>
      <div className="project-meta">
        <span className="project-number">{String(project.id).slice(0, 2).toUpperCase()}</span>
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      </div>
      <div className="project-stack">{project.techStack.join(' / ')}</div>
      <div className="project-links">
        {formatProjectLinks(project).map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
      <span className="marker" aria-hidden="true" />
    </article>
  )
}

export default function HomePage() {
  const projectRows = useMemo(() => projects.filter((project) => project.title !== 'Will be uploaded soon'), [])

  return (
    <>
      <section id="home" className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="open-line">
              <InlineMark />
              <span>Open to work</span>
            </div>

            <h1 aria-label="Alshan Rijal" className="hero-title">
              <span className="title-plain">Alshan</span>
              <span className="title-outline">Rijal</span>
            </h1>

            <p className="eyebrow">AI / ML + Cloud</p>

            <p className="summary">
              Software engineer from Itahari, Nepal, building AI/ML and cloud projects with
              Python and the MERN stack.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#projects">
                View projects
              </a>
              <a className="link-button" href="/resume.pdf" download>
                Download CV
              </a>
            </div>
          </div>

          <aside className="ledger" aria-label="Now ledger">
            <div className="ledger-row">
              <span>Focus</span>
              <strong>AI/ML and cloud</strong>
            </div>
            <div className="ledger-row">
              <span>Stack</span>
              <strong>Python, MERN, AWS</strong>
            </div>
            <div className="ledger-row">
              <span>Based in</span>
              <strong>Itahari, Nepal</strong>
            </div>
            <div className="ledger-row">
              <span>Status</span>
              <strong>
                <span className="status-dot" aria-hidden="true" />
                Open to work
              </strong>
            </div>
          </aside>
        </div>

        <div className="container stats-strip">
          <div>
            <span>Years learning</span>
            <strong>4+</strong>
          </div>
          <div>
            <span>Internships</span>
            <strong>2</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>Nepal</strong>
          </div>
        </div>
      </section>

      <section id="about" className="section-block">
        <div className="container">
          <div className="section-heading">
            <SectionKicker label="About" />
            <h2>Soft edges, sharp thinking.</h2>
          </div>

          <div className="two-column editorial">
            <div className="facts-box">
              <ul>
                <li>
                  <span>Role</span>
                  <strong>{profile.role}</strong>
                </li>
                <li>
                  <span>Location</span>
                  <strong>{profile.location}</strong>
                </li>
                <li>
                  <span>Email</span>
                  <strong>{profile.contact.email}</strong>
                </li>
              </ul>
            </div>
            <div className="editorial-copy">
              <p>{profile.bio}</p>
              <div className="focus-tags">
                {profile.focusAreas.map((area) => (
                  <span key={area.label}>{area.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section-block">
        <div className="container">
          <div className="section-heading">
            <SectionKicker label="Skills" />
            <h2>Tools I shape products with.</h2>
          </div>

          <div className="skills-grid">
            {techStack.map((group) => (
              <div key={group.category} className="skill-group">
                <h3>{group.category}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.name}>{item.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section-block">
        <div className="container">
          <div className="section-heading">
            <SectionKicker label="Projects" />
            <h2>Selected work.</h2>
          </div>

          <div className="project-list">
            {projectRows.map((project) => (
              <ProjectPreview key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="section-block">
        <div className="container">
          <div className="section-heading">
            <SectionKicker label="Education" />
            <h2>Where I learned.</h2>
          </div>

          <ol className="timeline">
            {education.map((item) => (
              <li key={`${item.role}-${item.org}`} className="timeline-item">
                <div className="timeline-date">{item.period}</div>
                <div className="timeline-content">
                  <h3>{item.role}</h3>
                  <p>{item.org}</p>
                  <span>{item.description}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="section-block contact-section">
        <div className="container contact-wrap">
          <div className="contact-intro">
            <SectionKicker label="Contact" />
            <h2>Let’s build something useful.</h2>
            <a href={`mailto:${profile.contact.email}`} className="email-link">
              {profile.contact.email}
            </a>
            <div className="social-list">
              {profile.contact.socials.map((social) => (
                <SocialLink key={social.platform} platform={social.platform} href={social.url} />
              ))}
            </div>
          </div>

          <div className="contact-card">
            <ContactForm />
          </div>
        </div>
      </section>

    </>
  )
}
