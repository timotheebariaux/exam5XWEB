
/* ======================================================
   WEBEXPLORER - JAVASCRIPT PRINCIPAL
   Projet de fin d'études

   Toutes les interactions du site sont regroupées ici.

   Le site fonctionne sans serveur local.
   La recherche de l'IP publique utilise une API externe
   uniquement après un clic du visiteur.
   ====================================================== */


// ======================================================
// 1. INITIALISATION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("WebExplorer est prêt !");

    initialiserNavigation();
    initialiserAnimations();
    initialiserURL();
    initialiserQuizHTTP();
    initialiserDNS();
    initialiserAdresseIP();
    initialiserQuizDNS();
    initialiserCartesSecurite();
    initialiserQuizPhishing();
    initialiserRetourHaut();

});


// ======================================================
// 2. MENU ET NAVIGATION
// ======================================================

function initialiserNavigation() {

    const boutonMenu = document.getElementById("menu-toggle");
    const menu = document.getElementById("nav-links");

    if (!boutonMenu || !menu) return;

    const liens = menu.querySelectorAll("a");

    function fermerMenu() {

        menu.classList.remove("open");

        boutonMenu.setAttribute("aria-expanded", "false");
        boutonMenu.setAttribute("aria-label", "Ouvrir le menu");

        const icone = boutonMenu.querySelector("i");

        if (icone) {
            icone.className = "fa-solid fa-bars";
        }

    }

    boutonMenu.addEventListener("click", () => {

        const ouvert = menu.classList.toggle("open");

        boutonMenu.setAttribute(
            "aria-expanded",
            String(ouvert)
        );

        boutonMenu.setAttribute(
            "aria-label",
            ouvert ? "Fermer le menu" : "Ouvrir le menu"
        );

        const icone = boutonMenu.querySelector("i");

        if (icone) {
            icone.className = ouvert
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }

    });

    liens.forEach(lien => {

        lien.addEventListener("click", () => {

            fermerMenu();

            liens.forEach(element => {
                element.classList.remove("active");
            });

            lien.classList.add("active");

        });

    });

    document.addEventListener("keydown", evenement => {

        if (evenement.key === "Escape") {
            fermerMenu();
        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 850) {
            fermerMenu();
        }

    });

    // Mise à jour du lien actif pendant le défilement.

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if (!("IntersectionObserver" in window)) return;

    const observateur = new IntersectionObserver(

        entrees => {

            entrees.forEach(entree => {

                if (!entree.isIntersecting) return;

                const id = entree.target.id;

                const sectionActive =
                    id === "explorer" ? "accueil" : id;

                liens.forEach(lien => {

                    lien.classList.toggle(
                        "active",
                        lien.getAttribute("href") ===
                        "#" + sectionActive
                    );

                });

            });

        },

        {
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
        }

    );

    sections.forEach(section => {
        observateur.observe(section);
    });

}


// ======================================================
// 3. ANIMATIONS AU DEFILEMENT
// ======================================================

function initialiserAnimations() {

    const elements = document.querySelectorAll(
        ".info-card, " +
        ".topic-card, " +
        ".timeline-item, " +
        ".http-card, " +
        ".price-card, " +
        ".standard-card, " +
        ".security-advice-grid"
    );

    const animationsReduites = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        animationsReduites ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    elements.forEach(element => {
        element.classList.add("reveal");
    });

    const observateur = new IntersectionObserver(

        entrees => {

            entrees.forEach(entree => {

                if (entree.isIntersecting) {

                    entree.target.classList.add("visible");
                    observateur.unobserve(entree.target);

                }

            });

        },

        {
            threshold: 0.08,
            rootMargin: "0px 0px 40px 0px"
        }

    );

    elements.forEach(element => {
        observateur.observe(element);
    });

}


// ======================================================
// 4. DECODEUR D'URL
// ======================================================

function initialiserURL() {

    const boutons = document.querySelectorAll(".url-part");

    const explication = document.getElementById(
        "url-explanation"
    );

    if (!explication || boutons.length === 0) return;

    const informations = {

        protocol: {
            titre: "Le protocole HTTPS",
            texte:
                "HTTPS permet au navigateur et au serveur " +
                "de communiquer grâce au protocole HTTP " +
                "sur une connexion protégée par TLS. " +
                "Les données échangées sont chiffrées. " +
                "Cependant, HTTPS ne garantit pas " +
                "qu'un site est honnête."
        },

        domain: {
            titre: "Le nom d'hôte",
            texte:
                "www.example.com est le nom d'hôte. " +
                "example.com est le nom de domaine, " +
                ".com est l'extension et www est un " +
                "sous-domaine. Le DNS peut aider à retrouver " +
                "les adresses IP associées à ce nom."
        },

        path: {
            titre: "Le chemin",
            texte:
                "/articles désigne le chemin de la ressource " +
                "demandée. Il peut correspondre à une page, " +
                "une ressource ou une route de l'application."
        },

        parameters: {
            titre: "Les paramètres",
            texte:
                "?page=2 transmet un paramètre nommé page " +
                "dont la valeur est 2. Les paramètres peuvent " +
                "servir à filtrer des résultats, effectuer " +
                "une recherche ou gérer la pagination."
        }

    };

    boutons.forEach(bouton => {

        bouton.addEventListener("click", () => {

            const information =
                informations[bouton.dataset.urlPart];

            if (!information) return;

            boutons.forEach(element => {

                element.classList.remove("selected");
                element.setAttribute("aria-pressed", "false");

            });

            bouton.classList.add("selected");
            bouton.setAttribute("aria-pressed", "true");

            const titre = document.createElement("h4");
            titre.textContent = information.titre;

            const texte = document.createElement("p");
            texte.textContent = information.texte;

            explication.replaceChildren(titre, texte);

        });

    });

}


// ======================================================
// 5. QUIZ HTTP
// ======================================================

function initialiserQuizHTTP() {

    const questionElement = document.getElementById(
        "http-question"
    );

    const optionsElement = document.getElementById(
        "http-options"
    );

    const feedbackElement = document.getElementById(
        "http-feedback"
    );

    const numeroElement = document.getElementById(
        "http-question-number"
    );

    const scoreElement = document.getElementById(
        "http-score"
    );

    const boutonSuivant = document.getElementById(
        "http-next"
    );

    if (
        !questionElement ||
        !optionsElement ||
        !feedbackElement ||
        !numeroElement ||
        !scoreElement ||
        !boutonSuivant
    ) return;

    const questions = [

        {
            question:
                "Une page demandée est introuvable. " +
                "Quel code HTTP est renvoyé ?",

            choix: ["200", "404", "500"],

            reponse: "404",

            explication:
                "404 signifie que le serveur n'a pas " +
                "trouvé la ressource demandée."
        },

        {
            question:
                "Le serveur a correctement traité " +
                "ta demande. Quel code correspond ?",

            choix: ["500", "200", "404"],

            reponse: "200",

            explication:
                "200 OK indique que la requête " +
                "a été traitée avec succès."
        },

        {
            question:
                "Une erreur interne survient " +
                "dans le serveur. Quel code est renvoyé ?",

            choix: ["404", "500", "200"],

            reponse: "500",

            explication:
                "500 Internal Server Error indique " +
                "une erreur interne du serveur."
        },

        {
            question:
                "Un site change définitivement " +
                "d'adresse. Quelle redirection convient ?",

            choix: ["302", "301", "404"],

            reponse: "301",

            explication:
                "301 indique une redirection permanente."
        },

        {
            question:
                "Une page est déplacée temporairement. " +
                "Quelle redirection convient ?",

            choix: ["200", "301", "302"],

            reponse: "302",

            explication:
                "302 indique une redirection temporaire."
        },

        {
            question:
                "Tu visites une page qui s'affiche " +
                "correctement. Quel code attends-tu ?",

            choix: ["200", "500", "404"],

            reponse: "200",

            explication:
                "200 signifie que la requête a réussi."
        },

        {
            question:
                "Un lien pointe vers une ressource " +
                "introuvable. Quel code peut apparaître ?",

            choix: ["301", "404", "200"],

            reponse: "404",

            explication:
                "404 est fréquent lorsqu'une ressource " +
                "n'existe pas à l'adresse demandée."
        }

    ];

    let index = 0;
    let score = 0;
    let reponseDonnee = false;
    let termine = false;

    function afficherQuestion() {

        reponseDonnee = false;
        termine = false;

        const question = questions[index];

        questionElement.textContent = question.question;

        numeroElement.textContent =
            `Question ${index + 1} / ${questions.length}`;

        scoreElement.textContent = `Score : ${score}`;

        feedbackElement.textContent = "";
        feedbackElement.className = "quiz-feedback";

        boutonSuivant.hidden = true;
        optionsElement.replaceChildren();

        question.choix.forEach(choix => {

            const bouton = document.createElement("button");

            bouton.type = "button";
            bouton.className = "quiz-option";
            bouton.textContent = choix;

            bouton.addEventListener("click", () => {
                verifierReponse(choix);
            });

            optionsElement.appendChild(bouton);

        });

    }

    function verifierReponse(choix) {

        if (reponseDonnee) return;

        reponseDonnee = true;

        const question = questions[index];
        const correct = choix === question.reponse;

        if (correct) score++;

        scoreElement.textContent = `Score : ${score}`;

        feedbackElement.textContent = correct
            ? "Bonne réponse ! " + question.explication
            : "La bonne réponse est " +
              question.reponse + ". " +
              question.explication;

        feedbackElement.className = correct
            ? "quiz-feedback success"
            : "quiz-feedback error";

        optionsElement.querySelectorAll(
            ".quiz-option"
        ).forEach(bouton => {

            bouton.disabled = true;

            if (bouton.textContent === question.reponse) {
                bouton.classList.add("correct");
            }

            if (!correct && bouton.textContent === choix) {
                bouton.classList.add("incorrect");
            }

        });

        boutonSuivant.hidden = false;

        boutonSuivant.textContent =
            index === questions.length - 1
                ? "Voir mon résultat"
                : "Question suivante";

    }

    function afficherResultat() {

        termine = true;

        const pourcentage = Math.round(
            score / questions.length * 100
        );

        questionElement.textContent =
            `Résultat : ${score} / ${questions.length}` +
            ` (${pourcentage} %)`;

        numeroElement.textContent = "Quiz terminé";

        optionsElement.replaceChildren();

        feedbackElement.className =
            pourcentage >= 60
                ? "quiz-feedback success"
                : "quiz-feedback";

        feedbackElement.textContent =
            pourcentage === 100
                ? "Excellent ! Tu maîtrises les codes HTTP."
                : pourcentage >= 60
                    ? "Bien joué ! Tu connais les bases."
                    : "Continue à t'entraîner !";

        boutonSuivant.textContent = "Recommencer";
        boutonSuivant.hidden = false;

    }

    boutonSuivant.addEventListener("click", () => {

        if (termine) {

            index = 0;
            score = 0;

            afficherQuestion();
            return;

        }

        index++;

        if (index < questions.length) {
            afficherQuestion();
        } else {
            afficherResultat();
        }

    });

    afficherQuestion();

}


// ======================================================
// 6. NOUVEAU SIMULATEUR DNS EN SIX ETAPES
// ======================================================

function initialiserDNS() {

    const formulaire = document.getElementById(
        "dns-search-form"
    );

    const champDomaine = document.getElementById(
        "dns-domain-input"
    );

    const boutonDemarrer = document.getElementById(
        "dns-start"
    );

    const boutonPrecedent = document.getElementById(
        "dns-previous"
    );

    const boutonSuivant = document.getElementById(
        "dns-next"
    );

    const boutonReset = document.getElementById(
        "dns-reset"
    );

    const cartes = Array.from(document.querySelectorAll(
        "#dns-animation .dns-step"
    ));

    const titreElement = document.getElementById(
        "dns-detail-title"
    );

    const descriptionElement = document.getElementById(
        "dns-detail-description"
    );

    const exempleElement = document.getElementById(
        "dns-detail-example"
    );

    const numeroElement = document.getElementById(
        "dns-detail-number"
    );

    const progressionElement = document.getElementById(
        "dns-progress-fill"
    );

    const progressionBarre = document.getElementById(
        "dns-progress-bar"
    );

    const progressionTexte = document.getElementById(
        "dns-progress-label"
    );

    const progressionPourcent = document.getElementById(
        "dns-progress-percent"
    );

    const statutElement = document.getElementById(
        "dns-status"
    );

    if (
        !formulaire ||
        !champDomaine ||
        !boutonDemarrer ||
        !boutonPrecedent ||
        !boutonSuivant ||
        !boutonReset ||
        cartes.length !== 6 ||
        !titreElement ||
        !descriptionElement ||
        !exempleElement ||
        !numeroElement ||
        !progressionElement ||
        !progressionBarre ||
        !progressionTexte ||
        !progressionPourcent ||
        !statutElement
    ) return;


    // --------------------------------------------------
    // VARIABLES DE LA SIMULATION
    // --------------------------------------------------

    const DUREE_ETAPE = 5000;

    let domaine = "example.com";
    let etapeActuelle = 0;

    let simulationDemarree = false;
    let simulationTerminee = false;

    // Ces variables permettent d'annuler proprement
    // une simulation automatique en cours.

    let identifiantSimulation = 0;
    let minuterie = null;

    const preferenceAnimations = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    // --------------------------------------------------
    // CONTENU PEDAGOGIQUE DES SIX ETAPES
    // --------------------------------------------------

    const etapes = [

        {
            titre: "Le navigateur reçoit une adresse",

            description:
                "Lorsque tu saisis une adresse Web, " +
                "le navigateur analyse l'URL et identifie " +
                "le nom d'hôte du site à contacter. " +
                "Pour communiquer avec le serveur, " +
                "il doit généralement connaître une " +
                "adresse IP associée à ce nom.",

            exemple:
                () =>
                    "Exemple : tu souhaites visiter " +
                    "https://" + domaine + "."
        },

        {
            titre: "Vérification du cache DNS",

            description:
                "Avant de lancer une nouvelle recherche, " +
                "le système vérifie si une réponse DNS " +
                "est déjà connue. Elle peut se trouver " +
                "dans un cache du navigateur, du système " +
                "ou d'un résolveur DNS. " +
                "Si une réponse encore valide existe, " +
                "il n'est pas nécessaire de refaire " +
                "toute la recherche.",

            exemple:
                () =>
                    "Exemple : si " + domaine +
                    " a été consulté récemment, " +
                    "son adresse IP est peut-être déjà " +
                    "enregistrée temporairement."
        },

        {
            titre: "Interrogation d'un résolveur DNS",

            description:
                "Si aucune réponse utilisable n'est " +
                "disponible localement, l'appareil " +
                "interroge généralement un résolveur DNS. " +
                "Ce serveur effectue la recherche " +
                "pour le compte du client. " +
                "Il possède lui aussi un cache et " +
                "peut donc parfois répondre directement.",

            exemple:
                () =>
                    "Exemple : ton ordinateur demande " +
                    "au résolveur DNS l'adresse IP " +
                    "associée à " + domaine + "."
        },

        {
            titre: "Consultation des serveurs DNS",

            description:
                "Si le résolveur ne connaît pas la réponse, " +
                "il peut effectuer une recherche itérative. " +
                "Il consulte la hiérarchie DNS : " +
                "les serveurs racine l'orientent " +
                "vers les serveurs de l'extension, " +
                "puis vers les serveurs faisant autorité " +
                "pour le domaine. Ces derniers fournissent " +
                "les enregistrements DNS correspondants.",

            exemple:
                () =>
                    "Exemple simplifié : racine → " +
                    "serveurs de l'extension → " +
                    "serveurs faisant autorité pour " +
                    domaine + "."
        },

        {
            titre: "Une adresse IP est renvoyée",

            description:
                "Le résolveur renvoie la réponse DNS " +
                "à l'appareil. Il peut notamment s'agir " +
                "d'un enregistrement A contenant une " +
                "adresse IPv4 ou AAAA contenant une " +
                "adresse IPv6. " +
                "La réponse peut être mise en cache " +
                "pendant une durée limitée, appelée TTL. " +
                "Un domaine peut posséder plusieurs " +
                "adresses IP.",

            exemple:
                () =>
                    "Exemple pédagogique : " + domaine +
                    " → 192.0.2.1. Cette adresse est " +
                    "fictive et réservée à la documentation."
        },

        {
            titre: "Le navigateur contacte le serveur",

            description:
                "Une fois une adresse IP obtenue, " +
                "le navigateur peut établir une connexion " +
                "vers le serveur approprié. " +
                "Avec HTTPS, une connexion sécurisée " +
                "est établie, puis le navigateur envoie " +
                "une requête HTTP. " +
                "Le serveur peut alors répondre avec " +
                "les ressources nécessaires à la page.",

            exemple:
                () =>
                    "Exemple : le navigateur se connecte " +
                    "à un serveur associé à " + domaine +
                    " et demande le contenu de la page."
        }

    ];


    // --------------------------------------------------
    // CONNAITRE LE MODE SELECTIONNE
    // --------------------------------------------------

    function obtenirMode() {

        const choix = document.querySelector(
            'input[name="dns-mode"]:checked'
        );

        return choix ? choix.value : "automatic";

    }


    // --------------------------------------------------
    // VALIDATION D'UN NOM DE DOMAINE
    // --------------------------------------------------

    function domaineValide(valeur) {

        if (
            valeur.length > 253 ||
            valeur.length < 3 ||
            valeur.includes("://") ||
            valeur.includes("/") ||
            valeur.includes("?") ||
            valeur.includes("#") ||
            valeur.includes(" ")
        ) {
            return false;
        }

        const parties = valeur.split(".");

        if (parties.length < 2) return false;

        return parties.every(partie => {

            return (
                partie.length >= 1 &&
                partie.length <= 63 &&
                /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
                    .test(partie)
            );

        });

    }


    // --------------------------------------------------
    // ANNULER UNE ANIMATION AUTOMATIQUE
    // --------------------------------------------------

    function annulerAnimation() {

        identifiantSimulation++;

        if (minuterie !== null) {
            clearTimeout(minuterie);
            minuterie = null;
        }

    }


    // --------------------------------------------------
    // AFFICHER UNE ETAPE
    // --------------------------------------------------

    function afficherEtape(index) {

        etapeActuelle = Math.max(
            0,
            Math.min(index, etapes.length - 1)
        );

        const etape = etapes[etapeActuelle];

        // Mettre à jour les textes explicatifs.

        numeroElement.textContent =
            "ÉTAPE " + (etapeActuelle + 1);

        titreElement.textContent = etape.titre;

        descriptionElement.textContent =
            etape.description;

        exempleElement.textContent = etape.exemple();

        // Colorer les cartes du parcours.

        cartes.forEach((carte, indexCarte) => {

            carte.classList.toggle(
                "active",
                indexCarte === etapeActuelle
            );

            carte.classList.toggle(
                "completed",
                indexCarte < etapeActuelle
            );

        });

        // Calculer la progression.

        const pourcentage = simulationDemarree
            ? Math.round(
                (etapeActuelle + 1) / etapes.length * 100
              )
            : 0;

        progressionElement.style.width =
            pourcentage + "%";

        progressionBarre.setAttribute(
            "aria-valuenow",
            String(pourcentage)
        );

        progressionPourcent.textContent =
            pourcentage + " %";

        progressionTexte.textContent =
            "Étape " +
            (etapeActuelle + 1) +
            " sur " +
            etapes.length;

        // Gérer les boutons du mode manuel.

        const manuel = obtenirMode() === "manual";

        boutonPrecedent.disabled =
            !manuel ||
            !simulationDemarree ||
            etapeActuelle === 0;

        boutonSuivant.disabled =
            !manuel ||
            !simulationDemarree ||
            simulationTerminee;

        // Mettre à jour le texte du bouton principal.

        if (simulationTerminee) {

            boutonDemarrer.innerHTML =
                '<i class="fa-solid fa-rotate-right"></i> ' +
                "Recommencer la simulation";

        } else if (
            simulationDemarree &&
            obtenirMode() === "automatic"
        ) {

            boutonDemarrer.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> ' +
                "Simulation en cours...";

        } else if (simulationDemarree) {

            boutonDemarrer.innerHTML =
                '<i class="fa-solid fa-check"></i> ' +
                "Mode manuel actif";

        } else {

            boutonDemarrer.innerHTML =
                '<i class="fa-solid fa-play"></i> ' +
                "Lancer la simulation";

        }

        boutonDemarrer.disabled =
            simulationDemarree && !simulationTerminee;

    }


    // --------------------------------------------------
    // FIN DE LA SIMULATION
    // --------------------------------------------------

    function terminerSimulation() {

        annulerAnimation();

        simulationTerminee = true;

        afficherEtape(etapes.length - 1);

        statutElement.textContent =
            "Simulation terminée ! Tu as découvert " +
            "comment le DNS aide ton navigateur " +
            "à retrouver un serveur Web.";

    }


    // --------------------------------------------------
    // SIMULATION AUTOMATIQUE
    // --------------------------------------------------

    function lancerAutomatique() {

        const id = identifiantSimulation;

        function programmerEtape() {

            const delai = preferenceAnimations.matches
                ? 0
                : DUREE_ETAPE;

            minuterie = setTimeout(() => {

                // Si l'utilisateur a annulé ou changé de mode,
                // on n'exécute plus cette animation.

                if (
                    id !== identifiantSimulation ||
                    !simulationDemarree ||
                    obtenirMode() !== "automatic"
                ) {
                    return;
                }

                if (etapeActuelle < etapes.length - 1) {

                    afficherEtape(etapeActuelle + 1);
                    programmerEtape();

                } else {

                    terminerSimulation();

                }

            }, delai);

        }

        programmerEtape();

    }


    // --------------------------------------------------
    // DEMARRER UNE SIMULATION
    // --------------------------------------------------

    function demarrerSimulation() {

        annulerAnimation();

        simulationDemarree = true;
        simulationTerminee = false;

        afficherEtape(0);

        if (obtenirMode() === "automatic") {

            statutElement.textContent =
                "Simulation automatique : chaque étape " +
                "reste affichée pendant 5 secondes.";

            if (preferenceAnimations.matches) {
                statutElement.textContent =
                    "Simulation automatique avec animations " +
                    "réduites selon tes préférences système.";
            }

            lancerAutomatique();

        } else {

            statutElement.textContent =
                "Mode manuel : utilise les boutons " +
                "Précédent et Suivant pour avancer.";

        }

    }


    // --------------------------------------------------
    // REINITIALISER LA SIMULATION
    // --------------------------------------------------

    function reinitialiserSimulation(message) {

        annulerAnimation();

        simulationDemarree = false;
        simulationTerminee = false;
        etapeActuelle = 0;

        afficherEtape(0);

        statutElement.textContent =
            message || "Simulation réinitialisée.";

    }


    // --------------------------------------------------
    // EVENEMENT : CHOISIR UN DOMAINE
    // --------------------------------------------------

    formulaire.addEventListener("submit", evenement => {

        evenement.preventDefault();

        const valeur = champDomaine.value
            .trim()
            .toLowerCase()
            .replace(/\.$/, "");

        if (!domaineValide(valeur)) {

            statutElement.textContent =
                "Nom de domaine invalide. " +
                "Entre un domaine comme example.com, " +
                "sans https:// ni chemin.";

            champDomaine.focus();

            return;

        }

        domaine = valeur;
        champDomaine.value = domaine;

        reinitialiserSimulation(
            "Domaine sélectionné : " +
            domaine +
            ". Tu peux maintenant lancer la simulation."
        );

    });


    // --------------------------------------------------
    // EVENEMENT : DEMARRER OU RECOMMENCER
    // --------------------------------------------------

    boutonDemarrer.addEventListener("click", () => {

        demarrerSimulation();

    });


    // --------------------------------------------------
    // EVENEMENT : ETAPE PRECEDENTE
    // --------------------------------------------------

    boutonPrecedent.addEventListener("click", () => {

        if (
            obtenirMode() !== "manual" ||
            !simulationDemarree ||
            etapeActuelle === 0
        ) return;

        simulationTerminee = false;

        afficherEtape(etapeActuelle - 1);

        statutElement.textContent =
            "Étape " + (etapeActuelle + 1) +
            " sur " + etapes.length + ".";

    });


    // --------------------------------------------------
    // EVENEMENT : ETAPE SUIVANTE
    // --------------------------------------------------

    boutonSuivant.addEventListener("click", () => {

        if (
            obtenirMode() !== "manual" ||
            !simulationDemarree ||
            simulationTerminee
        ) return;

        if (etapeActuelle < etapes.length - 1) {

            afficherEtape(etapeActuelle + 1);

            statutElement.textContent =
                "Étape " + (etapeActuelle + 1) +
                " sur " + etapes.length + ".";

        } else {

            terminerSimulation();

        }

    });


    // --------------------------------------------------
    // EVENEMENT : CHANGEMENT DE MODE
    // --------------------------------------------------

    document.querySelectorAll(
        'input[name="dns-mode"]'
    ).forEach(boutonRadio => {

        boutonRadio.addEventListener("change", () => {

            const mode = obtenirMode();

            reinitialiserSimulation(
                mode === "automatic"
                    ? "Mode automatique sélectionné. " +
                      "Chaque étape durera 5 secondes."
                    : "Mode manuel sélectionné. " +
                      "Tu pourras avancer à ton rythme."
            );

        });

    });


    // --------------------------------------------------
    // EVENEMENT : REINITIALISATION
    // --------------------------------------------------

    boutonReset.addEventListener("click", () => {

        reinitialiserSimulation(
            "Simulation réinitialisée. " +
            "Clique sur Lancer la simulation."
        );

    });


    // --------------------------------------------------
    // INITIALISATION DE L'AFFICHAGE
    // --------------------------------------------------

    afficherEtape(0);

}


// ======================================================
// 7. DECOUVRIR L'ADRESSE IP PUBLIQUE DU VISITEUR
// ======================================================

function initialiserAdresseIP() {

    const bouton = document.getElementById(
        "my-ip-button"
    );

    const adresseElement = document.getElementById(
        "my-public-ip"
    );

    const statutElement = document.getElementById(
        "my-ip-status"
    );

    if (
        !bouton ||
        !adresseElement ||
        !statutElement
    ) return;


    // API utilisée :
    // https://www.ipify.org/
    //
    // api64.ipify.org prend en charge IPv4 et IPv6.
    //
    // IMPORTANT :
    // L'API n'est appelée qu'après le clic du visiteur.
    // Aucun résultat IP n'est enregistré par ce script.

    const URL_API =
        "https://api64.ipify.org?format=json";


    bouton.addEventListener("click", async () => {

        bouton.disabled = true;

        adresseElement.textContent = "Recherche...";

        statutElement.textContent =
            "Connexion au service ipify en cours...";

        bouton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> ' +
            "Recherche en cours...";

        // Éviter qu'une requête reste bloquée sans fin.

        const controleur = new AbortController();

        const minuterie = setTimeout(() => {
            controleur.abort();
        }, 10000);

        try {

            const reponse = await fetch(URL_API, {

                method: "GET",
                signal: controleur.signal,
                cache: "no-store"

            });

            if (!reponse.ok) {

                throw new Error(
                    "Le service n'a pas répondu correctement."
                );

            }

            const donnees = await reponse.json();

            // Vérifier que le service renvoie bien
            // une chaîne ressemblant à une IPv4 ou IPv6.

            if (
                typeof donnees.ip !== "string" ||
                !/^[0-9a-fA-F:.]+$/.test(donnees.ip) ||
                donnees.ip.length > 45
            ) {

                throw new Error(
                    "Réponse IP invalide."
                );

            }

            adresseElement.textContent = donnees.ip;

            const typeAdresse = donnees.ip.includes(":")
                ? "IPv6"
                : "IPv4";

            statutElement.textContent =
                "Adresse " + typeAdresse +
                " publique détectée. " +
                "Il s'agit de l'adresse visible " +
                "par le service ipify, et pas " +
                "nécessairement d'une adresse " +
                "propre à ton appareil.";

        } catch (erreur) {

            adresseElement.textContent =
                "Adresse indisponible";

            statutElement.textContent =
                erreur.name === "AbortError"
                    ? "La recherche a pris trop de temps. " +
                      "Réessaie plus tard."
                    : "Impossible de récupérer l'adresse IP. " +
                      "Vérifie ta connexion Internet " +
                      "ou les restrictions du navigateur.";

            console.error(
                "Erreur de recherche IP :",
                erreur
            );

        } finally {

            clearTimeout(minuterie);

            bouton.disabled = false;

            bouton.innerHTML =
                '<i class="fa-solid fa-rotate-right"></i> ' +
                "Relancer la recherche";

        }

    });

}


// ======================================================
// 8. NOUVEAU MINI-QUIZ DNS
// ======================================================

function initialiserQuizDNS() {

    const questionElement = document.getElementById(
        "dns-question"
    );

    const optionsElement = document.getElementById(
        "dns-options"
    );

    const feedbackElement = document.getElementById(
        "dns-feedback"
    );

    const numeroElement = document.getElementById(
        "dns-question-number"
    );

    const scoreElement = document.getElementById(
        "dns-score"
    );

    const boutonSuivant = document.getElementById(
        "dns-quiz-next"
    );

    if (
        !questionElement ||
        !optionsElement ||
        !feedbackElement ||
        !numeroElement ||
        !scoreElement ||
        !boutonSuivant
    ) return;


    // --------------------------------------------------
    // QUESTIONS DU QUIZ DNS
    // --------------------------------------------------

    const questions = [

        {
            question:
                "À quoi sert principalement le système DNS ?",

            choix: [
                "Retrouver des informations associées " +
                "à un nom de domaine",

                "Créer des mots de passe",

                "Protéger un ordinateur contre les virus"
            ],

            reponse: 0,

            explication:
                "Le DNS permet notamment de retrouver " +
                "des adresses IP associées aux noms " +
                "de domaine."
        },

        {
            question:
                "Pourquoi utilise-t-on des noms de domaine ?",

            choix: [
                "Parce que les adresses IP sont interdites",

                "Parce qu'ils sont plus faciles " +
                "à mémoriser",

                "Parce qu'ils remplacent Internet"
            ],

            reponse: 1,

            explication:
                "Les noms de domaine sont plus faciles " +
                "à retenir que des adresses numériques."
        },

        {
            question:
                "Que vérifie généralement l'appareil " +
                "avant une nouvelle résolution DNS ?",

            choix: [
                "La couleur du navigateur",

                "La puissance du processeur",

                "Les réponses DNS disponibles en cache"
            ],

            reponse: 2,

            explication:
                "Une réponse encore valide en cache " +
                "peut éviter une nouvelle recherche DNS."
        },

        {
            question:
                "Quel est le rôle d'un résolveur DNS ?",

            choix: [
                "Rechercher une réponse DNS " +
                "pour le client",

                "Créer des pages HTML",

                "Supprimer les virus"
            ],

            reponse: 0,

            explication:
                "Le résolveur recherche et renvoie " +
                "des réponses DNS au client."
        },

        {
            question:
                "Que signifie TTL dans le contexte DNS ?",

            choix: [
                "Le nombre de visiteurs",

                "La durée pendant laquelle " +
                "une réponse peut être conservée en cache",

                "Le prix d'un nom de domaine"
            ],

            reponse: 1,

            explication:
                "TTL signifie Time To Live. " +
                "Cette valeur contrôle la durée " +
                "de conservation d'une réponse en cache."
        },

        {
            question:
                "Un nom de domaine peut-il correspondre " +
                "à plusieurs adresses IP ?",

            choix: [
                "Non, jamais",

                "Seulement sur un ordinateur portable",

                "Oui, plusieurs adresses peuvent être associées"
            ],

            reponse: 2,

            explication:
                "Un domaine peut disposer de plusieurs " +
                "adresses IPv4 ou IPv6, notamment " +
                "pour répartir les connexions."
        },

        {
            question:
                "Que fait le navigateur après avoir " +
                "obtenu une adresse IP ?",

            choix: [
                "Il peut établir une connexion " +
                "vers le serveur",

                "Il supprime automatiquement son cache",

                "Il change le nom du domaine"
            ],

            reponse: 0,

            explication:
                "Après la résolution DNS, le navigateur " +
                "peut contacter le serveur et effectuer " +
                "sa requête HTTP ou HTTPS."
        }

    ];


    // --------------------------------------------------
    // VARIABLES DU QUIZ
    // --------------------------------------------------

    let index = 0;
    let score = 0;

    let reponseDonnee = false;
    let quizTermine = false;


    // --------------------------------------------------
    // AFFICHER UNE QUESTION
    // --------------------------------------------------

    function afficherQuestion() {

        quizTermine = false;
        reponseDonnee = false;

        const question = questions[index];

        questionElement.textContent = question.question;

        numeroElement.textContent =
            `Question ${index + 1} / ${questions.length}`;

        scoreElement.textContent = `Score : ${score}`;

        feedbackElement.textContent = "";
        feedbackElement.className = "quiz-feedback";

        boutonSuivant.hidden = true;

        optionsElement.replaceChildren();

        question.choix.forEach((choix, numero) => {

            const bouton = document.createElement("button");

            bouton.type = "button";
            bouton.className = "quiz-option";
            bouton.textContent = choix;

            bouton.addEventListener("click", () => {
                verifierReponse(numero);
            });

            optionsElement.appendChild(bouton);

        });

    }


    // --------------------------------------------------
    // VERIFIER UNE REPONSE
    // --------------------------------------------------

    function verifierReponse(reponse) {

        if (reponseDonnee) return;

        reponseDonnee = true;

        const question = questions[index];

        const correct = reponse === question.reponse;

        if (correct) score++;

        scoreElement.textContent = `Score : ${score}`;

        feedbackElement.textContent = correct
            ? "Bonne réponse ! " + question.explication
            : "Ce n'est pas la bonne réponse. " +
              question.explication;

        feedbackElement.className = correct
            ? "quiz-feedback success"
            : "quiz-feedback error";

        optionsElement.querySelectorAll(
            ".quiz-option"
        ).forEach((bouton, numero) => {

            bouton.disabled = true;

            if (numero === question.reponse) {
                bouton.classList.add("correct");
            }

            if (!correct && numero === reponse) {
                bouton.classList.add("incorrect");
            }

        });

        boutonSuivant.hidden = false;

        boutonSuivant.textContent =
            index === questions.length - 1
                ? "Voir mon résultat"
                : "Question suivante";

    }


    // --------------------------------------------------
    // RESULTAT FINAL
    // --------------------------------------------------

    function afficherResultat() {

        quizTermine = true;

        const pourcentage = Math.round(
            score / questions.length * 100
        );

        questionElement.textContent =
            `Tu as obtenu ${score} / ${questions.length}` +
            ` (${pourcentage} %).`;

        numeroElement.textContent = "Quiz terminé";
        scoreElement.textContent = `Score final : ${score}`;

        optionsElement.replaceChildren();

        feedbackElement.className = "quiz-feedback";

        if (pourcentage === 100) {

            feedbackElement.textContent =
                "Excellent ! Tu maîtrises le fonctionnement du DNS.";

            feedbackElement.classList.add("success");

        } else if (pourcentage >= 60) {

            feedbackElement.textContent =
                "Bien joué ! Tu as compris les bases du DNS.";

            feedbackElement.classList.add("success");

        } else {

            feedbackElement.textContent =
                "Continue à explorer la simulation " +
                "pour mieux comprendre le DNS.";

        }

        boutonSuivant.textContent = "Recommencer";
        boutonSuivant.hidden = false;

    }


    // --------------------------------------------------
    // QUESTION SUIVANTE / RECOMMENCER
    // --------------------------------------------------

    boutonSuivant.addEventListener("click", () => {

        if (quizTermine) {

            index = 0;
            score = 0;

            afficherQuestion();

            return;

        }

        index++;

        if (index < questions.length) {
            afficherQuestion();
        } else {
            afficherResultat();
        }

    });

    afficherQuestion();

}


// ======================================================
// 9. CARTES RETOURNABLES DE CYBERSECURITE
// ======================================================

function initialiserCartesSecurite() {

    const cartes = document.querySelectorAll(
        ".flip-card"
    );

    cartes.forEach(carte => {

        carte.addEventListener("click", () => {

            const retournee = carte.classList.toggle(
                "flipped"
            );

            carte.setAttribute(
                "aria-pressed",
                String(retournee)
            );

        });

    });

}


// ======================================================
// 10. QUIZ PHISHING
// ======================================================

function initialiserQuizPhishing() {

    const expediteur = document.getElementById(
        "email-sender"
    );

    const sujet = document.getElementById(
        "email-subject"
    );

    const contenu = document.getElementById(
        "email-body"
    );

    const numeroElement = document.getElementById(
        "phishing-question-number"
    );

    const scoreElement = document.getElementById(
        "phishing-score"
    );

    const optionsElement = document.getElementById(
        "phishing-options"
    );

    const feedbackElement = document.getElementById(
        "phishing-feedback"
    );

    const boutonSuivant = document.getElementById(
        "phishing-next"
    );

    if (
        !expediteur ||
        !sujet ||
        !contenu ||
        !numeroElement ||
        !scoreElement ||
        !optionsElement ||
        !feedbackElement ||
        !boutonSuivant
    ) return;


    // Les messages sont entièrement fictifs.
    // Les domaines .example sont réservés aux exemples.

    const messages = [

        {
            expediteur:
                "assistance@verification-compte.example",

            sujet:
                "URGENT : votre compte sera suspendu !",

            contenu:
                "Bonjour,\n\n" +
                "Votre compte sera suspendu dans deux heures " +
                "si vous ne confirmez pas immédiatement " +
                "votre mot de passe et vos coordonnées.\n\n" +
                "Cliquez sur le lien de vérification " +
                "pour éviter la suspension.",

            reponse: "phishing",

            explication:
                "Le message utilise l'urgence et demande " +
                "des informations sensibles. " +
                "Ce sont des signes caractéristiques " +
                "d'une tentative de phishing."
        },

        {
            expediteur:
                "bibliotheque@ecole.example",

            sujet:
                "Rappel : retour de votre livre",

            contenu:
                "Bonjour,\n\n" +
                "Nous vous rappelons que le livre emprunté " +
                "doit être rapporté vendredi.\n\n" +
                "Vous pouvez consulter les horaires " +
                "à l'accueil de la bibliothèque.\n\n" +
                "Bonne journée.",

            reponse: "legitimate",

            explication:
                "Dans ce scénario, il s'agit d'un rappel " +
                "normal sans demande sensible. " +
                "En réalité, l'identité de l'expéditeur " +
                "doit toujours être vérifiée."
        },

        {
            expediteur:
                "livraison@colis-urgent.example",

            sujet:
                "Votre colis est bloqué !",

            contenu:
                "Bonjour,\n\n" +
                "Votre colis ne peut pas être livré. " +
                "Vous devez payer immédiatement 2,99 € " +
                "pour éviter son retour.\n\n" +
                "Saisissez vos coordonnées bancaires " +
                "sur notre site de paiement.",

            reponse: "phishing",

            explication:
                "Une demande de paiement inattendue " +
                "et urgente est suspecte. " +
                "Consulte directement le site officiel " +
                "du transporteur."
        },

        {
            expediteur:
                "professeur@ecole.example",

            sujet:
                "Informations sur le prochain cours",

            contenu:
                "Bonjour à tous,\n\n" +
                "Le prochain cours débutera à 9 h. " +
                "Pensez à prendre votre matériel " +
                "et vos notes de la séance précédente.\n\n" +
                "Bonne journée.",

            reponse: "legitimate",

            explication:
                "Dans cet exemple, le message donne " +
                "une information normale sur un cours. " +
                "Il ne demande aucune donnée confidentielle."
        },

        {
            expediteur:
                "securite@compte-bancaire.example",

            sujet:
                "Connexion inhabituelle détectée",

            contenu:
                "Cher client,\n\n" +
                "Une connexion inhabituelle a été détectée. " +
                "Pour protéger votre argent, veuillez " +
                "nous envoyer votre mot de passe ainsi que " +
                "le code reçu par SMS.\n\n" +
                "Répondez dans les dix prochaines minutes.",

            reponse: "phishing",

            explication:
                "Ne communique jamais ton mot de passe " +
                "ou ton code de validation par e-mail. " +
                "Ce message cherche à obtenir tes accès."
        },

        {
            expediteur:
                "association@club.example",

            sujet:
                "Confirmation de votre inscription",

            contenu:
                "Bonjour,\n\n" +
                "Nous confirmons votre inscription " +
                "à notre activité de samedi.\n\n" +
                "L'accueil commencera à 14 h " +
                "à l'entrée principale.\n\n" +
                "À bientôt !",

            reponse: "legitimate",

            explication:
                "Dans notre scénario, ce message est " +
                "une confirmation normale d'inscription. " +
                "Une vérification reste nécessaire " +
                "si le message est inattendu."
        },

        {
            expediteur:
                "cadeau@super-recompense.example",

            sujet:
                "FÉLICITATIONS ! Vous avez gagné 1000 € !",

            contenu:
                "Félicitations !\n\n" +
                "Vous avez été sélectionné pour recevoir " +
                "un cadeau de 1000 €.\n\n" +
                "Pour le récupérer, fournissez votre " +
                "identité et votre numéro de carte bancaire " +
                "avant minuit.\n\n" +
                "Dépêchez-vous !",

            reponse: "phishing",

            explication:
                "Un cadeau inattendu accompagné d'une " +
                "demande bancaire et d'un délai très court " +
                "est un signe fréquent d'arnaque."
        }

    ];


    let index = 0;
    let score = 0;

    let reponseDonnee = false;
    let quizTermine = false;


    // --------------------------------------------------
    // AFFICHER UN MESSAGE
    // --------------------------------------------------

    function afficherMessage() {

        reponseDonnee = false;
        quizTermine = false;

        const message = messages[index];

        expediteur.textContent = message.expediteur;
        sujet.textContent = message.sujet;

        // textContent empêche l'injection de HTML.

        contenu.textContent = message.contenu;
        contenu.style.whiteSpace = "pre-line";

        numeroElement.textContent =
            `Message ${index + 1} / ${messages.length}`;

        scoreElement.textContent = `Score : ${score}`;

        feedbackElement.textContent = "";
        feedbackElement.className = "quiz-feedback";

        boutonSuivant.hidden = true;

        optionsElement.querySelectorAll(
            ".quiz-option"
        ).forEach(bouton => {

            bouton.hidden = false;
            bouton.disabled = false;

            bouton.classList.remove(
                "correct",
                "incorrect"
            );

        });

    }


    // --------------------------------------------------
    // VERIFIER LE MESSAGE
    // --------------------------------------------------

    function verifierMessage(reponse) {

        if (reponseDonnee) return;

        reponseDonnee = true;

        const message = messages[index];

        const correct = reponse === message.reponse;

        if (correct) score++;

        scoreElement.textContent = `Score : ${score}`;

        feedbackElement.textContent = correct
            ? "Bonne réponse ! " + message.explication
            : "Ce n'est pas la bonne réponse. " +
              message.explication;

        feedbackElement.className = correct
            ? "quiz-feedback success"
            : "quiz-feedback error";

        optionsElement.querySelectorAll(
            ".quiz-option"
        ).forEach(bouton => {

            const valeur = bouton.dataset.answer;

            bouton.disabled = true;

            if (valeur === message.reponse) {
                bouton.classList.add("correct");
            }

            if (!correct && valeur === reponse) {
                bouton.classList.add("incorrect");
            }

        });

        boutonSuivant.hidden = false;

        boutonSuivant.textContent =
            index === messages.length - 1
                ? "Voir mon résultat"
                : "Message suivant";

    }


    // --------------------------------------------------
    // CLIC SUR UNE REPONSE
    // --------------------------------------------------

    optionsElement.addEventListener("click", evenement => {

        const bouton = evenement.target.closest(
            ".quiz-option"
        );

        if (
            !bouton ||
            !optionsElement.contains(bouton)
        ) return;

        verifierMessage(bouton.dataset.answer);

    });


    // --------------------------------------------------
    // RESULTAT FINAL
    // --------------------------------------------------

    function afficherResultat() {

        quizTermine = true;

        const pourcentage = Math.round(
            score / messages.length * 100
        );

        expediteur.textContent = "WebExplorer";
        sujet.textContent = "Résultat du quiz";

        contenu.textContent =
            "Tu as terminé le défi cybersécurité !\n\n" +
            `Ton score : ${score} / ${messages.length}` +
            ` (${pourcentage} %).\n\n` +
            "Rappelle-toi qu'un message suspect doit " +
            "toujours être vérifié auprès de " +
            "l'organisme officiel.";

        numeroElement.textContent = "Défi terminé";

        optionsElement.querySelectorAll(
            ".quiz-option"
        ).forEach(bouton => {
            bouton.hidden = true;
        });

        feedbackElement.className = "quiz-feedback";

        if (pourcentage === 100) {

            feedbackElement.textContent =
                "Excellent ! Tu as repéré tous les pièges.";

            feedbackElement.classList.add("success");

        } else if (pourcentage >= 60) {

            feedbackElement.textContent =
                "Bien joué ! Continue à rester vigilant.";

            feedbackElement.classList.add("success");

        } else {

            feedbackElement.textContent =
                "Continue à t'entraîner pour reconnaître " +
                "les tentatives de phishing.";

        }

        boutonSuivant.textContent = "Recommencer";
        boutonSuivant.hidden = false;

    }


    // --------------------------------------------------
    // MESSAGE SUIVANT / RECOMMENCER
    // --------------------------------------------------

    boutonSuivant.addEventListener("click", () => {

        if (quizTermine) {

            index = 0;
            score = 0;

            afficherMessage();
            return;

        }

        index++;

        if (index < messages.length) {
            afficherMessage();
        } else {
            afficherResultat();
        }

    });

    afficherMessage();

}


// ======================================================
// 11. BOUTON RETOUR EN HAUT
// ======================================================

function initialiserRetourHaut() {

    const bouton = document.getElementById(
        "back-to-top"
    );

    if (!bouton) return;

    function verifierDefilement() {

        bouton.classList.toggle(
            "visible",
            window.scrollY > 450
        );

    }

    window.addEventListener(
        "scroll",
        verifierDefilement,
        { passive: true }
    );

    verifierDefilement();

    bouton.addEventListener("click", () => {

        const animationsReduites = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({

            top: 0,

            behavior: animationsReduites
                ? "instant"
                : "smooth"

        });

    });

}


// ======================================================
// FIN DU FICHIER SCRIPT.JS
// ======================================================

console.log("Script WebExplorer chargé.");
