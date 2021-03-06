var system = new System({
    debug: false,
    beanFactory:{
        "com.magnifyall.product.Laptop":{
            url: "data/product/{{id}}.json"
        },
        "com.magnifyall.product.Bag":{
            url: "data/product/{{id}}.json"
        }
    }
});

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
user.__render("#user-detail");
user.__render("#user-detail1", '<h2>{{name}}</h2>');
user.__render("#user-detail2", false, user.__getCurrentPath()+'.detail.html');

var laptop = system.getBean("com.magnifyall.product.Laptop", "l01");
laptop.__render("#product");