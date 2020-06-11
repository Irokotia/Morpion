/* global modele */

var modele = {};

modele.Partie = function(nomJoueur) {
    // attributs

    var joueur = window.localStorage.getItem(nomJoueur);

    if(nomJoueur === modele.Partie.nomJoueur){
        photoJoueur = modele.Partie.photoJoueur;
    }else{
        photoJoueur = modele.Partie.photoJoueur2;
    }

    // si pas de joueur on en créer un
    if (joueur === null) {
        var json_stringify_joueur = JSON.stringify({
            nbVictoiresJoueur: 0,
            nbDefaitesJoueur: 0,
            nbNulsJoueur: 0,
            imageJoueur : photoJoueur
        });
        window.localStorage.setItem(nomJoueur, json_stringify_joueur);
    }
};


modele.Partie.morpion = new Array();


modele.Shuffle = function (o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// Méthodes
modele.Partie.prototype = {
    nouveauCoup: function (nomJoueur,coupJoueur) { // détermine le résulat d'un nouveau coup et sauvegarde le score

        var victoire = false;
        var resultat = "test";
        if(modele.Partie.nomJoueur === nomJoueur){
            numCourant = 1;
        }else{
            numCourant = 2;
        }

        // remplir tableaux
        if (coupJoueur <= 2) {
            modele.Partie.morpion[0][coupJoueur] = numCourant;
        } else if (coupJoueur <= 5) {
            modele.Partie.morpion[1][coupJoueur % 3] = numCourant;
        } else {
            modele.Partie.morpion[2][coupJoueur % 3] = numCourant;
        }
        // colonnes
        /*
        * 1 1 1
          1 1 1
          1 1 1
            i = 0
                0[i] === 1[i] === 2[i]
                0[0] === 1[0] === 2[0]
                soit la première colonne
            i = 1
                0[i] === 1[i] === 2[i]
                0[1] === 1[1] === 2[1]
                soit la seconde colonne
            i = 2
                0[i] = 1[i] = 2[i]
                0[2] = 1[2] = 2[2]
                soit la troisième colonne
        * */
        for(var i = 0;i < 3;i++){
            // sachant que le coup est réalisé par le JoueurCourant on effectue la vérification uniquement sur le numCourant
            if((modele.Partie.morpion[0][i] === numCourant) &&
                (modele.Partie.morpion[1][i] === numCourant) &&
                (modele.Partie.morpion[2][i] === numCourant)){
                victoire = true;
            }
        }
        // ligne
        /*
        * 1 1 1
          1 1 1
          1 1 1
            i = 0
                i[0] === i[1] === i[2]
                0[0] === 0[1] === 0[2]
                soit la première ligne
            i = 1
                i[0] === i[1] === i[2]
                1[0] === 1[1] === 1[2]
                soit la seconde ligne
            i = 2
                i[0] === i[1] === i[2]
                2[0] === 2[1] === 2[2]
                soit la troisième ligne
        * */
        for(var i = 0;i < 3;i++){
            // sachant que le coup est réalisé par le JoueurCourant on effectue la vérification uniquement sur le numCourant
            if((modele.Partie.morpion[i][0] === numCourant) &&
                (modele.Partie.morpion[i][1] === numCourant) &&
                (modele.Partie.morpion[i][2] === numCourant)){
                victoire = true;
            }
        }
        /*
        * 1 1 1
          1 1 1
          1 1 1
            i = 0
                i[0] === i[1] === i[2]
                0[0] === 1[1] === 2[2]
                soit la première diago
            i = 1
                i[0] === i[1] === i[2]
                0[2] === 1[1] === 2[0]
                soit la seconde diago
        * */
        if ((modele.Partie.morpion[0][0] === numCourant) &&
            (modele.Partie.morpion[1][1] === numCourant) &&
            (modele.Partie.morpion[2][2] === numCourant)) {
            victoire = true;
        }
        if ((modele.Partie.morpion[0][2] === numCourant) &&
            (modele.Partie.morpion[1][1] === numCourant) &&
            (modele.Partie.morpion[2][0] === numCourant)) {
            victoire = true;
        }
        if(!victoire){
            if (modele.Partie.morpion[0].every((current) => current !== " ") &&
                modele.Partie.morpion[1].every((current) => current !== " ") &&
                modele.Partie.morpion[2].every((current) => current !== " ")) {
                modele.scoreDAO.setScore(modele.Partie.nomJoueur, 0, 0, 1);
                modele.scoreDAO.setScore(modele.Partie.nomJoueur2, 0, 0, 1);
                resultat = "Egalité";
            }else {
                modele.Partie.JoueurCourant = (modele.Partie.JoueurCourant === modele.Partie.nomJoueur) ?
                    modele.Partie.nomJoueur2 : modele.Partie.nomJoueur;
                resultat = "Partie non fini !";
            }
        }else{
            if(modele.Partie.JoueurCourant === modele.Partie.nomJoueur){
                resultat = "Victoire de " + modele.Partie.nomJoueur;
                modele.scoreDAO.setScore(modele.Partie.nomJoueur, 1, 0, 0);
                modele.scoreDAO.setScore(modele.Partie.nomJoueur2, 0, 1, 0);
            }else{
                resultat = "Victoire de " + modele.Partie.nomJoueur2;
                modele.scoreDAO.setScore(modele.Partie.nomJoueur, 0, 1, 0);
                modele.scoreDAO.setScore(modele.Partie.nomJoueur2, 1, 0, 0);
            }
        }
        return resultat;
    }
};
modele.scoreDAO = {
    setScore : function (nomJoueur, victoire, defaite,nuls) {

        var json_joueur = modele.scoreDAO.getScore(nomJoueur);
        nbVictoires = parseInt(json_joueur.nbVictoiresJoueur) + victoire;
        nbDefaites = parseInt(json_joueur.nbDefaitesJoueur) + defaite;
        nbNuls =  parseInt(json_joueur.nbNulsJoueur) + nuls;

        var json_stringify_joueur = JSON.stringify({
            nbVictoiresJoueur: nbVictoires,
            nbDefaitesJoueur: nbDefaites,
            nbNulsJoueur: nbNuls,
            imageJoueur: json_joueur.photoJoueur
        });
        window.localStorage.setItem(nomJoueur,json_stringify_joueur);
        var joueur = localStorage.getItem(nomJoueur);
        console.log(" joueur après :" + joueur);
    },
    getScore: function (nomJoueur) {
        var joueur = localStorage.getItem(nomJoueur);
        var json_joueur = JSON.parse(joueur);

        return json_joueur;
    }
}






////////////////////////////////////////////////////////////////////////////////
// Classe Image
////////////////////////////////////////////////////////////////////////////////
modele.Image = function (nomJoueur, imageData) {
    // Attributs
    this.id = 'image'+nomJoueur;
    modele.photoJoueur = imageData; // l'image Base64
    //
    // MÃ©thode pour obtenir l'image au format Base64 (dÃ©compressÃ©) avec en-tÃªte MIME
    this.getBase64 = function() {
        return "data:image/jpeg;base64,"+ modele.photoJoueur;
    },
      
    window.localStorage.setItem("image"+modele.Partie.nomJoueur,modele.photoJoueur);
};
modele.Image2 = function (nomJoueur, imageData) {
    // Attributs
    this.id = 'image'+nomJoueur;
    modele.photoJoueur2 = imageData; // l'image Base64
    //
    // MÃ©thode pour obtenir l'image au format Base64 (dÃ©compressÃ©) avec en-tÃªte MIME
    this.getBase64 = function() {
        return "data:image/jpeg;base64,"+ modele.photoJoueur2;
    },

    window.localStorage.setItem("image"+modele.Partie.nomJoueur2,modele.photoJoueur2);
};

////////////////////////////////////////////////////////////////////////////////
// MÃ©thode pour capturer une image avec le tÃ©lÃ©phone encodÃ©e en Base64
////////////////////////////////////////////////////////////////////////////////
modele.takePicture = function (successCB, errorCB) {
    navigator.camera.getPicture(
        function (imageData) {
            // imageData contient l'image capturÃ©e au format Base64, sans en-tÃªte MIME
            // On appelle successCB en lui transmettant une entitÃ© Image
            successCB.call(this, new modele.Image(0,imageData));
            
            
            
        },
        function (err) {
            console.log("Erreur Capture image : " + err.message);
            errorCB.call(this);
        },
        {uality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            cameraDirection: navigator.camera.Direction.FRONT}
        // qualitÃ© encodage 50%, format base64 (et JPEG par dÃ©faut)
    );
};
modele.takePicture2 = function (successCB, errorCB) {
    navigator.camera.getPicture(
        function (imageData) {
            // imageData contient l'image capturÃ©e au format Base64, sans en-tÃªte MIME
            // On appelle successCB en lui transmettant une entitÃ© Image
            successCB.call(this, new modele.Image2(0,imageData));



        },
        function (err) {
            console.log("Erreur Capture image : " + err.message);
            errorCB.call(this);
        },
        {quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            encodingType: navigator.camera.EncodingType.JPEG,
            mediaType: navigator.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            cameraDirection: navigator.camera.Direction.FRONT}
        // qualitÃ© encodage 50%, format base64 (et JPEG par dÃ©faut)
    );
};
// Objet dao pour gérer la Persistance des parties dans le local storage.
modele.dao = {

    savePartie: function(partie) { // sauvegarde la partie au format JSON dans le local storage
        window.localStorage.setItem(partie.nomJoueur, JSON.stringify(partie));
    },

    loadPartie: function(nomJoueur) { // charge la partie d'un joueur, si elle existe, depuis le local storage
        var partie = window.localStorage.getItem(nomJoueur);
        if (partie === null) { // s'il n'y a pas de partie au nom de ce joueur, on en crée une nouvelle
            return new modele.Partie(nomJoueur);
        }
        else { // sinon on convertit la partie au format JSON en objet JS de la classe Partie
            partie = JSON.parse(partie); // convertit la chaine JSON en objet JS
            Object.setPrototypeOf(partie,modele.Partie.prototype); // attache le prototype Partie à l'objet
            return partie;
        }
    }
};


