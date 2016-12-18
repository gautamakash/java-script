/*
 java-script.js v0.0.0
 (c) 2016-2017 Akash Gautam . http://www.magnifyall.com
 License: MIT
*/
// Define system core package
var systems = {};
// Define System Class
var System = function(_settings){
    /**
     * Create Public Variables
     */
    // System name (unique) use to access anywhere to get specific system by systems[name]
    this.name = (_settings && _settings.name)?_settings.name:"default";
    // If system with name is already exist
    if(systems[this.name]){
        // then return system which make sure a singleton system per name
        return systems[this.name];
    }else{
        // assign system name
        systems[this.name] = this;
    }
    // Source folder where packages are store, can be relative to application or absolute path
    this.src = (_settings && _settings.src)?_settings.src:"src";
    // Java-script.js lib folder path , can be absolute or application relative
    this.lib = (_settings && _settings.lib)?_settings.lib:"java-script";
    // Default Template Extention, can be any thing like html, php, asp, htm, jsp ...
    this.templateExt = (_settings && _settings.templateExt)?_settings.templateExt:".html";
    // System Cache
    this.__cache = {};
    
    // If enable then log actual class on console
    this.debug = (_settings && _settings.debug)?_settings.debug:false;
    
    /**
     * Privat variables
     */
    
    // beanFactory configuration where {{id}} will be replace by object ID
    /**
     * Example:
     * {
        "com.magnifyall.UserProfile":{
            url: "data/user/{{id}}"
        }
     */
    this.beanConfig = (_settings && _settings.beanFactory)?_settings.beanFactory:false;
    
    /**
     * Public Methods
     */
    // Import Global function which initiate and load package in runtime and proxy the classes
    this.import = function (_filePath) {
        var _fileString = this.getFile(_extractPath(_filePath, this.src)+'.js', false, this);
        _fileString = _initiatePackage(_filePath, _fileString);
        _fileString = _initiateAspect(_fileString, this.lib, this.src, _filePath, this);
        if(this.debug){            
            console.log(_fileString);
        }
        eval(_fileString);
    };
    
    // Create new thread and execute code.
    this.run = function(_fnc){
        setTimeout(_fnc, 0);
    };
    
    // return String value from response take file path, should cache, system
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
    };
    
    // Render value in target from currentPath or template with values from instance
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
    };
    
    // Bean factory beans
    this.beans = {};
    
    // return/create Bean which is configure in beanFactory, must has package and id of pojo
    this.getBean = function(_class, _id){
        if(this.beanConfig && this.beanConfig[_class]){
            this.import(_class);
            var _beanConfig = this.beanConfig[_class];
            var _data = {};
            var _dataUrl = false;
            if(_beanConfig.url){
                _dataUrl = _beanConfig.url;
                _dataUrl = _dataUrl.replace("{{id}}", _id);
                var _dataString = this.getFile(_dataUrl, true, this);
                _data = JSON.parse(_dataString);
                _data.__url = _dataUrl;
            }
            if(_dataUrl && this.beans[_dataUrl]){
                return this.beans[_dataUrl];
            }else if(this.beans[_class+'_'+_id]){
                return this.beans[_class+'_'+_id];
            }
            var _classObj = window;
            var _classArr = _class.split('.');
            for(var _classI = 0; _classI < _classArr.length; _classI++){
                _classObj = _classObj[_classArr[_classI]];
            }
            var _bean = new _classObj(_data);
            if(_dataUrl){
                this.beans[_dataUrl] = _bean;
            }else{
                this.beans[_class+'_'+_id] = _bean;
            }
            return _bean;
        }
    };
    
    /**
     * Private Method
     */
    
    // Extract and return path from package
    var _extractPath = function(_filePath, _basePath){
        var _fileArr = _filePath.split('.');
        var _retObj = _basePath;
        for(var _fileArrI = 0; _fileArrI < _fileArr.length; _fileArrI++){
            _retObj+= "/"+_fileArr[_fileArrI];
        }
        return _retObj;
    };
    
    // create package and update package in string class defination
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
    };
    
    // Update String function with Aspects
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
    }; 
}