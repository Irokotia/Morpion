/* global plugins, modele */

////////////////////////////////////////////////////////////////////////////////
// On dÃ©finit un objet controleur qui va contenir les controleurs de nos pages
////////////////////////////////////////////////////////////////////////////////

var controleur = {};

////////////////////////////////////////////////////////////////////////////////
// Session : variables qui reprÃ©sentent l'Ã©tat de l'application
////////////////////////////////////////////////////////////////////////////////

controleur.session = {
    partieEnCours: null // La partie en train d'Ãªtre jouÃ©e
};

////////////////////////////////////////////////////////////////////////////////
// initialise : exÃ©cutÃ© au dÃ©marrage de l'application (voir fichier index.js)
////////////////////////////////////////////////////////////////////////////////

controleur.init = function () {
    // On duplique Header et Footer sur chaque page (sauf la premiÃ¨re !)
    $('div[data-role="page"]').each(function (i) {
        if (i > 0)
            $(this).html($('#shifumiHeader').html() + $(this).html() + $('#shifumiFooter').html());
    });
    // On afficher la page d'accueil
    $.mobile.changePage("#vueAccueil");
};

////////////////////////////////////////////////////////////////////////////////
// Controleurs de pages : 1 contrÃ´leur par page, qui porte le nom de la page
//  et contient les callbacks des Ã©vÃ©nements associÃ©s Ã  cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
        $("#nomJoueur").val("");
        $("#nomJoueur2").val("");
        $("#cameraImageJoueur1").attr("src", "images/imageblanche.jpg");
        $("#cameraImageJoueur2").attr("src","images/imageblanche.jpg");
    },
    

    nouvellePartie: function () {
        // on rÃ©cupÃ¨re de l'information de la vue en cours
        var nomJoueur1 = $("#nomJoueur1").val();
        var nomJoueur2 = $("#nomJoueur2").val();

        var photoJoueur = $("#cameraImageJoueur1").attr("src");
        var photoJoueur2 =  $("#cameraImageJoueur2").attr("src");

        if (nomJoueur1 === "" || nomJoueur2 === "") {
            alert("Entrez un nom de joueur svp");
        } else {
            modele.Partie.nomJoueur = nomJoueur1;
            modele.Partie.nomJoueur2 = nomJoueur2;
            modele.Partie.photoJoueur = photoJoueur;
            modele.Partie.photoJoueur2 = photoJoueur2;

            controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur1); // charge la partie du joueur depuis le localstorage
            controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur2); // charge la partie du joueur depuis le localstorage


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
            
            // Et on passe Ã  une autre vue
            $.mobile.changePage("#vueJeu");
            controleur.vueJeu.init();
        }
    }
};
// On dÃ©finit ici la callback exÃ©cutÃ©e au chargement de la vue Accueil
$(document).on("pagebeforeshow", "#vueAccueil", function () {
    controleur.vueAccueil.init();
});
controleur.cameraController = {
    takePictureJoueur1: function () {
        // on appelle la méthode du modèle le permettant de prendre une photo
        // en lui passant en paramÃƒÂ¨tre successCB et errorCB
        console.log('ça passe !');
        window.modele.takePicture(
            // successCB : on met à  jour dans la vue le champ cameraImage
            function (uneImage) {
                // on récupère un objet Image
                    $("#cameraImageJoueur1").attr("src", uneImage.getBase64());
            },
            // erreurCB : on affiche la page erreur avec un message appropriÃƒÂ©
            function () {
                console.log('ça cassse !');
                plugins.toast.showShortCenter("Impossible de prendre une photo");
            },1
        );
    },
    takePictureJoueur2: function () {
        // on appelle la méthode du modèle le permettant de prendre une photo
        // en lui passant en paramÃƒÂ¨tre successCB et errorCB
        console.log('ça passe !');
        window.modele.takePicture2(
            // successCB : on met à  jour dans la vue le champ cameraImage
            function (uneImage) {
                // on récupère un objet Image
                $("#cameraImageJoueur2").attr("src", uneImage.getBase64());
            },
            // erreurCB : on affiche la page erreur avec un message appropriÃƒÂ©
            function () {
                console.log('ça cassse !');
                plugins.toast.showShortCenter("Impossible de prendre une photo");
            },1
        );
    }
};
////////////////////////////////////////////////////////////////////////////////
controleur.vueJeu = {

    init: function () {
        // on active et on montre tous les boutons du joueur
        $("button[id^=joueur]").prop('disabled', false).show();




        modele.Partie.morpion[0] = new Array(" "," "," ");
        modele.Partie.morpion[1] = new Array(" "," "," ");
        modele.Partie.morpion[2] = new Array(" "," "," ");

        modele.Partie.JoueurCourant = modele.Partie.nomJoueur;
        // controleur.session.partieEnCours = modele.dao.loadPartie(nomJoueur); // charge la partie du joueur depuis le localstorage
        // On "propage" le nom du joueur sur toutes les vues
        $('span[data-role="nomJoueurCourant"]').each(function () {
            $(this).html(modele.Partie.JoueurCourant);
        });
    },

    jouer: function (coupJoueur) {
        var lastPersonne = modele.Partie.JoueurCourant;
        // on interroge le modÃ¨le pour voir le rÃ©sultat du nouveau coup
        var resultat = modele.Partie.prototype.nouveauCoup(modele.Partie.JoueurCourant,coupJoueur);
        console.log(resultat);
        console.log(resultat.includes("Victoire"));
        // le score a changÃ© => on sauvegarde la partie en cours
        modele.dao.savePartie(controleur.session.partieEnCours);
        if(resultat.includes("Victoire")){
            controleur.vueJeu.finPartie();
        }else{
            $('span[data-role="nomJoueurCourant"]').each(function () {
                $(this).html(modele.Partie.JoueurCourant);
            });
        }
        if (lastPersonne !== modele.Partie.JoueurCourant) {
            controleur.vueJeu.nouveauCoup(coupJoueur,modele.Partie.JoueurCourant);
        }
    },

    nouveauCoup: function (coupJoueur,joueur) {
        // controleur.vueJeu.init();
        $("#imageblock" + coupJoueur).attr('src', function () {
            //console.log("imageblock"+ coupJoueur);
            var src = ((modele.Partie.nomJoueur === joueur) ?
                modele.Partie.photoJoueur : modele.Partie.photoJoueur2);
            //console.log(src);
            $(this).attr("src", src);
        });
        $("#block"+coupJoueur).prop('disabled', true);
    },

    finPartie: function () {
        $.mobile.changePage("#vueFin");
    }
};

// On dÃ©finit ici la callback exÃ©cutÃ©e au chargement de la vue Jeu
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

// On dÃ©finit ici la callback exÃ©cutÃ©e au chargement de la vue Fin
$(document).on("pagebeforeshow", "#vueFin", function () {
    controleur.vueFin.init();
});
