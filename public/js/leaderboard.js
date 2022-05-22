import ApiFetching from "/static/js/ApiFetching.js";
let db = new ApiFetching();


db.getAllUsers().then(result => {

    function byId(a, b) {
    return parseInt(a.score) - parseInt(b.score);
    }


    var bdd =[];
    var i =1;
    

    result.forEach(item => { 
        bdd.push(item);
    })
    
        

    bdd.sort(byId).forEach(item => {

    if(!item.score) return ;
    let a = document.getElementsByClassName("Tab-cont")[0];
    let b = document.createElement('tr');

    let c = document.createElement('th');
    let d = document.createElement('th');
    let e = document.createElement('th');
    let f = document.createElement('th');

var dateGlobale = new Date(item.score.bestScoreDate);

    
var annee = dateGlobale.getFullYear();
var mois = dateGlobale.getMonth();
var jour = dateGlobale.getDate();
var jour_semaine = dateGlobale.getDay();

var heure = dateGlobale.getHours();
var minute = dateGlobale.getMinutes();
var seconde = dateGlobale.getSeconds();

if( heure < 10 ) { heure = "0" + heure; }
if( minute < 10 ) { minute = "0" + minute; }
if( seconde < 10 ) { seconde = "0" + seconde; }

var MOIS = [ "janvier", "fÃ©vrier", "mars", "avril", "mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre" ];
var JOUR_SEMAINE = ["dimanche" , "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

mois = MOIS[mois];
jour_semaine = JOUR_SEMAINE[jour_semaine];
    c.textContent ="#" + i;
    d.textContent =  item.username;
    e.textContent =item.score.bestScore;
    f.textContent =jour_semaine + " " + jour + " " + mois + " " + annee + " - " + heure + ":" + minute + ":" + seconde;

    b.appendChild(c);
    b.appendChild(d);
    b.appendChild(e);
    b.appendChild(f);
    a.appendChild(b);
    i=i+1;
    })
})
