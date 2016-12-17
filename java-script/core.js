/**
 * Core Class
 */
var systems = {};
var System = function(_settings){
    /**
     * Create Public Variables
     */
    this.name = (_settings && _settings.name)?_settings.name:"default"; // System Name
    if(systems[this.name]){
        return systems[this.name];
    }else{
        systems[this.name] = this;
    }
    this.src = (_settings && _settings.src)?_settings.src:"src"; // src folder for the application
    this.lib = (_settings && _settings.lib)?_settings.lib:"java-script"; // src folder for the application
    this.templateExt = (_settings && _settings.templateExt)?_settings.templateExt:".html"; // src folder for the application
    this.__cache = {};
    
    this.debug = (_settings && _settings.debug)?_settings.debug:false; // src folder for the application
    /**
     * Public Methods
     */
    this.import = function (_filePath) {
        var _fileString = this.getFile(_extractPath(_filePath, this.src)+'.js', false, this);
        _fileString = _initiatePackage(_filePath, _fileString);
        _fileString = _initiateAspect(_fileString, this.lib, this.src, _filePath, this);
        if(this.debug){            
            console.log(_fileString);
        }
        eval(_fileString);
    }
    
    this.run = function(_fnc){
        setTimeout(_fnc, 0);
    }
    
    /**
     * Private Method
     */
    this.getFile = function(_filePath, uncached, _instance){
        var _returnString = "";
        if(!uncached && _instance.__cache[_filePath]){
            _returnString = _instance.__cache[_filePath];
        }else{
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    _returnString =  this.responseText;
                }
            };
            xhttp.open("GET", _filePath, false);
            xhttp.send();
            if(!uncached){
                _instance.__cache[_filePath] = _returnString;
            }
        }
        return _returnString;
    }
    var _extractPath = function(_filePath, _basePath){
        var _fileArr = _filePath.split('.');
        var _retObj = _basePath;
        for(var _fileArrI = 0; _fileArrI < _fileArr.length; _fileArrI++){
            _retObj+= "/"+_fileArr[_fileArrI];
        }
        return _retObj;
    }
    var _initiatePackage = function(_filePath, _fileString){
        var _fileArr = _filePath.split('.');
        var _baseObj = window;
        var _className = "";
        for(var _fileArrI = 0; _fileArrI < _fileArr.length; _fileArrI++){
            if(_fileArr.length>1 && _fileArrI < _fileArr.length-1){
                _baseObj[_fileArr[_fileArrI]] = _baseObj[_fileArr[_fileArrI]] || {};
                _baseObj = _baseObj[_fileArr[_fileArrI]];
            }else{
                _className = _fileArr[_fileArrI];
            }            
        }
        var _methodRegEx = new RegExp(_className+"[ ]{0,}=", "g");
        _fileString = _fileString.replace(_methodRegEx, _filePath+" =");
        
        return _fileString;
    }
    var _initiateAspect = function( _fileString, _libPath, _basePath, _filePath, _instance){
        
        var _aspectString = _instance.getFile(_libPath+"/defaultAspect.js", false, _instance);
        var _currentPackage = _filePath;
        var _currentPath = _extractPath(_filePath, _basePath);
        _aspectString += ' var _currentPackage = "'+_currentPackage+'"; ';
        _aspectString += ' var _currentPath = "'+_currentPath+'"; ';
        _aspectString += ' var _system = "'+_instance.name+'"; ';
        var _aspectRegex = new RegExp("function[ ]{0,}(.*){", "");
        var _functionArr = _fileString.match(_aspectRegex);
        var _preFunctionString = _fileString.substring(0,_functionArr.index+_functionArr['0'].length);        
        var _postFunctionString = _fileString.substring(_functionArr.index+_functionArr['0'].length, _fileString.length);
        _fileString = _preFunctionString+" "+_aspectString+" "+_postFunctionString;
        return _fileString;
    }
    this.processTemplate = function(_target, _currentPath, _template, _instance){
        var templateStr = "";
        try{
            if(_template){
                templateStr = _template;
            }else{
                templateStr=this.getFile(_currentPath+this.templateExt, false, this);
            }
        }catch(e){
            console.error(e);
        }
        var _variables = {};
        templateStr = templateStr.replace(/{{[a-zA-z-.]{0,}}}/g, function(all) {
            var _key = all.split("{{")[1].split("}}")[0];
            /*var _keyArr = _key.split(".");
            var _value = _instance[_keyArr[0]];
            for(var _keyI = 1; _keyI< _keyArr.length; _keyI++){
                _value = _value[_keyArr[_keyI]];
            }
            return _value;*/
            var _keyClass = _key.replace(/\./g, '_');
            var _placeholder = '<span data-system-bind="'+_key+'" class="'+_keyClass+'"></span>';
            _variables[_keyClass]=_key;
            return _placeholder;
        });
        //console.log(_variables);
        //console.log(templateStr);
        _target.innerHTML = templateStr;
        for(var _key in _variables){
            var _bindEles = document.querySelectorAll('.'+_key);
            for(var _bindI = 0; _bindI< _bindEles.length; _bindI++){
                _instance.__paint(_bindEles[_bindI], _variables[_key]);
            }
        }
    }
}