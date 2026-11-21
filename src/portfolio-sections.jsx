import { useRef, useState } from 'react'
import { CardTrack, FeatureCard } from './sections'
import { brandMark, LINKS, miami, highlights, experience, blog, footer } from './content'
import work from './assets/site/highlights/remote-work.avif'
import afterHours from './assets/site/highlights/dev-community.avif'
import techTambola from './assets/site/highlights/tech-tambola.avif'
import offClock from './assets/site/highlights/movie-night.avif'
import codeshor from './assets/site/experience/codeshor.avif'
import cstep from './assets/site/experience/cstep.avif'
import postOne from './assets/site/blog/post-1.avif'
import postTwo from './assets/site/blog/post-2.avif'
import postThree from './assets/site/blog/post-3.avif'

export function Miami() {
  return (
    <section id="miami" className="miami scroll-section" aria-labelledby="miami-title">
      <div className="miami-backdrop scene-backdrop" aria-hidden="true">
        <video muted playsInline preload="none" />
      </div>
      <div className="site-shell miami-copy">
        <h2 id="miami-title">{miami.title}</h2>
        <p>{miami.bio}</p>
      </div>
    </section>
  )
}

export function Highlights() {
  const images = [work, afterHours, techTambola, offClock]
  return (
    <div className="section-cards highlights">
      {highlights.map(({ category, title, description, action, link }, index) => (
        <FeatureCard key={title} image={images[index]} className="highlight-card">
          <p className="section-eyebrow">{category}</p>
          <h2>{title}</h2>
          <p>{description}</p>
          {link && <a href={LINKS[link]} className="section-action">{action}</a>}
        </FeatureCard>
      ))}
    </div>
  )
}

function CardCarousel({ id, title, viewAll, children }) {
  const track = useRef(null)
  const [expanded, setExpanded] = useState(false)

  function move(direction) {
    const row = track.current
    const cards = row.children
    if (cards.length < 2) return
    const distance = cards[1].offsetLeft - cards[0].offsetLeft
    const lastPosition = row.scrollWidth - row.clientWidth
    const position = row.scrollLeft + direction * distance
    const target = direction > 0 && row.scrollLeft >= lastPosition - 2 ? 0
      : direction < 0 && row.scrollLeft <= 2 ? lastPosition : position
    row.scrollTo({ left: target })
  }

  return (
    <section id={id} className={`site-shell collection collection-${id}`} aria-labelledby={`${id}-title`}>
      <div className="collection-header">
        <h2 id={`${id}-title`}>{title}</h2>
        <div className="collection-controls">
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${title} card`}>‹</button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${title} card`}>›</button>
          <button className="collection-all" type="button" aria-controls={`${id}-cards`}
            aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show carousel' : viewAll}
          </button>
        </div>
      </div>
      <CardTrack id={`${id}-cards`} className="collection-track" label={title} track={track} expanded={expanded}>
        {children}
      </CardTrack>
    </section>
  )
}

export function WorkExperience() {
  const images = { codeshor, cstep }
  return (
    <CardCarousel id="experience" title={experience.title} viewAll={experience.viewAll}>
      {experience.cards.map(({ id, role, organization, metadata, description }) => (
        <FeatureCard key={id} image={images[id]} className="experience-card">
          <p className="section-eyebrow">{role}</p>
          <h3>{organization}</h3>
          <p className="experience-meta">{metadata}</p>
          <p className="experience-description">{description}</p>
        </FeatureCard>
      ))}
    </CardCarousel>
  )
}

export function Blog() {
  const images = [postOne, postTwo, postThree]

  return (
    <CardCarousel id="blog" title={blog.title} viewAll={blog.viewAll}>
      {blog.posts.map(({ title, dateTime, metadata, readTime, link }, index) => (
        <article className="blog-card" key={link}>
          <a href={LINKS[link]}>
            <img src={images[index]} alt="" loading="lazy" />
            <div className="card-copy">
              <p className="blog-meta">
                <time dateTime={dateTime}>{metadata}</time>
                {readTime && <span> · {readTime}</span>}
              </p>
              <h3>{title}</h3>
            </div>
          </a>
        </article>
      ))}
    </CardCarousel>
  )
}

export function Footer() {
  const form = footer.contactForm

  return (
    <footer className="portfolio-footer">
      <div className="site-shell footer-inner">
        <a href={LINKS.home} className="footer-logo">
          <img src={brandMark} width="115" height="84" alt={footer.logoAlt} loading="lazy" />
        </a>
        <section id="contact" className="footer-contact" aria-labelledby="contact-title" tabIndex={-1}>
          <h2 id="contact-title">{footer.contactTitle}</h2>
          <p>{footer.contactDescription}</p>
          <form className="contact-form" action={LINKS.inquiry} method="post" aria-labelledby="contact-title">
            <input type="hidden" name="_subject" value={form.subject} />
            <input type="hidden" name="_template" value="table" />
            <label>
              {form.name}
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              {form.email}
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label className="contact-message">
              {form.message}
              <textarea name="message" rows={4} required />
            </label>
            <div className="contact-actions">
              <button type="submit" className="section-action">{form.submit}</button>
              <a href={LINKS.booking} className="section-action contact-booking">{footer.bookingAction}</a>
            </div>
          </form>
        </section>
        <div className="footer-meta">
          <nav className="footer-directories" aria-label="Footer links">
            {['socials', 'links'].map((group) => (
              <ul key={group}>
                {footer[group].map(({ label, link }) => (
                  <li key={link}><a href={LINKS[link]}>{label}</a></li>
                ))}
              </ul>
            ))}
          </nav>
          <div className="footer-rating">
            <strong>{footer.rating}</strong>
            <p>{footer.ratingNote}</p>
          </div>
        </div>
        <small>{footer.copyright}</small>
      </div>
    </footer>
  )
}
