/* One native player, sized to the media ratio; sound and position survive reopening. */
(() => {
    const triggers = [...document.querySelectorAll('[data-video-src]')];
    if (!triggers.length) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'ds-video-dialog';
    dialog.lang = window.portfolioI18n?.language || 'fr';
    dialog.setAttribute('aria-labelledby', 'video-dialog-title');
    dialog.innerHTML = `<div class="ds-video-shell">
        <h2 id="video-dialog-title" class="ds-sr-only"></h2>
        <div class="ds-video-frame"><video controls playsinline disablepictureinpicture preload="none" tabindex="0" autofocus></video>
            <div class="ds-video-notice" hidden><p class="ds-video-status" role="status" aria-live="polite" aria-atomic="true"></p><button type="button" class="ds-button ds-button--secondary video-recovery" hidden>Réessayer</button></div>
        </div></div>`;
    document.body.append(dialog);
    const video = dialog.querySelector('video');
    const recovery = dialog.querySelector('.video-recovery');
    const notice = dialog.querySelector('.ds-video-notice');
    const status = dialog.querySelector('.ds-video-status');
    const translate = (key, fallback, values) => window.portfolioI18n?.t(key, values) || fallback;
    let trigger, source, requested = false, attempt = 0, ratio = 16 / 9;
    let sound = {muted: false, volume: 1};
    let lastFullscreenExit = -Infinity, fullscreen = false;
    const positions = new Map();
    function resize() {
        if (!dialog.open || document.fullscreenElement) return;
        const css = getComputedStyle(document.documentElement);
        const margin = parseFloat(css.getPropertyValue('--ds-video-margin'));
        const limit = parseFloat(css.getPropertyValue('--ds-video-max-width'));
        const widthAvailable = Math.max(1, innerWidth - margin * 2 - 2);
        const heightAvailable = Math.max(1, innerHeight - margin * 2 - 2);
        dialog.style.setProperty('--video-dialog-width', Math.min(limit, widthAvailable, heightAvailable * ratio) + 'px');
        dialog.style.setProperty('--video-ratio', String(ratio));
    }
    function state(name) {
        dialog.dataset.state = name;
        video.setAttribute('aria-busy', String(name === 'loading'));
        notice.hidden = !['loading', 'error', 'blocked', 'cancelled'].includes(name);
        recovery.hidden = !['loading', 'error', 'cancelled'].includes(name);
        recovery.textContent = name === 'loading' ? translate('video.cancel', 'Annuler') : translate('video.retry', 'Réessayer');
        const fallback = {loading: 'Chargement de la vidéo…', error: 'Lecture impossible. Vous pouvez réessayer.', blocked: 'Utilisez le bouton de lecture du lecteur pour démarrer la vidéo.', cancelled: 'Chargement annulé. Vous pouvez réessayer.'};
        status.textContent = fallback[name] ? translate('video.' + name, fallback[name]) : '';
    }
    function release() {
        attempt++;
        requested = false;
        if (source && video.currentTime > 0) positions.set(source, video.currentTime);
        video.pause();
        video.removeAttribute('src');
        video.preload = 'none';
        video.load();
    }
    function mount() {
        if (video.hasAttribute('src')) return;
        video.src = source;
        video.preload = 'metadata';
        video.load();
    }
    async function play() {
        if (video.error) release();
        mount();
        requested = true;
        video.preload = 'auto';
        const ticket = ++attempt;
        state('loading');
        try { await video.play(); }
        catch (error) {
            if (ticket !== attempt || !dialog.open || error.name === 'AbortError') return;
            requested = false;
            if (error.name === 'NotAllowedError') state('blocked');
            else state('error');
        }
    }
    function close() { release(); if (dialog.open) dialog.close(); }
    triggers.forEach(button => {
        button.setAttribute('aria-haspopup', 'dialog');
        button.addEventListener('click', () => {
            trigger = button;
            source = button.dataset.videoSrc;
            ratio = Number(button.dataset.videoRatio) || 16 / 9;
            video.poster = button.dataset.videoPoster || '';
            video.muted = sound.muted;
            video.volume = sound.volume;
            video.setAttribute('aria-label', translate('video.label', 'Gameplay de ' + button.dataset.videoTitle, {title: button.dataset.videoTitle}));
            dialog.querySelector('h2').textContent = translate('video.title', 'Gameplay · ' + button.dataset.videoTitle, {title: button.dataset.videoTitle});
            document.dispatchEvent(new Event('portfolio:video-open'));
            document.body.setAttribute('data-video-open', '');
            dialog.showModal();
            video.focus();
            resize();
            play();
        });
    });
    recovery.addEventListener('click', () => {
        if (dialog.dataset.state === 'loading') { release(); state('cancelled'); recovery.focus(); }
        else play();
    });
    video.addEventListener('volumechange', () => { sound = {muted: video.muted, volume: video.volume}; });
    video.addEventListener('loadedmetadata', () => {
        if (video.videoWidth && video.videoHeight) ratio = video.videoWidth / video.videoHeight;
        resize();
        const position = positions.get(source) || 0;
        if (position > 0 && position < video.duration) video.currentTime = position;
    });
    video.addEventListener('play', () => { requested = true; });
    video.addEventListener('playing', () => state('playing'));
    video.addEventListener('canplay', () => { if (!requested) state('ready'); });
    video.addEventListener('waiting', () => { if (requested) state('loading'); });
    video.addEventListener('pause', () => { requested = false; if (dialog.open && video.hasAttribute('src') && !video.error) state('paused'); });
    video.addEventListener('ended', () => { requested = false; state('paused'); });
    video.addEventListener('error', () => { if (dialog.open && video.hasAttribute('src')) { requested = false; state('error'); } });
    let outside = false;
    function isOutside(event) {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener('pointerdown', event => { outside = isOutside(event); });
    dialog.addEventListener('click', event => { if (outside && isOutside(event)) close(); });
    dialog.addEventListener('cancel', event => {
        event.preventDefault();
        if (!document.fullscreenElement && performance.now() - lastFullscreenExit >= 250) close();
    });
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape' && document.fullscreenElement) {
            event.preventDefault(); event.stopPropagation(); document.exitFullscreen().catch(() => {});
        }
    }, true);
    // Let Tab visit the native media controls, then wrap at the dialog boundary.
    document.addEventListener('keyup', event => {
        if (event.key === 'Tab' && dialog.open && !dialog.contains(document.activeElement)) (event.shiftKey && !recovery.hidden ? recovery : video).focus({preventScroll: true});
    });
    document.addEventListener('focusin', event => {
        if (dialog.open && !dialog.contains(event.target)) video.focus({preventScroll: true});
    });
    dialog.addEventListener('close', () => {
        release();
        document.body.removeAttribute('data-video-open');
        trigger?.focus({preventScroll: true});
    });
    document.addEventListener('fullscreenchange', () => {
        if (fullscreen && !document.fullscreenElement) lastFullscreenExit = performance.now();
        fullscreen = Boolean(document.fullscreenElement);
        if (!fullscreen) resize();
    });
    window.addEventListener('resize', resize);
    document.addEventListener('portfolio:language-change', () => {
        dialog.lang = window.portfolioI18n?.language || 'fr';
        if (!trigger) return;
        video.setAttribute('aria-label', translate('video.label', 'Gameplay de ' + trigger.dataset.videoTitle, {title: trigger.dataset.videoTitle}));
        state(dialog.dataset.state);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && dialog.open) video.pause(); });
})();
