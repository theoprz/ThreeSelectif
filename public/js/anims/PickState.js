import State from "/static/js/State.js"


class PickState extends State {
    constructor(parent) {
        super(parent);
        this._FinishedCallback = () => {
            this._Finished();
        }
    }


    get Name() {
        return 'pick';
    }

    Enter(prevState) {
        const curAction = this._parent._proxy._animations['pick'].action;
        const mixer = curAction.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);

        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name].action;
            curAction.reset();
            curAction.setLoop(THREE.LoopOnce,1);
            curAction.clampWhenFinished = true;
            curAction.crossFadeFrom(prevAction, 0.2, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }

    _Cleanup() {
        const action = this._parent._proxy._animations['pick'].action;
        action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }

    Exit() {
        this._Cleanup();
    }

    Update(_) {
    }
}

export default PickState;
