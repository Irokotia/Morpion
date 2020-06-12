/* global plugins, modele */

////////////////////////////////////////////////////////////////////////////////
// On définit un objet controleur qui va contenir les controleurs de nos pages
////////////////////////////////////////////////////////////////////////////////

var controleur = {
};

////////////////////////////////////////////////////////////////////////////////
// Session : variables qui représentent l'état de l'application
////////////////////////////////////////////////////////////////////////////////

controleur.session = {
    partieEnCours: null // La partie en train d'être jouée
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
//  et contient les callbacks des événements associés Ã  cette page
////////////////////////////////////////////////////////////////////////////////

controleur.vueAccueil = {
    init: function () {
        if(modele.Partie.nomJoueur != null){
            $("#nomJoueur").val(modele.Partie.nomJoueur);
        }else{
            $("#nomJoueur").val("");
        }
        if(modele.Partie.nomJoueur2 != null){
            $("#nomJoueur2").val(modele.Partie.nomJoueur2);
        }else{
            $("#nomJoueur2").val("");
        }
        if(modele.Partie.photoJoueur != null){
            $("#cameraImageJoueur1").attr("src", modele.Partie.photoJoueur);
        }
        if(modele.Partie.photoJoueur2 != null){
            $("#cameraImageJoueur2").attr("src", modele.Partie.photoJoueur2);
        }
    },
    

    nouvellePartie: function () {
        // on récupère de l'information de la vue en cours
        var nomJoueur1 = $("#nomJoueur1").val();
        var nomJoueur2 = $("#nomJoueur2").val();

        var photoJoueur = $("#cameraImageJoueur1").attr("src");
        var photoJoueur2 =  $("#cameraImageJoueur2").attr("src");

        // image prédéfinie pour les deux joueurs
        if(photoJoueur === "images/imageblanche.png"){
            photoJoueur = "images/happy-cat.jpg";
        }
        if(photoJoueur2 === "images/imageblanche.png"){
            photoJoueur2 = "images/sad-cat.jpg";
        }


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
            
            // Et on passe à  une autre vue
            $.mobile.changePage("#vueJeu");
            controleur.vueJeu.init();
        }
    },
    // recherche image pour le premier input
    searchImageBD1(nomJoueur){
        var joueur = JSON.parse(window.localStorage.getItem(nomJoueur));
        // si on trouve le joueur alors on charge son image
        // il faut gérer le cas ou on appuie sur rejouer et que l'on change un des pseudos pour un pseudo non existant en BDD
        if(joueur !== null){
            // on mets à jour le joueur qui veut jouer si il est enregistré en BDD
            // cela permettra d'enregistrer la prise de photo
            modele.Partie.nomJoueur = nomJoueur;
            $("#cameraImageJoueur1").attr("src", joueur.imageJoueur);
        }else{
            $("#cameraImageJoueur1").attr("src","images/imageblanche.png");
        }
    }
    ,
    // recherche image pour le deuxième input
    searchImageBD2(nomJoueur){
        var joueur = JSON.parse(window.localStorage.getItem(nomJoueur));
        // si on trouve le joueur alors on charge son image
        // il faut gérer le cas ou on appuie sur rejouer et que l'on change un des pseudos pour un pseudo non existant en BDD
        if(joueur !== null){
            // on mets à jour le joueur qui veut jouer si il est enregistré en BDD
            modele.Partie.nomJoueur2 = nomJoueur;
            $("#cameraImageJoueur2").attr("src", joueur.imageJoueur);
        }else{
            $("#cameraImageJoueur2").attr("src","images/imageblanche.png");
        }
    }
};
// On définit ici la callback exécutée au chargement de la vue Accueil
$(document).on("pagebeforeshow", "#vueAccueil", function () {
    controleur.vueAccueil.init();
});
controleur.cameraController = {
    takePictureJoueur1: function () {
        // on appelle la méthode du modèle le permettant de prendre une photo
        // en lui passant en paramètre successCB et errorCB
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

        // on initialise les images avec des images blanches
        for(i = 0;i <= 8;i++){
            $("#imageblock" + i).attr('src', function () {
                var src = "images/imageblanche.png";
                $(this).attr("src", src);
            });
            $("#block"+i).prop('disabled', false);
        }

        modele.Partie.morpion[0] = new Array(" "," "," ");
        modele.Partie.morpion[1] = new Array(" "," "," ");
        modele.Partie.morpion[2] = new Array(" "," "," ");

        modele.Partie.JoueurCourant = modele.Partie.nomJoueur;
        // On "propage" le nom du joueur sur toutes les vues
        $('span[data-role="nomJoueurCourant"]').each(function () {
            $(this).html(modele.Partie.JoueurCourant);
        });
    },

    jouer: function (coupJoueur) {
        var lastPersonne = modele.Partie.JoueurCourant;

        // on interroge le modèle pour voir le résultat du nouveau coup
        var resultat = modele.Partie.prototype.nouveauCoup(modele.Partie.JoueurCourant,coupJoueur);
        // le score a changé => on sauvegarde la partie en cours
        //modele.dao.savePartie(controleur.session.partieEnCours);

        // on vérifie si la partie est fini
        if(resultat.includes("Victoire") || resultat.includes("Egalité")){
            controleur.vueJeu.finPartie();
        }
        // sinon on mets à jour les champs contenant le nom du joueurCourant
        else{
            $('span[data-role="nomJoueurCourant"]').each(function () {
                $(this).html(modele.Partie.JoueurCourant);
            });
        }
        if (lastPersonne !== modele.Partie.JoueurCourant) {
            controleur.vueJeu.nouveauCoup(coupJoueur,lastPersonne);
        }
    },

    nouveauCoup: function (coupJoueur,joueur) {
        // controleur.vueJeu.init();

        // on mets à jour l'image du block en fonction du joueur qui joue
        $("#imageblock" + coupJoueur).attr('src', function () {
            var src = ((modele.Partie.nomJoueur === joueur) ?
                modele.Partie.photoJoueur : modele.Partie.photoJoueur2);
            $(this).attr("src", src);
        });
        $("#block"+coupJoueur).prop('disabled', true);
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
        var joueur1 = modele.scoreDAO.getScore(modele.Partie.nomJoueur);
        var joueur2 = modele.scoreDAO.getScore(modele.Partie.nomJoueur2);

        // Premier Joueur
        $("#nompremierjoueur").html(modele.Partie.nomJoueur);
        $("#victoiresjoueur1").html(joueur1.nbVictoiresJoueur);
        $("#nulsjoueur1").html(joueur1.nbNulsJoueur);
        $("#defaitesjoueur1").html(joueur1.nbDefaitesJoueur);
        // Second Joueur
        $("#nomsecondjoueur").html(modele.Partie.nomJoueur2);
        $("#victoiresjoueur2").html(joueur2.nbVictoiresJoueur);
        $("#nulsjoueur2").html(joueur2.nbNulsJoueur);
        $("#defaitesjoueur2").html(joueur2.nbDefaitesJoueur);

        $('span[data-role="resultatJeu"]').each(function () {
            $(this).html(modele.Partie.resultat);
        });
        $('p[data-role="nomJoueur1"]').each(function () {
            $(this).html(modele.Partie.nomJoueur);
        });
        $('p[data-role="nomJoueur2"]').each(function () {
            $(this).html(modele.Partie.nomJoueur2);
        });
        $('img[data-role="photoJoueur1"]').each(function () {
            $(this).attr("src",modele.Partie.photoJoueur);
        });
        $('img[data-role="photoJoueur2"]').each(function () {
            $(this).attr("src",modele.Partie.photoJoueur2);
        });
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
