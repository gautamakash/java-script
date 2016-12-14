/**
 * Declear Hello Class
 */
Hello = function(_msg){
    this.msg = _msg||"No Message!";
    this.greet = function(){
        return "Hello "+this.msg+"!";
    }
}