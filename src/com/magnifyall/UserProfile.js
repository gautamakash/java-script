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
}