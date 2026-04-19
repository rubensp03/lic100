import './style.css';
import { loadData } from './scripts/dataLoader';
import { animateOnScroll, initSmoothScroll } from './scripts/animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const init = async () => {
    try {
        const { gallery } = await loadData();
        
        // Render Full Gallery
        const grid = document.querySelector('#full-gallery-grid');
        if (grid) {
            grid.innerHTML = gallery.map(item => `
                <div class="gallery-item group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-700">
                    <div class="aspect-[4/5] bg-white/5 animate-pulse overflow-hidden">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-700 opacity-0" onload="this.classList.remove('opacity-0'); this.parentElement.classList.remove('animate-pulse')">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0">
                        <span class="text-accent text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2">${item.category}</span>
                        <h3 class="text-lg md:text-xl font-black uppercase tracking-tighter italic">${item.title}</h3>
                    </div>
                </div>
            `).join('');
        }

        // Allow browser to paint injected content before animating
        requestAnimationFrame(() => {
            animateOnScroll('.gallery-item');
            ScrollTrigger.refresh();
        });

        initSmoothScroll();
    } catch (error) {
        console.error('Error loading gallery data:', error);
    }
};

window.addEventListener('DOMContentLoaded', init);
