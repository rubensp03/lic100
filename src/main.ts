import './style.css';
import { loadData } from './scripts/dataLoader';
import { initHeroAnimations, animateOnScroll, initSmoothScroll } from './scripts/animations';
import { initBooksy } from './scripts/booksy';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const init = async () => {
  try {
    const { config, gallery } = await loadData();
    
    // Update texts from config.json
    document.title = `${config.name} | ${config.slogan}`;

    // Render Logo in Nav and Hero
    const navLogo = document.querySelector('#nav-logo-container');
    if (navLogo && config.logo) {
      navLogo.innerHTML = `
        <div class="h-8 w-8 md:h-10 md:w-10 bg-white p-1 rounded-sm mr-2 md:mr-3">
          <img src="${config.logo}" alt="${config.name}" class="h-full w-full object-contain">
        </div>
        <div class="text-lg md:text-2xl font-black tracking-tighter text-accent uppercase">${config.name}</div>
      `;
    }

    const heroTitle = document.querySelector('#hero-title');
    if (heroTitle) {
      if (config.logo) {
        heroTitle.innerHTML = `
          <div class="flex flex-col items-center gap-4 md:gap-6">
            <div class="bg-white p-3 md:p-4 rounded-lg shadow-2xl shadow-white/5 border border-white/10 max-w-[200px] sm:max-w-[280px] md:max-w-[400px]">
              <img src="${config.logo}" alt="${config.name}" class="w-full object-contain mx-auto">
            </div>
            <span class="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-accent">${config.name}</span>
          </div>
        `;
      } else {
        heroTitle.innerHTML = `<span class="text-accent italic">${config.name}</span>`;
      }
    }
    
    const heroSlogan = document.querySelector('#hero-slogan');
    if (heroSlogan) heroSlogan.textContent = config.slogan;

    // Render Gallery
    const grid = document.querySelector('#gallery-grid');
    if (grid) {
      grid.innerHTML = gallery.map(item => `
        <div class="gallery-item group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-700">
          <div class="aspect-[4/5] bg-white/5 animate-pulse overflow-hidden">
             <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-700 opacity-0" onload="this.classList.remove('opacity-0'); this.parentElement.classList.remove('animate-pulse')">
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0">
            <span class="text-accent text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2">${item.category}</span>
            <h3 class="text-xl md:text-2xl font-black uppercase tracking-tighter italic">${item.title}</h3>
          </div>
        </div>
      `).join('');
    }

    // Update Locations
    const locList = document.querySelector('#locations-list');
    if (locList) {
      locList.innerHTML = config.locations.map(loc => `
        <div class="location-card flex flex-col h-full overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 group transition-all duration-500 hover:border-accent/30">
            <div class="aspect-video overflow-hidden bg-white/5 animate-pulse">
              <img src="${loc.image}" alt="${loc.name}" class="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 opacity-0 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-100" onload="this.classList.remove('opacity-0'); this.parentElement.classList.remove('animate-pulse')">
            </div>
            <div class="p-5 md:p-6 space-y-4 flex flex-col flex-grow bg-gradient-to-b from-white/[0.02] to-transparent">
                <div class="flex justify-between items-start">
                  <h4 class="text-accent text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">${loc.name}</h4>
                  <a href="${loc.mapsUrl}" target="_blank" class="text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 hover:text-accent transition-all flex items-center gap-1">
                    Ver Mapa ↗
                  </a>
                </div>
                <p class="text-base md:text-lg font-medium opacity-80 italic flex-grow">${loc.address}</p>
                <div class="pt-2 md:pt-4 mt-auto">
                  <a href="${loc.booksyUrl}" target="_blank" class="block w-full text-center bg-primary text-bg py-3 md:py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-black/20">
                    Reservar Cita
                  </a>
                </div>
            </div>
        </div>
      `).join('');
    }
    
    const scheduleList = document.querySelector('#schedule-list');
    if (scheduleList) {
      scheduleList.innerHTML = config.schedule.map(s => `
        <div class="flex justify-between items-center text-[10px] md:text-xs font-medium border-b border-white/5 py-2 md:py-3">
            <span class="opacity-40 uppercase tracking-widest">${s.days}</span>
            <span class="text-accent tracking-tighter">${s.hours}</span>
        </div>
      `).join('');
    }

    // Update Socials
    const socials = ['ig', 'tk', 'wa'];
    socials.forEach(s => {
      const el = document.querySelector(`#social-${s}`) as HTMLAnchorElement;
      if (el) {
        const key = s === 'ig' ? 'instagram' : s === 'tk' ? 'tiktok' : 'whatsapp';
        el.href = config.socials[key as keyof typeof config.socials];
      }
    });

    // Init animations
    initHeroAnimations();

    // Allow browser to paint injected content before animating
    requestAnimationFrame(() => {
      animateOnScroll('.gallery-item');
      animateOnScroll('.location-card');
      animateOnScroll('#contact h2');
      ScrollTrigger.refresh();
    });
    
    initSmoothScroll();
    initBooksy(config.booksyId);

    // Active State for Bottom Nav
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const navLinks = document.querySelectorAll('.md\\:hidden a');
          navLinks.forEach(link => {
            const href = link.getAttribute('href')?.replace('#', '');
            const icon = link.querySelector('svg');
            const label = link.querySelector('span');
            
            if (href === id) {
              icon?.classList.replace('opacity-40', 'opacity-100');
              icon?.classList.add('text-accent');
              label?.classList.replace('opacity-30', 'opacity-100');
            } else {
              icon?.classList.replace('opacity-100', 'opacity-40');
              icon?.classList.remove('text-accent');
              label?.classList.replace('opacity-100', 'opacity-30');
            }
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll('section, footer').forEach(section => observer.observe(section));

  } catch (error) {
    console.error('Error loading barber data:', error);
  }
};

window.addEventListener('DOMContentLoaded', init);
