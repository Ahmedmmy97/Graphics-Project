import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/FBXLoader.js'
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js'
import {DragControls} from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/DragControls.js'
import {Chair} from './Chair.js';
var scene;
var camera;
var renderer;

const floorTex = "Textures/wood.jpg";
const wallTex = "Textures/wall2.jpg";
const chairTex = "Textures/chair2.jpg"
var floor_width = 600;
var floor_height = 400;
var wall_height = 250;
var l = 10;
var x =-1;
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
var objects = [];
window.onload = (event) => {
  init();
  [light,lightCube]= addLighting(0xE1C16E);
 

  createScene();
  setDraggingActions();
  animate();

};

function animate() {
  controls.update();
  animateLight();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
}
function animateLight(){
  lightCube.rotation.y += (2 * Math.PI) / 180;
 
  if(l>360)
    x=-1;
  if(l<0)
    x=1;
  l+=x;
  lightCube.position.x += Math.sin(l* Math.PI/ 180)*4 ;

  light.position.set(lightCube.position.x,lightCube.position.y,lightCube.position.z); 
  light.rotation.set(lightCube.rotation.x,lightCube.rotation.y,lightCube.rotation.z); 
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
  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;
  
}
function setDraggingActions(){
  var dragControls = new DragControls(moveableObjects, camera, renderer.domElement);
  
  dragControls.addEventListener( 'dragstart', function ( event ) {
    controls.enabled = false;
	  //event.object.material.emissive =  0xaaaaaa ;

} );

dragControls.addEventListener( 'dragend', function ( event ) {
  controls.enabled = true;
	//event.object.material.emissive=  0x000000;
  controlOutOfBounds(event);
} );
  
}
function controlOutOfBounds(event){
  if(event.object.position.y<event.object.geometry.parameters.height/2 *event.object.scale.y -2.5)
   event.object.position.y = event.object.geometry.parameters.height/2 *event.object.scale.y -2.5;
   if(event.object.position.y>wall_height -event.object.geometry.parameters.height/2 *event.object.scale.y)
   event.object.position.y =wall_height -event.object.geometry.parameters.height/2 *event.object.scale.y;
  if(event.object.position.z<event.object.geometry.parameters.depth/2 *event.object.scale.z - floor_height/2)
  event.object.position.z = event.object.geometry.parameters.depth/2 *event.object.scale.z - floor_height/2;
  if(event.object.position.z>floor_height/2 -event.object.geometry.parameters.depth/2 *event.object.scale.z )
  event.object.position.z = floor_height/2 -event.object.geometry.parameters.depth/2 *event.object.scale.z;
  if(event.object.position.x<event.object.geometry.parameters.width/2 *event.object.scale.x - floor_width/2)
  event.object.position.x = event.object.geometry.parameters.depth/2 *event.object.scale.x - floor_width/2;
  if(event.object.position.x>floor_width/2 -event.object.geometry.parameters.width/2 *event.object.scale.x )
  event.object.position.x = floor_width/2 -event.object.geometry.parameters.width/2 *event.object.scale.x;
}
function addLighting(color){
  const geometry = new THREE.SphereGeometry(25, 32, 16);
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("");
  const texture =  textureLoader.load("Textures/tiles.jpg");
  const material = new THREE.MeshBasicMaterial({ map:texture,color: color});
  var lightCube = new THREE.Mesh(geometry, material);
  lightCube.position.y = 350;
  
  scene.add( lightCube );
  const light = new THREE.PointLight( color,2);
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
  var chair =  new Chair(55,55,7,[0,2.5 + 55,0],chairTex);
  var chairObj= chair.create();
  scene.add(chairObj);
  moveableObjects.push(chairObj);
  createTable();
}
function createTable(){
  const fbxLoader = new FBXLoader()
  fbxLoader.load(
      'Textures/table.fbx',
      (object) => {
          
           
           var geometry = new THREE.BoxGeometry(270, 270, 270);
          
          var material = new THREE.MeshStandardMaterial({
              
              opacity: 0.0,
              transparent: true,
            });
          var group = new THREE.Mesh(geometry, material);
           
           group.add(object.children[1]);
           group.add(object.children[1]);
           group.scale.set(0.5,0.5,0.5);
           group.children[1].position.y = group.children[1].position.y - 270/2
           group.children[0].position.y = group.children[0].position.y - 270/2
           group.position.y = 270/4
           group.position.x = floor_width/2 - group.geometry.parameters.width/2;
          scene.add(group)
          moveableObjects.push(group)
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
          console.log(error)
      }
  )
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
