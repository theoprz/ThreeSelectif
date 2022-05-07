import ApiFetching from "/static/js/ApiFetching.js"
import BasicCharacterController from "/static/js/BasicCharacterController.js"
import ThirdPersonCamera from "/static/js/ThirdPersonCamera.js"
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/OBJLoader.js";


let colliders = [];

class CharacterControllerDemo {
    constructor() {
        this._Initialize();
    }

    _Initialize() {

        function onTransitionEnd(event) {
            event.target.remove();
        }

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
            setInterval(function () { loadingScreen.remove() }, 1900);
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

        /*const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 10, 10),
            new THREE.MeshStandardMaterial({
                color: 0x808080,
            }));
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);*/
        // -----------------------------------------------------
        this.objects = [];
        this.raycast = new THREE.Raycaster();
        this.clickMouse = new THREE.Vector2();
        // let draggable = new THREE.Object3D;

        const clickedObject = null;


        let test = this.db.getAllUsers().then(data => {
            console.log(data);
        });


        this.addObject("box");

        this.addObject("trash1");
        this.addObject("trash2");
        this.addObject("trash3");
        this.addObject("trash4");
        this.addObject("trash5");
        this.addObject("trash6");
        this.clickOnObject();

        this._mixers = [];
        this._previousRAF = null;

        this._LoadAnimatedModel();
        this._RAF();
    }

    ramdomPos() {

        //Postion à déterminer en fonction de la map

        let pos1 = { x: 290, z: -93 };
        let pos2 = { x: 386, z: -93 };
        let pos3 = { x: 452, z: -93 };
        let values = [pos1, pos2, pos3];
        let valueToUse = values[Math.floor(Math.random() * values.length)];
        return valueToUse;
    }

    addObject(type) {
        let scale = { x: 6, y: 6, z: 6 }
        let tempPos = this.ramdomPos();
        let pos = { x: tempPos.x, y: scale.y / 2, z: tempPos.z }
        let object = new THREE.Object3D;
        let game = this;

        switch (type) {
            case "box":
                {
                    object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xDC143C }));
                    object.position.set(500, 6, -93);
                    object.scale.set(scale.x, scale.y, scale.z);
                    object.userData.name = 'Boite';
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.userData.draggable = true;
                    this._scene.add(object)
                    break;
                }
            case "trash1":
                {
                    object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x00FFFF }));
                    object.position.set(pos.x, pos.y, pos.z);
                    object.scale.set(scale.x, scale.y, scale.z);
                    object.userData.name = 'Dechet1';
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.userData.draggable = true;
                    this._scene.add(object)
                    break;
                }
            case "trash2":
                {
                    object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x00FF00 }));
                    object.position.set(450, pos.y, -60);
                    object.scale.set(scale.x, scale.y, scale.z);
                    object.userData.name = 'Dechet2';
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.userData.draggable = true;
                    this._scene.add(object)
                    break;
                }
            case "trash3":
                {
                    object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xFFFF00 }));
                    object.position.set(440, pos.y, 0);
                    object.scale.set(scale.x, scale.y, scale.z);
                    object.userData.name = 'Dechet3';
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.userData.draggable = true;
                    this._scene.add(object)
                    break;
                }
            case "trash4":
                {
                    const game = this;
                    let loaderTrash4 = new THREE.FBXLoader(this.manager);
                    loaderTrash4.load("/static/assets/game/objects/trash-carton.fbx", function (object) {
                        const carton = object.children[0];
                        carton.scale.multiplyScalar(5)
                        carton.position.set(400, pos.y, -50);
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
                    })
                    break;
                }
            case "trash5":
                {
                    object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
                    object.position.set(410, pos.y, 0);
                    object.scale.set(scale.x, scale.y, scale.z);
                    object.userData.name = 'Dechet5';
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.userData.draggable = true;
                    this._scene.add(object)
                    break;
                }
            case "trash6":
                {
                    object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x00000F }));
                    object.position.set(390, pos.y, 0);
                    object.scale.set(scale.x, scale.y, scale.z);
                    object.userData.name = 'Dechet6';
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.userData.draggable = true;
                    this._scene.add(object)
                    break;
                }

        }

        //object.userData.draggable = true;

        //this._scene.add(object)
        
    }

    question(questionNumber) {
        var choix1, choix2, choix3, questions, solution, good_response, bad_response;
        this.db.getQuestion(questionNumber).then(async data => {
            choix1 = await data.choix1;
            choix2 = await data.choix2;
            choix3 = await data.choix3;
            questions = data.questions;
            console.log(questions);
            console.log(data.questions);
            solution = await data.solution;
            good_response = await data.good;
            bad_response = await data.bad;
        });

        console.log(questions);
        (async () => {

            /* inputOptions can be an object or Promise */
            const inputOptions = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        '1': choix1,
                        '2': choix2,
                        '3': choix3
                    })
                }, 1000)
            });

            const { value: color } = await Swal.fire({
                title: questions,
                icon: 'question',
                input: 'radio',
                inputOptions: inputOptions,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Vous devez mettre une réponse !'
                    }
                    console.log(value);
                }
            })

            if (color === solution) {
                Swal.fire({
                    icon: 'success',
                    html: good_response,
                    confirmButtonText: 'Suivant'
                }).then((result) => this.question(0))

            } else {
                Swal.fire({
                    icon: 'error',
                    html: bad_response,
                    confirmButtonText: 'Suivant'
                })
            }


        })()

    }

    endgame_quest() {

        (async () => {

            const { value: accept } = await Swal.fire({
                title: 'Combien avez-vous fait economiser de temp de dégradation avec vos déchets triés ?',
                icon: 'question',
                input: 'range',
                inputLabel: 'Temp ( en millier d\'année)',
                inputAttributes: {
                    min: 0,
                    max: 10000,
                    step: 1
                },
                inputValue: 200
            })
            if (accept == 300) {
                console.log("ahahahahahah");
            }
            then

        })()
    }

    clickOnObject() {
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        let count5 = 0;
        let count6 = 0;

        window.addEventListener('click', event => {
            this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            console.log()

            //création de l'image pour l'afficher dans l'inventaire

            //Bouteille en Verre
            let img1 = document.createElement("img");
            img1.src = "/static/assets/game/trash-glass-bottle.png";
            img1.setAttribute("position", "absolute")

            //Canette
            let img2 = document.createElement("img");
            img2.src = "/static/assets/game/trash-canette.png";
            img2.setAttribute("position", "absolute")
            img2.setAttribute("style", "margin-top: 15px")

            //Déchets Alimentaire
            let img3 = document.createElement("img");
            img3.src = "/static/assets/game/trash-aliments.png";
            img3.setAttribute("position", "absolute")
            img3.setAttribute("style", "margin-top: 17px")


            //Carton
            let img4 = document.createElement("img");
            img4.src = "/static/assets/game/trash-carton.png";
            img4.setAttribute("position", "absolute")
            img4.setAttribute("style", "margin-top: 17px")

            //plastique
            let img5 = document.createElement("img");
            img5.src = "/static/assets/game/trash-plastique.png";
            img5.setAttribute("position", "absolute");

            //Mégot
            let img6 = document.createElement("img");
            img6.src = "/static/assets/game/trash-megot.png";
            img6.setAttribute("position", "absolute");
            img6.setAttribute("style", "margin-top: 12px")

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




            const found = this.intersect(this.clickMouse);
            console.log(found);
            if (found.length > 0) {
                if (found[0].object.userData.draggable) {
                    this.clickedObject = found[0].object;

                    // Quand on appuie sur l'objet de l'étape 1 question
                    if (this.clickedObject.userData.name == "Boite") {
                        this.question(0);
                        this._scene.remove(found[0].object);
                    }
                    console.log(`Clicked on ${this.clickedObject.userData.name}`);

                    //Pour l'inventaire:

                    //Premier Objet
                    if (div1.childElementCount == 0 & this.clickedObject.userData.name == "Dechet1") {
                        div1.appendChild(img1);
                        count1 += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count1)
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet1") {
                        count1 += 1;
                        document.getElementById("countSlot1").innerHTML = count1;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count1)
                    }

                    //Deuxième Objet
                    if (div2.childElementCount == 0 & this.clickedObject.userData.name == "Dechet2") {
                        div2.appendChild(img2);
                        count2 += 1;
                        document.getElementById("countSlot2").innerHTML = count2;

                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count2)
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet2") {
                        count2 += 1;
                        document.getElementById("countSlot2").innerHTML = count2;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count2)
                    }

                    //Troisème Objet
                    if (div3.childElementCount == 0 & this.clickedObject.userData.name == "Dechet3") {
                        div3.appendChild(img3);
                        count3 += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count3)
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet3") {
                        count3 += 1;
                        document.getElementById("countSlot3").innerHTML = count3;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count3)
                    }

                    //Quatrièmee Objet
                    if (div4.childElementCount == 0 & this.clickedObject.userData.name == "Dechet4") {
                        div4.appendChild(img4);
                        count4 += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count4)
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet4") {
                        count4 += 1;
                        document.getElementById("countSlot4").innerHTML = count4;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count4)
                    }

                    //Cinqièmee Objet
                    if (div5.childElementCount == 0 & this.clickedObject.userData.name == "Dechet5") {
                        div5.appendChild(img5);
                        count5 += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count5)
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet5") {
                        count5 += 1;
                        document.getElementById("countSlot5").innerHTML = count5;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count5)
                    }

                    //Sixièmee Objet
                    if (div6.childElementCount == 0 & this.clickedObject.userData.name == "Dechet6") {
                        div6.appendChild(img6);
                        count6 += 1;
                        document.getElementById("countSlot6").innerHTML = count6;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count6)
                    }

                    // Si il y a déjà l'image
                    else if (this.clickedObject.userData.name == "Dechet6") {
                        count6 += 1;
                        document.getElementById("countSlot6").innerHTML = count6;
                        //this.db.updateInventory("Test", { inventory: { cannettes: count1 } });
                        console.log(count6)
                    }
                }
            }
        })
    }

    intersect(pos) {
        this.raycast.setFromCamera(pos, this._camera);
        console.log(this._scene.children);

        return this.raycast.intersectObjects(this._scene.children);
    }

    _LoadAnimatedModel() {
        const params = {
            camera: this._camera,
            scene: this._scene,
            manager: this.manager
        };
        this._controls = new BasicCharacterController(params);

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
export { colliders };