// --- PARAMÈTRES ---
const duration = 800; // Ton temps d'animation (0.8s)
const container = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('.planche');

// Variables d'état principales
let currentSectionIndex = 0;
let isAnimating = false; 

// --- VARIABLES DU BUFFER ---
let bufferedDirection = 0; // Pour la molette (+1, -1 ou 0)
let bufferedIndex = null;  // NOUVEAU : Pour les clics sur les boutons/dots (null ou index cible)
const bufferThreshold = 0.7; // 70% : fenêtre d'acceptation du prochain input
let currentProgress = 0; 

// --- FONCTION MOTEUR D'ANIMATION ---
function scrollToSection(index) {
    // Sécurité de limite
    if (index < 0 || index >= sections.length) {
        bufferedDirection = 0; 
        bufferedIndex = null;
        container.style.scrollSnapType = 'y mandatory';
        isAnimating = false;
        return;
    }
    
    isAnimating = true;
    currentSectionIndex = index;

    // Mise à jour visuelle des dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');

    const targetSection = sections[index];
    const startPos = container.scrollTop;
    const targetPos = targetSection.offsetTop;
    const distance = targetPos - startPos;
    let startTime = null;

    container.style.scrollSnapType = 'none';

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        
        currentProgress = Math.min(timeElapsed / duration, 1);
        const ease = currentProgress; 

        container.scrollTop = startPos + (distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            history.pushState(null, null, '#' + targetSection.id);
            isAnimating = false;
            
            // 2. LECTURE DU DOUBLE BUFFER (Priorité au clic si l'utilisateur a fait les deux)
            if (bufferedIndex !== null) {
                const nextIndex = bufferedIndex;
                bufferedIndex = null;
                bufferedDirection = 0; // On purge l'autre action
                scrollToSection(nextIndex); // On enchaîne direct !
                
            } else if (bufferedDirection !== 0) {
                const nextIndex = currentSectionIndex + bufferedDirection;
                bufferedDirection = 0; 
                scrollToSection(nextIndex); // On enchaîne direct !
                
            } else {
                container.style.scrollSnapType = 'y mandatory';
            }
        }
    }

    requestAnimationFrame(animation);
}

// --- ÉCOUTEUR 1 : LA MOLETTE DE SOURIS ---
container.addEventListener('wheel', function(e) {
    e.preventDefault(); 
    const direction = e.deltaY > 0 ? 1 : -1;

    if (isAnimating) {
        if (currentProgress >= bufferThreshold) {
            bufferedDirection = direction;
            bufferedIndex = null; // La molette annule un clic potentiellement mémorisé
        }
        return; 
    }

    scrollToSection(currentSectionIndex + direction);
}, { passive: false }); 

// --- ÉCOUTEUR 2 : LES BOUTONS ET LES DOTS ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetIndex = Array.from(sections).findIndex(sec => sec.id === targetId);
        
        if (targetIndex !== -1) {
            if (isAnimating) {
                // 3. ENREGISTREMENT DU BUFFER DE CLIC
                // Si on est à la fin de l'animation, on mémorise la destination !
                if (currentProgress >= bufferThreshold) {
                    bufferedIndex = targetIndex;
                    bufferedDirection = 0; // Le clic annule une molette potentiellement mémorisée
                }
                // Quoi qu'il arrive, on bloque l'exécution immédiate pour ne pas casser l'animation
                return; 
            }
            
            // Si aucune animation n'est en cours, on y va direct
            bufferedDirection = 0; 
            bufferedIndex = null;
            scrollToSection(targetIndex);
        }
    });
});

// =========================================
// GESTION DE LA VIDÉO DE FOND
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const backgroundVideo = document.querySelector('.video-bg');
    
    if (backgroundVideo) {
        // Règle la vitesse de lecture. 
        // 1.0 = Vitesse normale (100%)
        // 0.5 = Moitié de la vitesse (50%)
        // 0.8 = Un peu plus lent (80%)
        backgroundVideo.playbackRate = 0.1; 
    }
});

// =========================================
// GESTION DES VIDÉOS AU CLIC (Click to Play)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const videoContainers = document.querySelectorAll('.project-video-container');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');

        container.addEventListener('click', () => {
            if (video.paused) {
                // On lance la vidéo
                video.play()
                    .then(() => {
                        container.classList.add('is-playing');
                    })
                    .catch(error => console.log("Erreur lecture :", error));
            } else {
                // On met en pause
                video.pause();
                container.classList.remove('is-playing');
                // Optionnel : video.currentTime = 0; // Si tu veux revenir au poster
            }
        });
    });
});

// =========================================
// GESTION DU BOUTON D'EXPANSION DE PROJET
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // On cible le bouton via document.body pour que ça marche même si on en ajoute dynamiquement
    document.body.addEventListener('click', function(e) {
        
        // On vérifie si l'élément cliqué (ou son parent) a la classe expand-btn
        const btn = e.target.closest('.expand-btn');
        
        if (btn) {
            e.preventDefault(); 
            // On cherche la section "planche" correspondante
            const parentPlanche = btn.closest('.planche');
            
            // On active/désactive le mode large et le fade
            if (parentPlanche) {
                parentPlanche.classList.toggle('is-expanded');
            }
        }
    });
});