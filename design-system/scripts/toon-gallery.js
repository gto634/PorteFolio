/* Controls and illustrative previews for the adopted design system gallery. */
(() => {
    const root = document.querySelector('[data-toon-root]');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    // The approved recipe is fixed. Only the OS motion preference changes it.
    function syncMotion() {
        root.dataset.motion = reduce.matches ? 'off' : 'on';
        document.querySelector('[data-os-note]').hidden = !reduce.matches;
    }
    reduce.addEventListener('change', syncMotion);
    syncMotion();
    const dialog = document.querySelector('.lab-dialog');
    const picture = dialog.querySelector('[data-dialog-image]');
    const title = dialog.querySelector('h2');
    let opener;
    function show(button, project = false) {
        opener = button;
        title.textContent = project ? 'Aperçu · ' + button.dataset.projectTitle : 'Aperçu du lecteur · Tatamiam';
        picture.src = project ? button.dataset.projectImage : picture.dataset.defaultImage;
        picture.alt = project ? 'Aperçu de ' + button.dataset.projectTitle : 'Aperçu de Tatamiam';
        document.dispatchEvent(new Event('portfolio:video-open'));
        dialog.showModal();
        dialog.focus({preventScroll: true});
    }
    picture.dataset.defaultImage = picture.getAttribute('src');
    document.querySelectorAll('[data-open-dialog]').forEach(button => button.addEventListener('click', () => show(button)));
    document.querySelectorAll('[data-card-preview]').forEach(button => button.addEventListener('click', event => { event.preventDefault(); show(button, true); }));
    let downOnBackdrop = false;
    dialog.addEventListener('pointerdown', event => {
        const box = dialog.getBoundingClientRect();
        downOnBackdrop = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    });
    dialog.addEventListener('click', event => {
        const box = dialog.getBoundingClientRect();
        const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
        if (downOnBackdrop && outside) dialog.close();
        downOnBackdrop = false;
    });
    dialog.addEventListener('close', () => opener?.focus({preventScroll: true}));
    document.querySelectorAll('.lab-dots a').forEach(link => link.addEventListener('click', event => {
        if (link.classList.contains('active')) { event.preventDefault(); return; }
        document.querySelectorAll('.lab-dots a').forEach(dot => { dot.classList.remove('active'); dot.removeAttribute('aria-current'); });
        link.classList.add('active');
        link.setAttribute('aria-current', 'location');
    }));
})();
