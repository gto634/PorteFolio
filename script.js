const container = document.querySelector('.scroll-container');
const sections = [...document.querySelectorAll('.planche')];
const dots = [...document.querySelectorAll('.dot')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let currentSectionIndex = 0;
let scrollFrame = 0;
function updateNavigation(index) {
    currentSectionIndex = index;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        if (i === index) dot.setAttribute('aria-current', 'location');
        else dot.removeAttribute('aria-current');
    });
}
function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    cancelAnimationFrame(scrollFrame);
    const start = container.scrollTop, target = sections[index].offsetTop;
    const started = performance.now();
    container.style.scrollSnapType = 'none';
    updateNavigation(index);
    function step(now) {
        const progress = reducedMotion.matches ? 1 : Math.min((now - started) / 650, 1);
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        container.scrollTop = start + (target - start) * eased;
        if (progress < 1) scrollFrame = requestAnimationFrame(step);
        else {
            scrollFrame = 0;
            container.style.scrollSnapType = '';
            history.replaceState(null, '', '#' + sections[index].id);
        }
    }
    scrollFrame = requestAnimationFrame(step);
}
dots.forEach(dot => dot.setAttribute('aria-label', dot.title));
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        const index = sections.findIndex(section => '#' + section.id === anchor.hash);
        if (index < 0) return;
        event.preventDefault();
        scrollToSection(index);
    });
});
// Keep native touch/keyboard scrolling and allow scrolling inside tall panels.
let lastWheel = 0;
container.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) < 4 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const panel = event.target.closest('.planche');
    const direction = Math.sign(event.deltaY);
    if (panel && (direction > 0 ? panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2 : panel.scrollTop > 2)) return;
    event.preventDefault();
    const now = performance.now(), continuingGesture = now - lastWheel < 180;
    lastWheel = now;
    if (scrollFrame || continuingGesture) return;
    scrollToSection(currentSectionIndex + direction);
}, { passive: false });
const navigationObserver = new IntersectionObserver(entries => {
    if (scrollFrame) return;
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) updateNavigation(sections.indexOf(entry.target));
    });
}, { root: container, threshold: 0.55 });
sections.forEach(section => navigationObserver.observe(section));
window.addEventListener('hashchange', () => {
    const index = sections.findIndex(section => '#' + section.id === location.hash);
    if (index >= 0) scrollToSection(index);
});
window.addEventListener('resize', () => { if (scrollFrame) scrollToSection(currentSectionIndex); });
const players = [];
document.querySelectorAll('.project-video-container').forEach((panel, index) => {
    const video = panel.querySelector('video');
    const section = panel.closest('.planche');
    const expand = section.querySelector('.expand-btn');
    const title = section.querySelector('h2').textContent;
    const source = video.querySelector('source').dataset.src;
    panel.querySelector('.video-hint').remove();
    video.controls = true;
    video.setAttribute('aria-label', 'Gameplay de ' + title);
    const toggle = document.createElement('button');
    toggle.className = 'video-toggle';
    toggle.type = 'button';
    const status = document.createElement('span');
    status.className = 'video-status';
    status.setAttribute('role', 'status');
    panel.append(toggle, status);
    panel.id = 'player-' + index;
    panel.inert = true;
    expand.setAttribute('aria-controls', panel.id);
    let requested = false, position = 0, attempt = 0;
    function state(name) {
        panel.dataset.state = name;
        panel.setAttribute('aria-busy', String(name === 'loading'));
        toggle.hidden = name === 'playing';
        toggle.textContent = name === 'loading' ? 'Annuler' : name === 'error' ? '↻ Réessayer' : '▶ Lire la vidéo';
        toggle.setAttribute('aria-label', (name === 'loading' ? 'Annuler le chargement de ' : 'Lire le gameplay de ') + title);
        status.textContent = name === 'loading' ? 'Chargement de la vidéo…' : name === 'error' ? 'Lecture impossible. Réessayez.' : '';
    }
    function mount() {
        if (video.hasAttribute('src')) return;
        video.preload = 'auto';
        video.src = source;
        video.load();
    }
    function stop(release = false) {
        attempt++;
        requested = false;
        video.pause();
        if (release && video.hasAttribute('src')) {
            position = video.currentTime;
            video.removeAttribute('src');
            video.preload = 'none';
            video.load();
        }
        state('paused');
    }
    function labelExpansion() {
        const open = section.classList.contains('is-expanded');
        expand.title = (open ? 'Masquer' : 'Voir') + ' la vidéo';
        expand.setAttribute('aria-label', expand.title + ' — ' + title);
        expand.setAttribute('aria-expanded', String(open));
        panel.inert = !open;
    }
    expand.addEventListener('click', () => {
        section.classList.toggle('is-expanded');
        labelExpansion();
        if (section.classList.contains('is-expanded')) {
            players.forEach(player => { if (player.video !== video) player.stop(true); });
            mount();
        } else stop(true);
    });
    toggle.addEventListener('click', async () => {
        if (requested) { stop(true); return; }
        players.forEach(player => { if (player.video !== video) player.stop(true); });
        if (video.error) stop(true);
        mount();
        requested = true;
        const token = ++attempt;
        state('loading');
        try { await video.play(); }
        catch (error) {
            if (token === attempt && error.name !== 'AbortError') {
                requested = false;
                state('error');
            }
        }
    });
    video.addEventListener('loadedmetadata', () => {
        if (position > 0 && position < video.duration) video.currentTime = position;
    });
    video.addEventListener('play', () => {
        requested = true;
        players.forEach(player => { if (player.video !== video) player.stop(true); });
    });
    video.addEventListener('playing', () => state('playing'));
    video.addEventListener('waiting', () => { if (requested) state('loading'); });
    video.addEventListener('pause', () => {
        requested = false;
        state(video.error ? 'error' : 'paused');
    });
    video.addEventListener('error', () => { requested = false; state('error'); });
    labelExpansion();
    state('paused');
    new IntersectionObserver(entries => {
        if (entries[0].intersectionRatio < 0.1) stop(true);
    }, { root: container, threshold: 0.1 }).observe(section);
    players.push({ video, stop });
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) players.forEach(player => player.stop(true));
});
