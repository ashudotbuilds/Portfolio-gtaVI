import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import desktopPoster from './assets/site/services/backdrop-desktop.avif'
import portraitPoster from './assets/site/services/backdrop-portrait.avif'
import servicesDesktopVideo from './assets/site/services/motion-desktop.mp4'
import servicesPortraitVideo from './assets/site/services/motion-portrait.mp4'
import cityDesktopPoster from './assets/site/highlights/city-desktop.avif'
import cityPortraitPoster from './assets/site/highlights/city-portrait.avif'
import cityDesktopVideo from './assets/site/highlights/motion-desktop.mp4'
import cityPortraitVideo from './assets/site/highlights/motion-portrait.mp4'

gsap.registerPlugin(ScrollTrigger)

const clamp = gsap.utils.clamp(0, 1)
const mix = gsap.utils.interpolate
const revealEase = gsap.parseEase('power2.inOut')
const videoFps = 24

function reveal(progress, start, end) {
  return revealEase(clamp((progress - start) / (end - start)))
}

function setupSmoothScroll(page) {
  // Match the reference's desktop wheel response and keep native touch inertia.
  const lenis = new Lenis({
    lerp: 0.07,
    wheelMultiplier: 1.2,
    autoToggle: true,
    virtualScroll: ({ event, deltaX, deltaY }) =>
      event.type !== 'wheel' || (!event.shiftKey && Math.abs(deltaY) > Math.abs(deltaX)),
  })
  const tick = (time) => lenis.raf(time * 1000)
  function releaseWheelForAnchor(event) {
    // Let the browser's fragment scroll take over from any wheel inertia.
    if (lenis.isSmooth && event.target instanceof Element && event.target.closest('a[href^="#"]')) {
      lenis.scrollTo(window.scrollY, { immediate: true })
    }
  }
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)
  page.addEventListener('click', releaseWheelForAnchor)
  return () => {
    page.removeEventListener('click', releaseWheelForAnchor)
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}

function setupBackdrop(section, { source, poster, reduced, foreground, scrubStart, scrubEnd }) {
  const backdrop = section.querySelector('.scene-backdrop')
  const video = backdrop.querySelector('video')
  backdrop.style.backgroundImage = `url("${poster}")`
  video.poster = poster
  if (reduced) return () => {}

  const controller = new AbortController()
  const playhead = { progress: 0 }
  let active = true
  let started = false
  let objectUrl
  let timeout
  let requestedFrame

  function seek() {
    if (video.seeking || !Number.isFinite(video.duration)) return
    const lastFrame = Math.max(0, Math.ceil(video.duration * videoFps - 0.01) - 1)
    const frame = Math.round(lastFrame * playhead.progress)
    if (frame === requestedFrame) return
    requestedFrame = frame
    video.currentTime = Math.min(video.duration, (frame + 0.1) / videoFps)
  }

  async function primeVideo({ isActive, progress }) {
    if (started || (!isActive && progress === 0)) return
    started = true
    video.preload = 'auto'
    // Buffer these short clips once so reverse seeks can read the same local bytes.
    timeout = window.setTimeout(() => controller.abort(), 3500)
    try {
      const response = await fetch(source, { signal: controller.signal })
      if (!response.ok) throw new Error(`Video response: ${response.status}`)
      const blob = await response.blob()
      if (!active) return
      objectUrl = URL.createObjectURL(blob)
      video.src = objectUrl
    } catch {
      if (active) video.src = source
    } finally {
      window.clearTimeout(timeout)
    }
  }
  function revealBackdrop({ progress: entrance }) {
    const opacity = reveal(entrance, 0, 1)
    backdrop.style.setProperty('--backdrop-in', opacity)
    backdrop.style.setProperty('--backdrop-mask', opacity > 0.98
      ? 'none'
      : `linear-gradient(transparent, #000 ${16 * (1 - opacity)}svh)`)
  }
  function shadeBackdrop({ progress: exit }) {
    backdrop.style.setProperty('--backdrop-out', reveal(exit, 0, 1))
  }

  video.addEventListener('loadedmetadata', seek)
  video.addEventListener('seeked', seek)
  ScrollTrigger.create({
    trigger: section,
    start: 'top 200%',
    end: 'top bottom',
    onUpdate: primeVideo,
    onRefresh: primeVideo,
  })
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'top 5%',
    onUpdate: revealBackdrop,
    onRefresh: revealBackdrop,
  })
  ScrollTrigger.create({
    animation: gsap.to(playhead, { progress: 1, ease: 'none', onUpdate: seek }),
    trigger: section,
    start: scrubStart,
    end: scrubEnd,
    scrub: 0.16,
  })
  ScrollTrigger.create({
    trigger: foreground,
    start: 'top 87%',
    end: 'top 29%',
    onUpdate: shadeBackdrop,
    onRefresh: shadeBackdrop,
  })
  return () => {
    active = false
    controller.abort()
    window.clearTimeout(timeout)
    video.removeEventListener('loadedmetadata', seek)
    video.removeEventListener('seeked', seek)
    video.removeAttribute('src')
    video.load()
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    backdrop.style.removeProperty('--backdrop-in')
    backdrop.style.removeProperty('--backdrop-mask')
    backdrop.style.removeProperty('--backdrop-out')
  }
}

function setupPointerGlow(page) {
  const glow = page.querySelector('.portfolio-glow')
  const moveX = gsap.quickTo(glow, 'x', { duration: 0.24, ease: 'power2.out' })
  const moveY = gsap.quickTo(glow, 'y', { duration: 0.24, ease: 'power2.out' })
  const fade = gsap.quickTo(glow, 'opacity', { duration: 0.24, ease: 'power2.out' })
  let present = false

  function moveGlow({ clientX, clientY, pointerType }) {
    if (pointerType !== 'mouse') return
    if (!present) {
      moveX(clientX, clientX)
      moveY(clientY, clientY)
      fade(1)
      present = true
      return
    }
    moveX(clientX)
    moveY(clientY)
  }
  function hideGlow() {
    fade(0)
    present = false
  }

  window.addEventListener('pointermove', moveGlow, { passive: true })
  window.addEventListener('blur', hideGlow)
  document.documentElement.addEventListener('pointerleave', hideGlow)
  return () => {
    window.removeEventListener('pointermove', moveGlow)
    window.removeEventListener('blur', hideGlow)
    document.documentElement.removeEventListener('pointerleave', hideGlow)
    gsap.set(glow, { clearProps: 'transform,opacity' })
  }
}

export function setupScrollScenes(page, reducedMotionQuery) {
  const media = gsap.matchMedia()
  const heroTrack = page.querySelector('.hero-scroll')
  const hero = heroTrack.querySelector('.hero')
  const artwork = hero.querySelector('.hero-artwork')
  const details = hero.querySelector('.hero-details')
  const navHire = page.querySelector('.nav-hire')
  const meet = page.querySelector('.meet')
  const meetScene = meet.querySelector('.meet-scene')
  const meetHeading = meet.querySelector('.meet-heading')
  const meetCards = meet.querySelector('.meet-cards')
  const services = page.querySelector('.services')
  const city = page.querySelector('.miami')

  media.add('(prefers-reduced-motion: no-preference)', () => setupSmoothScroll(page), page)

  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    () => setupPointerGlow(page), page)

  media.add({
    wide: '(min-width: 601px), (orientation: landscape)',
    portrait: '(max-width: 600px) and (orientation: portrait)',
    reduced: reducedMotionQuery,
  }, ({ conditions: { portrait, reduced } }) => {
    const cleanServices = setupBackdrop(services, {
      source: portrait ? servicesPortraitVideo : servicesDesktopVideo,
      poster: portrait ? portraitPoster : desktopPoster,
      reduced,
      foreground: services.querySelector('.service-cards'),
      scrubStart: 'top 22%',
      scrubEnd: () => 'top top-=' + innerHeight * 0.35,
    })
    const cleanCity = setupBackdrop(city, {
      source: portrait ? cityPortraitVideo : cityDesktopVideo,
      poster: portrait ? cityPortraitPoster : cityDesktopPoster,
      reduced,
      foreground: city.querySelector('.miami-copy'),
      scrubStart: 'top 10%',
      scrubEnd: () => 'top top-=' + innerHeight * (portrait ? 0.66 : 0.71),
    })
    const setDetails = gsap.quickSetter(details, 'css')
    const setHeroOpacity = gsap.quickSetter(hero, 'opacity')
    const setNavHire = gsap.quickSetter(navHire, 'css')
    const setMeetScene = gsap.quickSetter(meetScene, 'css')
    const setMeetHeading = gsap.quickSetter(meetHeading, 'css')

    function updateHandoff({ progress }) {
      if (reduced) {
        page.dataset.hireDocked = String(progress >= 1)
        return
      }
      const heroFade = reveal(progress, 0.22, 0.61)
      const detailsFade = reveal(progress, 0.08, 0.47)
      const meetReveal = reveal(progress, 0.48, 0.84)
      const navReveal = reveal(progress, 0.83, 1)
      setHeroOpacity(1 - heroFade)
      const shrink = reveal(progress, 0, 0.64)
      artwork.style.scale = shrink ? mix(1, 0.89, shrink) : ''
      setDetails({ autoAlpha: 1 - detailsFade })
      setMeetScene({ '--meet-in': meetReveal })
      setNavHire({ opacity: navReveal, y: mix(8, 0, navReveal) })
      page.dataset.hireDocked = String(navReveal >= 0.03)
    }

    ScrollTrigger.create({
      trigger: heroTrack,
      start: 0,
      end: reduced ? 'bottom top+=64' : 'bottom 88%',
      onUpdate: updateHandoff,
      onRefresh: updateHandoff,
    })

    if (!reduced) {
      function updateMeetExit({ progress }) {
        setMeetScene({ '--meet-shade': reveal(progress, 0, 1) })
        const headingOpacity = 1 - reveal(progress, 0.24, 0.85)
        setMeetHeading({ opacity: headingOpacity })
      }

      ScrollTrigger.create({
        trigger: meetCards,
        start: 'top bottom',
        end: 'top 16%',
        onUpdate: updateMeetExit,
        onRefresh: updateMeetExit,
      })

      return () => {
        cleanServices()
        cleanCity()
        artwork.style.removeProperty('scale')
        gsap.set(navHire, { clearProps: 'transform,opacity' })
        gsap.set(details, { clearProps: 'opacity,visibility' })
        meetScene.style.removeProperty('--meet-in')
        meetScene.style.removeProperty('--meet-shade')
        gsap.set(meetHeading, { clearProps: 'opacity' })
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
