import ApiFetching from "/static/js/ApiFetching.js"
import BasicCharacterController from "/static/js/BasicCharacterController.js"
import ThirdPersonCamera from "/static/js/ThirdPersonCamera.js"

class CharacterControllerDemo {
    constructor() {
        this._Initialize();
    }

    _Initialize() {

        function onTransitionEnd( event ) {
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
            const loadingScreen = document.getElementById( 'loading-screen' );

            // optional: remove loader from DOM via event listener
            loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        });
        this.manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        this.manager.onLoad = function ( ) {
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );
            console.log( 'Loading complete!');

        };


        this.manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

        };

        this.manager.onError = function ( url ) {

            console.log( 'There was an error loading ' + url );

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
        const clickedObject = null;

        let test = this.db.getAllUsers().then(data => {
            console.log(data);
        });

        this.addObject("box2");
        this.addObject("box")
        this.clickOnObject();

        this._mixers = [];
        this._previousRAF = null;

        this._LoadAnimatedModel();
        this._RAF();
    }

    ramdomPos() {

        //Postion à déterminer en fonction de la map

        let pos1 = { x: 10 , z: 10};
        let pos2= { x: 20 , z: 20};
        let pos3 = { x: 30 , z: 30};
        let values = [pos1,pos2,pos3];
        let valueToUse = values[Math.floor(Math.random() * values.length)];
        return valueToUse;
    }

    addObject(type){
        let scale = { x: 6, y: 6, z: 6 }
        let tempPos = this.ramdomPos();
        let pos = { x: tempPos.x, y: scale.y / 2, z: tempPos.z }
        let object = null;

        switch(type){
            case "box": {
                object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xDC143C }));
                object.position.set(50, 6, 50);
                object.scale.set(scale.x, scale.y, scale.z);
                object.userData.name = 'Boite';
                break;
            }
            case "box2": {
                object = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x00FFFF }));
                object.position.set(pos.x, pos.y, pos.z);
                object.scale.set(scale.x, scale.y, scale.z);
                object.userData.name = 'Boite2';
                break;
            }
        }

        object.castShadow = true;
        object.receiveShadow = true;
        object.userData.draggable = true;

        this._scene.add(object)
    }

    question(questionNumber){
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

            if( color === solution){
                Swal.fire({
                    icon: 'success',
                    html: good_response,
                    confirmButtonText: 'Suivant'
                }).then((result)=> this.question(0))

            }else {
                Swal.fire({
                    icon: 'error',
                    html: bad_response,
                    confirmButtonText: 'Suivant'
                })
            }


        })()

    }

    endgame_quest(){

        (async () => {

            const {value: accept} = await Swal.fire({
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
            }then

        })()
    }

    clickOnObject() {
        let count1 =0;
        window.addEventListener('click', event => {
            this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            //création de l'image pour l'afficher dans l'inventaire
            let img1 = document.createElement("img");
            img1.src = "/static/assets/game/trash-glass-bottle.png";
            img1.setAttribute("style", "height: 100%");
            img1.setAttribute("position", "absolute")

            let div1 = document.getElementById("texteSlot1");
            div1.setAttribute("style", "text-align:center");
            const found = this.intersect(this.clickMouse);
            console.log(found);
            if(found.length > 0){
                if(found[0].object.userData.draggable) {
                    this.clickedObject = found[0].object;
                    if (this.clickedObject.userData.name == "Boite") {
                        this.question(0);
                        this._scene.remove(found[0].object);
                    }
                    console.log(`Clicked on ${this.clickedObject.userData.name}`);
                    if (div1.childElementCount == 0 & this.clickedObject.userData.name == "Boite2") {
                        div1.appendChild(img1);
                        count1 += 1;
                        this.db.updateInventory("Test", {inventory: {cannettes: count1}});
                        console.log(count1)
                    }

                    else if (this.clickedObject.userData.name == "Boite2") {
                        count1 += 1;
                        this.db.updateInventory("Test", {inventory: {cannettes: count1}});
                        console.log(count1)
                    }
                }
            }
        })
    }

    intersect(pos) {
        this.raycast.setFromCamera(pos, this._camera);
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
        var loaderrrr = new THREE.FBXLoader(this.manager);
        loaderrrr.load("/static/assets/game/town.fbx", function (object) {
            object.scale.multiplyScalar(0.1);
            game.colliders = [];
            game._scene.add(object);
            object.traverse(function (child) {
                if (child.isMesh) {
                    if (child.name.startsWith("proxy")) {
                        game.colliders.push(child);
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

export default CharacterControllerDemo;
