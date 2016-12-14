/**
 * Class Decleration
 */
UserProfile = function(_config){
    this.name = _config.name || "";
    this.dob = _config.dob || "";
    this.address = _config.address || {
        street: "",
        city: "",
        country: ""
    };
    this.render = function(_selector){
        this.__paint(document.querySelector(_selector+" .user-name"), "name");
        this.__paint(document.querySelector(_selector+" .user-dob"), "dob");
        this.__paint(document.querySelector(_selector+" .user-address-street"), "address.street");
        this.__paint(document.querySelector(_selector+" .user-address-city"), "address.city");
        this.__paint(document.querySelector(_selector+" .user-address-country"), "address.country");
    };
}