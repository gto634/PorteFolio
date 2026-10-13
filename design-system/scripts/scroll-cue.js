/* Reusable reference of the Intro triangle and its squash-and-stretch bounce.
   Repetition is opt-in and requires a visible pause control. */
(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const poses = [
        {transform: 'translateY(0) scale(1, 1)', offset: 0},
        {transform: 'translateY(2px) scale(1.22, 0.8)', offset: .14},
        {transform: 'translateY(-7px) scale(0.76, 1.32)', offset: .4},
        {transform: 'translateY(-7px) scale(0.88, 1.16)', offset: .57},
        {transform: 'translateY(1px) scale(1.24, 0.78)', offset: .77},
        {transform: 'translateY(0) scale(1, 1)', offset: 1},
    ];
    document.querySelectorAll('[data-scroll-cue]').forEach(link => {
        const icon = link.querySelector('.ds-scroll-cue-icon');
        if (!icon?.animate || !window.IntersectionObserver) return;
        const toggle = document.getElementById(link.dataset.scrollCueToggle);
        const motionRoot = link.closest('[data-motion]');
        const repeated = link.hasAttribute('data-scroll-cue-repeat') && !!toggle;
        let visible = false, paused = false, animation, timer = 0;
        const restricted = () => preference.matches || motionRoot?.dataset.motion === 'off';
        const canMove = () => visible && !paused && !document.hidden && !restricted();
        function stop() {
            clearTimeout(timer);
            timer = 0;
            animation?.cancel();
            animation = undefined;
            link.dataset.bounceState = 'idle';
        }
        function timing(name, fallback) {
            return parseFloat(getComputedStyle(link).getPropertyValue(name)) || fallback;
        }
        function play(delay = 0) {
            if (!canMove()) return;
            stop();
            const duration = timing('--ds-cue-bounce-duration', 900);
            const current = icon.animate(poses, {duration, delay, iterations: 1, easing: 'ease-in-out'});
            animation = current;
            link.dataset.bounceState = 'playing';
            link.dataset.bounceCount = String(Number(link.dataset.bounceCount || 0) + 1);
            current.finished.then(() => {
                if (animation !== current) return;
                animation = undefined;
                link.dataset.bounceState = 'idle';
                if (repeated && canMove()) timer = setTimeout(() => {
                    timer = 0;
                    play();
                }, Math.max(0, timing('--ds-cue-bounce-period', 1500) - duration));
            }).catch(() => {}); // Offscreen and preference changes cancel normally.
        }
        function sync() {
            if (toggle) {
                toggle.hidden = false;
                toggle.disabled = restricted();
                toggle.setAttribute('aria-pressed', String(!paused && !restricted()));
                const state = toggle.querySelector('[data-cue-state]');
                if (state) state.textContent = preference.matches ? 'Réduits' : paused || restricted() ? 'Arrêtés' : 'Activés';
            }
            if (!canMove()) { stop(); return; }
            if (!animation && !timer) play(timing('--ds-cue-bounce-delay', 650));
        }
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .35;
            sync();
        }, {root: link.closest('.scroll-container'), threshold: [0, .35]}).observe(link);
        link.addEventListener('pointerenter', () => play());
        link.addEventListener('focus', () => play());
        toggle?.addEventListener('click', () => { paused = !paused; sync(); });
        document.addEventListener('visibilitychange', sync);
        preference.addEventListener('change', sync);
        if (motionRoot) new MutationObserver(sync).observe(motionRoot, {attributes: true, attributeFilter: ['data-motion']});
        sync();
    });
})();
