/* Shared compact navigation and tooltip placement/dismissal. */
(() => {
    function navigationBounds(nav) {
        const boxes = [nav, ...nav.querySelectorAll('.ds-menu-toggle:not([hidden]), .ds-language-toggle:not([hidden]), .ds-menu-panel:not([hidden]), .ds-language-panel:not([hidden])')].map(element => element.getBoundingClientRect());
        return {left: Math.min(...boxes.map(box => box.left)), right: Math.max(...boxes.map(box => box.right)), top: Math.min(...boxes.map(box => box.top)), bottom: Math.max(...boxes.map(box => box.bottom))};
    }
    document.querySelectorAll('[data-compact-nav]').forEach(nav => {
        const toggle = nav.querySelector('.ds-menu-toggle');
        const panel = nav.querySelector('.ds-menu-panel');
        const languageToggle = nav.querySelector('.ds-language-toggle');
        const languagePanel = nav.querySelector('.ds-language-panel');
        const inlineLanguage = nav.querySelector('.ds-language-inline');
        toggle.hidden = false;
        panel.hidden = true;
        if (languageToggle) languageToggle.hidden = false;
        const translate = (key, fallback) => window.portfolioI18n?.t(key) || fallback;
        function labels() {
            toggle.setAttribute('aria-label', panel.hidden ? translate('nav.open', 'Ouvrir le menu') : translate('nav.close', 'Fermer le menu'));
            if (languageToggle) languageToggle.setAttribute('aria-label', languagePanel.hidden ? translate('language.open', 'Choisir la langue, français sélectionné') : translate('language.close', 'Fermer le choix de langue, français sélectionné'));
        }
        function measure() {
            if (nav.classList.contains('ds-compact-nav--example')) return;
            // Dropdowns overlay the page; only the fixed controls reserve space.
            // Including an open panel here would move the project copy below it.
            const controls = nav.querySelector('.ds-compact-controls') || nav;
            document.documentElement.style.setProperty('--ds-navigation-clearance', Math.ceil(controls.getBoundingClientRect().bottom) + 'px');
        }
        function close(returnFocus = false, control = toggle) {
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            if (languagePanel) languagePanel.hidden = true;
            languageToggle?.setAttribute('aria-expanded', 'false');
            labels();
            measure();
            if (returnFocus) control.focus({preventScroll: true});
        }
        toggle.addEventListener('click', () => {
            const opening = panel.hidden;
            close();
            panel.hidden = !opening;
            toggle.setAttribute('aria-expanded', String(!panel.hidden));
            labels();
            measure();
        });
        languageToggle?.addEventListener('click', () => {
            const opening = languagePanel.hidden;
            close();
            languagePanel.hidden = !opening;
            languageToggle.setAttribute('aria-expanded', String(opening));
            labels();
            measure();
        });
        (inlineLanguage || languagePanel)?.querySelectorAll('[data-language]').forEach(button => {
            button.addEventListener('click', () => {
                if (!inlineLanguage) close(true, languageToggle);
                window.portfolioI18n?.setLanguage(button.dataset.language);
            });
        });
        panel.addEventListener('click', event => { if (event.target.closest('a')) close(); });
        nav.addEventListener('wheel', event => {
            if (event.ctrlKey || event.metaKey) return;
            const activePanel = event.target.closest('.ds-menu-panel, .ds-language-panel');
            const room = activePanel && !activePanel.hidden && (event.deltaY > 0 ? activePanel.scrollHeight - activePanel.clientHeight - activePanel.scrollTop : activePanel.scrollTop);
            if (!room || room < 2) event.preventDefault();
        }, {passive: false});
        document.addEventListener('pointerdown', event => { if (!nav.contains(event.target)) close(); });
        nav.addEventListener('focusout', event => {
            if (event.relatedTarget && !nav.contains(event.relatedTarget)) close();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && (!panel.hidden || languagePanel && !languagePanel.hidden) && !document.querySelector('.ds-video-dialog[open]')) {
                event.preventDefault(); close(true, languagePanel && !languagePanel.hidden ? languageToggle : toggle);
            }
        });
        document.addEventListener('portfolio:video-open', () => close());
        document.addEventListener('portfolio:language-change', () => { labels(); measure(); });
        const resize = new ResizeObserver(measure);
        [nav, panel, languagePanel].filter(Boolean).forEach(element => resize.observe(element));
        window.addEventListener('resize', measure);
        labels();
        measure();
    });
    // Fixed controls must not hide the next keyboard destination after a scroll.
    document.addEventListener('focusin', event => {
        const target = event.target;
        const nav = document.querySelector('.ds-compact-nav:not(.ds-compact-nav--example)');
        if (!nav || nav.contains(target) || document.body.hasAttribute('data-video-open') || !target.matches(':focus-visible')) return;
        const box = target.getBoundingClientRect(), cover = navigationBounds(nav);
        if (box.left < cover.right && box.right > cover.left && box.top < cover.bottom + 8 && box.bottom > cover.top) {
            const scroll = target.closest('.scroll-container') || document.scrollingElement;
            const section = target.closest('.project-screen');
            const sectionStart = section ? section.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop : 0;
            scroll.scrollTop = Math.max(sectionStart, scroll.scrollTop - (cover.bottom + 16 - box.top));
        }
    });
    document.querySelector('.catalogue-page .ds-skip')?.addEventListener('click', () => {
        requestAnimationFrame(() => document.querySelector('.catalogue h1')?.focus({preventScroll: true}));
    });

    const quietTips = new Set();
    document.querySelectorAll('.ds-logo, .dot, .ds-tooltip-trigger, .ds-social-link').forEach(host => {
        const quiet = !!host.closest('[data-tooltip-policy="quiet"]');
        let tip = host.querySelector('.ds-tooltip');
        if (!tip && host.classList.contains('dot')) {
            host.setAttribute('aria-label', host.getAttribute('aria-label') || host.title);
            tip = document.createElement('span');
            tip.className = 'ds-tooltip';
            tip.setAttribute('aria-hidden', 'true');
            tip.textContent = host.getAttribute('aria-label');
            if (host.dataset.i18nAriaLabel) tip.dataset.i18n = host.dataset.i18nAriaLabel;
            host.append(tip);
        }
        if (!tip) return;
        host.removeAttribute('title');
        let timer, showTimer;
        function dismiss() {
            clearTimeout(timer);
            clearTimeout(showTimer);
            host.classList.remove('is-tooltip-open');
            host.classList.add('is-tooltip-dismissed');
        }
        const record = {host, dismiss};
        if (quiet) quietTips.add(record);
        function place() {
            const box = host.getBoundingClientRect();
            if (quiet && (box.bottom <= 0 || box.top >= innerHeight || box.right <= 0 || box.left >= innerWidth)) {
                dismiss();
                return;
            }
            tip.classList.add('is-positioned');
            const bounds = tip.getBoundingClientRect();
            const dot = host.classList.contains('dot');
            let x = dot ? box.left - bounds.width - 8 : box.left + box.width / 2 - bounds.width / 2;
            let y = dot ? box.top + (box.height - bounds.height) / 2 : box.top - bounds.height - 8;
            let placement = dot ? 'left' : 'above';
            if (quiet && dot && x < 16) { x = box.right + 8; placement = 'right'; }
            if (quiet && !dot && y < 16) { y = box.bottom + 8; placement = 'below'; }
            if (quiet && host.matches('.ds-tooltip-trigger')) {
                if (box.right + bounds.width + 8 <= innerWidth - 16) {
                    x = box.right + 8;
                    y = box.top;
                    placement = 'right';
                } else if (box.bottom + bounds.height + 8 <= innerHeight - 16) {
                    y = box.bottom + 8;
                    placement = 'below';
                }
            }
            if (quiet) tip.dataset.placement = placement;
            tip.style.setProperty('--tooltip-left', Math.max(16, Math.min(x, innerWidth - bounds.width - 16)) + 'px');
            tip.style.setProperty('--tooltip-top', Math.max(16, Math.min(y, innerHeight - bounds.height - 16)) + 'px');
            tip.classList.add('is-positioned');
        }
        function open() {
            clearTimeout(timer);
            clearTimeout(showTimer);
            if (quiet) quietTips.forEach(item => { if (item !== record) item.dismiss(); });
            host.classList.remove('is-tooltip-dismissed');
            host.classList.add('is-tooltip-open');
            place();
        }
        function close() {
            clearTimeout(showTimer);
            timer = setTimeout(() => {
                if (host.matches(':hover, :focus')) return;
                host.classList.remove('is-tooltip-open', 'is-tooltip-dismissed');
            }, 120);
        }
        host.addEventListener('pointerenter', () => {
            clearTimeout(timer);
            if (quiet) showTimer = setTimeout(() => { if (host.matches(':hover')) open(); }, 350);
            else open();
        });
        host.addEventListener('focus', () => { if (!quiet || host.matches(':focus-visible')) open(); });
        host.addEventListener('pointerleave', close);
        host.addEventListener('blur', close);
        host.addEventListener('keydown', event => {
            if (event.key === 'Escape') dismiss();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && host.classList.contains('is-tooltip-open')) dismiss();
        });
        if (host.matches('.ds-tooltip-trigger')) {
            let openBeforePress = false;
            host.addEventListener('pointerdown', () => { openBeforePress = host.classList.contains('is-tooltip-open'); });
            host.addEventListener('click', event => {
                const opened = event.detail === 0 ? host.classList.contains('is-tooltip-open') : openBeforePress;
                if (opened) dismiss(); else open();
            });
        }
        window.addEventListener('resize', place);
        document.addEventListener('portfolio:language-change', () => {
            if (host.classList.contains('dot')) tip.textContent = host.getAttribute('aria-label');
            if (host.classList.contains('is-tooltip-open')) place();
        });
        document.addEventListener('scroll', () => { if (host.classList.contains('is-tooltip-open')) place(); }, true);
    });
    document.addEventListener('pointerdown', event => quietTips.forEach(item => {
        if (!item.host.contains(event.target)) item.dismiss();
    }));
    document.addEventListener('portfolio:video-open', () => quietTips.forEach(item => item.dismiss()));
})();
