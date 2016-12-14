var system = new System({debug: false});

system.import("com.magnifyall.Hello");

var hello = new com.magnifyall.Hello("Hello Akash Gautam!");

hello.greet(document.getElementById("greeting"));

system.import("com.magnifyall.UserProfile");

var user = new com.magnifyall.UserProfile({
    name: "Akash Gautam",
    dob: "27 Nov",
    address: {
        street: "10 Magical Street",
        city: "Wonder Land",
        country: "Earth United"
    }
});
user.render("#user-detail");