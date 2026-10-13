/* Featured screens: one wheel gesture per transition, long content in one scroll. */
(() => {
    const container = document.querySelector('.scroll-container');
    if (!container) return;
    const sections = [...container.querySelectorAll('.planche, .end-banner')];
    const dots = [...document.querySelectorAll('.dot')];
    const featured = document.body.classList.contains('showcase-page');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const token = name => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    let scrollFrame = 0, current = 0, updateFrame = 0;
    let gesture = {time: -Infinity, direction: 0, amount: 0, consumed: false};
    function startOf(section) {
        return section.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    }
    function topOf(section) {
        let target = startOf(section);
        if (section.classList.contains('end-banner')) target += section.getBoundingClientRect().height - container.clientHeight;
        return Math.max(0, Math.min(Math.ceil(target), container.scrollHeight - container.clientHeight));
    }
    function active(index) {
        current = index;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            if (i === index) dot.setAttribute('aria-current', 'location');
            else dot.removeAttribute('aria-current');
        });
        if (!featured) return;
        const destination = sections[index]?.id === 'intro' ? 'intro' : sections[index]?.id === 'contact' ? 'contact' : 'featured';
        document.querySelectorAll('[data-nav-destination]').forEach(link => {
            if (link.dataset.navDestination === destination) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }
    function indexAtPosition() {
        if (container.scrollTop >= container.scrollHeight - container.clientHeight - 2) return sections.length - 1;
        let index = 0;
        sections.forEach((section, i) => { if (startOf(section) <= container.scrollTop + 2) index = i; });
        return index;
    }
    function stop() { cancelAnimationFrame(scrollFrame); scrollFrame = 0; }
    function go(index, {focus = false, animate = true} = {}) {
        if (index < 0 || index >= sections.length) return;
        stop();
        const section = sections[index];
        const from = container.scrollTop;
        const duration = animate && !reducedMotion.matches ? token('--ds-duration-scroll') : 0;
        const started = performance.now();
        active(index);
        function step(now) {
            const t = duration ? Math.min((now - started) / duration, 1) : 1;
            const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
            container.scrollTop = from + (topOf(section) - from) * eased;
            if (t < 1) scrollFrame = requestAnimationFrame(step);
            else {
                scrollFrame = 0;
                if (focus) {
                    const title = section.querySelector('h1, h2') || section;
                    title.setAttribute('tabindex', '-1');
                    title.focus({preventScroll: true});
                }
            }
        }
        scrollFrame = requestAnimationFrame(step);
    }
    document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const index = sections.findIndex(section => '#' + section.id === link.hash);
        if (index < 0) return;
        event.preventDefault();
        gesture.consumed = true;
        if (location.hash !== link.hash) history.pushState(null, '', link.hash);
        go(index, {focus: true});
    }));
    if (featured) container.addEventListener('wheel', event => {
        if (event.ctrlKey || event.metaKey || event.altKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
        if (document.body.hasAttribute('data-video-open') || event.target.closest('.ds-menu-panel')) return;
        // The Intro retains its existing internal layout and scrolling.
        const nested = event.target.closest('#intro');
        if (nested && nested.scrollHeight > nested.clientHeight + 2) {
            const room = event.deltaY > 0 ? nested.scrollHeight - nested.clientHeight - nested.scrollTop : nested.scrollTop;
            if (room > 2) { stop(); return; }
        }
        event.preventDefault();
        const direction = Math.sign(event.deltaY);
        const now = performance.now();
        if (direction !== gesture.direction || now - gesture.time > token('--ds-wheel-idle')) {
            gesture = {time: now, direction, amount: 0, consumed: false};
        }
        gesture.time = now;
        if (gesture.consumed) return;
        const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? container.clientHeight : 1);
        gesture.amount += Math.abs(delta);
        if (gesture.amount < token('--ds-wheel-threshold')) return;
        const index = scrollFrame ? current : indexAtPosition();
        const section = sections[index];
        const first = topOf(section);
        const last = Math.max(first, Math.floor(startOf(section) + section.getBoundingClientRect().height - container.clientHeight));
        const position = container.scrollTop;
        const room = direction > 0 ? last - position : position - first;
        if (!scrollFrame && room > 2) {
            // Clamp the gesture at the content boundary, giving the actions a reading stop.
            const next = Math.max(first, Math.min(last, position + delta));
            container.scrollTop = next;
            active(index);
            if (Math.abs(next - (direction > 0 ? last : first)) < 2) gesture.consumed = true;
            return;
        }
        gesture.consumed = true;
        go(index + direction);
    }, {passive: false});
    container.addEventListener('touchstart', stop, {passive: true});
    container.addEventListener('pointerdown', stop, {passive: true});
    container.addEventListener('keydown', event => {
        if (['PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) stop();
    });
    document.addEventListener('portfolio:video-open', stop);
    let languageOffset = 0;
    document.addEventListener('portfolio:language-before-change', () => {
        stop();
        current = indexAtPosition();
        languageOffset = container.scrollTop - startOf(sections[current]);
    });
    document.addEventListener('portfolio:language-change', () => {
        const section = sections[current];
        const end = Math.max(topOf(section), startOf(section) + section.getBoundingClientRect().height - container.clientHeight);
        container.scrollTop = Math.max(topOf(section), Math.min(startOf(section) + languageOffset, end));
        active(current);
    });
    container.addEventListener('scroll', () => {
        if (updateFrame || scrollFrame) return;
        updateFrame = requestAnimationFrame(() => { updateFrame = 0; if (!scrollFrame) active(indexAtPosition()); });
    }, {passive: true});
    function restore() {
        gesture.consumed = true;
        const index = sections.findIndex(section => '#' + section.id === location.hash);
        go(index >= 0 ? index : 0, {animate: false, focus: index >= 0 && sections[index].id !== 'intro'});
    }
    window.addEventListener('popstate', restore);
    window.addEventListener('hashchange', restore);
    window.addEventListener('load', restore);
    window.addEventListener('resize', stop);
    active(0);
})();
