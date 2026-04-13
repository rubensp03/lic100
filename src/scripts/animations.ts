import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const initHeroAnimations = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
  
  tl.to('#hero-title', { opacity: 1, y: 0, delay: 0.5 })
    .to('#hero-slogan', { opacity: 1, y: 0 }, '-=0.8')
    .to('#hero-actions', { opacity: 1, y: 0 }, '-=0.8');
    
  // Parallax effect on hero image
  gsap.to('#hero-image', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
};

export const animateOnScroll = (selector: string) => {
  const elements = gsap.utils.toArray(selector);
  if (!elements.length) return;

  // Set initial state immediately
  gsap.set(elements, { opacity: 0, y: 30 });

  elements.forEach((el, i) => {
    gsap.to(el as Element, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el as Element,
        start: 'top 85%',
        toggleActions: 'play none none none',
        invalidateOnRefresh: true,
      }
    });
  });
};

export const initSmoothScroll = () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#location') { // We also want the explicit "Nuestras Sedes" button
        if (targetId === '#') return;
      }
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId!);
      if (targetElement) {
        const offset = 100; // Nav height roughly
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: targetElement, offsetY: offset },
          ease: 'power4.inOut'
        });
      }
    });
  });
};
