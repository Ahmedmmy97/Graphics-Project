import * as THREE from "./common/three.js";
import { FBXLoader } from "./common/FBXLoader.js";
import { OrbitControls } from "./common/OrbitControls.js";
import { DragControls } from "./common/DragControls.js";
import { Chair } from "./Objects/Chair.js";
import { Bed } from "./Objects/Bed.js";
var scene;
var camera;
var renderer;

const floorTex = "Textures/wood.jpg";
const wallTex = "Textures/wall2.jpg";
const chairTex = "Textures/chair2.jpg";
const bedTex = "Textures/chair3.jpg";
var floor_width = 1000;
var floor_height = 1000;
var wall_height = 400;
var l = 10;
var x = -1;
var controls;
var dragControls;
var raycaster = new THREE.Raycaster();
var scaleSlider;
var rotationMode = false;
var selected;
var moveableObjects = [];
var Objects = [];
var lightCube;
var light;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var slowingFactor = 0.025;
var selectionColor = { r: 69, g: 72, b: 81 };
window.onload = () => {
  init();

  [light, lightCube] = addLighting(0xe1c16e);

  setUiAndEvents();
  createScene();
  setDraggingActions();
  clearSelected();
  animate();
};
function setUiAndEvents() {
  document.addEventListener("mousedown", onDocumentMouseDown);
  document.addEventListener("touchstart", onDocumentMouseDown);
  var button = document.getElementById("Rotation");
  button.onclick = function () {
    rotationMode = !rotationMode;
    setRotationMode(button);
  };
  document.getElementById("Chair").onclick = function () {
    createChair();
  };
  document.getElementById("Bed").onclick = function () {
    createBed();
  };
  document.getElementById("Table").onclick = function () {
    createTable();
  };
  document.getElementById("Delete").onclick = function () {
    if (selected != null) {
      scene.remove(selected);

      moveableObjects = moveableObjects.filter((element) => {
        return element != selected;
      });
      Objects = Objects.filter((element) => {
        return element != selected;
      });

      clearSelected();
    }
    setDraggingActions();
  };
  document.getElementById("Red").onclick = function () {
    console.log(selected);
    if (selected != null) {
      selected.children.forEach((element) => {
        element.material.color = { r: 30, g: 0, b: 0 };
        clearSelected();
      });
    }
  };
  document.getElementById("Green").onclick = function () {
    console.log(selected);
    if (selected != null) {
      selected.children.forEach((element) => {
        element.material.color = { r: 0, g: 30, b: 0 };
        clearSelected();
      });
    }
  };
  document.getElementById("Blue").onclick = function () {
    console.log(selected);
    if (selected != null) {
      selected.children.forEach((element) => {
        element.material.color = { r: 0, g: 0, b: 30 };
        clearSelected();
      });
    }
  };
  document.getElementById("Default").onclick = function () {
    console.log(selected);
    if (selected != null) {
      selected.children.forEach((element) => {
        try {
          element.material = [
            new THREE.MeshStandardMaterial({ map: element.material[0].map }),
            new THREE.MeshStandardMaterial({ map: element.material[1].map }),
          ];
        } catch {
          element.material = new THREE.MeshStandardMaterial({
            map: element.material.map,
          });
        }
        // element.material = new THREE.MeshStandardMaterial({ map: element.material.map });
      });
      clearSelected();
    }
  };
  scaleSlider = document.getElementById("scale");
  scaleSlider.oninput = function (event) {
    var value = event.target.value / 5;
    if (selected != null) {
      selected.scale.set(value, value, value);
      controlOutOfBounds(selected);
    }
  };
}
function setRotationMode(button) {
  if (rotationMode) {
    dragControls.enabled = false;
    button.style.background = "#FA2C01";
    button.style.boxShadow = "inset 1px 1px 10px #333";
    button.style.margin = "20px 10px";
    button.style.padding = "25px";
    button.style.borderRadius = "25px";
  } else {
    dragControls.enabled = true;
    button.style.background = "#FCFCFC";
    button.style.boxShadow = "";
    button.style.margin = "20px 10px";
    button.style.padding = "25px";
    button.style.borderRadius = "25px";
  }
}
function onDocumentMouseDown(event) {
  //event.preventDefault();
  //controls.enabled = false;
  document.addEventListener("mouseup", onDocumentMouseUp, false);
  document.addEventListener("touchend", onDocumentMouseUp,false);
  var coord;
  if(event.type == "touchstart"){
    coord = event.changedTouches[0];
  }else{
    coord = event;
  }
  var mouse3D = new THREE.Vector3(
    (coord.clientX / window.innerWidth) * 2 - 1,
    -(coord.clientY / window.innerHeight) * 2 + 1,
    coord.clientZ
  );
  raycaster.setFromCamera(mouse3D, camera);
  var intersects = raycaster.intersectObjects(Objects);

  if (intersects.length > 0) {
    if (moveableObjects.includes(intersects[0].object)) {
      if (rotationMode) {
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("touchmove", onDocumentMouseMove, false);
        mouseXOnMouseDown = coord.clientX - windowHalfX;

        mouseYOnMouseDown = coord.clientY - windowHalfY;
        controls.enabled = false;
      }

      

      selectObject(intersects[0].object);
    } else {
      clearSelected();
    }
  }
}
function onDocumentMouseMove(event) {
  var coord;
  if(event.type == "touchmove"){
    coord = event.changedTouches[0];
  }else{
    coord = event;
  }
  mouseX = coord.clientX - windowHalfX;

  selected.rotation.y = (mouseX - mouseXOnMouseDown) * slowingFactor;

  /*mouseY = event.clientY - windowHalfY;

  selected.rotation.y = ( mouseY - mouseYOnMouseDown ) *slowingFactor ;*/
}

function onDocumentMouseUp(event) {
  //event.preventDefault();
  if (rotationMode) dragControls.enabled = false;
  else dragControls.enabled = true;
  controls.enabled = true;

  document.removeEventListener("mousemove", onDocumentMouseMove, false);
  document.removeEventListener("mouseup", onDocumentMouseUp, false);
  document.removeEventListener("touchmove", onDocumentMouseMove, false);
  document.removeEventListener("touchend", onDocumentMouseUp, false);
}
function selectObject(object) {
  clearSelected();
  object.children.forEach((element) => {
    element.material.emissive = selectionColor;
  });

  selected = object;
  scaleSlider.disabled = false;
  scaleSlider.value = object.scale.x * 5;
}
function clearSelected() {
  if (selected != null) {
    selected.children.forEach((element) => {
      element.material.emissive = { r: 0, g: 0, b: 0 };
    });
  }
  selected = null;
  scaleSlider.disabled = true;
  scaleSlider.value = 5;
}
function animate() {
  controls.update();
  animateLight();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
function animateLight() {
  lightCube.rotation.y += (2 * Math.PI) / 180;

  if (l > 360) x = -1;
  if (l < 0) x = 1;
  l += x;
  lightCube.position.x += Math.sin((l * Math.PI) / 180) * 4;

  light.position.set(
    lightCube.position.x,
    lightCube.position.y,
    lightCube.position.z
  );
  light.rotation.set(
    lightCube.rotation.x,
    lightCube.rotation.y,
    lightCube.rotation.z
  );
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

  camera.position.y = 900;
  camera.position.z = 1000;
  camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  controls = new OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;
}
function setDraggingActions() {
  dragControls = new DragControls(moveableObjects, camera, renderer.domElement);

  dragControls.addEventListener("dragstart", function () {
    controls.enabled = false;
    //event.object.material.emissive =  0xaaaaaa ;
  });

  dragControls.addEventListener("dragend", function (event) {
    controls.enabled = true;
    //event.object.material.emissive=  0x000000;
    controlOutOfBounds(event.object);
  });
}
function controlOutOfBounds(object) {
  if (
    object.position.y <
    (object.geometry.parameters.height / 2) * object.scale.y - 2.5
  )
    object.position.y =
      (object.geometry.parameters.height / 2) * object.scale.y - 2.5;
  if (
    object.position.y >
    wall_height - (object.geometry.parameters.height / 2) * object.scale.y
  )
    object.position.y =
      wall_height - (object.geometry.parameters.height / 2) * object.scale.y;
  if (
    object.position.z <
    (object.geometry.parameters.depth / 2) * object.scale.z - floor_height / 2
  )
    object.position.z =
      (object.geometry.parameters.depth / 2) * object.scale.z -
      floor_height / 2;
  if (
    object.position.z >
    floor_height / 2 - (object.geometry.parameters.depth / 2) * object.scale.z
  )
    object.position.z =
      floor_height / 2 -
      (object.geometry.parameters.depth / 2) * object.scale.z;
  if (
    object.position.x <
    (object.geometry.parameters.width / 2) * object.scale.x - floor_width / 2
  )
    object.position.x =
      (object.geometry.parameters.depth / 2) * object.scale.x - floor_width / 2;
  if (
    object.position.x >
    floor_width / 2 - (object.geometry.parameters.width / 2) * object.scale.x
  )
    object.position.x =
      floor_width / 2 - (object.geometry.parameters.width / 2) * object.scale.x;
}
function addLighting(color) {
  const geometry = new THREE.SphereGeometry(50, 32, 16);
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("");
  const texture = textureLoader.load("Textures/tiles.jpg");
  const material = new THREE.MeshBasicMaterial({ map: texture, color: color });
  var lightCube = new THREE.Mesh(geometry, material);
  lightCube.position.y = wall_height;

  scene.add(lightCube);
  const light = new THREE.PointLight(color, 2);
  light.position.set(0, wall_height, 0);
  scene.add(light);
  moveableObjects.push(lightCube);
  return [light, lightCube];
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
  Objects.push(wall, floor, wall2);
  /*
  
  createTable();
  */
}
function createChair() {
  var chair = new Chair(75, 75, 7, [0, 2.5 + 75, 0], chairTex);
  var chairObj = chair.create();
  scene.add(chairObj);
  moveableObjects.push(chairObj);
  Objects.push(chairObj);
}
function createBed() {
  var bed = new Bed(100, 150, 7, [0, 2.5, 0], bedTex);
  var bedObj = bed.create();
  scene.add(bedObj);
  moveableObjects.push(bedObj);
  Objects.push(bedObj);
}
function createTable() {
  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    "3DModels/table.fbx",
    (object) => {
      var geometry = new THREE.BoxGeometry(270, 270, 270);

      var material = new THREE.MeshStandardMaterial({
        opacity: 0.0,
        transparent: true,
      });
      var group = new THREE.Mesh(geometry, material);

      group.add(object.children[1]);
      group.add(object.children[1]);
      group.scale.set(0.5, 0.5, 0.5);
      group.children[1].position.y = group.children[1].position.y - 270 / 2;
      group.children[0].position.y = group.children[0].position.y - 270 / 2;
      group.position.y = 270 / 4;
      group.position.x = 0;
      scene.add(group);
      moveableObjects.push(group);
      Objects.push(group);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
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
  const texture = textureLoader.load(textureImg);
  const material = ligthed
    ? new THREE.MeshStandardMaterial({ map: texture })
    : new THREE.MeshBasicMaterial({ map: texture });
  const WallFloor = new THREE.Mesh(geometry, material);
  scene.add(WallFloor);
  WallFloor.position.z = z;
  WallFloor.position.y = y;
  WallFloor.position.x = x;
  WallFloor.rotation.x = (xAngle * Math.PI) / 180;
  WallFloor.rotation.y = (yAngle * Math.PI) / 180;
  return WallFloor;
}
