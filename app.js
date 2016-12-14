var system = new System({debug: false});

system.import("com.magnifyall.Hello");

var hello = new com.magnifyall.Hello("Hello Akash Gautam!");

hello.greet(document.getElementById("greeting"));