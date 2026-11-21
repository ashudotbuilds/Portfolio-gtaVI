export const brandMark = `${import.meta.env.BASE_URL}favicon.svg`

const contactEmail = 'singhashutosh4123@gmail.com'

export const LINKS = {
  home: '#top',
  hire: '#contact',
  email: `mailto:${contactEmail}`,
  inquiry: `https://formsubmit.co/ajax/${contactEmail}`,
  booking: 'https://cal.com/ashudotbuilds',
  resume: `${import.meta.env.BASE_URL}ashutosh-singh-resume.pdf`,
  github: 'https://github.com/ashudotbuilds',
  linkedin: 'https://www.linkedin.com/in/ashudotbuilds/',
  x: 'https://x.com/Ashudotbuilds',
  projects: '#projects',
  projectCards: '#project-cards',
  monster: 'https://monster.ashu.fun/',
  ticket: 'https://bms.ashu.fun/',
  portfolio: 'https://www.ashu.fun/',
  techTambola: 'https://blog.ashu.fun/it-worked-until-it-didn-t',
  services: '#service-options',
  experience: '#experience',
  blog: '#blog',
  machinePost: 'https://blog.ashu.fun/in-love-with-the-machine-not-the-race',
  certificatesPost: 'https://blog.ashu.fun/are-certificates-dead',
  llmsPost: 'https://blog.ashu.fun/understanding-large-language-models-llms',
  about: '#miami-title',
}

export const navbar = {
  menu: 'Menu',
  close: 'Close',
}

export const hero = {
  title: 'Ashutosh Singh',
  tagline: 'Software Engineer',
  hire: 'Hire Me',
  stackLabel: 'Tech stack',
  stack: ['React', 'Node.js', 'PostgreSQL'],
}

export const meet = {
  title: 'Meet the Developer',
  featured: 'From Idea to Launch',
  explore: 'Explore Projects',
  projects: [
    { id: 'monster', category: 'GSAP + Blender', title: 'Monster App' },
    { id: 'ticket', category: 'Backend', title: 'Book My Ticket' },
    { id: 'portfolio', category: 'Frontend', title: 'Portfolio Website' },
  ],
}

export const services = {
  title: 'Services',
  rescue: {
    title: 'Code Rescue',
    description: 'For existing teams: slow pages, flaky deploys or a codebase nobody wants to touch. I find the problems, fix them and leave it documented.',
    action: "See What's Included",
    included: 'Performance review, deployment fixes, and documentation for your team.',
  },
  builds: {
    category: 'For new products',
    title: 'Full-Stack / Builds',
    description: 'I build full-stack web products, mobile apps with React Native and Expo, and generative AI features. Typically six to ten weeks from first sketch to production.',
    action: 'Start a Project',
  },
}

export const miami = {
  title: 'Indore, India',
  bio: "I'm Ashutosh Singh, a full-stack developer and applied AI engineer. I also build mobile apps with React Native and Expo. I enjoy discussing system design and thinking through how APIs, data models, and backend services fit together.",
}

export const highlights = [
  { category: 'Status', title: 'Open to Work', description: 'I’m available for remote work only, starting January 2027.', action: 'Hire Me', link: 'hire' },
  { category: 'Community', title: 'After Hours', description: 'I enjoy tech meetups and system design conversations with developer communities in Indore and Bhopal.' },
  { category: 'Case Study', title: 'Tech Tambola', description: 'We built a digital Tambola game for our college club’s Techtonic event. Here’s how we handled retries and competing claims for the last prize.', action: 'Read the Case Study', link: 'techTambola' },
  { category: 'Personal', title: 'Off the Clock', description: 'Away from the keyboard, I like catching a movie in Indore.', action: 'More About Me', link: 'about' },
]

export const experience = {
  title: 'Work Experience',
  viewAll: 'View all',
  cards: [
    {
      id: 'codeshor',
      role: 'Full Stack Engineer',
      organization: 'Codeshor Technologies',
      metadata: 'Jun 2026 – Present · Full-time · Remote',
      description: 'I build features across the stack, test where they break, and fix what I find.',
    },
    {
      id: 'cstep',
      role: 'Intern',
      organization: 'CSTEP',
      metadata: 'Jul 2026 – Oct 2026 · Remote',
      description: 'I wrote scripts to automate recurring tasks and reduce manual steps in day-to-day workflows.',
    },
  ],
}

export const blog = {
  title: 'Blog',
  viewAll: 'View all',
  posts: [
    { title: 'In Love With the Machine, Not the Race', dateTime: '2026-11-13', metadata: 'November 13, 2026', link: 'machinePost' },
    { title: 'Are Certificates Dead? 💀', dateTime: '2026-10-11', metadata: 'October 11, 2026', link: 'certificatesPost' },
    { title: 'Understanding Large Language Models (LLMs):', dateTime: '2026-07-01', metadata: 'July 1, 2026', readTime: '10 min read', link: 'llmsPost' },
  ],
}

export const footer = {
  logoAlt: 'AL home',
  contactTitle: 'Have a project in mind?',
  contactDescription: 'Tell me what you’re building and where you could use a hand.',
  contactForm: {
    name: 'Name',
    email: 'Email',
    message: 'Project details',
    submit: 'Send Inquiry',
    sending: 'Sending…',
    sent: 'Thanks! Your inquiry was sent.',
    error: 'Your inquiry could not be sent. Please try again.',
    subject: 'New Hire Me inquiry from AshuLabs',
  },
  bookingAction: 'Book a Call',
  socials: [
    { label: 'GitHub', link: 'github' },
    { label: 'LinkedIn', link: 'linkedin' },
    { label: 'X', link: 'x' },
  ],
  links: [
    { label: 'Email', link: 'email' },
    { label: 'Résumé', link: 'resume' },
  ],
  rating: 'Rated D for Developer',
  ratingNote: 'Clean Code, Mild Refactoring, Frequent Coffee.',
  copyright: '© 2026 AshuLabs.',
}
