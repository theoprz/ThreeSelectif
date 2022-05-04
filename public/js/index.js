import CharacterControllerDemo from "/static/js/CharacterControllerDemo.js";
import ApiFetching from "/static/js/ApiFetching.js";
import BasicCharacterControllerProxy from "/static/js/BasicCharacterControllerProxy.js";
import BasicCharacterController from "/static/js/BasicCharacterController.js";
import BasicCharacterControllerInput from "/static/js/BasicCharacterControllerInput.js";
import CharacterFSM from "/static/js/CharacterFSM.js";

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
    _APP = new ThirdPersonCameraDemo();
});


// function _LerpOverFrames(frames, t) {
//     const s = new THREE.Vector3(0, 0, 0);
//     const e = new THREE.Vector3(100, 0, 0);
//     const c = s.clone();

//     for (let i = 0; i < frames; i++) {
//         c.lerp(e, t);
//     }
//     return c;
// }

// function _TestLerp(t1, t2) {
//     const v1 = _LerpOverFrames(100, t1);
//     const v2 = _LerpOverFrames(50, t2);
//     console.log(v1.x + ' | ' + v2.x);
// }

// _TestLerp(0.01, 0.01);
// _TestLerp(1.0 / 100.0, 1.0 / 50.0);
// _TestLerp(1.0 - Math.pow(0.3, 1.0 / 100.0),
//     1.0 - Math.pow(0.3, 1.0 / 50.0));





