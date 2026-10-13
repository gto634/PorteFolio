// One soft bounce every 1.5 seconds.
// Motion is cancelled offscreen, in a hidden tab or with reduced motion enabled.
const intro = document.querySelector('#intro');
const link = intro?.querySelector('#transition-btn');
const triangle = link?.querySelector('.intro-triangle');
if (triangle) {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const poses = [
        { transform: 'translateY(0) scale(1, 1)', offset: 0 },
        { transform: 'translateY(2px) scale(1.22, 0.8)', offset: 0.14 },
        { transform: 'translateY(-7px) scale(0.76, 1.32)', offset: 0.4 },
        { transform: 'translateY(-7px) scale(0.88, 1.16)', offset: 0.57 },
        { transform: 'translateY(1px) scale(1.24, 0.78)', offset: 0.77 },
        { transform: 'translateY(0) scale(1, 1)', offset: 1 },
    ];
    let visible = false, animation, timer = 0;
    function canMove() {
        return visible && !document.hidden && !motion.matches;
    }
    function stop() {
        clearTimeout(timer);
        timer = 0;
        animation?.cancel();
        animation = undefined;
        link.dataset.bounceState = 'idle';
    }
    function play(iterations, delay = 0) {
        if (!canMove() || !triangle.animate) return;
        stop();
        const current = triangle.animate(poses, { duration: 900, delay, iterations, easing: 'ease-in-out' });
        animation = current;
        link.dataset.bounceState = 'playing';
        link.dataset.bounceCount = String(Number(link.dataset.bounceCount || 0) + 1);
        current.finished.then(() => {
            if (animation === current) {
                animation = undefined;
                link.dataset.bounceState = 'idle';
                if (canMove()) timer = setTimeout(() => {
                    timer = 0;
                    play(1);
                }, 600); // 900 ms of motion + 600 ms of rest, keeping the 1.5 s period.
            }
        }).catch(() => {}); // Cancellation on navigation is expected.
    }
    function sync() {
        if (!canMove()) {
            stop();
            return;
        }
        if (!animation && !timer) play(1, 650);
    }
    new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.35;
        sync();
    }, { root: document.querySelector('.scroll-container'), threshold: [0, 0.35] }).observe(intro);
    link.addEventListener('pointerenter', () => play(1));
    link.addEventListener('focus', () => play(1));
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
}
