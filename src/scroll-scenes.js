import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import hostedMedia from './assets/hosted-media.json'
import desktopPoster from './assets/site/services/backdrop-desktop.avif'
import portraitPoster from './assets/site/services/backdrop-portrait.avif'
import cityDesktopPoster from './assets/site/highlights/city-desktop.avif'
import cityPortraitPoster from './assets/site/highlights/city-portrait.avif'

gsap.registerPlugin(ScrollTrigger)

const clamp = gsap.utils.clamp(0, 1)
const mix = gsap.utils.interpolate
const travelEase = gsap.parseEase('power2.inOut')
const videoFps = 24

function backdropVideoUrl(source, portrait) {
  const crop = portrait ? 'c_fill,g_auto,w_540,h_960/' : ''
  return source.replace('/upload/', `/upload/${crop}ac_none,ki_4,fps_24,vc_h264/`)
}

function setupBackdrop(section, { source, poster, portrait, reduced, depth, scrubRange }) {
  const backdrop = section.querySelector('.scene-backdrop')
  const video = backdrop.querySelector('video')
  backdrop.style.backgroundImage = `url("${poster}")`
  video.poster = poster
  if (reduced) return () => {}

  let progress = 0
  function seek() {
    if (video.seeking || video.readyState < 2 || !Number.isFinite(video.duration)) return
    const lastFrame = Math.max(0, Math.ceil(video.duration * videoFps - 0.01) - 1)
    const frame = Math.round(lastFrame * clamp((progress - 0.08) / scrubRange))
    const time = Math.min(video.duration, (frame + 0.1) / videoFps)
    if (Math.abs(video.currentTime - time) > 0.5 / videoFps) video.currentTime = time
  }
  function updateVideo(state) {
    progress = state.progress
    if (!video.hasAttribute('src') && (state.isActive || progress > 0)) {
      video.preload = 'auto'
      video.src = backdropVideoUrl(source, portrait)
    }
    seek()
  }
  video.addEventListener('loadeddata', seek)
  video.addEventListener('seeked', seek)
  ScrollTrigger.create({
    trigger: section,
    start: 'top 95%',
    end: () => 'top top-=' + innerHeight * depth,
    onUpdate: updateVideo,
    onRefresh: updateVideo,
  })
  return () => {
    video.removeEventListener('loadeddata', seek)
    video.removeEventListener('seeked', seek)
    video.removeAttribute('src')
    video.load()
  }
}

export function setupScrollScenes(page, reducedMotionQuery) {
  const media = gsap.matchMedia()
  const heroTrack = page.querySelector('.hero-scroll')
  const hero = heroTrack.querySelector('.hero')
  const artwork = hero.querySelector('.hero-artwork')
  const heroHire = hero.querySelector('.hire-link')
  const navHire = page.querySelector('.nav-hire')
  const menu = page.querySelector('.menu-button')
  const services = page.querySelector('.services')
  const city = page.querySelector('.miami')

  media.add({
    wide: '(min-width: 601px), (orientation: landscape)',
    portrait: '(max-width: 600px) and (orientation: portrait)',
    reduced: reducedMotionQuery,
  }, ({ conditions: { portrait, reduced } }) => {
    const cleanServices = setupBackdrop(services, {
      source: hostedMedia.services.video,
      poster: portrait ? portraitPoster : desktopPoster,
      portrait, reduced, depth: 0.9, scrubRange: 0.46,
    })
    const cleanCity = setupBackdrop(city, {
      source: hostedMedia.city.video,
      poster: portrait ? cityPortraitPoster : cityDesktopPoster,
      portrait, reduced, depth: portrait ? 0.72 : 0.82, scrubRange: 0.89,
    })
    const moveHire = gsap.quickSetter(navHire, 'css')

    function updateHero({ progress }) {
      const flight = clamp((progress - 0.16) / 0.7)
      const fading = clamp((progress - 0.1) / 0.78)
      page.dataset.hireDocked = String(reduced ? progress >= 1 : flight > 0)
      if (reduced) return

      gsap.set(hero, { opacity: 1 - fading })
      gsap.set(artwork, { scale: mix(1, 0.86, progress) })
      const source = heroHire.getBoundingClientRect()
      const target = navHire.parentElement.getBoundingClientRect()
      const centerX = menu.getBoundingClientRect().left - 12 - navHire.offsetWidth / 2
      const centerY = target.top + target.height / 2
      const travel = travelEase(flight)
      moveHire({
        x: mix(source.left + source.width / 2 - centerX, 0, travel),
        y: mix(source.top + source.height / 2 - centerY, 0, travel),
        scale: mix(heroHire.offsetWidth / navHire.offsetWidth, 1, travel),
        opacity: mix(1 - fading, 1, flight),
      })
    }

    ScrollTrigger.create({
      trigger: heroTrack,
      start: 0,
      end: reduced ? 'bottom top+=64' : () => `+=${Math.min(innerHeight * 0.72, hero.offsetHeight)}`,
      onUpdate: updateHero,
      onRefresh: updateHero,
    })

    if (!reduced) {
      return () => {
        cleanServices()
        cleanCity()
        gsap.set(artwork, { clearProps: 'transform' })
        gsap.set(navHire, { clearProps: 'transform,opacity' })
        hero.style.removeProperty('opacity')
        delete page.dataset.hireDocked
      }
    }
    return () => {
      delete page.dataset.hireDocked
    }
  }, page)

  return () => media.revert()
}
