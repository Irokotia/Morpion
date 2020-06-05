var modele = {};

// Le modele contient ici une seule classe : Partie
modele.Partie = function (nomJoueur1) {
    // atributs
    this.nomJoueur1 = nomJoueur1;
    this.nomJoueur2 = nomJoueur2;
}
// Méthodes
modele.Partie.prototype = {
    nouveauCoup: function (nomJoueur,coupJoueur) { // détermine le résulat d'un nouveau coup et sauvegarde le score
        var numCourant = '';
        if(nomJoueur === this.nomJoueur1){
            numCourant = 1;
        }else{
            numCourant = 2;
        }
        for(var i = 1;i <= 9;i++){
            if(i === coupJoueur){
                if(1 <= i <= 3){
                    this.morpion[0][i] = numCourant;
                }else if(4 <= i <= 6){
                    this.morpion[1][i%3] = numCourant;
                }else{
                    this.morpion[2][i%3] = numCourant;
                }
            }
        }
    },
};

////////////////////////////////////////////////////////////////////////////////
// Classe Image
////////////////////////////////////////////////////////////////////////////////
model.Image = function (id, imageData) {
    // Attributs
    this.id = id;
    this.imageData = imageData; // l'image Base64
    //
    // MÃ©thode pour obtenir l'image au format Base64 (dÃ©compressÃ©) avec en-tÃªte MIME
    this.getBase64 = function() {
        return "data:image/jpeg;base64,"+this.imageData;
    },
      
    // MÃ©thode pour insÃ©rer une nouvelle image en BD
    this.insert = function (successCB, errorCB) {
        var self=this; // pour pouvoir accÃ©der Ã  l'objet Image dans le succesCB de la requÃªte insert
        model.db.executeSql("INSERT INTO photos (imagedata) VALUES (?)",[this.imageData],
            function (res) {
                self.id=res.insertId; // on met Ã  jour l'id de l'Image aprÃ¨s insertion en BD
                successCB.call(this);
            },
            function (err) {
                console.log("Erreur Insertion : " + err.message);
                errorCB.call(this);
            }
        );
    };
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
        {quality: 50, destinationType: navigator.camera.DestinationType.DATA_URL}
        // qualitÃ© encodage 50%, format base64 (et JPEG par dÃ©faut)
    );
};

// Objet dao pour gérer la Persistance des parties dans le local storage.
// On stocke des paires (nomJoeur, partie).
modele.dao = {

    savePartie: function(partie) { // sauvegarde la partie au format JSON dans le local storage
        window.localStorage.setItem(partie.nomJoueur, JSON.stringify(partie));
    },

    loadPartie: function(nomJoueur) { // charge la partie d'un joueur, si elle existe, depuis le local storage
        var partie = window.localStorage.getItem(nomJoueur);
        if (partie === null) { // s'il n'y a pas de partie au nom de ce joueur, on en crée une nouvelle
            return new modele.Partie(nomJoueur,0,0,0);
        }
        else { // sinon on convertit la partie au format JSON en objet JS de la classe Partie
            partie = JSON.parse(partie); // convertit la chaine JSON en objet JS
            Object.setPrototypeOf(partie,modele.Partie.prototype); // attache le prototype Partie à l'objet
            return partie;
        }
    }
}
