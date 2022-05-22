import ApiFetching from "/static/js/ApiFetching.js"
import BasicCharacterController from "/static/js/BasicCharacterController.js"
import ThirdPersonCamera from "/static/js/ThirdPersonCamera.js"

import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/OBJLoader.js";


let colliders = [];
let pickup = false;
let jeter = false;
//Positions possibles pour les objets
//Bouteille de verre
let pos1Trash1 = { x: -187, y: 0, z: 520 };
let pos2Trash1 = { x: 206, y: 0, z: 744 };
let pos3Trash1 = { x: 956, y: 3, z: 494 };
let pos4Trash1 = { x: 420, y: 0, z: -621 };
let pos5Trash1 = { x: 103, y: 0, z: -1030 };
let pos6Trash1 = { x: -207, y: 0, z: -445 };
let valuesTrash1 = [pos1Trash1, pos2Trash1, pos3Trash1, pos4Trash1, pos5Trash1, pos6Trash1];
//Canettes
let pos1Trash2 = { x: 623, y: 3, z: 80 };
let pos2Trash2 = { x: 292, y: 3, z: 99 };
let pos3Trash2 = { x: 201, y: 3, z: 213 };
let pos4Trash2 = { x: 407, y: 1, z: -160 };
let pos5Trash2 = { x: -107, y: 1, z: 376 };
let pos6Trash2 = { x: -194, y: 3, z: -743 };
let valuesTrash2 = [pos1Trash2, pos2Trash2, pos3Trash2, pos4Trash2, pos5Trash2, pos6Trash2];
//Déchets alimentaires
let pos1Trash3 = { x: 902, y: -1, z: 230 };
let pos2Trash3 = { x: 457, y: -1, z: 476 };
let pos3Trash3 = { x: 194, y: -1, z: 264 };
let pos4Trash3 = { x: 416, y: -1, z: 37 };
let pos5Trash3 = { x: 1018, y: -1, z: 38 };
let pos6Trash3 = { x: -186, y: -1, z: -790 };
let valuesTrash3 = [pos1Trash3, pos2Trash3, pos3Trash3, pos4Trash3, pos5Trash3, pos6Trash3];
//Cartons
let pos1Trash4 = { x: 945, y: 7, z: -430 };
let pos2Trash4 = { x: 22, y: 4, z: 800 };
let pos3Trash4 = { x: 890, y: 12, z: -1030 };
let pos4Trash4 = { x: 432, y: 1, z: -1150 };
let pos5Trash4 = { x: -190, y: 2, z: -890 };
let pos6Trash4 = { x: 960, y: 6, z: 121 };
let valuesTrash4 = [pos1Trash4, pos2Trash4, pos3Trash4, pos4Trash4, pos5Trash4, pos6Trash4];
//Plastiques
let pos1Trash5 = { x: 983, y: 0, z: -1061 };
let pos2Trash5 = { x: 364, y: 0, z: -237 };
let pos3Trash5 = { x: -267, y: 0, z: 702 };
let pos4Trash5 = { x: 74, y: 0, z: 449 };
let pos5Trash5 = { x: 562, y: 0, z: 312 };
let pos6Trash5 = { x: 234, y: 0, z: -438 };
let valuesTrash5 = [pos1Trash5, pos2Trash5, pos3Trash5, pos4Trash5, pos5Trash5, pos6Trash5];
//Mégots de cigarettes
let pos1Trash6 = { x: 913, y: 1, z: -183 };
let pos2Trash6 = { x: 766, y: 1, z: 771 };
let pos3Trash6 = { x: 177, y: 1, z: 564 };
let pos4Trash6 = { x: -209, y: 1, z: 97 };
let pos5Trash6 = { x: 519, y: 1, z: -211 };
let pos6Trash6 = { x: 15, y: 1, z: -946 };
let valuesTrash6 = [pos1Trash6, pos2Trash6, pos3Trash6, pos4Trash6, pos5Trash6, pos6Trash6];
let pospoubelleGreen = { x: 17, y: -3, z: 381 };
let pospoubelleGrey = { x: 17, y: -3, z: 290 }
let pospoubelleYellow = { x: 17, y: -3, z: 203 };
let trashTrie = 0;
let scoreTrie = 0;
let trashMalTrie = 0;
let scoreMalTrie = 0;
let timeSecChapter2 = 0;
let timeMinChapter2 = 0;
let timeChapter2 = 0;
let scoreQuestion = 0;
let scoreChapter2 = 0;
let gameFinish = false;
let actualChapter = 0;
let temps = 600;
class CharacterControllerDemo {
    constructor() {
        this._Initialize();
    }

    async _Initialize() {

        function onTransitionEnd(event) {
            event.target.remove();
        }

        this.player = {};
        this.score = 0;
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
        const far = 3000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(25, 10, 25);

        this._scene = new THREE.Scene();

        this.db = new ApiFetching();

        this.user = await this.db.getUser(username);

        this.manager = new THREE.LoadingManager(() => {
            const loadingScreen = document.getElementById('loading-screen');

            // optional: remove loader from DOM via event listener
            loadingScreen.addEventListener('transitionend', onTransitionEnd);
        });

        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
            // Number from 0.0 to 1.0
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onLoad = async function () {
            const loadingScreen = document.getElementById('loading-screen');
            await loadingScreen.classList.add('fade-out');
            let intervalLoading = setInterval(function () {
                loadingScreen.remove();
                alertify.alert()
                    .setting({
                        transition: 'zoom',
                        'modal': false,
                        'closable': false,
                        'padding': 10,
                        'invokeOnCloseOff': true,
                        'pinnable': false,
                        'label': 'Jouer',
                        'onok': function () { alertify.success('Bienvenue'); },
                        'message': `Bienvenue sur le <strong> Three Séléctif </strong>!
                    <br><br> Pour commencer le jeu tu vas devoir compléter un questionnaire pour tester tes connaissances sur le tri séléctif et le recyclage. 
                    Pour ce faire, tu vas te rendre derrière toi dans un batiment marron à côté d'un magnifique panneau Junia tu trouveras un Ordinateur où tu cliqueras pour commencer le questionnaire.
                    <br><br> <i>Bon jeu!</i>`,
                    }).setHeader('<strong> Bienvenue </strong>').show()
                clearInterval(intervalLoading);
            }, 5000);
            console.log('Loading complete!');
        };

        let bar = new ProgressBar.Line("#progressBar", {
            strokeWidth: 4,
            easing: 'linear',
            duration: 100,
            color: '#93c47d',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: { width: '100%', height: '100%' },
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#999',
                    position: 'absolute',
                    right: '40%',
                    top: '50%',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: { color: '#FFEA82' },
            to: { color: '#ED6A5A' },
        });

        this.manager.onProgress = function (url, itemsLoaded, itemsTotal) {
            let percent = Math.floor(itemsLoaded / itemsTotal * 100);
            bar.animate(percent / 100);
            //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onError = function (url) {

            console.log('There was an error loading ' + url);

        };

        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-239, 300, 856);
        light.target.position.set(1063, 0, -1072);
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
        // let bgTexture = new THREE.TextureLoader().load('/static/assets/game/sky.jpg');
        // this._scene.background = bgTexture;

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

        this.testTimer = function () {
            this.timer(false)
        }

        //Ordinhateur pour le questionnaire
        this.addObject("questionnaire");

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

        //poubelle Verte
        this.addObject("poubelleGreen");
        //poubelle Grise
        this.addObject("poubelleGrey");
        //poubelle Jaune
        this.addObject("poubelleYellow");

        this._mixers = [];
        this._previousRAF = null;

        this._LoadAnimatedModel();

        this.clickOnObject();
        this._RAF();
    }

    timer(state) { //Cooldown pour le chapitre 2
        const timerElement = document.getElementById("timer");

        let interval = setInterval(() => {
            let minutes = parseInt(temps / 60, 10);
            let secondes = parseInt(temps % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            secondes = secondes < 10 ? "0" + secondes : secondes;
            if (timerElement) {
                timerElement.innerText = `${minutes}:${secondes}`;
                timerElement.classList.add('timer');
            }
            if (temps == 0 || !state) {
                if (timerElement) {
                    timerElement.remove()
                }
                gameFinish = true;
                this.endChapter2();
                clearInterval(interval);
                return;
            } else if (temps < 30) {
                timerElement.classList.remove('timer');
                timerElement.classList.add('timer2');
            }
            temps = temps <= 0 ? 0 : temps - 1;
            scoreTemps = scoreTemps <= 0 ? 0 : scoreTemps - 1;
            timeChapter2 = 600 - temps;
            timeMinChapter2 = parseInt(timeChapter2 / 60, 10);
            timeSecChapter2 = parseInt(timeChapter2 % 60, 10);
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
            case "questionnaire":
                {
                    const game = this;
                    let loaderComputer = new THREE.FBXLoader(this.manager);
                    loaderComputer.load("/static/assets/game/objects/quest-computer.fbx", function (object) {
                        const computer = object.children[0];
                        computer.scale.multiplyScalar(0.005)
                        computer.position.set(310, 14, -720);
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
                        game._scene.add(computer);
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
                        });
                        game._scene.add(bouteille);
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
                        canette.scale.multiplyScalar(0.03)
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
                        });
                        game._scene.add(canette);
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
                        });
                        game._scene.add(aliment);
                    });
                    break;
                }
            case "trash4":
                {
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
                        });
                        game._scene.add(carton);
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
                        });
                        game._scene.add(plastique);
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
                        });
                        game._scene.add(cigarette);
                    });
                    break;
                }
            case "poubelleGreen":
                {
                    const game = this;
                    let loaderpoubelleGreen = new THREE.FBXLoader(this.manager);
                    loaderpoubelleGreen.load("/static/assets/game/objects/poubelleGreen.fbx", function (object) {
                        const poubelleGreen = object.children[0];
                        poubelleGreen.scale.multiplyScalar(0.04)
                        poubelleGreen.position.set(pospoubelleGreen.x, pospoubelleGreen.y, pospoubelleGreen.z);
                        poubelleGreen.userData.name = 'PoubelleGreen';
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
                        game._scene.add(poubelleGreen);
                    });
                    break;
                }

            case "poubelleGrey":
                {

                    const game = this;
                    let loaderpoubelleGrey = new THREE.FBXLoader(this.manager);
                    loaderpoubelleGrey.load("/static/assets/game/objects/poubelleGrey.fbx", function (object) {
                        const poubelleGrey = object.children[0];

                        poubelleGrey.scale.multiplyScalar(0.04)
                        poubelleGrey.position.set(pospoubelleGrey.x, pospoubelleGrey.y, pospoubelleGrey.z);
                        poubelleGrey.userData.name = 'PoubelleGrey';
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
                        game._scene.add(poubelleGrey);
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
                        poubelleYellow.userData.name = 'PoubelleYellow';
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

    questionFinal(score) {
        Swal.fire({
            title: 'Question Finale',
            icon: 'question',
            input: 'range',
            inputLabel: 'ans',
            html: "Combien avez vous fait economiser à la terre en temp de dégradation ? (100 ans pres) ",
            confirmButton: "Ok",
            inputAttributes: {
                min: 0,
                max: 20000,
                step: 100,
            },
            inputValue: 0
        }).then((result) => {
            if (result == score) {
                console.log("WIN")
            }
        })
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

                const { value: color } = await Swal.fire({
                    icon: 'question',
                    title: await data.questions,
                    html: ` Question :${this.iterations}/10`,
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
                        if (this.iterations == 10) {
                            if (this.iterationsWin >= 6) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'CHAPITRE 1 TERMINÉ',
                                    html: `Bravo tu as répondu correctement à :  ${this.iterationsWin} questions`,
                                    confirmButtonText: 'Chapitre suivant',
                                }).then((result) => {
                                    scoreQuestion = this.iterationsWin * 10
                                    this.score += scoreQuestion;
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'CHAPITRE 2',
                                        html: `Dans ce chapitre vous allez devoir ramasser et trier le plus de déchets possible en 10 min. Il y a 18 déchets en tout. Il y a trois poubelles dans le parc, mettez les déchets dans les bonnes poubelles.<br><br> Pour récupérer un déchet approchez vous de lui et cliquer dessus, pour le déposer dans une poubelle approchez vous d'une poubelle et appuyez sur 1, 2, 3, 4, 5, ou 6 sur votre clavier`,
                                        confirmButtonText: 'Start',
                                    }).then(async (result) => {
                                        this.timer(true);
                                        actualChapter = 1;
                                        await this.db.updateChapter(username, { chapter: 1 });
                                    });
                                });
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
                                        this.iterations = 1;
                                        this.iterationsWin = 1;
                                        this.tab = [];
                                        this.startquestion();
                                        // A revoir
                                    } else if (result.isDenied) {
                                        window.location.href = '/'
                                        // A faire
                                    }
                                });
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
                        if (this.iterations == 10) {

                            if (this.iterationsWin >= 6) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'CHAPITRE 1 TERMINÉ',
                                    html: `Bravo tu as répondu correctement à :  ${this.iterationsWin} questions`,
                                    confirmButtonText: 'Chapitre suivant',
                                }).then((result) => {
                                    this.score += this.iterationsWin * 10;
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'CHAPITRE 2',
                                        html: `Dans ce chapitre vous allez devoir ramasser et trier le plus de déchets possible en 10 min. Il y a 18 déchets en tout. Il y a trois poubelles dans le parc, mettez les déchets dans les bonnes poubelles.<br><br> Pour récupérer un déchet approchez vous de lui et cliquer dessus, pour le déposer dans une poubelle approchez vous d'une poubelle et appuyez sur 1, 2, 3, 4, 5, ou 6 sur votre clavier`,
                                        confirmButtonText: 'Start',
                                    }).then(async (result) => {
                                        this.timer(true);
                                        actualChapter = 1;
                                        await this.db.updateChapter(username, { chapter: 1 });
                                    });
                                });
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
                                        this.iterations = 1;
                                        this.iterationsWin = 1;
                                        this.tab = [];
                                        this.startquestion();
                                        // A revoir
                                    } else if (result.isDenied) {
                                        window.location.href = '/'
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
                } else { }
            })()
        });
    }

    pasDeRepetitionQuestion() {
        var theRandomNumber = Math.floor(Math.random() * 50) + 1;
        if (this.tab.includes(theRandomNumber)) {
            while ((this.tab.includes(theRandomNumber))) {
                theRandomNumber = Math.floor(Math.random() * 50) + 1;
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
        img5.setAttribute("id", "imgId5");
        //Mégot
        let img6 = document.createElement("img");
        img6.src = "/static/assets/game/trash-megot.png";
        img6.setAttribute("position", "absolute");
        img6.setAttribute("style", "margin-top: 12px");
        img6.setAttribute("id", "imgId6");
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
            //Pour afficher les enfants de la scène (objets/light, etc...)
            //console.log(this.player)
            const found = this.intersect(this.clickMouse);
            if (found.length > 0) {
                this.clickedObject = found[0].object;

                //distance entre l'objet et le personnage
                let distx = Math.abs(this.clickedObject.position.x - this.player.x);
                let disty = Math.abs(this.clickedObject.position.y - this.player.y);
                let distz = Math.abs(this.clickedObject.position.z - this.player.z);

                if (found[0].object.userData.draggable && distx < 30 && disty < 30 && distz < 30) { //Si l'objet et cliquable et que la distance est < 30 alors:

                    // Quand on appuie sur l'objet de l'étape 1 question
                    if (this.clickedObject.userData.name === "BoiteQuestionnaire") {
                        this.iterations = 1;
                        this.iterationsWin = 1;
                        this.tab = [];
                        this.startquestion();
                        this.clickedObject.userData.draggable = false;
                    }
                    //Pour connaitre l'objet qu'on appuie
                    //console.log(`Clicked on ${this.clickedObject.userData.name}`);

                    //Pour l'inventaire:
                    if (sommecount > 5) {
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.error('Ton sac est plein, va trier tes déchets dans les poubelles');
                    }
                    //Premier Objet
                    if (actualChapter !== 1) return;

                    if (div1.childElementCount === 0 & this.clickedObject.userData.name === "Dechet1" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        div1.appendChild(img1);
                        count1 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé une Bouteille en verre');
                        document.getElementById("countSlot1").innerHTML = count1;
                        document.getElementById("countSlot1").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet1" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        count1 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé une Bouteille en verre');
                        document.getElementById("countSlot1").innerHTML = count1;
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    //Deuxième Objet
                    if (div2.childElementCount == 0 & this.clickedObject.userData.name == "Dechet2" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        div2.appendChild(img2);
                        count2 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé une canette');
                        document.getElementById("countSlot2").innerHTML = count2;
                        document.getElementById("countSlot2").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet2" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        count2 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé une canette');
                        document.getElementById("countSlot2").innerHTML = count2;
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    //Troisème Objet
                    if (div3.childElementCount == 0 & this.clickedObject.userData.name == "Dechet3" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        div3.appendChild(img3);
                        count3 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé des déchets alimentaires');
                        document.getElementById("countSlot3").innerHTML = count3;
                        document.getElementById("countSlot3").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet3" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        count3 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé des déchets alimentaires');
                        document.getElementById("countSlot3").innerHTML = count3;
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    //Quatrième Objet
                    if (div4.childElementCount == 0 & this.clickedObject.userData.name == "Dechet4" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        div4.appendChild(img4);
                        count4 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé des cartons usagés');
                        document.getElementById("countSlot4").innerHTML = count4;
                        document.getElementById("countSlot4").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet4" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        this._scene.remove(found[0].object);
                        count4 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé des cartons usagés');
                        document.getElementById("countSlot4").innerHTML = count4;
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    //Cinqième Objet
                    if (div5.childElementCount == 0 & this.clickedObject.userData.name == "Dechet5" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        div5.appendChild(img5);
                        count5 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé une bouteille en plastique');
                        document.getElementById("countSlot5").innerHTML = count5;
                        document.getElementById("countSlot5").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet5" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        count5 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé une bouteille en plastique');
                        document.getElementById("countSlot5").innerHTML = count5;
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    //Sixième Objet
                    if (div6.childElementCount == 0 & this.clickedObject.userData.name == "Dechet6" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        div6.appendChild(img6);
                        count6 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé un mégot');
                        document.getElementById("countSlot6").innerHTML = count6;
                        document.getElementById("countSlot6").setAttribute("style", "opacity: 1")
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet6" & sommecount <= 5) {
                        pickup = true;
                        setTimeout(() => {
                            pickup = false;
                        }, 1000)
                        count6 += 1;
                        sommecount += 1;
                        alertify.set('notifier', 'position', 'bottom-left');
                        alertify.success('Tu as ramassé un mégot');
                        document.getElementById("countSlot6").innerHTML = count6;
                        this._scene.remove(found[0].object);
                        if (sommecount == 6) {
                            alertify.warning('Attention, ton sac est plein.');
                        }
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                    }
                }
            }
        })
        //Enlever des objets de l'inventaire grâce aux touches (1 2 3 4 5 6) du clavier
        let posPlayer = this.player;
        let listChildren = this._scene;
        document.addEventListener('keydown', (e) => KeyDown(e), false);
        document.addEventListener('keyup', (e) => KeyUp(e), false);
        let game = this;
        function KeyDown(event) {
            switch (event.keyCode) {
                case 49: // 1
                    let PoubelleGreen1;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGreen")
                            PoubelleGreen1 = elem;

                    })
                    let PoubelleGrey1;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGrey")
                            PoubelleGrey1 = elem;

                    })
                    let PoubelleYellow1;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleYellow")
                            PoubelleYellow1 = elem;
                    })
                    //Poubelle Verte
                    let distBoutRx = Math.abs(PoubelleGreen1.position.x - posPlayer.x);
                    let distBoutRy = Math.abs(PoubelleGreen1.position.y - posPlayer.y);
                    let distBoutRz = Math.abs(PoubelleGreen1.position.z - posPlayer.z);
                    //Poubelle Grise
                    let distBoutBx = Math.abs(PoubelleGrey1.position.x - posPlayer.x);
                    let distBoutBy = Math.abs(PoubelleGrey1.position.y - posPlayer.y);
                    let distBoutBz = Math.abs(PoubelleGrey1.position.z - posPlayer.z);
                    //Poubelle jaune
                    let distBoutYx = Math.abs(PoubelleYellow1.position.x - posPlayer.x);
                    let distBoutYy = Math.abs(PoubelleYellow1.position.y - posPlayer.y);
                    let distBoutYz = Math.abs(PoubelleYellow1.position.z - posPlayer.z);

                    if (count1 > 0 && rep == false && distBoutRx < 30 && distBoutRy < 30 && distBoutRz < 30) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        console.log("tes chaud")

                        rep = true;
                        count1 -= 1;
                        sommecount -= 1;
                        trashTrie += 1;
                        scoreTrie = trashTrie * 10;
                        alertify.success("Bravo!");
                        document.getElementById("countSlot1").innerHTML = count1;
                        if (count1 == 0) {
                            console.log("il faut enle")

                            div1.removeChild(div1.children[0])
                            document.getElementById("countSlot1").setAttribute("style", "opacity: 0")
                        }
                    }
                    if (count1 > 0 && rep == false && ((distBoutBx < 30 && distBoutBy < 30 && distBoutBz < 30) || (distBoutYx < 30 && distBoutYy < 30 && distBoutYz < 30))) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)

                        console.log("tes chaud2")
                        rep = true;
                        count1 -= 1;
                        sommecount -= 1;
                        trashMalTrie += 1;
                        scoreMalTrie = trashMalTrie * 15;
                        alertify.error("Tu as mal trié ton déchet");
                        document.getElementById("countSlot1").innerHTML = count1;
                        if (count1 == 0) {
                            console.log("tes il faut enlever ça")

                            div1.removeChild(div1.children[0])
                            document.getElementById("countSlot1").setAttribute("style", "opacity: 0")
                        }
                    }

                    else if (count1 > 0 && (distBoutRx > 30 || distBoutRy > 30 || distBoutRz > 30) && (distBoutBx > 30 || distBoutBy > 30 || distBoutBz > 30) && (distBoutYx > 30 || distBoutYy > 30 || distBoutYz > 30)) {
                        alertify.error("Tu es trop loin d'une poubelle");
                    }

                    break;
                case 50: // 2
                    let PoubelleGreen2;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGreen") {
                            PoubelleGreen2 = elem;
                        }
                    })
                    let PoubelleGrey2;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGrey") {
                            PoubelleGrey2 = elem;
                        }
                    })
                    let PoubelleYellow2;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleYellow") {
                            PoubelleYellow2 = elem;
                        }
                    })
                    //Poubelle Verte
                    let distCanRx = Math.abs(PoubelleGreen2.position.x - posPlayer.x);
                    let distCanRy = Math.abs(PoubelleGreen2.position.y - posPlayer.y);
                    let distCanRz = Math.abs(PoubelleGreen2.position.z - posPlayer.z);
                    //Poubelle Grise
                    let distCanBx = Math.abs(PoubelleGrey2.position.x - posPlayer.x);
                    let distCanBy = Math.abs(PoubelleGrey2.position.y - posPlayer.y);
                    let distCanBz = Math.abs(PoubelleGrey2.position.z - posPlayer.z);
                    //Poubelle jaune
                    let distCanYx = Math.abs(PoubelleYellow2.position.x - posPlayer.x);
                    let distCanYy = Math.abs(PoubelleYellow2.position.y - posPlayer.y);
                    let distCanYz = Math.abs(PoubelleYellow2.position.z - posPlayer.z);


                    if (count2 > 0 && rep == false && distCanYx < 30 && distCanYy < 30 && distCanYz < 30) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count2 -= 1; //on soustrait un au compteur de cannettes
                        sommecount -= 1;
                        trashTrie += 1;
                        scoreTrie = trashTrie * 10
                        alertify.success("Bravo!");
                        document.getElementById("countSlot2").innerHTML = count2;
                        if (count2 == 0) {
                            div2.removeChild(div2.children[0])
                            document.getElementById("countSlot2").setAttribute("style", "opacity: 0");
                        }
                    }

                    if (count2 > 0 && rep == false && ((distCanBx < 30 && distCanBy < 30 && distCanBz < 30) || (distCanRx < 30 && distCanRy < 30 && distCanRz < 30))) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count2 -= 1; //on soustrait un au compteur de cannettes
                        sommecount -= 1;
                        trashMalTrie += 1;
                        scoreMalTrie = trashMalTrie * 15;
                        alertify.error("Tu as mal trié ton déchet");
                        document.getElementById("countSlot2").innerHTML = count2;
                        if (count2 == 0) {
                            div2.removeChild(div2.children[0])
                            document.getElementById("countSlot2").setAttribute("style", "opacity: 0");
                        }
                    }

                    else if (count2 > 0 && (distCanRx > 30 || distCanRy > 30 || distCanRz > 30) && (distCanBx > 30 || distCanBy > 30 || distCanBz > 30) && (distCanYx > 30 || distCanYy > 30 || distCanYz > 30)) {
                        alertify.error("Tu es trop loin d'une poubelle");
                    }

                    break;
                case 51: // 3
                    let PoubelleGreen3;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGreen") {
                            PoubelleGreen3 = elem;
                        }
                    })
                    let PoubelleGrey3;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGrey") {
                            PoubelleGrey3 = elem;
                        }
                    })
                    let PoubelleYellow3;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleYellow") {
                            PoubelleYellow3 = elem;
                        }
                    })
                    //Poubelle Verte
                    let distAlRx = Math.abs(PoubelleGreen3.position.x - posPlayer.x);
                    let distAlRy = Math.abs(PoubelleGreen3.position.y - posPlayer.y);
                    let distAlRz = Math.abs(PoubelleGreen3.position.z - posPlayer.z);
                    //Poubelle Grise
                    let distAlBx = Math.abs(PoubelleGrey3.position.x - posPlayer.x);
                    let distAlBy = Math.abs(PoubelleGrey3.position.y - posPlayer.y);
                    let distAlBz = Math.abs(PoubelleGrey3.position.z - posPlayer.z);
                    //Poubelle jaune
                    let distAlYx = Math.abs(PoubelleYellow3.position.x - posPlayer.x);
                    let distAlYy = Math.abs(PoubelleYellow3.position.y - posPlayer.y);
                    let distAlYz = Math.abs(PoubelleYellow3.position.z - posPlayer.z);

                    if (count3 > 0 && rep == false && ((distAlRx < 30 && distAlRy < 30 && distAlRz < 30) || (count3 > 0 && rep == false && distAlYx < 30 && distAlYy < 30 && distAlYz < 30))) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count3 -= 1;
                        sommecount -= 1;
                        trashMalTrie += 1;
                        scoreMalTrie = trashMalTrie * 15;
                        alertify.error("Tu as mal trié ton déchet");
                        document.getElementById("countSlot3").innerHTML = count3;
                        if (count3 == 0) {
                            div3.removeChild(div3.children[0])
                            document.getElementById("countSlot3").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count3 > 0 && rep == false && distAlBx < 30 && distAlBy < 30 && distAlBz < 30) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count3 -= 1;
                        sommecount -= 1;
                        trashTrie += 1;
                        scoreTrie = trashTrie * 10;
                        alertify.success("Bravo!");
                        document.getElementById("countSlot3").innerHTML = count3;
                        if (count3 == 0) {
                            div3.removeChild(div3.children[0])
                            document.getElementById("countSlot3").setAttribute("style", "opacity: 0")
                        }
                    }
                    else if (count3 > 0 && (distAlRx > 30 || distAlRy > 30 || distAlRz > 30) && (distAlBx > 30 || distAlBy > 30 || distAlBz > 30) && (distAlYx > 30 || distAlYy > 30 || distAlYz > 30)) {
                        alertify.error("Tu es trop loin d'une poubelle");
                    }

                    break;
                case 52: // 4
                    let PoubelleGreen4;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGreen") {
                            PoubelleGreen4 = elem;
                        }
                    })
                    let PoubelleGrey4;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGrey") {
                            PoubelleGrey4 = elem;
                        }
                    })
                    let PoubelleYellow4;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleYellow") {
                            PoubelleYellow4 = elem;
                        }
                    })
                    //Poubelle Verte
                    let distCartRx = Math.abs(PoubelleGreen4.position.x - posPlayer.x);
                    let distCartRy = Math.abs(PoubelleGreen4.position.y - posPlayer.y);
                    let distCartRz = Math.abs(PoubelleGreen4.position.z - posPlayer.z);
                    //Poubelle Grise
                    let distCartBx = Math.abs(PoubelleGrey4.position.x - posPlayer.x);
                    let distCartBy = Math.abs(PoubelleGrey4.position.y - posPlayer.y);
                    let distCartBz = Math.abs(PoubelleGrey4.position.z - posPlayer.z);
                    //Poubelle jaune
                    let distCartYx = Math.abs(PoubelleYellow4.position.x - posPlayer.x);
                    let distCartYy = Math.abs(PoubelleYellow4.position.y - posPlayer.y);
                    let distCartYz = Math.abs(PoubelleYellow4.position.z - posPlayer.z);

                    if (count4 > 0 && rep == false && distCartYx < 30 && distCartYy < 30 && distCartYz < 30) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count4 -= 1;
                        sommecount -= 1;
                        trashTrie += 1;
                        scoreTrie = trashTrie * 10;
                        alertify.success("Bravo!");
                        document.getElementById("countSlot4").innerHTML = count4;
                        if (count4 == 0) {
                            div4.removeChild(div4.children[0])
                            document.getElementById("countSlot4").setAttribute("style", "opacity: 0")
                        }
                    }
                    if (count4 > 0 && rep == false && ((distCartBx < 30 && distCartBy < 30 && distCartBz < 30) || (distCartRx < 30 && distCartRy < 30 && distCartRz < 30))) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count4 -= 1;
                        sommecount -= 1;
                        trashMalTrie += 1;
                        scoreMalTrie = trashMalTrie * 15;
                        alertify.error("Tu as mal trié ton déchet");
                        document.getElementById("countSlot4").innerHTML = count4;
                        if (count4 == 0) {
                            div4.removeChild(div4.children[0])
                            document.getElementById("countSlot4").setAttribute("style", "opacity: 0")
                        }
                    }
                    else if (count4 > 0 && (distCartRx > 30 || distCartRy > 30 || distCartRz > 30) && (distCartBx > 30 || distCartBy > 30 || distCartBz > 30) && (distCartYx > 30 || distCartYy > 30 || distCartYz > 30)) {
                        alertify.error("Tu es trop loin d'une poubelle");
                    }

                    break;
                case 53: // 5
                    let PoubelleGreen5;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGreen") {
                            PoubelleGreen5 = elem;
                        }
                    })
                    let PoubelleGrey5;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGrey") {
                            PoubelleGrey5 = elem;
                        }
                    })
                    let PoubelleYellow5;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleYellow") {
                            PoubelleYellow5 = elem;
                        }
                    })
                    //Poubelle Verte
                    let distPlasRx = Math.abs(PoubelleGreen5.position.x - posPlayer.x);
                    let distPlasRy = Math.abs(PoubelleGreen5.position.y - posPlayer.y);
                    let distPlasRz = Math.abs(PoubelleGreen5.position.z - posPlayer.z);
                    //Poubelle Grise
                    let distPlasBx = Math.abs(PoubelleGrey5.position.x - posPlayer.x);
                    let distPlasBy = Math.abs(PoubelleGrey5.position.y - posPlayer.y);
                    let distPlasBz = Math.abs(PoubelleGrey5.position.z - posPlayer.z);
                    //Poubelle jaune
                    let distPlasYx = Math.abs(PoubelleYellow5.position.x - posPlayer.x);
                    let distPlasYy = Math.abs(PoubelleYellow5.position.y - posPlayer.y);
                    let distPlasYz = Math.abs(PoubelleYellow5.position.z - posPlayer.z);



                    if (count5 > 0 && rep == false && ((distPlasRx < 30 && distPlasRy < 30 && distPlasRz < 30) || (distPlasBx < 30 && distPlasBy < 30 && distPlasBz < 30))) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count5 -= 1;
                        sommecount -= 1;
                        trashMalTrie += 1;
                        scoreMalTrie = trashMalTrie * 15;
                        alertify.error("Tu as mal trié ton déchet");
                        document.getElementById("countSlot5").innerHTML = count5;
                        if (count5 == 0) {
                            div5.removeChild(div5.children[0])
                            document.getElementById("countSlot5").setAttribute("style", "opacity: 0")
                        }

                    }

                    if (count5 > 0 && rep == false && distPlasYx < 30 && distPlasYy < 30 && distPlasYz < 30) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count5 -= 1;
                        sommecount -= 1;
                        trashTrie += 1;
                        scoreTrie = trashTrie * 10;
                        alertify.success("Bravo!");
                        document.getElementById("countSlot5").innerHTML = count5;
                        if (count5 == 0) {
                            div5.removeChild(div5.children[0])
                            document.getElementById("countSlot5").setAttribute("style", "opacity: 0")
                        }
                    }
                    else if (count5 > 0 && (distPlasRx > 30 || distPlasRy > 30 || distPlasRz > 30) && (distPlasBx > 30 || distPlasBy > 30 || distPlasBz > 30) && (distPlasYx > 30 || distPlasYy > 30 || distPlasYz > 30)) {
                        alertify.error("Tu es trop loin d'une poubelle");
                    }
                    break;
                case 54: // 6
                    let PoubelleGreen6;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGreen") {
                            PoubelleGreen6 = elem;
                        }
                    })
                    let PoubelleGrey6;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleGrey") {
                            PoubelleGrey6 = elem;
                        }
                    })
                    let PoubelleYellow6;
                    listChildren.children.forEach(elem => {
                        if (elem.userData.name === "PoubelleYellow") {
                            PoubelleYellow6 = elem;
                        }
                    })
                    //Poubelle Verte
                    let distCigRx = Math.abs(PoubelleGreen6.position.x - posPlayer.x);
                    let distCigRy = Math.abs(PoubelleGreen6.position.y - posPlayer.y);
                    let distCigRz = Math.abs(PoubelleGreen6.position.z - posPlayer.z);
                    //Poubelle Grise
                    let distCigBx = Math.abs(PoubelleGrey6.position.x - posPlayer.x);
                    let distCigBy = Math.abs(PoubelleGrey6.position.y - posPlayer.y);
                    let distCigBz = Math.abs(PoubelleGrey6.position.z - posPlayer.z);
                    //Poubelle jaune
                    let distCigYx = Math.abs(PoubelleYellow6.position.x - posPlayer.x);
                    let distCigYy = Math.abs(PoubelleYellow6.position.y - posPlayer.y);
                    let distCigYz = Math.abs(PoubelleYellow6.position.z - posPlayer.z);


                    if (count6 > 0 && rep == false && distCigBx < 30 && distCigBy < 30 && distCigBz < 30) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count6 -= 1;
                        sommecount -= 1;
                        trashTrie += 1;
                        scoreTrie = trashTrie * 10;
                        alertify.success("Bravo!");
                        document.getElementById("countSlot6").innerHTML = count6;
                        if (count6 == 0) {
                            div6.removeChild(div6.children[0])
                            document.getElementById("countSlot6").setAttribute("style", "opacity: 0")
                        }
                    }

                    if (count6 > 0 && rep == false && ((distCigYx < 30 && distCigYy < 30 && distCigYz < 30) || (distCigRx < 30 && distCigRy < 30 && distCigRz < 30))) {
                        jeter = true;
                        setTimeout(() => {
                            jeter = false;
                        }, 1000)
                        rep = true;
                        count6 -= 1;
                        sommecount -= 1;
                        trashMalTrie += 1;
                        scoreMalTrie = trashMalTrie * 15;
                        alertify.error("Tu as mal trié ton déchet");
                        document.getElementById("countSlot6").innerHTML = count6;
                        if (count6 == 0) {
                            div6.removeChild(div6.children[0])
                            document.getElementById("countSlot6").setAttribute("style", "opacity: 0")
                        }
                    }
                    else if (count6 > 0 && (distCigRx > 30 || distCigRy > 30 || distCigRz > 30) && (distCigBx > 30 || distCigBy > 30 || distCigBz > 30) && (distCigYx > 30 || distCigYy > 30 || distCigYz > 30)) {
                        alertify.error("Tu es trop loin d'une poubelle");
                    }
                    break;

            }

            if (trashMalTrie + trashTrie == 18 && !gameFinish) {
                game.testTimer();
                return;
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
    async endChapter2() {
        //BDD score
        scoreChapter2 =temps + scoreTrie -scoreMalTrie ;
        this.score += scoreChapter2;
        alertify.confirm()
            .setting({
                transition: 'zoom',
                'modal': false,
                'closable': false,
                'padding': 10,
                'invokeOnCloseOff': true,
                'pinnable': false,
                'labels': { ok: 'Rejouer', cancel: 'Voir le leaderboard' },
                'onok': function () { document.location.href = "/"; },
                'oncancel': function () { document.location.href = "/settings"; },
                'message': `Bien joué<strong> ${username}</strong>, tu as fini le 2ème mini jeu. On va te faire un petit récapitulatif de ta performance:
        <br><br>Tu as bien trié: <strong>${trashTrie}  déchets</strong>.
        <br>Tu as mal trié: <strong>${trashMalTrie} déchets</strong>.
        <br> Et tu as finis le jeu en<strong> ${timeMinChapter2} minutes et ${timeSecChapter2} secondes. </strong>
        <br><br>Tu as eu ${this.iterationsWin} au questionnaire tu as donc eu ${scoreQuestion} points au questionnaire. <br><br>
        Pour le recyclage et triage tu as eu ${scoreChapter2} points.<br><br>
        <br><strong>Tu as donc un score de total ${this.score} points! Bien joué<br>
        <br><br> Si jamais tu veux rejouer clique sur le bouton Rejouer et si tu veux voir le classement je te laisse cliquer sur: Voir le leaderboard.
        <br><br><i> Merci d'avoir joué à notre jeu!</i>`,
            }).setHeader('Félicitations').show()

        this.db.newScore(username, { finalScore: this.score })
        await this.db.updateChapter(username, { chapter: 0 });
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

export { CharacterControllerDemo };
export { colliders, pickup, jeter };
