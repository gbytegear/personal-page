class StateListenerID {
  constructor(element, state_name, on_enable, index) {
    this.element = element;
    this.state_name = state_name;
    this.on_enable = on_enable;
    this.index = index;
  }

  isExists() {
    return this.element != null && this.state_name != null && this.on_enable != null && this.index != null;
  }

  enable() {
    this.element.state_listeners[this.state_name][is_enable ? "on_enable" : "on_disable"][this.index].is_enable = true;
  }

  disable() {
    this.element.state_listeners[this.state_name][is_enable ? "on_enable" : "on_disable"][this.index].is_enable = false;
  }

  toggle() {
    this.element.state_listeners[this.state_name][is_enable ? "on_enable" : "on_disable"][this.index].is_enable = !this.element.state_listeners[this.state_name][is_enable ? "on_enable" : "on_disable"][this.index].is_enable;
  }

  call() {
    this.element.state_listeners[this.state_name][is_enable ? "on_enable" : "on_disable"][this.index].callback(this.element);
  }

  remove() {
    this.element.state_listeners[this.state_name][is_enable ? "on_enable" : "on_disable"].splice(this.index, 1);
    this.element = null;
    this.state_name = null;
    this.on_enable = null;
    this.index = null;
  }
}

HTMLElement.prototype.addStateListener = function(state_name, callback, on_enable = true) {
  if(!this.state_listeners) this.state_listeners = new Object();
  if(!this.state_listeners[state_name]) this.state_listeners[state_name] = new Object();
  if(on_enable) {
    if(!this.state_listeners[state_name].on_enable) this.state_listeners[state_name].on_enable = new Array();
    return new StateListenerID(this, state_name, true, this.state_listeners[state_name].on_enable.push({is_enable: true, callback}) - 1);
  } else {
    if(!this.state_listeners[state_name].on_disable) this.state_listeners[state_name].on_disable = new Array();
    return new StateListenerID(this, state_name, false, this.state_listeners[state_name].on_disable.push({is_enable: true, callback}) - 1);
  }
}

HTMLElement.prototype.hasState = function(state_name) { return this.classList.contains('state-' + state_name); }

HTMLElement.prototype.addState = function(state_name) {
  if(this.hasState(state_name)) return;
  this.classList.add('state-' + state_name);
  if(!this.state_listeners) return;
  else if (!this.state_listeners[state_name]) return;
  else if (!this.state_listeners[state_name].on_enable) return;
  else {
    this.state_listeners[state_name].on_enable.forEach(listener => {
      if(!listener.is_enable) return;
      else listener.callback(this);
    });
  }
}

HTMLElement.prototype.removeState = function(state_name) {
  if(!this.hasState(state_name)) return;
  this.classList.remove('state-' + state_name);
  if(!this.state_listeners) return;
  else if (!this.state_listeners[state_name]) return;
  else if (!this.state_listeners[state_name].on_disable) return;
  else {
    this.state_listeners[state_name].on_disable.forEach(listener => {
      if(!listener.is_enable) return;
      else listener.callback(this);
    });
  }
}

HTMLElement.prototype.toggleState = function(state_name) {
  if(this.hasState(state_name)) {
    this.removeState(state_name);
    return false;
  } else {
    this.addState(state_name);
    return true;
  }
}

HTMLElement.prototype.setState = function(state_name, value) {
  if(value)
    this.addState(state_name);
  else
    this.removeState(state_name);
}