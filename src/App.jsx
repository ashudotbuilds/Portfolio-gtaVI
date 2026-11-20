import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import desktopPoster from './assets/site/hero/desktop/poster.avif'
import desktopLogo from './assets/site/hero/desktop/poster-logo.avif'
import mobilePoster from './assets/site/hero/mobile/poster.avif'
import mobileLogo from './assets/site/hero/mobile/poster-logo.avif'
import { hero, LINKS, navbar } from './content'
import { playHeroIntro, waitForHero } from './hero-intro'
import { MeetDeveloper, Services } from './sections'
import { Miami, Highlights, Clients, Blog, Footer } from './portfolio-sections'
import { setupScrollScenes } from './scroll-scenes'

const compactArtwork = '(max-width: 767px) and (orientation: portrait)'
const reducedMotion = '(prefers-reduced-motion: reduce)'
const introArtwork = import.meta.glob('./assets/site/hero/*/shard-*.avif', {
  eager: true,
  import: 'default',
  query: '?url',
})
const shards = Array.from({ length: 10 }, (_, i) => `shard-${String(i + 1).padStart(2, '0')}`)

function PosterLogo({ alt, layer }) {
  return (
    <picture data-layer={layer}>
      <source media={compactArtwork} srcSet={mobileLogo} width="1366" height="1366" />
      <img src={desktopLogo} width="2560" height="1440" alt={alt} />
    </picture>
  )
}

function IntroArtwork() {
  return (
    <div className="hero-intro" aria-hidden="true">
      {shards.map((layer) => (
        <picture data-layer={layer} key={layer}>
          <source media={compactArtwork} srcSet={introArtwork[`./assets/site/hero/mobile/${layer}.avif`]} />
          <img src={introArtwork[`./assets/site/hero/desktop/${layer}.avif`]} alt="" />
        </picture>
      ))}
      <div className="intro-vi" data-layer="logo-vi">
        <div className="intro-vi-shape" />
      </div>
      <PosterLogo alt="" layer="logo-reveal" />
    </div>
  )
}

function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-shell navbar" aria-label="Main navigation">
        <a className="navbar-mark" href={LINKS.home} aria-label={hero.title}>
          {navbar.monogram}
        </a>
        <a className="hire-link nav-hire" href={LINKS.hire}>{hero.hire}</a>
        <button className="menu-button" type="button" aria-label={navbar.menu} disabled>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>
    </header>
  )
}

function Hero({ showIntro }) {
  return (
    <section className="site-shell hero" aria-labelledby="hero-title">
      <div className="hero-artwork">
        {showIntro && <IntroArtwork />}
        <div className="hero-poster">
          <picture>
            <source media={compactArtwork} srcSet={mobilePoster} width="640" height="640" />
            <img src={desktopPoster} width="2560" height="1440" alt="" fetchPriority="high" />
          </picture>
          <h1 id="hero-title" className="hero-logo">
            <PosterLogo alt={hero.title} />
          </h1>
        </div>
      </div>

      <div className="hero-details">
        <div>
          <p className="hero-tagline">{hero.tagline}</p>
          <p className="hero-availability">{hero.availability}</p>
        </div>
        <a className="hire-link" href={LINKS.hire}>
          {hero.hire}
        </a>
        <ul className="hero-stack" aria-label={hero.stackLabel}>
          {hero.stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </div>
    </section>
  )
}

export default function App() {
  const page = useRef(null)
  const [showIntro, setShowIntro] = useState(() => !window.matchMedia(reducedMotion).matches)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (ready) return setupScrollScenes(page.current, reducedMotion)
  }, [ready])

  useEffect(() => {
    const loader = document.getElementById('site-loader')
    const artwork = window.matchMedia(compactArtwork)
    const motion = window.matchMedia(reducedMotion)
    const site = page.current
    let revision = 0
    let animation

    function finish() {
      artwork.removeEventListener('change', load)
      motion.removeEventListener('change', load)
      loader.hidden = true
      setShowIntro(false)
      setReady(true)
    }

    async function load() {
      const attempt = ++revision
      animation?.revert()
      animation = undefined
      const canAnimate = !motion.matches && Boolean(site.querySelector('.hero-intro'))
      const imagesReady = await waitForHero(site, loader, canAnimate)
      if (attempt !== revision) return

      if (canAnimate && imagesReady) {
        animation = playHeroIntro(site, loader, artwork.matches, finish)
      } else {
        finish()
      }
    }

    load()
    artwork.addEventListener('change', load)
    motion.addEventListener('change', load)
    return () => {
      revision++
      artwork.removeEventListener('change', load)
      motion.removeEventListener('change', load)
      animation?.revert()
    }
  }, [])

  return (
    <div id="top" ref={page} className="site-content" data-ready={ready} inert={!ready}>
      <Navbar />
      <main>
        <div className="hero-scroll">
          <Hero showIntro={showIntro} />
        </div>
        <MeetDeveloper />
        <Services />
        <Miami />
        <Highlights />
        <Clients />
        <Blog />
      </main>
      <Footer />
    </div>
  )
}
