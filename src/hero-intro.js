import gsap from 'gsap'

// Each row maps a shard to its entrance time and projected depth. The desktop
// values were fitted to the recording, whose first visible movement is at 4.8s.
const desktopFlight = [
  [2, 0, 2.17],
  [1, 0.04, 1.77],
  [3, 0.07, 2.18],
  [4, 0.14, 2.61],
  [5, 0.19, 3.72],
  [6, 0.23, 3.74],
  [7, 0.27, 3.81],
  [8, 0.30, 7.83],
  [9, 0.33, 6.28],
  [10, 0.84, 0],
]

const mobileFlight = [
  [2, 0, 2.17],
  [7, 0.04, 1.77],
  [5, 0.07, 2.18],
  [4, 0.14, 2.61],
  [3, 0.19, 3.72],
  [1, 0.23, 3.74],
  [10, 0.27, 3.81],
  [8, 0.30, 7.83],
  [9, 0.33, 6.28],
  [6, 0.84, 0],
]

export async function waitForHero(site, loader, includeIntro) {
  const selector = includeIntro ? '.hero-artwork img' : '.hero-poster img'
  const images = [...site.querySelectorAll(selector), loader.querySelector('img')]
  const fonts = [
    '600 1rem Outfit',
    '700 1rem "Barlow Condensed"',
    '900 1rem "Barlow Condensed"',
  ]

  const [decoded] = await Promise.all([
    Promise.all(images.map(async (image) => {
      try {
        await image.decode()
        return true
      } catch {
        return image.complete && image.naturalWidth > 0
      }
    })),
    Promise.allSettled(fonts.map((font) => document.fonts.load(font))),
  ])
  // A missing loader mark can use the overlay background while the hero loads.
  return decoded.slice(0, -1).every(Boolean)
}

export function playHeroIntro(site, loader, compact, onComplete) {
  const artwork = site.querySelector('.hero-artwork')
  const intro = artwork.querySelector('.hero-intro')
  const poster = artwork.querySelector('.hero-poster')
  const wordmark = intro.querySelector('[data-layer="logo-reveal"]')
  const vi = intro.querySelector('[data-layer="logo-vi"]')
  const header = site.querySelector('.site-header')
  const cta = site.querySelector('.hero-details .hire-link')
  const details = site.querySelectorAll('.hero-details > :not(.hire-link)')
  const flight = compact ? mobileFlight : desktopFlight
  const layers = flight.map(([id, entrance, depth]) => ({
    element: intro.querySelector(`[data-layer="shard-${String(id).padStart(2, '0')}"]`),
    entrance,
    depth,
  }))
  const projected = [...layers, { element: vi, depth: 4.5 }, { element: wordmark, depth: 4.9 }]
  const cameraEase = gsap.parseEase('power2.inOut')
  const depthEase = gsap.parseEase('power3.inOut')
  const clock = { time: 0 }
  const origin = `50% ${window.innerHeight / 2 - artwork.getBoundingClientRect().top}px`

  function project() {
    // The recording first exposes the artwork while the camera is already pulling back.
    const camera = 1 + 0.462 * (1 - cameraEase(Math.min(1, (clock.time + 1.438) / 3.571)))
    const remainingDepth = 1 - depthEase(Math.min(1, (clock.time + 1.909) / 3.133))
    for (const { element, depth } of projected) {
      const scale = camera / Math.max(0.42, 1 - depth * remainingDepth)
      element.style.transform = `scale(${scale})`
    }
  }

  return gsap.context(() => {
    gsap.set(projected.map(({ element }) => element), { opacity: 0, transformOrigin: origin })
    gsap.set(intro, { visibility: 'visible' })
    gsap.set([poster, header, cta, ...details], { opacity: 0 })
    gsap.set(wordmark, { '--wordmark-reveal': '0%' })
    gsap.set(layers[0].element, { opacity: 0.12 })
    project()

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      paused: document.hidden,
      onComplete: () => {
        document.removeEventListener('visibilitychange', syncVisibility)
        onComplete()
      },
    })
    function syncVisibility() {
      timeline.paused(document.hidden)
    }
    document.addEventListener('visibilitychange', syncVisibility)

    timeline.to(clock, { time: 1.84, duration: 1.84, onUpdate: project }, 0)
    timeline.to(loader, { autoAlpha: 0, duration: 0.38, ease: 'sine.inOut' }, 0)

    for (const { element, entrance } of layers) {
      timeline.to(element, { opacity: 1, duration: 0.42, ease: 'sine.inOut' }, entrance)
    }

    timeline.to(vi, { opacity: 1, duration: 0.5 }, 0.19)
    timeline.to(vi, { '--vi-glow': 0.6, duration: 0.35, ease: 'sine.inOut' }, 0.48)
    timeline.to(vi, { '--vi-glow': 0, duration: 0.55, ease: 'power2.in' }, 1.06)
    timeline.set(wordmark, { opacity: 1 }, 0.96)
    timeline.to(wordmark, { '--wordmark-reveal': '114%', duration: 0.55, ease: 'power1.out' }, 0.96)
    timeline.to(vi, { opacity: 0, duration: 0.37, ease: 'sine.inOut' }, 1.04)
    timeline.to(poster, { opacity: 1, duration: 0.22, ease: 'sine.inOut' }, 1.62)
    timeline.to(intro, { opacity: 0, duration: 0.16, ease: 'sine.inOut' }, 1.68)
    timeline.to(cta, { opacity: 1, duration: 0.50, ease: 'power1.in' }, 1.42)
    timeline.to([header, ...details], { opacity: 1, duration: 0.67, ease: 'power1.inOut' }, 1.42)
    return () => document.removeEventListener('visibilitychange', syncVisibility)
  }, site)
}
