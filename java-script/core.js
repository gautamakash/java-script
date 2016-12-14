/**
 * Core Class
 */
var System = function(_settings){
    /**
     * Create Public Variables
     */
    this.src = (_settings && _settings.src)?_settings.src:"src"; // src folder for the application
    this.lib = (_settings && _settings.lib)?_settings.lib:"java-script"; // src folder for the application
    this.__cache = {};
    
    this.debug = (_settings && _settings.debug)?_settings.debug:false; // src folder for the application
    /**
     * Public Methods
     */
    this.import = function (_filePath) {
        var _fileString = _getFile(_extractPath(_filePath, this.src), false, this);
        _fileString = _initiatePackage(_filePath, _fileString);
        _fileString = _initiateAspect(_fileString, this.lib, this);
        if(this.debug){            
            console.log(_fileString);
        }
        eval(_fileString);
    }
    
    /**
     * Private Method
     */
    var _getFile = function(_filePath, uncached, _instance){
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
        _retObj+=".js";
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
    var _initiateAspect = function( _fileString, _libPath, _instance){
        
        var _aspectString = _getFile(_libPath+"/aspect.js", false, _instance);
        
        var _aspectRegex = new RegExp("function[ ]{0,}(.*){", "");
        var _functionArr = _fileString.match(_aspectRegex);
        var _preFunctionString = _fileString.substring(0,_functionArr.index+_functionArr['0'].length);        
        var _postFunctionString = _fileString.substring(_functionArr.index+_functionArr['0'].length, _fileString.length);
        _fileString = _preFunctionString+" "+_aspectString+" "+_postFunctionString;
        return _fileString;
    }
    
}