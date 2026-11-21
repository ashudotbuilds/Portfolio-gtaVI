import { useEffect, useRef, useState } from 'react'
import Cal from '@calcom/embed-react'
import { CardTrack, FeatureCard } from './sections'
import { brandMark, LINKS, miami, highlights, experience, blog, footer } from './content'
import { fetchBlogPosts } from './hashnode'
import work from './assets/site/highlights/remote-work.avif'
import afterHours from './assets/site/highlights/dev-community.avif'
import techTambola from './assets/site/highlights/tech-tambola.avif'
import offClock from './assets/site/highlights/movie-night.avif'
import codeshor from './assets/site/experience/codeshor.avif'
import cstep from './assets/site/experience/cstep.avif'
import postOne from './assets/site/blog/post-1.avif'
import postTwo from './assets/site/blog/post-2.avif'
import postThree from './assets/site/blog/post-3.avif'

const blogCovers = {
  [LINKS.machinePost]: postOne,
  [LINKS.certificatesPost]: postTwo,
  [LINKS.llmsPost]: postThree,
}

const fallbackPosts = blog.posts.map((post) => ({ ...post, url: LINKS[post.link] }))

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
  const [posts, setPosts] = useState(fallbackPosts)

  useEffect(() => {
    const controller = new AbortController()

    fetchBlogPosts(controller.signal).then((latestPosts) => {
      if (!controller.signal.aborted && latestPosts.length) setPosts(latestPosts)
    }).catch(() => {
      // Keep the bundled cards when Hashnode is unavailable.
    })

    return () => controller.abort()
  }, [])

  return (
    <CardCarousel id="blog" title={blog.title} viewAll={blog.viewAll}>
      {posts.map(({ title, dateTime, metadata, readTime, url, image }) => (
        <article className="blog-card" key={url}>
          <a href={url}>
            <div className="blog-cover" aria-hidden="true">
              {(image || blogCovers[url]) && (
                <img src={image || blogCovers[url]} alt="" loading="lazy" onError={(event) => {
                  const img = event.currentTarget
                  if (blogCovers[url] && img.getAttribute('src') !== blogCovers[url]) {
                    img.src = blogCovers[url]
                  } else {
                    img.hidden = true
                  }
                }} />
              )}
            </div>
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

const bookingLink = new URL(LINKS.booking).pathname.slice(1)
const bookingConfig = { theme: 'dark' }

function FooterContact() {
  const copy = footer.contactForm
  const [status, setStatus] = useState('idle')
  const [bookingOpen, setBookingOpen] = useState(false)
  const sending = status === 'sending'

  async function sendInquiry(event) {
    event.preventDefault()
    if (sending) return

    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    setStatus('sending')

    try {
      const response = await fetch(LINKS.inquiry, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const result = await response.json()
      if (!response.ok || (result?.success !== true && result?.success !== 'true')) {
        setStatus('error')
        return
      }

      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="footer-contact" aria-labelledby="contact-title" tabIndex={-1}>
      <h2 id="contact-title">{footer.contactTitle}</h2>
      <p>{footer.contactDescription}</p>
      <form className="contact-form" onSubmit={sendInquiry} aria-labelledby="contact-title">
        <input type="hidden" name="_subject" value={copy.subject} />
        <input type="hidden" name="_template" value="table" />
        <input type="text" name="_honey" autoComplete="off" hidden />
        <label>
          {copy.name}
          <input name="name" autoComplete="name" readOnly={sending} required />
        </label>
        <label>
          {copy.email}
          <input type="email" name="email" autoComplete="email" readOnly={sending} required />
        </label>
        <label className="contact-message">
          {copy.message}
          <textarea name="message" rows={4} readOnly={sending} required />
        </label>
        <div className="contact-actions">
          <button type="submit" className="section-action" disabled={sending}>
            {sending ? copy.sending : copy.submit}
          </button>
          <button type="button" className="section-action contact-booking"
            aria-expanded={bookingOpen} aria-controls="contact-booking" onClick={() => setBookingOpen(!bookingOpen)}>
            {footer.bookingAction}
          </button>
        </div>
        <div className="contact-status" role="status">
          {status === 'sent' && copy.sent}
          {status === 'error' && copy.error}
        </div>
      </form>
      <div id="contact-booking" className="contact-scheduler" hidden={!bookingOpen}>
        {bookingOpen && <Cal calLink={bookingLink} config={bookingConfig} />}
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="site-shell footer-inner">
        <a href={LINKS.home} className="footer-logo">
          <img src={brandMark} width="115" height="84" alt={footer.logoAlt} loading="lazy" />
        </a>
        <FooterContact />
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
