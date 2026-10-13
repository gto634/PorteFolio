/* Explicitly labelled simulated messages; real modal uses video-modal.js. */
(() => {
    const status = document.querySelector('.gallery-video-status');
    const reset = document.querySelector('.gallery-video-reset');
    document.querySelectorAll('[data-show-video-state]').forEach(button => button.addEventListener('click', () => {
        const loading = button.dataset.showVideoState === 'loading';
        status.textContent = loading ? 'Chargement de la vidéo… (exemple)' : 'Lecture impossible. Vous pouvez réessayer. (exemple)';
        reset.hidden = false;
        reset.textContent = loading ? 'Annuler' : 'Réessayer';
    }));
    reset.addEventListener('click', () => { status.textContent = 'La vidéo est prête à être lue. (exemple)'; reset.hidden = true; });
})();
