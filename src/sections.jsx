import { useRef, useState } from 'react'
import scene from './assets/site/meet-the-developer/scene.avif'
import featured from './assets/site/meet-the-developer/featured-desktop.avif'
import featuredMobile from './assets/site/meet-the-developer/featured-mobile.avif'
import aiCard from './assets/site/meet-the-developer/card-1.avif'
import basketballCard from './assets/site/meet-the-developer/card-2.avif'
import mobileCard from './assets/site/meet-the-developer/card-3.avif'
import rescueArt from './assets/site/services/card-tall-desktop.avif'
import rescueMobile from './assets/site/services/card-tall-mobile.avif'
import buildsArt from './assets/site/services/card-short.avif'
import hostedMedia from './assets/hosted-media.json'
import { LINKS, meet, services } from './content'

const projectImages = [aiCard, basketballCard, mobileCard]

export function FeatureCard({ image, className, children }) {
  return (
    <article className={`feature-card ${className}`}>
      <img src={image} alt="" loading="lazy" />
      <div className="card-copy">{children}</div>
    </article>
  )
}

export function MeetDeveloper() {
  const player = useRef(null)
  const [playing, setPlaying] = useState(false)

  function openRide() {
    player.current.showModal()
    setPlaying(true)
  }

  return (
    <section className="meet scroll-section" aria-labelledby="meet-title">
      <div className="meet-scene scene-backdrop">
        <img src={scene} alt="" />
        <div className="meet-heading">
          <p className="section-eyebrow">{meet.watch}</p>
          <h2 id="meet-title">{meet.title}</h2>
          <button className="scene-play" type="button" onClick={openRide} aria-label={`${meet.play} ${meet.featured}`}>
            <span aria-hidden="true">▶</span>
          </button>
        </div>
      </div>
      <div className="section-cards meet-cards">
        <article className="feature-card ride-card">
          <picture>
            <source media="(max-width: 600px)" srcSet={featuredMobile} />
            <img src={featured} alt="" loading="lazy" />
          </picture>
          <div className="card-copy">
            <p className="section-eyebrow">{meet.watch}</p>
            <h3>{meet.featured}</h3>
            <button className="section-action" type="button" onClick={openRide}>{meet.play}</button>
          </div>
        </article>
        <div className="project-grid">
          {meet.projects.map(({ category, title }, index) => (
            <FeatureCard image={projectImages[index]} className="project-card" key={title}>
              <p className="section-eyebrow">{category}</p>
              <h3>{title}</h3>
            </FeatureCard>
          ))}
        </div>
      </div>
      <dialog className="ride-player" ref={player} aria-label={meet.featured} onClose={() => setPlaying(false)}>
        <form method="dialog">
          <button type="submit" className="section-action">{meet.close}</button>
        </form>
        {playing && <video src={hostedMedia.city.video} autoPlay muted playsInline controls aria-label={meet.featured} />}
      </dialog>
    </section>
  )
}

export function Services() {
  return (
    <section id="services" className="services scroll-section" aria-label={services.title}>
      <div className="services-backdrop scene-backdrop" aria-hidden="true">
        <video muted playsInline preload="none" />
      </div>
      <div className="section-cards service-cards">
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
