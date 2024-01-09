
class Toolbar {
  constructor(world) {
    this.world = world;
    this.canSwitch = true;
    this._tools = {};
    this._cooldown = 0.5;
    this._cameraLocked = false;
    this._inputEventListeners = []

    this.world.addInputEventListener("**",this.onInputEvent)
  }
  addTool(name, tool) {
    this._tools[name] = tool;
    tool.toolbar = this
    if(tool.init)tool.init()
    let toolIELs = []
    console.log(tool._inputEventListeners)
    tool._inputEventListeners.forEach(({key,callback})=>{
      if(key.length > 1) return this.world.addInputEventListener(key,(event)=>{
        event.key = key
        if(tool._enabled == false)return
        callback(event);
      })
      toolIELs.push({key,callback,tool})
    })
    this._inputEventListeners = this._inputEventListeners.concat(toolIELs)
  }
  toggleTool(toolname) {
    for (let name in this._tools) {
        if(name == toolname){
          this._tools[name].toggle()
        }else{
          this._tools[name].disable()
        }
      }
  }
  setCameraLock(bool){
    this._cameraLocked = bool
    if(bool)document.exitPointerLock()
  }
  onInputEvent(event){
    let obj;
    for(let i in this._inputEventListeners){
      obj = this._inputEventListeners[i]
      if(obj.tool._enabled == false)continue
      if(obj.key == event.key)obj.callback(event);
    }
  }
  activeCooldown() {
    this.canSwitch = false;
    setTimeout(() => {
      this.canSwitch = true;
    }, this._cooldown*1000);
  }
  step(ms) {
    let tool, newTool;
    if (this.canSwitch) {
      for (let name in this._tools) {
        tool = this._tools[name];
        if (tool.shouldEnable(this.world.InputTable)) newTool = name;
      }
      if (newTool != null) {
        this.toggleTool(newTool);
        this.activeCooldown()
      }
    }
    for (let i in this._tools) {
      tool = this._tools[i];
      tool.step(ms);
    }
  }
}
export {Toolbar}