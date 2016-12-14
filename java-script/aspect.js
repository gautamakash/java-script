this.__bind = [];
this.__paint = function(_ele, _key){
    var _keyArr = _key.split(".");
    var _value = this[_keyArr[0]];
    for(var _keyI = 1; _keyI< _keyArr.length; _keyI++){
        _value = _value[_keyArr[_keyI]];
    }
    if(_ele && isset(_ele.innerHTML)){
        _ele.innerHTML = _value;
        var _bindObj = {"ele": _ele, "key": _key};
        this.__bind.push(_bindObj);
    }
}