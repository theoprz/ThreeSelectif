import FiniteStateMachine from "/static/js/FiniteStateMachine.js"
import IdleState from "/static/js/anims/IdleState.js"
import RunState from "/static/js/anims/RunState.js"
import WalkState from "/static/js/anims/WalkState.js"
import PickState from "/static/js/anims/PickState.js"
import WalkBackState from "/static/js/anims/WalkBackState.js";
import ThrowState from "/static/js/anims/ThrowState.js";

class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
        super();
        this._proxy = proxy;
        this._Init();
    }

    _Init() {
        this._AddState('idle', IdleState);
        this._AddState('walk', WalkState);
        this._AddState('run', RunState);
        this._AddState('pick',PickState);
        this._AddState('walkb',WalkBackState);
        this._AddState('throw',ThrowState);
    }
}

export default CharacterFSM;
