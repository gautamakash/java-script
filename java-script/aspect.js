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