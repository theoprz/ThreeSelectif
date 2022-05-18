import BasicCharacterControllerInput from "/static/js/BasicCharacterControllerInput.js"
import CharacterFSM from "/static/js/CharacterFSM.js"
import BasicCharacterControllerProxy from "/static/js/BasicCharacterControllerProxy.js"

import { colliders } from "/static/js/CharacterControllerDemo.js"

class BasicCharacterController {
    constructor(params) {
        this._Init(params);
    }

    _Init(params) {
        this._params = params;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._position = new THREE.Vector3();

        this._animations = {};
        this._input = new BasicCharacterControllerInput();
        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations));

        this._LoadModels(params);
    }

    _LoadModels(params) {
        const loader = new THREE.FBXLoader();
        loader.load('/static/assets/game/zombie/mremireh_o_desbiens.fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            fbx.position.z = -200
            fbx.position.y = 0
            fbx.position.x = 330


            this._target = fbx;
            this._params.scene.add(this._target);
            this._mixer = new THREE.AnimationMixer(this._target);

            this._manager = new THREE.LoadingManager();
            this._manager.onLoad = () => {
                this._stateMachine.SetState('idle');
            };

            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this._mixer.clipAction(clip);

                this._animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const loader = new THREE.FBXLoader(this._manager);
            loader.load('/static/assets/game/zombie/walk.fbx', (a) => { _OnLoad('walk', a); });
            loader.load('/static/assets/game/zombie/run.fbx', (a) => { _OnLoad('run', a); });
            loader.load('/static/assets/game/zombie/idle.fbx', (a) => { _OnLoad('idle', a); });
        });

        /*const objLoader = new OBJLoader();
        objLoader.setPath('/static/assets/game/');
        objLoader.load('town.obj', (object) => {
            object.traverse(c => {
                c.castShadow = true;
            });

            this._target = object;
            this._params.scene.add(this._target);
        })*/
    }

    get Position() {
        return this._position;

    }

    get Rotation() {
        if (!this._target) {
            return new THREE.Quaternion();
        }
        return this._target.quaternion;
    }

    Update(timeInSeconds) {
        if (!this._stateMachine._currentState) {
            return;
        }

        this._stateMachine.Update(timeInSeconds, this._input);

        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));

        velocity.add(frameDecceleration);

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();
        //Vitesse du personnage
        acc.z += 100
        if (this._input._keys.shift) {
            acc.multiplyScalar(2.0);
        }

        if (this._input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
        }
        if (this._input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
        }
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);

        //Pour avoir la position du personnage
        //setInterval(console.log(oldPosition), 3000)

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);

        const pos = controlObject.position.clone();
        let dir = new THREE.Vector3();
        controlObject.getWorldDirection(dir);
        if (forward < 0) dir = -dir;
        let raycaster = new THREE.Raycaster(pos, dir);
        let blocked = false;

        if (colliders !== undefined) {
            const intersect = raycaster.intersectObjects(colliders);
            if (intersect.length > 0 && !(intersect[0].object.name === "proxy_(3)002" || intersect[0].object.name === "proxy_(3)001" || intersect[0].object.name === "proxy_(3)" || intersect[0].object.name === "proxy_(92)" || intersect[0].object.name === "proxy_(5)" || intersect[0].object.name === "proxy_(6)" || intersect[0].object.name === "proxy_(7)" || intersect[0].object.name === "proxy_(8)" || intersect[0].object.name === "proxy_(9)" || intersect[0].object.name === "proxy_(10)")) {
                if (intersect[0].distance < 5) blocked = true;
            }
        }

        if (!blocked) {
            controlObject.position.add(forward);
            controlObject.position.add(sideways);
        }

        if (colliders !== undefined) {
            dir.set(0, -1, 0);
            pos.y += 25;
            let raycaster = new THREE.Raycaster(pos, dir);

            let intersect = raycaster.intersectObjects(colliders);
            if (intersect.length > 0) {
                const targetY = pos.y - intersect[0].distance;
                if (targetY > controlObject.position.y) {
                    controlObject.position.y = 0.8 * controlObject.position.y + 0.2 * targetY;
                } else if (targetY < controlObject.position.y) {
                    if (controlObject.position.y < -targetY) {
                        controlObject.position.y = targetY;
                    }
                }
            }
        }

        this._position.copy(controlObject.position);

        if (this._mixer) {
            this._mixer.update(timeInSeconds);
        }
    }
}

export default BasicCharacterController;