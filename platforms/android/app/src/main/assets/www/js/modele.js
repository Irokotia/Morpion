/* global modele */

var modele = {};

modele.Partie = function(nomJoueur){
    // attributs
    this.nomJoueur = nomJoueur;
    this.nbVictoires = 0;
    this.nbDefaites = 0;
    this.nbNuls = 0;
    
    
    var json_stringify_joueur = JSON.stringify({
                                                 nbVictoiresJoueur: this.nbVictoiresJoueur,
                                                 nbDefaitesJoueur: this.nbDefaitesJoueur,
                                                 nbNulsJoueur: this.nbNulsJoueur
                                                 });
    window.localStorage.setItem(this.nomJoueur,json_stringify_joueur);
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
        var resultat = "";
        if(modele.Partie.nomJoueur === nomJoueur){
            numCourant = 1;
        }else{
            numCourant = 2;
        }

        // remplir tableaux
        console.log(coupJoueur);
        console.log(modele.Partie.morpion);
        if (coupJoueur <= 2) {
            console.log('passage 0-2');
            modele.Partie.morpion[0][coupJoueur] = numCourant;
        } else if (coupJoueur <= 5) {
            console.log('passage 3-5');
            modele.Partie.morpion[1][coupJoueur % 3] = numCourant;
        } else {
            console.log('passage 6-8');
            modele.Partie.morpion[2][coupJoueur % 3] = numCourant;
        }
        console.log(modele.Partie.morpion[0]);
        console.log(modele.Partie.morpion[1]);
        console.log(modele.Partie.morpion[2]);
        // colonnes
        /*
        * 1 1 1
          1 1 1
          1 1 1
            i = 0
                i[i] = i[i+3] = i[i+6]
                comparaison position0 = position3 = position6 donc première colonne
            i = 1
                i[i] = i[i+3] = i[i+6]
                comparaison position1 = position4 = position7 donc seconde colonne
            i = 2
                i[i] = i[i+3] = i[i+6]
                comparaison position2 = position5 = position8 donc troisième colonne
        * */
        for(var i = 0;i < 3;i++){
            console.log(i);
            console.log(modele.Partie.morpion[i][0]);
            console.log(modele.Partie.morpion[i][i+3]);
            console.log(modele.Partie.morpion[i][i+6]);
            if(modele.Partie.morpion[i][i] === modele.Partie.morpion[i][i+3] === modele.Partie.morpion[i][i+6]){
                victoire = true;
            }
        }
        if(!victoire){
            modele.Partie.JoueurCourant = ( modele.Partie.JoueurCourant === modele.Partie.nomJoueur)?
                modele.Partie.nomJoueur2 : modele.Partie.nomJoueur;
        }else{
            if(modele.Partie.JoueurCourant === modele.Partie.nomJoueur){
                resultat = "Victoire de " + modele.Partie.nomJoueur;
            }else{

            }
        }
        return resultat;
    }
};

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
      
    window.localStorage.setItem(this.id,this.getBase64());
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

    window.localStorage.setItem(this.id,modele.photoJoueur2);
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


