var scene;
var camera;
var renderer;
var cube;

var lastKnownScrollPosition;
var ticking;

window.onload = (event) => {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    $('body').append(renderer.domElement);
    
    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000});
    cube = new THREE.Mesh(geometry,material);
    scene.add(cube);
    
    cube.position.z = -5;
    cube.rotation.x = 10;
    cube.rotation.y = 5;
    
    renderer.render(scene,camera);
    
    var animate = function(){
    //   cube.rotation.x += 0.01;
      renderer.render(scene,camera);
      requestAnimationFrame(animate);
    }
    
    animate();


}

var goRight = (event) => {
    cube.position.x += 0.1;
}

var goLeft = (event) => {
    cube.position.x -= 0.1;
}

var goUp = (event) => {
    cube.position.y += 0.1;
}

var goDown = (event) => {
    cube.position.y -= 0.1;
}

var goClose = (event) => {
    cube.position.z += 0.1;
}

var goFar= (event) => {
    cube.position.z -= 0.1;
}


document.addEventListener('keyup', (e) => {
    console.log(e.code);
    if (e.code === "ArrowUp") {goUp(null);}
    else if (e.code === "ArrowDown") {goDown(null);}
    else if (e.code === "ArrowLeft") {goLeft(null);}
    else if (e.code === "ArrowRight") {goRight(null);}
}); 


