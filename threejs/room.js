var scene;
var camera;
var renderer;

const floorTex = "Textures/wood.jpg";
const wallTex = "Textures/wall2.jpg";
var floor_width = 600;
var floor_height = 400;
var wall_height = 250;
var controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(1, 0,1); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;
var moveableObjects=[];
var lightCube;
var light;
window.onload = (event) => {
  init();
  [light,lightCube]= addLighting(0xE1C16E);
  
  createScene();
  setDraggingActions();
  animate();

};

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("body").append(renderer.domElement);

  camera.position.y = 400;
  camera.position.z = 600;
  camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;
  
}
function setDraggingActions(){
  var dragControls = new THREE.DragControls(moveableObjects, camera, renderer.domElement);
  
  dragControls.addEventListener( 'dragstart', function ( event ) {
    controls.enabled = false;
	  //event.object.material.emissive =  0xaaaaaa ;

} );

dragControls.addEventListener( 'dragend', function ( event ) {
  controls.enabled = true;
	 event.object.material.emissive=  0x000000;
  light.position.set(lightCube.position.x,lightCube.position.y,lightCube.position.z);
} );
  
}

function addLighting(color){
  const geometry = new THREE.SphereGeometry(25, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color:color });
  var lightCube = new THREE.Mesh(geometry, material);
  lightCube.position.y = 350;

  scene.add( lightCube );
  const light = new THREE.SpotLight( color,1.5,1000,90 * Math.PI /180);
  light.position.set( 0, 350, 0);
  scene.add( light );
  moveableObjects.push(lightCube);
  return [light,lightCube];
}

function createScene() {
  var floor = createWallFloor(
    scene,
    [0, 0, 0],
    [90, 0],
    floor_width,
    floor_height,
    floorTex,
    true
  );
  var wall = createWallFloor(
    scene,
    [0, wall_height / 2, -floor_height / 2],
    [0, 180],
    floor_width,
    wall_height,
    wallTex
  );
  var wall2 = createWallFloor(
    scene,
    [-floor_width / 2, wall_height / 2, 0],
    [0, 90],
    floor_height,
    wall_height,
    wallTex
  );
  
}

function createWallFloor(
  scene,
  [x, y, z],
  [xAngle, yAngle],
  width,
  height,
  textureImg,
  ligthed
) {
  const geometry = new THREE.BoxGeometry(width, height, 5);
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("");
  const texture =  textureLoader.load(textureImg);
  const material = ligthed?new THREE.MeshStandardMaterial({ map: texture }):new THREE.MeshBasicMaterial({map:texture});
  const WallFloor = new THREE.Mesh(geometry, material);
  scene.add(WallFloor);
  WallFloor.position.z = z;
  WallFloor.position.y = y;
  WallFloor.position.x = x;
  WallFloor.rotation.x = (xAngle * Math.PI) / 180;
  WallFloor.rotation.y = (yAngle * Math.PI) / 180;
  return WallFloor;
}
