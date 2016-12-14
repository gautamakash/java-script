/**
 * Declear Hello Class
 */
Hello = function(_msg){
    this.msg = _msg||"No Message!";
    this.greet = function(_ele){
        this.__paint(_ele, "msg");
    }
}