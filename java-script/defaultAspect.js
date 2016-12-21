/*
 java-script.js v0.0.0
 (c) 2016-2017 Akash Gautam . http://www.magnifyall.com
 License: MIT
*/
// binded dom object
this.__bind = [];
// paint and bind dom with data
this.__paint = function(_ele, _key){
    var _keyArr = _key.split(".");
    var _value = this[_keyArr[0]];
    for(var _keyI = 1; _keyI< _keyArr.length; _keyI++){
        _value = _value[_keyArr[_keyI]];
    }
    if(_ele && _ele.innerHTML !== undefined){
        _ele.innerHTML = _value;
        var _bindObj = {"ele": _ele, "key": _key};
        this.__bind.push(_bindObj);
    }
}
// trigger update to object and trigger change event to subscriber
this.__update = function(){
    for(var _bindI = 0; _bindI < this.__bind.length; _bindI++){
        var _bind = this.__bind[_bindI];
        var _key = _bind.key;
        var _ele = _bind.ele;
        var _keyArr = _key.split(".");
        var _value = this[_keyArr[0]];
        for(var _keyI = 1; _keyI< _keyArr.length; _keyI++){
            _value = _value[_keyArr[_keyI]];
        }
        if(_ele && _ele.innerHTML !== undefined){
            _ele.innerHTML = _value;
        }
    }
    _change(this);
}

// triger update te reload template import
this.__reRender = function(){
    this.__bind.splice(0,this.__bind.length);
    if(__render_selector){
        if(__render_template || __render_templateUrl){
            this.__render(__render_selector, __render_template, __render_templateUrl);
        }else{
            this.__render(__render_selector);
        }
    }
}
var __render_selector = false;
var __render_template = false;
var __render_templateUrl = false;
// instance 
var _instance = this;

// Render template
this.__render=function(_selector, _template, _templateUrl){
    __render_selector = _selector;
    __render_template = _template;
    __render_templateUrl = _templateUrl;
    if(!_template && _templateUrl){
        _template = systems[_system].getFile(_templateUrl, false, systems[_system]);
    }
    var _target = document.querySelector(_selector);
    if(_target && _target.innerHTML !== undefined){
        systems[_system].processTemplate(_target, _currentPath, _template, this);
    }
}
// get systems
this.__getSystem = function(){
    return systems[_system];
}
// get data current path
this.__getCurrentPath = function(){
    return _currentPath;
}
// listners, subscribers
var _onChangeListners = {};
// Method to subscribe with unique id
this.subscribe = function(_id, _fnc){
    _onChangeListners[_id] = _fnc;
}
// unsubscribe unique id
this.unsubscribe = function(_id){
    delete _onChangeListners[_id];
}
// trigger change events to subscriber
var _change = function(_objectInstance){
    for(var _listner in _onChangeListners){
        _onChangeListners[_listner](_objectInstance);
    }
}
// serialize object
this.serialize = function(){
    var _localInstance = JSON.parse(JSON.stringify(this));
    delete _localInstance.__bind;
    return JSON.stringify(_localInstance);
}
// check if value(serialize) are equal
this.equal = function(_ele){
    return (this.serialize() === _ele.serialize());
}
