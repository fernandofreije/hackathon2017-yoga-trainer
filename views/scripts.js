var data;
var first = true;
var game_started = false;
var lastPetition;
var image_background;

function setup() {
    image_background = loadImage('sunset.jpg');
    createCanvas(windowWidth, windowHeight);
    $('#defaultCanvas0').hide();
    $('#postura1').hide();
}

ws_movement = new WebSocket('wss://c0ff33.eu-gb.mybluemix.net/kinect');
ws_hand = new WebSocket('wss://c0ff33.eu-gb.mybluemix.net/kinect/hand');

ws_movement.onmessage = function (event) {
    if (first) show_game();
    data = JSON.parse(event.data).user[0];
}

ws_hand.onmessage = function (event) {
    if (event.data == 'right' && !game_started) start();
}

function show_game() {
    $('#welcome').hide();
    $('#defaultCanvas0').show();
    $('#errors').text('Put your right hand up to start');
    first = false;
}

function start() {
    $('#errors').text('Imitate the figure');
    show_example(movements[0]);
    game_started = true;
}

var counter = 0;
var index = 0;
var movements = ['silla', 'guerrero', 'perro'];
function show_example(name) {
    image_background = loadImage(name + '.jpg');
    setTimeout(function () {
        $.ajax({
            type: 'post',
            url: 'http://c0ff33.eu-gb.mybluemix.net/is_position_ok',
            data: {
                position: name,
                user: (counter < 3) ? data : null
            },
            complete: function (response) {
                response = response.responseText;
                if (response !== '') {
                    console.log(counter);
                    $('#errors').text('Your ' + response + ' is wrong');
                    show_example(name);
                    counter++;
                } else {
                   end_game();

                }
            }
        });
    }, 3000);

}

function end_game() {    
    $('#errors').text('');
    $('#info').text('');
    $('#empezamos').text('Entrenamiento completado');
    $('#welcome').show();
    $('#defaultCanvas0').hide();
}

function send_position() {

}




var listaNodos = [];
var edges = [];

function draw() {
    background(image_background);
    if (data) {
        for (part of data.bodyParts) {
            const p = [part.positions[0].x, part.positions[0].y];
            const user_part_point = [
                map(p[0], -1, 1, 100, windowWidth, true),
                map(p[1], 1, -1, 100, windowHeight, true)
            ];
            var node = new Node(user_part_point[0], user_part_point[1], part.name);
            listaNodos.push(node);
            /*text(
                part.name,
                user_part_point[0],
                user_part_point[1],
            );
            ellipse(
                user_part_point[0],
                user_part_point[1],
                10,
                10
            );*/
        }
        for (nodo of listaNodos) {
            nodo.draw();
        } 
        for (nodo of listaNodos) {
            if (nodo.getName().name === 'Head') {
                new Edge(listaNodos.find(node => node.getName().name === "Neck"), nodo).draw();
            } if (nodo.getName().name === "Neck") {
                new Edge(listaNodos.find(node => node.getName().name === "SpineShoulder"), nodo).draw();
            } if (nodo.getName().name === "SpineShoulder") {
                new Edge(listaNodos.find(node => node.getName().name === "ShoulderRight"), nodo).draw();
                new Edge(listaNodos.find(node => node.getName().name === "ShoulderLeft"), nodo).draw();
            } if (nodo.getName().name === "ShoulderRight") {
                new Edge(listaNodos.find(node => node.getName().name === "ElbowRight"), nodo).draw();
            } if (nodo.getName().name==="ShoulderLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "ElbowLeft"), nodo).draw();
            } if (nodo.getName().name==="ElbowRight") {
                new Edge(listaNodos.find(node => node.getName().name === "WristRight"), nodo).draw();
            } if (nodo.getName().name==="ElbowLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "WristLeft"), nodo).draw();
            } if (nodo.getName().name==="WristRight") {
                new Edge(listaNodos.find(node => node.getName().name === "HandRight"), nodo).draw();
            } if (nodo.getName().name==="WristLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "HandLeft"), nodo).draw();
            } if (nodo.getName().name==="HandRight") {
                new Edge(listaNodos.find(node => node.getName().name === "ThumbRight"), nodo).draw();
                new Edge(listaNodos.find(node => node.getName().name === "HandTipRight"), nodo).draw();
            } if (nodo.getName().name==="HandLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "ThumbLeft"), nodo).draw();
                new Edge(listaNodos.find(node => node.getName().name === "HandTipLeft"), nodo).draw();
            } if (nodo.getName().name==="SpineMid") {
                new Edge(listaNodos.find(node => node.getName().name === "SpineBase"), nodo).draw();
                new Edge(listaNodos.find(node => node.getName().name === "SpineShoulder"), nodo).draw();
            } if (nodo.getName().name==="SpineBase") {
                new Edge(listaNodos.find(node => node.getName().name === "HipRight"), nodo).draw();
                new Edge(listaNodos.find(node => node.getName().name === "HipLeft"), nodo).draw();
            } if (nodo.getName().name==="HipRight") {
                new Edge(listaNodos.find(node => node.getName().name === "KneeRight"), nodo).draw();
            } if (nodo.getName().name==="HipLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "KneeLeft"), nodo).draw();
            } if (nodo.getName().name==="KneeRight") {
                new Edge(listaNodos.find(node => node.getName().name === "AnkleRight"), nodo).draw();
            } if (nodo.getName().name==="KneeLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "AnkleLeft"), nodo).draw();
            } if (nodo.getName().name==="AnkleRight") {
                new Edge(listaNodos.find(node => node.getName().name === "FootRight"), nodo).draw();
            } if (nodo.getName().name==="AnkleLeft") {
                new Edge(listaNodos.find(node => node.getName().name === "FootLeft"), nodo).draw();
            }
        }
     
        listaNodos = [];
    }
}

class Node {
    constructor(x, y, nombre) {
        this.setLocation(x, y);
        this.setName(nombre);
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    getLocation() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    setName(nombre) {
        this.name = nombre;
    }

    getName() {
        return{
            name: this.name
        };
    }

    draw() {
        ellipse(this.getLocation().x, this.getLocation().y, 10, 10);
        fill('#c0cbdb');
    }
}

class Edge {
    constructor(startNode = null, endNode = null) {
        this.start = startNode;
        this.end = endNode;
    }

    getNodes() {
        return {
            start: this.start,
            end: this.end,
        };
    }

    draw() {
        line(this.getNodes().start.x, this.getNodes().start.y
            , this.getNodes().end.x, this.getNodes().end.y,
        );
        stroke('#c0cbdb');
        fill('#c0cbdb');
    }

    setStarting(startNode) {
        this.start = startNode;
    }

    setEnding(endingNode) {
        this.end = endingNode;
    }
}
