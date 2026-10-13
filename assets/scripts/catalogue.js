/* Also used by the collection specimen in the design system gallery. */
(() => {
    document.querySelectorAll('.catalogue-filters').forEach(filters => {
        const root = filters.closest('.catalogue, .filter-demo');
        if (!root) return;
        const buttons = [...filters.querySelectorAll('[data-filter]')];
        const cards = [...root.querySelectorAll('.project-card')];
        const count = root.querySelector('.catalogue-count');
        const empty = root.querySelector('.catalogue-empty');
        const translated = document.documentElement.hasAttribute('data-i18n-page');
        function apply(category, selected) {
            buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
            cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
            const visible = cards.filter(card => !card.hidden).length;
            count.textContent = translated && window.portfolioI18n ? window.portfolioI18n.t(visible === 1 ? 'collection.count.one' : 'collection.count.other', {count: visible}) : `${visible} projet${visible > 1 ? 's' : ''}`;
            if (empty) empty.hidden = visible !== 0;
        }
        buttons.forEach(button => button.addEventListener('click', () => apply(button.dataset.filter, button)));
        document.addEventListener('portfolio:language-change', () => {
            const selected = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
            apply(selected.dataset.filter, selected);
        });
        apply('all', buttons.find(button => button.dataset.filter === 'all'));
        filters.hidden = false;
    });
})();
