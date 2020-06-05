/* global plugins */

////////////////////////////////////////////////////////////////////////////////
// On définit un objet controleur qui va contenir les controleurs de nos pages
////////////////////////////////////////////////////////////////////////////////

var controleur = {};

////////////////////////////////////////////////////////////////////////////////
// Session : variables qui représentent l'état de l'application
////////////////////////////////////////////////////////////////////////////////

controleur.session = {
    partieEnCours: null, // La partie en train d'être jouée
};

////////////////////////////////////////////////////////////////////////////////
// initialise : exécuté au démarrage de l'application (voir fichier index.js)
////////////////////////////////////////////////////////////////////////////////

controleur.init = function () {
    // On duplique Header et Footer sur chaque page (sauf la première !)
    $('div[data-role="page"]').each(function (i) {
        if (i > 0)
            $(this).html($('#shifumiHeader').html() + $(this).html() + $('#shifumiFooter').html());
    });
    // On afficher la page d'accueil
    $.mobile.changePage("#vueAccueil");
};

////////////////////////////////////////////////////////////////////////////////
// Controleurs de pages : 1 contrôleur par page, qui porte le nom de la page
//  et contient les callbacks des événements associés à cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
        $("#nomJoueur").val("");
    },
    

    nouvellePartie: function () {
        // on récupère de l'information de la vue en cours
        var nomJoueur1 = $("#nomJoueur1").val();
        var nomJoueur2 = $("#nomJoueur2").val();
        if (nomJoueur1 === "") {
            alert("Entrez un nom de joueur svp");
        }else if (nomJoueur2 === ""){
            alert("Entrez un nom de joueur svp");
        } else {
            // On utilise le modèle pour créer une nouvelle partie
            controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur1,nomJoueur2); // charge la partie du joueur depuis le localstorage
            // On "propage" le nom des joueurs sur toutes les vues
            $('span[data-role="nomJoueur1"]').each(function () {
                $(this).html(nomJoueur1);
            });
            $('span[data-role="nomJoueur2"]').each(function () {
                $(this).html(nomJoueur2);
            });
            
            // on "propage" le nom du premier joueur pour le premier coup
            $('span[data-role="nomJoueurCourant"]').each(function () {
                $(this).html(nomJoueur1);
            });
            
            // Et on passe à une autre vue
            $.mobile.changePage("#vueJeu");
        }
    }
};
// On définit ici la callback exécutée au chargement de la vue Accueil
$(document).on("pagebeforeshow", "#vueAccueil", function () {
    controleur.vueAccueil.init();
});
controleur.cameraController = {
    takePicture: function () {
        // on appelle la mÃ©thode du modÃ¨le permettant de prendre une photo
        // en lui passant en paramÃ¨tre successCB et errorCB
        window.model.takePicture(
            // successCB : on met Ã  jour dans la vue le champ cameraImage
            function (uneImage) {
                // on rÃ©cupÃ¨re un objet Image
                $("#cameraImage").attr("src",uneImage.getBase64());
                uneImage.insert(
                    function () { plugins.toast.showShortCenter("Image Enregistré");}, 
                    function () { plugins.toast.showShortCenter("Image non Enregistrée"); }
                );
            },
            // erreurCB : on affiche la page erreur avec un message appropriÃ©
            function () {
                plugins.toast.showShortCenter("Impossible de prendre une photo");
            }
        );
    }
};

$(document).on("pagebeforeshow", "#camera",
    function () {
        $("#cameraImage").attr("src","");
    }
);
////////////////////////////////////////////////////////////////////////////////
controleur.vueJeu = {

    init: function () {
        // on active et on montre tous les boutons du joueur
        $("button[id^=joueur]").prop('disabled', false).show();
 
    },

    jouer: function (coupJoueur) {
        // on interroge le modèle pour voir le résultat du nouveau coup
        var resultat = controleur.session.partieEnCours.nouveauCoup($("#nomJoueurCourant").val(),coupJoueur);
        // le score a changé => on sauvegarde la partie en cours
        modele.dao.savePartie(controleur.session.partieEnCours);
        $("#block"+coupJoueur).prop('disabled', true);
    },

    nouveauCoup: function () {
        controleur.vueJeu.init();
    },

    finPartie: function () {
        $.mobile.changePage("#vueFin");
    }
};

// On définit ici la callback exécutée au chargement de la vue Jeu
$(document).on("pagebeforeshow", "#vueJeu", function () {
    controleur.vueJeu.init();
});

////////////////////////////////////////////////////////////////////////////////
controleur.vueFin = {
    init: function () {
        $("#nbVictoires").html(controleur.session.partieEnCours.nbVictoires);
        $("#nbNuls").html(controleur.session.partieEnCours.nbNuls);
        $("#nbDefaites").html(controleur.session.partieEnCours.nbDefaites);
    },

    retourJeu: function () {
        $.mobile.changePage("#vueJeu");
    },

    retourAccueil: function () {
        $.mobile.changePage("#vueAccueil");
    }
};

// On définit ici la callback exécutée au chargement de la vue Fin
$(document).on("pagebeforeshow", "#vueFin", function () {
    controleur.vueFin.init();
});