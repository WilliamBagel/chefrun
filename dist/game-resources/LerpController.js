class LerpController {
  constructor(object, mode) {
    this.object = object;
    this.mode = mode;
    this.lastFrames = 0;
    this.currentFrames = 0;

    if (mode == 'b') this.targets = [];
  }
  setTarget(target, target2) {
    console.log(this.currentFrames);
    let tmpTarget = this.target;
    if (this.target || this.targets && this.targets.length > 0) {
      if (this.mode == 'p' || 'b') {
        if (this.mode == 'b') tmpTarget = this.targets[0];
        this.object.position.copy(tmpTarget);
      }
      if (this.mode == 'q' || 'b') {
        if (this.mode == 'b') tmpTarget = this.targets[1];
        this.object.quaternion.copy(tmpTarget);
      }
    }
    if (this.mode == 'b') {
      this.targets = [target, target2];
    } else this.target = target;
    this.lastFrames = this.currentFrames;
    this.currentFrames = 0;
  }
  cancel() {
    this._killSystem = true;
  }
  step() {
    if (this.currentFrames > this.lastFrames) return;
    this.alpha = Math.min(1 / (this.lastFrames - this.currentFrames));
    if (this.mode == 'p') {
      this.object.position.lerp(this.target, this.alpha, this.object.position);
    } else if (this.mode == 'q') {
      this.object.quaternion.slerp(this.target, this.alpha, this.object.quaternion);
    }
    this.currentFrames++;
  }
}

export { LerpController };