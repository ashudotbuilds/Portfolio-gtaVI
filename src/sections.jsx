import { Children, useRef, useState } from 'react'
import scene from './assets/site/meet-the-developer/scene.avif'
import portraitScene from './assets/site/meet-the-developer/scene-portrait.avif'
import featured from './assets/site/meet-the-developer/project-showcase-desktop.avif'
import featuredMobile from './assets/site/meet-the-developer/project-showcase-mobile.avif'
import monsterCard from './assets/site/meet-the-developer/monster-app.avif'
import ticketCard from './assets/site/meet-the-developer/book-my-ticket.avif'
import portfolioCard from './assets/site/meet-the-developer/portfolio-website.avif'
import rescueArt from './assets/site/services/card-tall-desktop.avif'
import rescueMobile from './assets/site/services/card-tall-mobile.avif'
import buildsArt from './assets/site/services/card-short.avif'
import { LINKS, meet, services } from './content'

const projectImages = { monster: monsterCard, ticket: ticketCard, portfolio: portfolioCard }

export function FeatureCard({ image, className, href, children }) {
  const Card = href ? 'a' : 'article'

  return (
    <Card className={`feature-card ${className}`} href={href}>
      <img src={image} alt="" loading="lazy" />
      <div className="card-copy">{children}</div>
    </Card>
  )
}

export function CardTrack({ id, className, label, track, expanded = false, children }) {
  const [current, setCurrent] = useState(0)
  const count = Children.count(children)

  function updateCurrent({ currentTarget: row }) {
    if (count < 2) return
    const distance = row.children[1].offsetLeft - row.children[0].offsetLeft
    if (distance > 0) setCurrent(Math.round(row.scrollLeft / distance))
  }

  function selectCard(index) {
    const row = track.current
    row.scrollTo({ left: row.children[index].offsetLeft - row.children[0].offsetLeft })
  }

  return (
    <>
      <div id={id} ref={track} className={className} data-expanded={expanded} onScroll={updateCurrent}>
        {children}
      </div>
      {count > 1 && <div className="carousel-pagination" role="group" aria-label={label}>
        {Array.from({ length: count }, (_, index) => (
          <button key={index} type="button" onClick={() => selectCard(index)}
            aria-label={`${index + 1} / ${count}`} aria-current={current === index ? 'true' : undefined}
            aria-controls={id} />
        ))}
      </div>}
    </>
  )
}

export function MeetDeveloper() {
  const projects = useRef(null)

  return (
    <section className="meet scroll-section" aria-labelledby="meet-title">
      <div className="meet-scene scene-backdrop">
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet={portraitScene} />
          <img src={scene} alt="" />
        </picture>
        <div className="meet-heading">
          <h2 id="meet-title">{meet.title}</h2>
        </div>
      </div>
      <div id="projects" className="section-cards meet-cards">
        <article className="feature-card project-showcase">
          <picture>
            <source media="(max-width: 600px)" srcSet={featuredMobile} />
            <img src={featured} alt="" loading="lazy" />
          </picture>
          <div className="card-copy">
            <h3>{meet.featured}</h3>
            <a href={LINKS.projectCards} className="section-action">{meet.explore}</a>
          </div>
        </article>
        <CardTrack id="project-cards" className="project-grid" label={meet.title} track={projects}>
          {meet.projects.map(({ id, category, title }) => (
            <FeatureCard image={projectImages[id]} className="project-card" href={LINKS[id]} key={id}>
              <p className="section-eyebrow">{category}</p>
              <h3>{title}</h3>
            </FeatureCard>
          ))}
        </CardTrack>
      </div>
    </section>
  )
}

export function Services() {
  return (
    <section id="services" className="services scroll-section" aria-label={services.title}>
      <div className="services-backdrop scene-backdrop" aria-hidden="true">
        <video muted playsInline preload="none" />
      </div>
      <div id="service-options" className="section-cards service-cards">
        <article className="feature-card rescue-card">
          <picture>
            <source media="(max-width: 600px)" srcSet={rescueMobile} />
            <img src={rescueArt} alt="" loading="lazy" />
          </picture>
          <div className="card-copy">
            <h2>{services.rescue.title}</h2>
            <p>{services.rescue.description}</p>
            <details className="service-details">
              <summary className="section-action">{services.rescue.action}</summary>
              <p>{services.rescue.included}</p>
            </details>
          </div>
        </article>
        <article className="feature-card builds-card">
          <img src={buildsArt} alt="" loading="lazy" />
          <div className="card-copy">
            <p className="section-eyebrow">{services.builds.category}</p>
            <h2>{services.builds.title}</h2>
            <p>{services.builds.description}</p>
            <a className="section-action" href={LINKS.hire}>{services.builds.action}</a>
          </div>
        </article>
      </div>
    </section>
  )
}
