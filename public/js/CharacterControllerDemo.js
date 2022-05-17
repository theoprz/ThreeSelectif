import ApiFetching from "/static/js/ApiFetching.js"
import BasicCharacterController from "/static/js/BasicCharacterController.js"
import ThirdPersonCamera from "/static/js/ThirdPersonCamera.js"
import {OBJLoader} from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/OBJLoader.js";


let colliders = [];
//Positions possibles pour les objets

//Bouteille de verre
let pos1Trash1 = {x: -187, y: 0, z: 520};
let pos2Trash1 = {x: 206, y: 0, z: 744};
let pos3Trash1 = {x: 956, y: 3, z: 494};
let pos4Trash1 = {x: 420, y: 0, z: -621};
let pos5Trash1 = {x: 103, y: 0, z: -1030};
let pos6Trash1 = {x: -207, y: 0, z: -445};
let valuesTrash1 = [pos1Trash1, pos2Trash1, pos3Trash1, pos4Trash1, pos5Trash1, pos6Trash1];

//Canettes
let pos1Trash2 = {x: 623, y: 0, z: 80};
let pos2Trash2 = {x: 292, y: 0, z: 99};
let pos3Trash2 = {x: 201, y: 0, z: 213};
let pos4Trash2 = {x: 407, y: -2, z: -160};
let pos5Trash2 = {x: -107, y: -2, z: 376};
let pos6Trash2 = {x: -194, y: 0, z: -743};
let valuesTrash2 = [pos1Trash2, pos2Trash2, pos3Trash2, pos4Trash2, pos5Trash2, pos6Trash2];

//Déchets alimentaires
let pos1Trash3 = {x: 902, y: -1, z: 230};
let pos2Trash3 = {x: 457, y: -1, z: 476};
let pos3Trash3 = {x: 194, y: -1, z: 264};
let pos4Trash3 = {x: 416, y: -1, z: 37};
let pos5Trash3 = {x: 1018, y: -1, z: 38};
let pos6Trash3 = {x: -186, y: -1, z: -790};
let valuesTrash3 = [pos1Trash3, pos2Trash3, pos3Trash3, pos4Trash3, pos5Trash3, pos6Trash3];

//Cartons
let pos1Trash4 = {x: 945, y: 7, z: -430};
let pos2Trash4 = {x: 22, y: 4, z: 800};
let pos3Trash4 = {x: 890, y: 12, z: -1030};
let pos4Trash4 = {x: 432, y: 1, z: -1150};
let pos5Trash4 = {x: -190, y: 2, z: -890};
let pos6Trash4 = {x: 960, y: 6, z: 121};
let valuesTrash4 = [pos1Trash4, pos2Trash4, pos3Trash4, pos4Trash4, pos5Trash4, pos6Trash4];


//Plastiques
let pos1Trash5 = {x: 983, y: 0, z: -1061};
let pos2Trash5 = {x: 364, y: 0, z: -237};
let pos3Trash5 = {x: -267, y: 0, z: 702};
let pos4Trash5 = {x: 74, y: 0, z: 449};
let pos5Trash5 = {x: 562, y: 0, z: 312};
let pos6Trash5 = {x: 234, y: 0, z: -438};
let valuesTrash5 = [pos1Trash5, pos2Trash5, pos3Trash5, pos4Trash5, pos5Trash5, pos6Trash5];


//Mégots de cigarettes
let pos1Trash6 = {x: 913, y: 1, z: -183};
let pos2Trash6 = {x: 766, y: 1, z: 771};
let pos3Trash6 = {x: 177, y: 1, z: 564};
let pos4Trash6 = {x: -209, y: 1, z: 97};
let pos5Trash6 = {x: 519, y: 1, z: -211};
let pos6Trash6 = {x: 15, y: 1, z: -946};
let valuesTrash6 = [pos1Trash6, pos2Trash6, pos3Trash6, pos4Trash6, pos5Trash6, pos6Trash6];

let pospoubelleRed = { x: 450, y: -5, z: -100 };
let pospoubelleBlue = { x: 300, y: -5, z: -100 };
let pospoubelleYellow = { x: 400, y: -5, z: -100 };

class CharacterControllerDemo {
    constructor() {
        this._Initialize();
    }

    async _Initialize() {

        function onTransitionEnd(event) {
            event.target.remove();
        }

        this.player;
        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
        });
        this._threejs.outputEncoding = THREE.sRGBEncoding;
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);

        window.addEventListener('resize', () => {
            this._OnWindowResize();
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(25, 10, 25);

        this._scene = new THREE.Scene();

        this.db = new ApiFetching();

        this.user = await this.db.getUser(username);
        console.log(this.user)

        this.manager = new THREE.LoadingManager(() => {
            const loadingScreen = document.getElementById('loading-screen');

            // optional: remove loader from DOM via event listener
            loadingScreen.addEventListener('transitionend', onTransitionEnd);
        });
        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {

            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onLoad = async function () {
            const loadingScreen = document.getElementById('loading-screen');
            await loadingScreen.classList.add('fade-out');
            setInterval(function () {
                loadingScreen.remove()
            }, 3000);
            console.log('Loading complete!');

        };


        this.manager.onProgress = function (url, itemsLoaded, itemsTotal) {

            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onError = function (url) {

            console.log('There was an error loading ' + url);

        };

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-100, 100, 100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 50;
        light.shadow.camera.right = -50;
        light.shadow.camera.top = 50;
        light.shadow.camera.bottom = -50;
        this._scene.add(light);

        light = new THREE.AmbientLight(0xFFFFFF, 0.25);
        this._scene.add(light);

        //Texture du background


        const loader = new THREE.CubeTextureLoader(this.manager);
        const texture = loader.load([
            '/static/assets/game/posx.jpg',
            '/static/assets/game/negx.jpg',
            '/static/assets/game/posy.jpg',
            '/static/assets/game/negy.jpg',
            '/static/assets/game/posz.jpg',
            '/static/assets/game/negz.jpg',
        ]);
        texture.encoding = THREE.sRGBEncoding;
        this._scene.background = texture;


        this._LoadMap();


        // -----------------------------------------------------
        //Raycaster
        this.objects = [];
        this.raycast = new THREE.Raycaster();
        this.clickMouse = new THREE.Vector2();

        const clickedObject = null;

        //Ordinateur pour le questionnaire
        this.addObject("questionnaire");

        this.clickOnObject();

        this._mixers = [];
        this._previousRAF = null;

        this._LoadAnimatedModel();
        this._RAF();

        //Ajouts des différents déchets
        //bouteille
        this.addObject("trash1");
        this.addObject("trash1");
        this.addObject("trash1");
        //Canette
        this.addObject("trash2");
        this.addObject("trash2");
        this.addObject("trash2");
        //Aliment
        this.addObject("trash3");
        this.addObject("trash3");
        this.addObject("trash3");

        //carton
        this.addObject("trash4");
        this.addObject("trash4");
        this.addObject("trash4");
        //Plastique
        this.addObject("trash5");
        this.addObject("trash5");
        this.addObject("trash5");

        //Cigarette
        this.addObject("trash6");
        this.addObject("trash6");
        this.addObject("trash6");

        //poubelleRouge
        this.addObject("poubelleRed");

        //poubelleBleue
        this.addObject("poubelleBlue");

        //poubelleJaune
        this.addObject("poubelleYellow");


        this._mixers = [];
        this._previousRAF = null;

        this._LoadAnimatedModel();

        this.clickOnObject();
        this._RAF();


    }

    timer() { //Cooldown pour le chapitre 2
        const departMinutes = 3;
        let temps = departMinutes * 60;

        const timerElement = document.getElementById("timer");

        setInterval(() => {
            let minutes = parseInt(temps / 60, 10);
            let secondes = parseInt(temps % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            secondes = secondes < 10 ? "0" + secondes : secondes;
            timerElement.innerText = `${minutes}:${secondes}`;
            timerElement.classList.add('timer');
            if (temps == 0) {
                return timerElement.remove()


            } else if (temps < 30) {
                timerElement.classList.remove('timer');
                timerElement.classList.add('timer2');
            }
            temps = temps <= 0 ? 0 : temps - 1;
        }, 1000);
    }

    randomPosTrash(array) {
        let index = Math.floor(Math.random() * array.length);
        let valueToUse = array[index];
        array.splice(index, 1);
        return valueToUse
    }


    addObject(type) {

        switch (type) {
            case "questionnaire": {
                const game = this;
                let loaderComputer = new THREE.FBXLoader(this.manager);
                loaderComputer.load("/static/assets/game/objects/quest-computer.fbx", function (object) {
                    const computer = object.children[0];
                    computer.scale.multiplyScalar(0.005)
                    computer.position.set(500, -2, -100);
                    computer.userData.name = 'BoiteQuestionnaire';
                    computer.userData.draggable = true;
                    object.traverse(function (child) {
                        if (child.isMesh) {
                            if (child.name.startsWith("proxy")) {
                                colliders.push(child);
                                child.material.visible = false;
                            } else {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        }
                    });
                    break;
                }
            case "trash1":
                {
                    let tempPos1 = this.randomPosTrash(valuesTrash1);
                    const game = this;
                    let loaderTrash1 = new THREE.FBXLoader(this.manager);
                    loaderTrash1.load("/static/assets/game/objects/trash-bouteille.fbx", function (object) {
                        const bouteille = object.children[0];
                        let pos1 = { x: tempPos1.x, y: tempPos1.y, z: tempPos1.z }
                        bouteille.scale.multiplyScalar(0.02)
                        bouteille.position.set(pos1.x, pos1.y, pos1.z);
                        bouteille.userData.name = 'Dechet1';
                        bouteille.userData.draggable = true;
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        }
                    });
                    break;
                }
            case "trash2":
                {
                    let tempPos2 = this.randomPosTrash(valuesTrash2);
                    const game = this;
                    let loaderTrash2 = new THREE.FBXLoader(this.manager);
                    loaderTrash2.load("/static/assets/game/objects/trash-canette.fbx", function (object) {
                        const canette = object.children[0];
                        let pos2 = { x: tempPos2.x, y: tempPos2.y, z: tempPos2.z }
                        canette.scale.multiplyScalar(0.02)
                        canette.position.set(pos2.x, pos2.y, pos2.z);
                        canette.userData.name = 'Dechet2';
                        canette.userData.draggable = true;
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        }
                    });
                    break;
                }
            case "trash3":
                {
                    let tempPos3 = this.randomPosTrash(valuesTrash3);
                    const game = this;
                    let loaderTrash3 = new THREE.FBXLoader(this.manager);
                    loaderTrash3.load("/static/assets/game/objects/trash-aliment.fbx", function (object) {
                        const aliment = object.children[0];
                        let pos3 = { x: tempPos3.x, y: tempPos3.y, z: tempPos3.z }
                        aliment.scale.multiplyScalar(0.1)
                        aliment.position.set(pos3.x, pos3.y, pos3.z);
                        aliment.userData.name = 'Dechet3';
                        aliment.userData.draggable = true;
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        }
                    });
                    game._scene.add(aliment);
                });
                break;
            }
            case "trash4": {


                    let tempPos = this.randomPosTrash(valuesTrash4);
                    const game = this;
                    let loaderTrash4 = new THREE.FBXLoader(this.manager);
                    loaderTrash4.load("/static/assets/game/objects/trash-carton.fbx", function (object) {
                        const carton = object.children[0];
                        let pos = { x: tempPos.x, y: tempPos.y, z: tempPos.z }
                        carton.scale.multiplyScalar(5)
                        carton.position.set(pos.x, pos.y, pos.z);
                        carton.userData.name = 'Dechet4';
                        carton.userData.draggable = true;
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        }
                    });
                    break;
                }
            case "trash5":
                {
                    let tempPos5 = this.randomPosTrash(valuesTrash5);
                    const game = this;
                    let loaderTrash5 = new THREE.FBXLoader(this.manager);
                    loaderTrash5.load("/static/assets/game/objects/trash-plastique.fbx", function (object) {
                        const plastique = object.children[0];
                        let pos5 = { x: tempPos5.x, y: tempPos5.y, z: tempPos5.z }
                        plastique.scale.multiplyScalar(0.5)
                        plastique.position.set(pos5.x, pos5.y, pos5.z);
                        plastique.userData.name = 'Dechet5';
                        plastique.userData.draggable = true;
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        }
                    });
                    break;
                }
            case "trash6":
                {
                    let tempPos6 = this.randomPosTrash(valuesTrash6);
                    const game = this;
                    let loaderTrash6 = new THREE.FBXLoader(this.manager);
                    loaderTrash6.load("/static/assets/game/objects/trash-cigarette.fbx", function (object) {
                        const cigarette = object.children[0];
                        let pos6 = { x: tempPos6.x, y: tempPos6.y, z: tempPos6.z }
                        cigarette.scale.multiplyScalar(1)  //configuration de sa taille
                        cigarette.position.set(pos6.x, pos6.y, pos6.z); //configuration de sa position
                        cigarette.userData.name = 'Dechet6'; //configuration du nom du déchet
                        cigarette.userData.draggable = true;  //Rendre le déchet cliquable
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        }
                    });
                    break;
                }
            case "poubelleRed":
                {
                    const game = this;
                    let loaderpoubelleRed = new THREE.FBXLoader(this.manager);
                    loaderpoubelleRed.load("/static/assets/game/objects/poubelleRed.fbx", function (object) {
                        const poubelleRed = object.children[0];
                        poubelleRed.scale.multiplyScalar(0.04)
                        poubelleRed.position.set(pospoubelleRed.x, pospoubelleRed.y, pospoubelleRed.z);
                        poubelleRed.userData.name = 'PoubelleRed';
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        });
                        game._scene.add(poubelleRed);
                    });
                    break;
                }

            case "poubelleBlue":
                {
                    const game = this;
                    let loaderpoubelleBlue = new THREE.FBXLoader(this.manager);
                    loaderpoubelleBlue.load("/static/assets/game/objects/poubelleBlue.fbx", function (object) {
                        const poubelleBlue = object.children[0];
                        poubelleBlue.scale.multiplyScalar(0.04)
                        poubelleBlue.position.set(pospoubelleBlue.x, pospoubelleBlue.y, pospoubelleBlue.z);
                        poubelleBlue.userData.name = 'poubelleBlue';
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        });
                        game._scene.add(poubelleBlue);
                    });
                    break;

                }
            case "poubelleYellow":
                {
                    const game = this;
                    let loaderpoubelleYellow = new THREE.FBXLoader(this.manager);
                    loaderpoubelleYellow.load("/static/assets/game/objects/poubelleYellow.fbx", function (object) {
                        const poubelleYellow = object.children[0];
                        poubelleYellow.scale.multiplyScalar(0.04)
                        poubelleYellow.position.set(pospoubelleYellow.x, pospoubelleYellow.y, pospoubelleYellow.z);
                        poubelleYellow.userData.name = 'poubelleYellow';
                        object.traverse(function (child) {
                            if (child.isMesh) {
                                if (child.name.startsWith("proxy")) {
                                    colliders.push(child);
                                    child.material.visible = false;
                                } else {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            }
                        });
                        game._scene.add(poubelleYellow);
                    });
                    break;

                }

        }
    }

    question(questionNumber) {

        var theRandomNumber = this.pasDeRepetitionQuestion();

        this.db.getQuestion(questionNumber).then(data => {
            (async () => {

                const inputOptions = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            '1': data.choix1,
                            '2': data.choix2,
                            '3': data.choix3
                        })
                    }, 1000)
                });

                const {value: color} = await Swal.fire({
                    icon: 'question',
                    title: await data.questions,
                    input: 'radio',
                    inputOptions: inputOptions,
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Vous devez mettre une réponse !'
                        }
                    }
                });

                if (color === data.solution) {

                    Swal.fire({
                        icon: 'success',
                        html: data.good,
                        confirmButtonText: 'Suivant',

                    }).then((result) => {
                        if (this.iterations == 9) {

                            if (this.iterationsWin >= 6) {

                                Swal.fire({
                                    icon: 'success',
                                    title: 'CHAPITRE 1 TERMINÉ',
                                    html: `Bravo tu as répondu correctement à :  ${this.iterationsWin} questions`,
                                    confirmButtonText: 'Chapitre suivant',
                                }).then((result) => {
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'CHAPITRE 2',
                                        html: 'Dans ce chapitre vous aller devoir rammasé le plus de déchets possible en 5 min',
                                        confirmButtonText: 'Start',
                                    }).then((result) => {
                                        this.timer();
                                    })

                                    return;
                                })
                                return;

                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'PERDU',
                                    showDenyButton: true,
                                    showConfirmButton: true,
                                    html: `Dommage tu as répondu juste que à : ${this.iterationsWin} questions , il te faut un  minimum de 5 réponse juste`,
                                    confirmButtonText: 'Relancer',
                                    denyButtonText: 'Menu principal',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.startquestion();
                                        // A revoir
                                    } else if (result.isDenied) {
                                        // A faire
                                    }
                                })
                                return;
                            }
                        }
                        this.iterationsWin += 1;
                        this.iterations += 1;

                        this.tab.push(theRandomNumber);
                        this.question(theRandomNumber);
                    })

                } else if (color !== data.solution) {
                    Swal.fire({
                        icon: 'error',
                        html: data.bad,
                        confirmButtonText: 'Suivant'
                    }).then((result) => {
                        if (this.iterations == 9) {

                            if (this.iterationsWin >= 6) {

                                Swal.fire({
                                    icon: 'success',
                                    title: 'CHAPITRE 1 TERMINÉ',
                                    html: `Bravo tu as répondu correctement à :  ${this.iterationsWin} questions`,
                                    confirmButtonText: 'Chapitre suivant',
                                }).then((result) => {
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'CHAPITRE 2',
                                        html: 'Dans ce chapitre vous aller devoir rammasé le plus de déchets possible en 5 min',
                                        confirmButtonText: 'Start',
                                    })
                                    return;
                                })
                                return;

                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'PERDU',
                                    showDenyButton: true,
                                    showConfirmButton: true,
                                    html: `Dommage tu as répondu juste que à : ${this.iterationsWin} questions , il te faut un  minimum de 5 réponse juste`,
                                    confirmButtonText: 'Relancer',
                                    denyButtonText: 'Menu principal',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.startquestion();
                                        // A revoir
                                    } else if (result.isDenied) {
                                        // A faire
                                    }
                                })
                                return;
                            }
                        }

                        this.iterations += 1;
                        this.tab.push(theRandomNumber);
                        this.question(theRandomNumber)
                    });
                } else {
                }
            })()
        });
    }

    pasDeRepetitionQuestion() {
        var theRandomNumber = Math.floor(Math.random() * 20) + 1;
        if (this.tab.includes(theRandomNumber)) {
            while ((this.tab.includes(theRandomNumber))) {
                theRandomNumber = Math.floor(Math.random() * 20) + 1;
            }
            if (!(this.tab.includes(theRandomNumber))) {
                return theRandomNumber;
            }

        } else {
            return theRandomNumber;
        }
    }

    startquestion() {
        var theRandomNumber = Math.floor(Math.random() * 20) + 1;
        this.tab.push(theRandomNumber);
        this.question(theRandomNumber);
    }

    clickOnObject() {
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        let count5 = 0;
        let count6 = 0;
        let sommecount = 0;
        let rep = false //variable pour empêcher le repeat pour le keyDown de l'inventaire
        let trashTrie = 0;
        let trashMalTrie = 0;

        //création de l'image pour l'afficher dans l'inventaire

        //Bouteille en Ver
        let img1 = document.createElement("img");
        img1.src = "/static/assets/game/trash-glass-bottle.png";
        img1.setAttribute("position", "absolute")
        img1.setAttribute("id", "imgId1")
        let imgRemove1 = document.getElementById("imgId1")


        //Canette
        let img2 = document.createElement("img");
        img2.src = "/static/assets/game/trash-canette.png";
        img2.setAttribute("position", "absolute")
        img2.setAttribute("style", "margin-top: 15px")
        img2.setAttribute("id", "imgId2")
        let imgRemove2 = document.getElementById("imgId2")



        //Déchets Alimentaire
        let img3 = document.createElement("img");
        img3.src = "/static/assets/game/trash-aliments.png";
        img3.setAttribute("position", "absolute")
        img3.setAttribute("style", "margin-top: 17px")
        img3.setAttribute("id", "imgId3")
        let imgRemove3 = document.getElementById("imgId3")

        //Carton
        let img4 = document.createElement("img");
        img4.src = "/static/assets/game/trash-carton.png";
        img4.setAttribute("position", "absolute")
        img4.setAttribute("style", "margin-top: 17px")
        img4.setAttribute("id", "imgId4")
        let imgRemove4 = document.getElementById("imgId4")


        //plastique
        let img5 = document.createElement("img");
        img5.src = "/static/assets/game/trash-plastique.png";
        img5.setAttribute("position", "absolute");
        img5.setAttribute("id", "imgId5")
        let imgRemove5 = document.getElementById("imgId5")

        //Mégot
        let img6 = document.createElement("img");
        img6.src = "/static/assets/game/trash-megot.png";
        img6.setAttribute("position", "absolute");
        img6.setAttribute("style", "margin-top: 12px")
        img6.setAttribute("id", "imgId6")
        let imgRemove6 = document.getElementById("imgId6")

        //première case de l'inventaire
        let div1 = document.getElementById("texteSlot1");

        //Deuxième case de l'inventaire
        let div2 = document.getElementById("texteSlot2");

        //Troisième case de l'inventaire
        let div3 = document.getElementById("texteSlot3");

        //Quatrième case de l'inventaire
        let div4 = document.getElementById("texteSlot4")

        //Cinqième case de l'inventaire
        let div5 = document.getElementById("texteSlot5")

        //Sixième case de l'inventaire
        let div6 = document.getElementById("texteSlot6")

        window.addEventListener('click', event => {
            this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            //console.log(this.player)
            //Pour afficher les enfants de la scène (objets/light, etc...)
            //console.log(this._scene.children)



            const found = this.intersect(this.clickMouse);
            if (found.length > 0) {
                this.clickedObject = found[0].object;
                console.log(username);

                //distance entre l'objet et le personnage

                let distx = Math.abs(this.clickedObject.position.x - this.player.x);
                let disty = Math.abs(this.clickedObject.position.y - this.player.y);
                let distz = Math.abs(this.clickedObject.position.z - this.player.z);

                if (found[0].object.userData.draggable && distx < 30 && disty < 30 && distz < 30) { //Si l'objet et cliquable et que la distance est < 30 alors:

                    // Quand on appuie sur l'objet de l'étape 1 question
                    if (this.clickedObject.userData.name === "BoiteQuestionnaire" && this.user[0].chapter === 0) {
                        this.iterations = 0;
                        this.iterationsWin = 1;
                        this.tab = [];
                        this.startquestion();
                        this.clickedObject.userData.draggable = false;
                    }
                    //Pour connaitre l'objet qu'on appuie
                    //console.log(`Clicked on ${this.clickedObject.userData.name}`);

                    //Pour l'inventaire:

                    //Premier Objet
                    if(this.user[0].chapter !== 1) console.log("testttt");
                    if (div1.childElementCount === 0 & this.clickedObject.userData.name === "Dechet1" & sommecount <= 5) {
                        div1.appendChild(img1);
                        count1 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        document.getElementById("countSlot1").setAttribute("style", "opacity: 1")

                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {bouteillesverre: count1}});
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet1" & sommecount <= 5) {
                        count1 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {bouteillesverre: count1}});
                    }

                    //Deuxième Objet
                    if (div2.childElementCount == 0 & this.clickedObject.userData.name == "Dechet2" & sommecount <= 5) {
                        div2.appendChild(img2);
                        count2 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot2").innerHTML = count2;
                        document.getElementById("countSlot2").setAttribute("style", "opacity: 1")

                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {cannettes: count2}});
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet2" & sommecount <= 5) {
                        count2 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot2").innerHTML = count2;
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {cannettes: count2}});
                    }

                    //Troisème Objet
                    if (div3.childElementCount == 0 & this.clickedObject.userData.name == "Dechet3" & sommecount <= 5) {
                        div3.appendChild(img3);
                        count3 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        document.getElementById("countSlot3").setAttribute("style", "opacity: 1")

                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {aliments: count3}});
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet3" & sommecount <= 5) {
                        count3 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {aliments: count3}});
                    }

                    //Quatrièmee Objet
                    if (div4.childElementCount == 0 & this.clickedObject.userData.name == "Dechet4" & sommecount <= 5) {
                        div4.appendChild(img4);
                        count4 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        document.getElementById("countSlot4").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {carton: count4}});
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet4" & sommecount <= 5) {
                        this._scene.remove(found[0].object);
                        count4 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {carton: count4}});
                    }

                    //Cinqièmee Objet
                    if (div5.childElementCount == 0 & this.clickedObject.userData.name == "Dechet5" & sommecount <= 5) {
                        div5.appendChild(img5);
                        count5 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        document.getElementById("countSlot5").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {plastiques: count5}});
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet5" & sommecount <= 5) {
                        count5 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {plastiques: count5}});
                    }

                    //Sixièmee Objet
                    if (div6.childElementCount == 0 & this.clickedObject.userData.name == "Dechet6" & sommecount <= 5) {
                        div6.appendChild(img6);
                        count6 += 1;
                        sommecount += 1;
                        document.getElementById("countSlot6").innerHTML = count6;
                        document.getElementById("countSlot6").setAttribute("style", "opacity: 1")

                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {cigarettes: count1}});
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet6" & sommecount <= 5) {
                        count6 += 1;
                        sommecount += 1;

                        document.getElementById("countSlot6").innerHTML = count6;
                        this._scene.remove(found[0].object);
                        this.db.updateInventory(username, {inventory: {cigarettes: count1}});
                    }
                }
            }
        })
        //Enlever des objets de l'inventaire grâce aux touches (1 2 3 4 5 6) du clavier
        let posPlayer = this.player
        document.addEventListener('keydown', (e) => KeyDown(e), false);
        document.addEventListener('keyup', (e) => KeyUp(e), false);

        function KeyDown(event) {
            switch (event.keyCode) {
                case 49: // 1
                    //Poubelle Rouge
                    let distBoutRx = Math.abs(pospoubelleRed.x - posPlayer.x);
                    let distBoutRy = Math.abs(pospoubelleRed.y - posPlayer.y);
                    let distBoutRz = Math.abs(pospoubelleRed.z - posPlayer.z);
                    //Poubelle Bleue
                    let distBoutBx = Math.abs(pospoubelleBlue.x - posPlayer.x);
                    let distBoutBy = Math.abs(pospoubelleBlue.y - posPlayer.y);
                    let distBoutBz = Math.abs(pospoubelleBlue.z - posPlayer.z);
                    //Poubelle jaune
                    let distBoutYx = Math.abs(pospoubelleYellow.x - posPlayer.x);
                    let distBoutYy = Math.abs(pospoubelleYellow.y - posPlayer.y);
                    let distBoutYz = Math.abs(pospoubelleYellow.z - posPlayer.z);
                    if (count1 > 0 && rep == false && distBoutRx < 30 && distBoutRy < 30 && distBoutRz < 30) {
                        rep = true;
                        count1 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        if (count1 == 0) {
                            div1.removeChild(div1.children[0])
                            document.getElementById("countSlot1").setAttribute("style", "opacity: 0")
                        }
                    }
                    if (count1 > 0 && rep == false && distBoutBx < 30 && distBoutBy < 30 && distBoutBz < 30) {
                        rep = true;
                        count1 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        if (count1 == 0) {
                            div1.removeChild(div1.children[0])
                            document.getElementById("countSlot1").setAttribute("style", "opacity: 0")
                        }
                    }
                    if (count1 > 0 && rep == false && distBoutYx < 30 && distBoutYy < 30 && distBoutYz < 30) {
                        rep = true;
                        count1 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        if (count1 == 0) {
                            div1.removeChild(div1.children[0])
                            document.getElementById("countSlot1").setAttribute("style", "opacity: 0")
                        }
                    }


                    break;
                case 50: // 2
                    //Poubelle Rouge
                    let distCanRx = Math.abs(pospoubelleRed.x - posPlayer.x);
                    let distCanRy = Math.abs(pospoubelleRed.y - posPlayer.y);
                    let distCanRz = Math.abs(pospoubelleRed.z - posPlayer.z);
                    //Poubelle Bleue
                    let distCanBx = Math.abs(pospoubelleBlue.x - posPlayer.x);
                    let distCanBy = Math.abs(pospoubelleBlue.y - posPlayer.y);
                    let distCanBz = Math.abs(pospoubelleBlue.z - posPlayer.z);
                    //Poubelle jaune
                    let distCanYx = Math.abs(pospoubelleYellow.x - posPlayer.x);
                    let distCanYy = Math.abs(pospoubelleYellow.y - posPlayer.y);
                    let distCanYz = Math.abs(pospoubelleYellow.z - posPlayer.z);

                    if (count2 > 0 && rep == false && distCanRx < 30 && distCanRy < 30 && distCanRz < 30) {
                        rep = true;
                        count2 -= 1; //on soustrait un au compteur de cannettes
                        sommecount -= 1;
                        //trashMalTrie += 1;
                        //On soustrait un à la somme des compteurs
                        document.getElementById("countSlot2").innerHTML = count2;
                        if (count2 == 0) {
                            div2.removeChild(div2.children[0])
                            document.getElementById("countSlot2").setAttribute("style", "opacity: 0");
                        }

                    }

                    if (count2 > 0 && rep == false && distCanBx < 30 && distCanBy < 30 && distCanBz < 30) {
                        rep = true;
                        count2 -= 1; //on soustrait un au compteur de cannettes
                        sommecount -= 1;
                        //trashMalTrie += 1;
                        document.getElementById("countSlot2").innerHTML = count2;
                        if (count2 == 0) {
                            div2.removeChild(div2.children[0])
                            document.getElementById("countSlot2").setAttribute("style", "opacity: 0");
                        }
                    }
                    if (count2 > 0 && rep == false && distCanYx < 30 && distCanYy < 30 && distCanYz < 30) {
                        rep = true;
                        count2 -= 1; //on soustrait un au compteur de cannettes
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot2").innerHTML = count2;
                        if (count2 == 0) {
                            div2.removeChild(div2.children[0])
                            document.getElementById("countSlot2").setAttribute("style", "opacity: 0");
                        }
                    }
                    break;
                case 51: // 3
                    //Poubelle Rouge
                    let distAlRx = Math.abs(pospoubelleRed.x - posPlayer.x);
                    let distAlRy = Math.abs(pospoubelleRed.y - posPlayer.y);
                    let distAlRz = Math.abs(pospoubelleRed.z - posPlayer.z);
                    //Poubelle Bleue
                    let distAlBx = Math.abs(pospoubelleBlue.x - posPlayer.x);
                    let distAlBy = Math.abs(pospoubelleBlue.y - posPlayer.y);
                    let distAlBz = Math.abs(pospoubelleBlue.z - posPlayer.z);
                    //Poubelle jaune
                    let distAlYx = Math.abs(pospoubelleYellow.x - posPlayer.x);
                    let distAlYy = Math.abs(pospoubelleYellow.y - posPlayer.y);
                    let distAlYz = Math.abs(pospoubelleYellow.z - posPlayer.z);
                    if (count3 > 0 && rep == false && distAlRx < 30 && distAlRy < 30 && distAlRz < 30) {
                        rep = true;
                        count3 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        if (count3 == 0) {
                            div3.removeChild(div3.children[0])
                            document.getElementById("countSlot3").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count3 > 0 && rep == false && distAlBx < 30 && distAlBy < 30 && distAlBz < 30) {
                        rep = true;
                        count3 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        if (count3 == 0) {
                            div3.removeChild(div3.children[0])
                            document.getElementById("countSlot3").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count3 > 0 && rep == false && distAlYx < 30 && distAlYy < 30 && distAlYz < 30) {
                        rep = true;
                        count3 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        if (count3 == 0) {
                            div3.removeChild(div3.children[0])
                            document.getElementById("countSlot3").setAttribute("style", "opacity: 0")
                        }
                    }
                    break;
                case 52: // 4
                    //Poubelle Rouge
                    let distCartRx = Math.abs(pospoubelleRed.x - posPlayer.x);
                    let distCartRy = Math.abs(pospoubelleRed.y - posPlayer.y);
                    let distCartRz = Math.abs(pospoubelleRed.z - posPlayer.z);
                    //Poubelle Bleue
                    let distCartBx = Math.abs(pospoubelleBlue.x - posPlayer.x);
                    let distCartBy = Math.abs(pospoubelleBlue.y - posPlayer.y);
                    let distCartBz = Math.abs(pospoubelleBlue.z - posPlayer.z);
                    //Poubelle jaune
                    let distCartYx = Math.abs(pospoubelleYellow.x - posPlayer.x);
                    let distCartYy = Math.abs(pospoubelleYellow.y - posPlayer.y);
                    let distCartYz = Math.abs(pospoubelleYellow.z - posPlayer.z);

                    if (count4 > 0 && rep == false && distCartRx < 30 && distCartRy < 30 && distCartRz < 30) {
                        rep = true;
                        count4 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        if (count4 == 0) {
                            div4.removeChild(div4.children[0])
                            document.getElementById("countSlot4").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count4 > 0 && rep == false && distCartBx < 30 && distCartBy < 30 && distCartBz < 30) {
                        rep = true;
                        count4 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        if (count4 == 0) {
                            div4.removeChild(div4.children[0])
                            document.getElementById("countSlot4").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count4 > 0 && rep == false && distCartYx < 30 && distCartYy < 30 && distCartYz < 30) {
                        rep = true;
                        count4 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        if (count4 == 0) {
                            div4.removeChild(div4.children[0])
                            document.getElementById("countSlot4").setAttribute("style", "opacity: 0")
                        }
                    }
                    break;
                case 53: // 5
                    //Poubelle Rouge
                    let distPlasRx = Math.abs(pospoubelleRed.x - posPlayer.x);
                    let distPlasRy = Math.abs(pospoubelleRed.y - posPlayer.y);
                    let distPlasRz = Math.abs(pospoubelleRed.z - posPlayer.z);
                    //Poubelle Bleue
                    let distPlasBx = Math.abs(pospoubelleBlue.x - posPlayer.x);
                    let distPlasBy = Math.abs(pospoubelleBlue.y - posPlayer.y);
                    let distPlasBz = Math.abs(pospoubelleBlue.z - posPlayer.z);
                    //Poubelle jaune
                    let distPlasYx = Math.abs(pospoubelleYellow.x - posPlayer.x);
                    let distPlasYy = Math.abs(pospoubelleYellow.y - posPlayer.y);
                    let distPlasYz = Math.abs(pospoubelleYellow.z - posPlayer.z);

                    if (count5 > 0 && rep == false && distPlasRx < 30 && distPlasRy < 30 && distPlasRz < 30) {

                        rep = true;
                        count5 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        if (count5 == 0) {
                            div5.removeChild(div5.children[0])
                            document.getElementById("countSlot5").setAttribute("style", "opacity: 0")
                        }

                    }

                    if (count5 > 0 && rep == false && distPlasBx < 30 && distPlasBy < 30 && distPlasBz < 30) {

                        rep = true;
                        count5 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        if (count5 == 0) {
                            div5.removeChild(div5.children[0])
                            document.getElementById("countSlot5").setAttribute("style", "opacity: 0")
                        }

                    }

                    if (count5 > 0 && rep == false && distPlasYx < 30 && distPlasYy < 30 && distPlasYz < 30) {

                        rep = true;
                        count5 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        if (count5 == 0) {
                            div5.removeChild(div5.children[0])
                            document.getElementById("countSlot5").setAttribute("style", "opacity: 0")
                        }

                    }
                    break;
                case 54: // 6
                    //Poubelle Rouge
                    let distCigRx = Math.abs(pospoubelleRed.x - posPlayer.x);
                    let distCigRy = Math.abs(pospoubelleRed.y - posPlayer.y);
                    let distCigRz = Math.abs(pospoubelleRed.z - posPlayer.z);
                    //Poubelle Bleue
                    let distCigBx = Math.abs(pospoubelleBlue.x - posPlayer.x);
                    let distCigBy = Math.abs(pospoubelleBlue.y - posPlayer.y);
                    let distCigBz = Math.abs(pospoubelleBlue.z - posPlayer.z);
                    //Poubelle jaune
                    let distCigYx = Math.abs(pospoubelleYellow.x - posPlayer.x);
                    let distCigYy = Math.abs(pospoubelleYellow.y - posPlayer.y);
                    let distCigYz = Math.abs(pospoubelleYellow.z - posPlayer.z);

                    if (count6 > 0 && rep == false && distCigRx < 30 && distCigRy < 30 && distCigRz < 30) {
                        rep = true;
                        count6 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot6").innerHTML = count6;
                        if (count6 == 0) {
                            div6.removeChild(div6.children[0])
                            document.getElementById("countSlot6").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count6 > 0 && rep == false && distCigBx < 30 && distCigBy < 30 && distCigBz < 30) {
                        rep = true;
                        count6 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot6").innerHTML = count6;
                        if (count6 == 0) {
                            div6.removeChild(div6.children[0])
                            document.getElementById("countSlot6").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count6 > 0 && rep == false && distCigYx < 30 && distCigYy < 30 && distCigYz < 30) {
                        rep = true;
                        count6 -= 1;
                        sommecount -= 1;
                        //trashTrie += 1;
                        document.getElementById("countSlot6").innerHTML = count6;
                        if (count6 == 0) {
                            div6.removeChild(div6.children[0])
                            document.getElementById("countSlot6").setAttribute("style", "opacity: 0")
                        }
                    }
                    break;
            }
        }
        function KeyUp(event) {
            switch (event.keyCode) {
                case 49: // 1
                    rep = false;
                    break;

                case 50: //2
                    rep = false;
                    break;

                case 51: //3
                    rep = false;
                    break;

                case 52: //4
                    rep = false;
                    break;

                case 53: //5
                    rep = false;
                    break;

                case 54: //6
                    rep = false;
                    break;
            }
        }
    }


    intersect(pos) {
        this.raycast.setFromCamera(pos, this._camera);

        return this.raycast.intersectObjects(this._scene.children);
    }

    _LoadAnimatedModel() {
        const params = {
            camera: this._camera,
            scene: this._scene,
            manager: this.manager,

        };
        this._controls = new BasicCharacterController(params);
        this.player = this._controls._position
        this._thirdPersonCamera = new ThirdPersonCamera({
            camera: this._camera,
            target: this._controls,
        });
    }

    _LoadMap() {
        const game = this;
        let loaderrrr = new THREE.FBXLoader(this.manager);
        loaderrrr.load("/static/assets/game/town.fbx", function (object) {
            object.scale.multiplyScalar(0.1);
            game._scene.add(object);
            object.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name.startsWith("proxy")) {
                        colliders.push(child);
                        child.material.visible = false;
                    } else {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                }
            });
        })
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame((t) => {
            if (this._previousRAF === null) {
                this._previousRAF = t;
            }

            this._RAF();

            this._threejs.render(this._scene, this._camera);
            this._Step(t - this._previousRAF);
            this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }

        if (this._controls) {
            this._controls.Update(timeElapsedS);
        }
        this._thirdPersonCamera.Update(timeElapsedS);
    }
}

export {CharacterControllerDemo};
export {colliders};
