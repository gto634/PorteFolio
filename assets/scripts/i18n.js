/* HTML owns the French text; this dictionary supplies English and dynamic UI copy. */
(() => {
    const messages = {
        'nav.label': ['Navigation du portfolio', 'Portfolio navigation'],
        'nav.main': ['Navigation principale', 'Main navigation'],
        'nav.home': ['Accueil', 'Home'],
        'nav.featured': ['À la une', 'Featured'],
        'nav.collection': ['Tout mes projets', 'All my projects'],
        'nav.contact': ['Contact', 'Contact'],
        'nav.open': ['Ouvrir le menu', 'Open menu'],
        'nav.close': ['Fermer le menu', 'Close menu'],
        'language.open': ['Choisir la langue, français sélectionné', 'Choose language, English selected'],
        'language.close': ['Fermer le choix de langue, français sélectionné', 'Close language selector, English selected'],
        'language.label': ['Langue du site', 'Site language'],
        'skip.projects': ['Aller aux projets', 'Skip to projects'],
        'skip.project': ['Aller au projet', 'Skip to project'],
        'intro.role': ['Développeur de jeux vidéo', 'Game developer'],
        'intro.motion': ['Rebonds du triangle', 'Triangle bounce'],
        'intro.motion.on': ['Activés', 'On'],
        'intro.motion.off': ['Arrêtés', 'Off'],
        'intro.motion.reduced': ['Réduits', 'Reduced'],
        'dots.label': ['Navigation des projets', 'Project navigation'],
        'dots.intro': ['Introduction', 'Introduction'],
        'dots.contact': ['Contact et autres projets', 'Contact and more projects'],
        'technical.language': ['Langage', 'Language'],
        'technical.engine': ['Moteur', 'Engine'],
        'technical.library': ['Bibliothèque', 'Library'],
        'technical.rendering': ['API de rendu', 'Rendering API'],
        'tools.title': ['Outils', 'Tools'],
        'tools.label': ['Outils de création utilisés', 'Creative tools used'],
        'facts.role': ['Mon rôle', 'My role'],
        'facts.team': ['Équipe', 'Team'],
        'facts.duration': ['Durée', 'Duration'],
        'facts.twoPeople': ['2 personnes', '2 people'],
        'facts.twoDevelopers': ['2 développeurs', '2 developers'],
        'facts.threeDevelopers': ['3 développeurs', '3 developers'],
        'facts.threeWeeks': ['3 semaines', '3 weeks'],
        'facts.twoWeeks': ['2 semaines', '2 weeks'],
        'facts.preproduction': ['1 semaine de préproduction + 3 semaines de développement', '1 week of preproduction + 3 weeks of development'],
        'facts.visual': ['Gameplay & intégration visuelle', 'Gameplay & visual integration'],
        'facts.lead': ['Lead développement · moteur & gameplay', 'Development lead · engine & gameplay'],
        'facts.generalist': ['Co-création · développement généraliste', 'Co-creation · generalist development'],
        'facts.engine': ['Tech design · développement moteur', 'Technical design · engine development'],
        'work.label': ['Mes réalisations principales', 'My main contributions'],
        'work.details': ['Détails de mes réalisations', 'More about my contributions'],
        'action.video': ['Voir la vidéo', 'Watch video'],
        'action.videoSoon': ['Vidéo — à venir', 'Video — coming soon'],
        'action.githubSoon': ['GitHub — à venir', 'GitHub — coming soon'],
        'action.discover': ['Découvrir le projet', 'Explore project'],
        'video.retry': ['Réessayer', 'Retry'],
        'video.cancel': ['Annuler', 'Cancel'],
        'video.loading': ['Chargement de la vidéo…', 'Loading video…'],
        'video.error': ['Lecture impossible. Vous pouvez réessayer.', 'Unable to play the video. You can try again.'],
        'video.blocked': ['Utilisez le bouton de lecture du lecteur pour démarrer la vidéo.', 'Use the player’s play button to start the video.'],
        'video.cancelled': ['Chargement annulé. Vous pouvez réessayer.', 'Loading cancelled. You can try again.'],
        'video.label': ['Gameplay de {title}', '{title} gameplay'],
        'video.title': ['Gameplay · {title}', 'Gameplay · {title}'],
        'contact.invitation': ['Et si on échangeait ?', 'Let’s talk'],
        'contact.title': ['Restons en contact.', 'Let’s stay in touch.'],
        'contact.more': ['La collection continue.', 'There’s more to explore.'],
        'contact.projects': ['Tout mes projets', 'All my projects'],
        "contact.top": ["Retour à l’accueil", "Back to home"],
        'contact.email': ['Écrire à rmahiou.pro@gmail.com dans Gmail (nouvel onglet)', 'Email rmahiou.pro@gmail.com in Gmail (new tab)'],
        'contact.linkedin': ['LinkedIn de Ryad Mahiou (nouvel onglet)', 'Ryad Mahiou’s LinkedIn (new tab)'],
        'collection.pageTitle': ['Tous les projets — MAHIOU Ryad', 'All projects — MAHIOU Ryad'],
        'collection.meta': ['Les jeux et moteurs de Ryad Mahiou : Necromancer x Magical Girl, Tatamiam, IsekaiWar!, EntreCôte et SpaceRunner.', 'Games and engines by Ryad Mahiou: Necromancer x Magical Girl, Tatamiam, IsekaiWar!, EntreCôte and SpaceRunner.'],
        'collection.title': ['Tous les <span>projets.</span>', 'All <span>projects.</span>'],
        'collection.description': ['Jeux, moteurs et expérimentations. Découvrez mes projets et les systèmes sur lesquels j’ai travaillé.', 'Games, engines and experiments. Explore my projects and the systems I’ve worked on.'],
        'collection.filterLabel': ['Filtrer les projets par type', 'Filter projects by type'],
        'collection.all': ['Tous', 'All'],
        'collection.games': ['Jeux', 'Games'],
        'collection.engines': ['Moteurs', 'Engines'],
        'collection.game': ['Jeu', 'Game'],
        'collection.list': ['Liste des projets', 'Project list'],
        'collection.empty': ['Aucun projet dans cette catégorie. Choisissez « Tous » pour retrouver la collection.', 'No projects in this category. Select “All” to see the collection.'],
        'collection.count.one': ['{count} projet', '{count} project'],
        'collection.count.other': ['{count} projets', '{count} projects'],
        'collection.footer': ['· Jeux & moteurs', '· Games & engines'],
        "necro.pitch": ["Incarnez un Nécromancien ou une Magical Girl et explorez un donjon à deux en coopération locale. Terrassez les ennemis, puis enrôlez-les dans votre armée pour surpasser celle de votre camarade.", "Play as a Necromancer or a Magical Girl and explore a dungeon together in local co-op. Defeat your enemies, then recruit them into your army to outmatch your partner’s."],
        "necro.card": ["Explorez un donjon à deux et enrôlez vos ennemis pour bâtir votre armée.", "Explore a dungeon in local co-op and recruit your enemies to build your army."],
        'necro.work1': ['Systèmes de combat : projectiles, hitboxes, dégâts et knockback.', 'Combat systems: projectiles, hitboxes, damage and knockback.'],
        'necro.work2': ['Moveset des deux personnages : capacités, déplacement et visée.', 'Both characters’ movesets: abilities, movement and aiming.'],
        'necro.detail1': ['Intégration et modification des assets et des animations.', 'Asset and animation integration and modification.'],
        'necro.detail2': ['Intégration des feedbacks visuels : effets, particules, flashs et réactions aux impacts.', 'Visual feedback integration: effects, particles, flashes and impact reactions.'],
        "tatamiam.pitch": ["Incarnez un sushi et lancez votre propre restaurant-dojo ! Collaborez avec vos amis en ligne afin de préparer les plats qui correspondent à chaque client.", "Play as a sushi and open your own restaurant-dojo! Work with your friends online to prepare the right dishes for each customer."],
        "tatamiam.card": ["Un jeu de cuisine en ligne où vous incarnez un sushi et gérez un restaurant-dojo avec vos amis.", "An online cooking game where you play as a sushi and run a restaurant-dojo with your friends."],
        "tatamiam.work1": ["Intégration d’une API multijoueur dans un moteur custom.", "Integration of a multiplayer API into a custom engine."],
        'tatamiam.work2': ['Architecture du jeu construite sur une base EC (entités/composants).', 'Game architecture built on an EC (entity/component) foundation.'],
        "tatamiam.detail1": ["Gameplay du joueur et son intégration visuelle.", "Player gameplay and visual integration."],
        "tatamiam.detail2": ["Synchronisation en ligne des différentes features.", "Online synchronization of game features."],
        "isekai.pitch": ["Protégez votre monde magique d’une attaque interdimensionnelle. Terrassez les vaisseaux aliens à l’aide de vos compétences magiques.", "Protect your magical world from an interdimensional attack. Defeat alien ships with your magical abilities."],
        "isekai.card": ["Protégez votre monde magique des vaisseaux aliens dans un shoot ’em up 2D.", "Protect your magical world from alien ships in a 2D shoot ’em up."],
        "isekai.work1": ["Développement d’une architecture d’héritage complète.", "Development of a complete inheritance architecture."],
        "isekai.work2": ["Intégration des classes abstraites de vie, de tirs et de déplacement.", "Integration of abstract classes for health, shooting and movement."],
        "isekai.detail1": ["Développement des différents projectiles et power-ups.", "Development of projectiles and power-ups."],
        "isekai.detail2": ["Intégration visuelle du fond et des projectiles.", "Visual integration of the background and projectiles."],
        "entrecote.pitch": ["Un moteur de jeu 3D avec un rendu DirectX 12 et une architecture EC (entités/composants). La vidéo présente sa sandbox et Sushi Adventure, un mini-jeu développé en 3 jours.", "A 3D game engine with DirectX 12 rendering and an EC (entity/component) architecture. The video showcases its sandbox and Sushi Adventure, a small game developed in 3 days."],
        'entrecote.card': ['Un moteur 3D avec un rendu DirectX 12 et une architecture à entités et composants.', 'A 3D engine with DirectX 12 rendering and an entity/component architecture.'],
        'entrecote.work1': ['Gestion du pipeline de rendu 3D.', '3D rendering pipeline management.'],
        'entrecote.work2': ['Structuration et encapsulation des systèmes du moteur.', 'Engine system structuring and encapsulation.'],
        "entrecote.detail1": ["Création du moteur physique avec ses collisions.", "Creation of the physics engine and its collision system."],
        "entrecote.detail2": ["Systèmes et composants pour la physique, les renderers et l’animation.", "Systems and components for physics, rendering and animation."],
        'space.meta': ['SpaceRunner, un jeu de course infini en 3D développé par Ryad Mahiou en binôme avec GC Engine.', 'SpaceRunner, a 3D endless runner developed by Ryad Mahiou and a teammate with GC Engine.'],
        'space.pitch': ['Lance-toi dans une course infinie à travers un environnement spatial. Découvre un jeu 3D réalisé avec GC Engine, le moteur de notre école.', 'Set off on an endless run through space. Discover a 3D game built with GC Engine, our school’s engine.'],
        'space.card': ['Une course infinie dans l’espace, conçue en deux semaines avec GC Engine.', 'An endless run through space, built in two weeks with GC Engine.'],
        'space.work1': ['Développement d’un jeu 3D à base de tuiles dans GC Engine.', 'Development of a tile-based 3D game in GC Engine.'],
        'space.work2': ['Optimisation des performances dans un moteur personnalisé.', 'Performance optimization in a custom engine.'],
        'space.detail1': ['Adaptation du gameplay aux fonctionnalités disponibles dans GC Engine.', 'Gameplay adaptation to GC Engine’s available features.'],
        'space.detail2': ['Level design réalisé en tenant compte des contraintes du gameplay.', 'Level design shaped by gameplay constraints.'],
        "necro.role": ["Gameplay & assets visuels", "Gameplay & visual assets"],
        "necro.duration": ["10 jours", "10 days"],
        "tatamiam.role": ["Lead Tech · moteur & gameplay", "Tech lead · engine & gameplay"],
        "tatamiam.duration": ["4 semaines", "4 weeks"],
        "isekai.role": ["Dev Gameplay", "Gameplay development"],
        "entrecote.role": ["Dev Moteur", "Engine development"],
        "action.source": ["Code source", "Source code"],
        "contact.github": ["GitHub de Ryad Mahiou (nouvel onglet)", "Ryad Mahiou’s GitHub (new tab)"],
        "contact.profiles": ["Profils professionnels", "Professional profiles"],
        "necro.sourceLabel": ["Code source de Necromancer x Magical Girl sur GitHub (nouvel onglet)", "Necromancer x Magical Girl source code on GitHub (new tab)"],
        "tatamiam.sourceLabel": ["Code source de Tatamiam sur GitHub (nouvel onglet)", "Tatamiam source code on GitHub (new tab)"],
        "isekai.sourceLabel": ["Code source de IsekaiWar! sur GitHub (nouvel onglet)", "IsekaiWar! source code on GitHub (new tab)"],
        "entrecote.sourceLabel": ["Code source de EntreCôte sur GitHub (nouvel onglet)", "EntreCôte source code on GitHub (new tab)"],
        "space.sourceLabel": ["Code source de SpaceRunner sur GitHub (nouvel onglet)", "SpaceRunner source code on GitHub (new tab)"],
    };
    const storageKey = 'portfolio.language';
    const valid = value => value === 'fr' || value === 'en';
    const originalCopy = new WeakMap();
    let language = 'fr';
    try {
        const saved = localStorage.getItem(storageKey);
        if (valid(saved)) language = saved;
    } catch (_) { /* Language still works when storage is unavailable. */ }

    function t(key, values = {}) {
        const message = messages[key]?.[language === 'en' ? 1 : 0] || key;
        return message.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
    }
    function render() {
        if (document.documentElement.hasAttribute('data-i18n-page')) document.documentElement.lang = language;
        document.querySelectorAll('[data-i18n-region]').forEach(region => { region.lang = language; });
        document.querySelectorAll('[data-i18n]').forEach(node => {
            if (!originalCopy.has(node)) originalCopy.set(node, node.textContent);
            node.textContent = language === 'fr' || !messages[node.dataset.i18n] ? originalCopy.get(node) : t(node.dataset.i18n);
        });
        // Only static headings use HTML. Their French markup comes from the page.
        document.querySelectorAll('[data-i18n-html]').forEach(node => {
            if (!originalCopy.has(node)) originalCopy.set(node, node.innerHTML);
            node.innerHTML = language === 'fr' || !messages[node.dataset.i18nHtml] ? originalCopy.get(node) : t(node.dataset.i18nHtml);
        });
        for (const attribute of ['aria-label', 'title', 'content']) {
            document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(node => {
                node.setAttribute(attribute, t(node.getAttribute(`data-i18n-${attribute}`)));
            });
        }
        document.querySelectorAll('[data-language]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.language === language));
        });
        document.dispatchEvent(new CustomEvent('portfolio:language-change', {detail: {language}}));
    }
    function setLanguage(value, persist = true) {
        if (!valid(value)) return;
        if (persist) {
            try { localStorage.setItem(storageKey, value); } catch (_) { /* Session-only fallback. */ }
        }
        if (value === language) return;
        document.dispatchEvent(new Event('portfolio:language-before-change'));
        language = value;
        render();
    }
    window.portfolioI18n = {t, setLanguage, get language() { return language; }};
    if (document.documentElement.hasAttribute('data-i18n-page')) document.documentElement.lang = language;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, {once: true});
    else render();
    // Also keep an already-open portfolio tab in sync with the user's choice.
    window.addEventListener('storage', event => {
        if (event.key === storageKey) setLanguage(valid(event.newValue) ? event.newValue : 'fr', false);
    });
})();
