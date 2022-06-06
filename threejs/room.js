var scene;
var camera;
var renderer;

const floorTex = "Textures/wood.jpg";
const wallTex = "Textures/wall2.jpg";
var floor_width = 400;
var floor_height = 400;
var wall_height = 200;
var controls;

window.onload = (event) => {
  init();
  createScene();
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

  camera.position.y = 160;
  camera.position.z = 400;
  camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  controls.enableZoom = true;
}

function createScene() {
  var floor = createWallFloor(
    scene,
    [0, 0, 0],
    [90, 0],
    floor_width,
    floor_height,
    floorTex
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
  textureImg
) {
  const geometry = new THREE.BoxGeometry(width, height, 5);
  const texture = new THREE.TextureLoader().load(textureImg);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  //texture.repeat.set( 2, 2 );
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const WallFloor = new THREE.Mesh(geometry, material);
  scene.add(WallFloor);
  WallFloor.position.z = z;
  WallFloor.position.y = y;
  WallFloor.position.x = x;
  WallFloor.rotation.x = (xAngle * Math.PI) / 180;
  WallFloor.rotation.y = (yAngle * Math.PI) / 180;
  return WallFloor;
}
