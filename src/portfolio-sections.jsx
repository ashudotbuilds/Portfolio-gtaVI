import { useRef, useState } from 'react'
import { FeatureCard } from './sections'
import { LINKS, hero, miami, highlights, clients, blog, footer } from './content'
import work from './assets/site/highlights/open-to-work.avif'
import afterHours from './assets/site/highlights/after-hours.avif'
import heist from './assets/site/highlights/the-heist.avif'
import clientArt from './assets/site/clients/clients.avif'
import reviewArt from './assets/site/clients/testimonial.avif'
import postOne from './assets/site/blog/post-1.avif'
import postTwo from './assets/site/blog/post-2.avif'
import postThree from './assets/site/blog/post-3.avif'
import logo from './assets/site/footer/logo.avif'

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
  const images = [work, afterHours, heist]
  return (
    <div className="section-cards highlights">
      {highlights.map(({ category, title, description, action, link }, index) => (
        <FeatureCard key={title} image={images[index]} className="highlight-card">
          <p className="section-eyebrow">{category}</p>
          <h2>{title}</h2>
          <p>{description}</p>
          {link ? (
            <a href={LINKS[link]} className="section-action">{action}</a>
          ) : (
            <a href={images[index]} className="section-action">{action}</a>
          )}
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
      <div id={`${id}-cards`} className="collection-track" ref={track} data-expanded={expanded}>
        {children}
      </div>
    </section>
  )
}

export function Clients() {
  const images = [clientArt, reviewArt]
  return (
    <CardCarousel id="clients" title={clients.title} viewAll={clients.viewAll}>
      {clients.cards.map(({ category, title, action }, index) => (
        <FeatureCard key={title} image={images[index]} className="client-card">
          <p className="section-eyebrow">{category}</p>
          <h3>{title}</h3>
          <a className="section-action" href={images[index]}>{action}</a>
        </FeatureCard>
      ))}
    </CardCarousel>
  )
}

export function Blog() {
  const images = [postOne, postTwo, postThree]
  return (
    <CardCarousel id="blog" title={blog.title} viewAll={blog.viewAll}>
      {blog.posts.map(({ title, date, displayDate }, index) => (
        <article className="blog-card" key={title}>
          <img src={images[index]} alt="" loading="lazy" />
          <div className="card-copy">
            <time dateTime={date}>{displayDate}</time>
            <h3>{title}</h3>
          </div>
        </article>
      ))}
    </CardCarousel>
  )
}

export function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="site-shell footer-inner">
        <a href={LINKS.home} className="footer-logo"><img src={logo} alt={hero.title} loading="lazy" /></a>
        <details className="footer-build">
          <summary>
            <strong>{footer.title}</strong>
            <span>{footer.description}</span>
          </summary>
          <ol>{footer.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </details>
        <div className="footer-meta">
          <div className="footer-directories">
            <ul>{footer.socials.map((label) => <li key={label}>{label}</li>)}</ul>
            <ul>{footer.links.map((label) => <li key={label}>{label}</li>)}</ul>
          </div>
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
