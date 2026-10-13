/* Finite deformation shared by the skin and its contents, with a fixed hit area. */
(() => {
    const root = document.querySelector('[data-toon-root]');
    if (!root || !window.KeyframeEffect || !window.Animation) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const running = new Map();
    const appearances = new Set();
    const menus = new Set();
    const compactMenus = new Map();
    const selector = '.ds-button, .ds-menu-toggle, .ds-language-toggle, .ds-filters button, .ds-menu-panel a, .ds-menu-panel button, .ds-language-panel button, .ds-card, .ds-logo, .ds-social-link, .dot';
    const enabled = () => root.classList.contains('ds-toon') && root.dataset.motion !== 'off' && !preference.matches && !document.hidden;
    const pressed = new Set();
    const bound = new WeakSet();
    const easing = 'cubic-bezier(.37, 0, .63, 1)';
    const menuCurve = [.22, .75, .32, .88];
    const menuTiming = {open: 300, close: 280, easing: `cubic-bezier(${menuCurve.join(',')})`};
    function pushUntil(progress) {
        const [x1, y1, x2, y2] = menuCurve;
        if (progress <= 0) return {amount: 0, easing: menuTiming.easing, slope: y1 / x1};
        if (progress >= 1) return {amount: 1, easing: menuTiming.easing, slope: (1 - y2) / (1 - x2)};
        const point = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
        const derivative = (t, a, b) => 3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * (b - a) + 3 * t ** 2 * (1 - b);
        let low = 0, high = 1;
        for (let i = 0; i < 20; i++) {
            const t = (low + high) / 2;
            if (point(t, x1, x2) < progress) low = t; else high = t;
        }
        const t = (low + high) / 2;
        const amount = point(t, y1, y2);
        // Split the actual push curve at release, preserving its trajectory
        // and instantaneous velocity instead of restarting an easing curve.
        const ax = t * x1, ay = t * y1;
        const bx = x1 + t * (x2 - x1), by = y1 + t * (y2 - y1);
        const cx = ax + t * (bx - ax), cy = ay + t * (by - ay);
        return {
            amount,
            easing: `cubic-bezier(${ax / progress}, ${ay / amount}, ${cx / progress}, ${cy / amount})`,
            slope: derivative(t, y1, y2) / derivative(t, x1, x2),
        };
    }
    function motionValue(token, fallback, min, max) {
        const value = parseFloat(getComputedStyle(root).getPropertyValue(token));
        return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
    }
    const menuOpenDuration = () => motionValue('--ds-toon-menu-open', menuTiming.open, 200, 800);
    function globeElasticity() {
        const amplitude = Number(getComputedStyle(root).getPropertyValue('--ds-toon-amplitude')) || 1;
        return {
            stretch: motionValue('--ds-toon-globe-stretch', 200, 60, 600),
            hang: motionValue('--ds-toon-globe-hang', 100, 0, 600),
            settle: motionValue('--ds-toon-globe-settle', 200, 120, 900),
            globeTravel: motionValue('--ds-toon-globe-travel', 15, 6, 40) * amplitude,
            globeWiden: motionValue('--ds-toon-globe-widen', 5, 0, 35) / 100 * amplitude,
            globeFlatten: motionValue('--ds-toon-globe-flatten', 7, 0, 30) / 100 * amplitude,
        };
    }
    function skinTransform(host) {
        const compact = compactMenus.get(host);
        return getComputedStyle(compact?.panel.hidden ? compact.surface : host, compact?.panel.hidden ? null : '::before').transform;
    }

    function cancel(host) {
        running.get(host)?.forEach(animation => animation.cancel());
        running.delete(host);
        host.dataset.toonState = 'idle';
    }
    function stopAll() {
        for (const host of running.keys()) cancel(host);
        for (const animation of appearances) animation.cancel();
        appearances.clear();
        for (const host of pressed) host.removeAttribute('data-toon-pressed');
        pressed.clear();
        menus.forEach(menu => menu.sync(false));
    }
    function play(host, kind, capturedStart) {
        if (!enabled() || host.matches(':disabled, [aria-disabled="true"]') || host.closest('[data-no-toon-motion]')) return;
        const compact = compactMenus.get(host);
        // Bounce a closed contour with its icon. An open panel stays readable;
        // only its icon repeats the same spring.
        const surface = compact?.panel.hidden ? compact.surface : null;
        const pseudo = surface ? null : '::before';
        const dot = host.classList.contains('dot');
        // Once started, a dot finishes its spring even after exit or blur.
        // Re-entry during that spring does not restart it.
        if (dot && (kind !== 'enter' || running.has(host))) return;
        const initial = getComputedStyle(surface || host, pseudo);
        const start = capturedStart || initial.transform;
        const startRadius = initial.borderRadius;
        cancel(host);
        if (kind === 'leave' && start === 'none') return;
        const css = getComputedStyle(root);
        let amp = Number(css.getPropertyValue('--ds-toon-amplitude')) || 1;
        amp *= Number(getComputedStyle(host).getPropertyValue('--ds-toon-component-amplitude')) || 1;
        const card = host.classList.contains('ds-card');
        const logo = host.classList.contains('ds-logo');
        let frames, duration;
        const total = parseFloat(css.getPropertyValue('--ds-toon-duration')) || 700;
        const pose = (x, y, lift = 0) => `translateY(${lift * amp}px) scale(${1 + x * amp}, ${1 + y * amp})`;
        const scale = amount => `scale(${1 + amount * amp})`;
        const restRadius = initial.borderRadius;
        const radius = parseFloat(initial.borderTopLeftRadius) || 20;
        const softRadius = (wide, tall) => {
            wide = 1 + (wide - 1) * amp;
            tall = 1 + (tall - 1) * amp;
            return `${radius * wide}px ${radius * wide * .94}px ${radius * tall * 1.04}px ${radius * tall}px / ${radius * tall}px ${radius * tall * 1.03}px ${radius * wide * .96}px ${radius * wide}px`;
        };
        if (kind === 'leave') {
            frames = [{transform: start}, {transform: 'none'}];
            duration = parseFloat(css.getPropertyValue('--ds-toon-return')) || 230;
        } else if (dot) {
            frames = [
                {transform: start, offset: 0},
                {transform: scale(.45), offset: .20},
                {transform: scale(-.12), offset: .40},
                {transform: scale(.20), offset: .59},
                {transform: scale(-.055), offset: .75},
                {transform: scale(.05), offset: .88},
                {transform: 'none', offset: 1},
            ];
            duration = parseFloat(css.getPropertyValue('--ds-toon-dot-duration')) || 650;
        } else if (kind === 'press') {
            frames = [{transform: start}, {transform: pose(.14, -.20, 1)}];
            duration = 110;
        } else if (kind === 'release') {
            frames = [
                {transform: start, offset: 0},
                {transform: pose(-.085, .16, -1), offset: .30},
                {transform: pose(.065, -.07, .5), offset: .55},
                {transform: pose(-.025, .045, -.35), offset: .76},
                {transform: 'none', offset: 1},
            ];
            duration = total * .78;
        } else {
            frames = [
                {transform: start, offset: 0},
                {transform: pose(.12, -.16, 1), offset: .13},
                {transform: pose(-.16, .28, -2), offset: .35},
                {transform: pose(-.09, .17, -2), offset: .47},
                {transform: pose(.13, -.14, .65), offset: .65},
                {transform: pose(-.06, .10, -.75), offset: .79},
                {transform: pose(.035, -.04, .3), offset: .90},
                {transform: 'none', offset: 1},
            ];
            duration = total;
            if (!card && !logo) {
                const shapes = [startRadius, softRadius(1.2, .85), softRadius(.88, 1.25), softRadius(.94, 1.15), softRadius(1.18, .88), softRadius(.95, 1.08), softRadius(1.04, .98), restRadius];
                frames.forEach((frame, index) => { frame.borderRadius = shapes[index]; });
            }
        }
        let effect;
        try {
            // Easing each segment keeps the successive oscillations continuous.
            frames.slice(0, -1).forEach(frame => { frame.easing = easing; });
            effect = new KeyframeEffect(surface || host, frames, {duration, easing: 'linear', pseudoElement: pseudo, fill: 'none'});
            if (pseudo && effect.pseudoElement !== pseudo) return;
        } catch { return; } // The CSS skin feedback remains available on older browsers.
        const animation = new Animation(effect, document.timeline);
        const group = [animation];
        if (!dot) {
            // Each child uses the skin's origin in page coordinates. This keeps
            // text, icons and images together without changing the layout.
            const skin = getComputedStyle(surface || host, pseudo);
            const hostStyle = getComputedStyle(host);
            const box = host.getBoundingClientRect();
            const [originX, originY] = skin.transformOrigin.split(' ').map(parseFloat);
            const x = box.left + (surface ? surface.offsetLeft : parseFloat(hostStyle.borderLeftWidth) + parseFloat(skin.left)) + originX;
            const y = box.top + (surface ? surface.offsetTop : parseFloat(hostStyle.borderTopWidth) + parseFloat(skin.top)) + originY;
            const contentFrames = frames.map(({borderRadius, ...frame}) => frame);
            for (const content of host.querySelectorAll(':scope > [data-toon-content]')) {
                const previousTransform = content.style.transform;
                content.style.transform = 'none';
                const contentBox = content.getBoundingClientRect();
                content.style.transform = previousTransform;
                content.style.transformOrigin = `${x - contentBox.left}px ${y - contentBox.top}px`;
                group.push(new Animation(new KeyframeEffect(content, contentFrames, {duration, easing: 'linear', fill: 'none'}), document.timeline));
            }
        }
        running.set(host, group);
        host.dataset.toonState = kind;
        const time = document.timeline.currentTime;
        group.forEach(item => { item.play(); item.startTime = time; });
        animation.finished.then(() => {
            if (running.get(host) === group) { running.delete(host); host.dataset.toonState = 'idle'; }
        }).catch(() => {});
    }
    function prepareContents(host) {
        if (host.classList.contains('dot')) return;
        // Text nodes need a transformable box, just like existing icons.
        for (const node of [...host.childNodes]) {
            if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
            const text = document.createElement('span');
            text.className = 'ds-toon-text';
            node.replaceWith(text);
            text.append(node);
        }
        for (const content of host.children) {
            if (!content.matches('.ds-tooltip, .ds-sr-only')) content.setAttribute('data-toon-content', '');
        }
    }
    function bind(host) {
        prepareContents(host);
        if (bound.has(host)) return;
        bound.add(host);
        host.addEventListener('pointerenter', () => play(host, 'enter'));
        host.addEventListener('pointerleave', () => {
            const start = skinTransform(host);
            host.removeAttribute('data-toon-pressed');
            pressed.delete(host);
            play(host, 'leave', start);
        });
        host.addEventListener('focus', () => { if (host.matches(':focus-visible')) play(host, 'enter'); });
        host.addEventListener('blur', () => play(host, 'leave'));
        host.addEventListener('pointerdown', event => {
            if (event.button !== 0 || host.matches(':disabled') || !enabled()) return;
            if (host.classList.contains('dot')) return;
            const start = skinTransform(host);
            host.setAttribute('data-toon-pressed', '');
            pressed.add(host);
            play(host, 'press', start);
        });
        host.addEventListener('keydown', event => {
            if (event.repeat || !['Enter', ' '].includes(event.key) || !enabled()) return;
            if (event.key === ' ' && host.tagName === 'A') return;
            if (host.classList.contains('dot')) return;
            const start = skinTransform(host);
            host.setAttribute('data-toon-pressed', '');
            pressed.add(host);
            play(host, 'press', start);
        });
        host.addEventListener('keyup', event => {
            if (!['Enter', ' '].includes(event.key)) return;
            if (!pressed.has(host)) return;
            const start = skinTransform(host);
            host.removeAttribute('data-toon-pressed');
            pressed.delete(host);
            play(host, 'release', start);
        });
    }
    root.querySelectorAll(selector).forEach(bind);
    function release() {
        for (const host of pressed) {
            const start = skinTransform(host);
            host.removeAttribute('data-toon-pressed');
            play(host, 'release', start);
        }
        pressed.clear();
    }
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', stopAll);
    window.addEventListener('blur', stopAll);
    preference.addEventListener('change', stopAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
    window.addEventListener('resize', () => menus.forEach(menu => menu.sync(false)));
    new MutationObserver(() => {
        if (!enabled()) stopAll();
        else menus.forEach(menu => menu.sync(false));
    }).observe(root, {attributes: true, attributeFilter: ['class', 'data-motion', 'data-intensity']});
    // Translation can replace a label or rebuild a menu after initial binding.
    new MutationObserver(records => {
        for (const {target, addedNodes} of records) {
            if (target.nodeType === Node.ELEMENT_NODE && target.matches(selector)) bind(target);
            for (const node of addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;
                if (node.matches(selector)) bind(node);
                node.querySelectorAll(selector).forEach(bind);
            }
        }
    }).observe(root, {childList: true, subtree: true});

    // Newly opened containers translate softly, without stretching their contents.
    const observer = new MutationObserver(records => {
        for (const {target, attributeName} of records) {
            if (!enabled() || target.matches('.ds-menu-panel, .ds-language-panel') && target.closest('[data-toon-menu]') || (attributeName === 'hidden' ? target.hidden : !target.open)) continue;
            const surface = target.matches('details') ? target.querySelector('ul') : target;
            if (!surface) continue;
            const animation = surface.animate([{opacity: 0, transform: 'translateY(5px)'}, {opacity: 1, transform: 'none'}], {duration: 180, easing: 'ease-out'});
            appearances.add(animation);
            animation.finished.then(() => appearances.delete(animation)).catch(() => appearances.delete(animation));
        }
    });
    root.querySelectorAll('.ds-menu-panel, .ds-language-panel, .ds-details, .ds-video-dialog').forEach(host => observer.observe(host, {attributes: true, attributeFilter: ['hidden', 'open']}));

    root.querySelectorAll('[data-compact-nav]').forEach(nav => {
        const items = nav.querySelectorAll('[data-toon-compact-item]');
        if (!items.length) return;
        nav.setAttribute('data-toon-menu', '');
        items.forEach(item => {
        const toggle = item.querySelector('.ds-menu-toggle, .ds-language-toggle');
        const panel = item.querySelector('.ds-menu-panel, .ds-language-panel');
        if (!toggle || !panel) return;
        const surface = document.createElement('div');
        surface.className = 'ds-toon-menu-surface';
        surface.setAttribute('aria-hidden', 'true');
        item.prepend(surface);
        let shellAnimation, contentAnimation, lastPose, lastOpen;
        function sync(animate = true) {
            const open = !panel.hidden;
            if (panel.classList.contains('ds-menu-panel')) {
                // Leave room for the adjacent globe and its approved overshoot.
                // Use the actual right edge: a gallery example can be inset
                // farther than the fixed controls on the public pages.
                const css = getComputedStyle(root);
                const inset = parseFloat(css.getPropertyValue('--ds-nav-inset')) || 16;
                const gap = parseFloat(css.getPropertyValue('--ds-nav-gap')) || 8;
                const elastic = globeElasticity();
                const globe = nav.querySelector('.ds-language-toggle');
                const width = globe?.offsetWidth || 0;
                const reserve = globe ? width + gap + elastic.globeTravel + width * elastic.globeWiden / 2 + 4 : 0;
                const available = Math.max(toggle.offsetWidth, Math.floor(nav.getBoundingClientRect().right - inset - reserve));
                nav.style.setProperty('--ds-toon-menu-available-width', available + 'px');
            }
            // Layout coordinates avoid measuring hover and sideways spring poses.
            const button = {left: toggle.offsetLeft, top: toggle.offsetTop, right: toggle.offsetLeft + toggle.offsetWidth, bottom: toggle.offsetTop + toggle.offsetHeight};
            const list = open ? {left: panel.offsetLeft, right: panel.offsetLeft + panel.offsetWidth, bottom: panel.offsetTop + panel.offsetHeight} : button;
            const left = Math.min(button.left, list.left);
            const top = button.top;
            const css = getComputedStyle(root);
            const target = {
                left: `${left}px`, top: `${top}px`,
                width: `${Math.max(button.right, list.right) - left}px`,
                height: `${Math.max(button.bottom, list.bottom) - top}px`,
                borderRadius: css.getPropertyValue(open ? '--ds-toon-menu-expanded-shape' : '--ds-toon-menu-shape').trim(),
            };
            const signature = JSON.stringify(target);
            if (animate && signature === lastPose && open === lastOpen) return;
            const current = getComputedStyle(surface);
            const start = Object.fromEntries(Object.keys(target).map(key => [key, current[key]]));
            cancel(toggle);
            shellAnimation?.cancel();
            contentAnimation?.cancel();
            Object.assign(surface.style, target);
            const transition = {open, duration: open ? menuOpenDuration() : menuTiming.close, startTime: document.timeline.currentTime};
            if (animate && enabled() && lastPose) {
                // Panels deploy directly to their final size. Elastic inertia
                // belongs only to the displaced language module.
                shellAnimation = surface.animate([start, target], {duration: transition.duration, easing: menuTiming.easing, fill: 'none'});
                shellAnimation.startTime = transition.startTime;
                if (open && !lastOpen) {
                    contentAnimation = panel.animate([
                        {opacity: 0, transform: 'translateY(3px)'},
                        {opacity: 1, transform: 'none'},
                    ], {delay: transition.duration * .38, duration: 180, easing: 'ease-out', fill: 'backwards'});
                }
            }
            lastPose = signature;
            lastOpen = open;
            controller.onSync?.(animate, transition);
        }
        const controller = {sync, surface, panel};
        compactMenus.set(toggle, controller);
        menus.add(controller);
        new MutationObserver(() => sync()).observe(toggle, {attributes: true, attributeFilter: ['aria-expanded']});
        new MutationObserver(() => sync()).observe(panel, {attributes: true, attributeFilter: ['hidden']});
        const resize = new ResizeObserver(() => sync());
        [item, toggle, panel].forEach(node => resize.observe(node));
        sync(false);
        });

        const languageItem = nav.querySelector('.ds-language-item');
        const navigationPanel = nav.querySelector('.ds-menu-panel');
        const navigationToggle = nav.querySelector('.ds-menu-toggle');
        if (!languageItem || !navigationPanel || !navigationToggle) return;
        let shiftAnimation, lastShift;
        function shift(animate = true, transition) {
            const target = root.classList.contains('ds-toon') && !navigationPanel.hidden ? -Math.max(0, navigationPanel.offsetWidth - navigationToggle.offsetWidth) : 0;
            if (animate && target === lastShift) return;
            const current = getComputedStyle(languageItem).transform;
            const startX = current === 'none' ? 0 : new DOMMatrixReadOnly(current).m41;
            shiftAnimation?.cancel();
            languageItem.style.transform = `translateX(${target}px)`;
            if (animate && enabled() && lastShift !== undefined && target !== startX) {
                const pose = (x, widen = 0, flatten = 0) => ({transform: `translateX(${x}px) scale(${1 + widen}, ${1 - flatten})`});
                const opening = transition?.open ?? target < startX;
                const pushDuration = transition?.duration ?? (opening ? menuOpenDuration() : menuTiming.close);
                const elastic = opening ? globeElasticity() : null;
                // The adjustable release point belongs to the deployment clock;
                // stretch begins there, preserving the instantaneous velocity.
                const releaseTime = elastic ? pushDuration * motionValue('--ds-toon-globe-start', 55, 0, 100) / 100 : pushDuration;
                const push = elastic ? pushUntil(releaseTime / pushDuration) : {amount: 1, easing: menuTiming.easing, slope: 0};
                const releaseX = startX + (target - startX) * push.amount;
                const duration = releaseTime + (elastic ? elastic.stretch + elastic.hang + elastic.settle : 0);
                const exitSpeed = Math.abs(target - startX) / pushDuration * push.slope;
                const travel = elastic ? Math.abs(target - elastic.globeTravel - releaseX) : 1;
                const resistance = elastic ? `cubic-bezier(.25, ${Math.min(.95, exitSpeed * elastic.stretch / travel * .25)}, .55, 1)` : 'linear';
                const frames = [{transform: current === 'none' ? pose(startX).transform : current, offset: 0, easing: releaseTime > 0 ? push.easing : resistance}];
                if (releaseTime > 0) frames.push({...pose(releaseX), offset: releaseTime / duration, easing: resistance});
                if (elastic) frames.push(
                    {...pose(target - elastic.globeTravel, elastic.globeWiden, elastic.globeFlatten), offset: (releaseTime + elastic.stretch) / duration, easing: 'linear'},
                    {...pose(target - elastic.globeTravel, elastic.globeWiden, elastic.globeFlatten), offset: (releaseTime + elastic.stretch + elastic.hang) / duration, easing: 'cubic-bezier(.55, 0, .28, 1)'},
                    {...pose(target), offset: 1},
                );
                shiftAnimation = languageItem.animate(frames, {duration, easing: 'linear', fill: 'none'});
                if (transition) shiftAnimation.startTime = transition.startTime;
            }
            lastShift = target;
        }
        // The navigation shell drives the globe directly; independent observers
        // would introduce a different start time or restart its displacement.
        compactMenus.get(navigationToggle).onSync = shift;
        shift(false);
        nav.addEventListener('toon:replay-menu', () => {
            if (!enabled()) return;
            if (!navigationPanel.hidden) navigationToggle.click();
            const languageToggle = nav.querySelector('.ds-language-toggle');
            const languagePanel = nav.querySelector('.ds-language-panel');
            if (languagePanel && !languagePanel.hidden) languageToggle.click();
            // Reset the preview before reopening, including an unfinished recoil.
            [languageToggle, navigationToggle].forEach(button => compactMenus.get(button)?.sync(false));
            navigationToggle.click();
        });
    });
    // Preview controls can replay one recipe without an infinite animation.
    root.addEventListener('toon:replay', () => root.querySelectorAll('[data-motion-sample]').forEach(host => {
        const box = host.getBoundingClientRect();
        if (box.bottom > 0 && box.top < innerHeight) play(host, 'enter');
    }));
    root.addEventListener('toon:cancel', stopAll);
})();
