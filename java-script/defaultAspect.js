this.__bind = [];
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
}
var _instance = this;
this.__render=function(_selector, _template, _templateUrl){
    if(!_template && _templateUrl){
        _template = systems[_system].getFile(_templateUrl, false, systems[_system]);
    }
    var _target = document.querySelector(_selector);
    if(_target && _target.innerHTML !== undefined){
        systems[_system].processTemplate(_target, _currentPath, _template, this);
    }
}
this.__getCurrentPath = function(){
    return _currentPath;
}
this.serialize = function(){
    var _localInstance = JSON.parse(JSON.stringify(this));
    delete _localInstance.__bind;
    return JSON.stringify(_localInstance);
}
this.equal = function(_ele){
    return (this.serialize() === _ele.serialize());
}
