import CharacterControllerDemo from "/static/js/CharacterControllerDemo.js";
import ApiFetching from "/static/js/ApiFetching.js";
import BasicCharacterControllerProxy from "/static/js/BasicCharacterControllerProxy.js";
import BasicCharacterController from "/static/js/BasicCharacterController.js";
import BasicCharacterControllerInput from "/static/js/BasicCharacterControllerInput.js";
import CharacterFSM from "/static/js/CharacterFSM.js";

let _APP = null;
window.addEventListener('DOMContentLoaded', () => {
    _APP = new CharacterControllerDemo();
});
