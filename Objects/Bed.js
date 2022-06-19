import * as THREE from '../common/three.js';
import {FBXLoader} from '../common/FBXLoader.js'
export class Bed {
  constructor(length, width, height, [x, y, z], textureImg) {
    this.length = length * 1.5;
    this.width = width * 1.5;
    this.height = 50;
    this.coordinates = [x, y, z];
    this.textureImg = textureImg;
    this.thickness = 10;
  }
  create = function () {
    var geometry = new THREE.BoxGeometry(this.width, 50, this.length);
    var textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    var texture = textureLoader.load(this.textureImg);
    var material = new THREE.MeshStandardMaterial({ map: texture });
    this.base = new THREE.Mesh(geometry, material);

    this.base.position.z = 0;
    this.base.position.y = 0 - this.height * 3.25 /2 +this.height*3/4;
    this.base.position.x = 0;
    this.base.rotation.x = (0 * Math.PI) / 180;
    this.base.rotation.y = (90 * Math.PI) / 180;
    var part1 = this.createHPart(
      this.length,
      10,
      this.thickness,
      true,
      this.coordinates,
      this.textureImg
    );
    var part2 = this.createHPart(
      this.length,
      10,
      this.thickness,
      false,
      this.coordinates,
      this.textureImg
    );
    var part3 = this.createVPart(
      this.thickness,
      10,
      this.width,
      true,
      this.coordinates,
      this.textureImg
    );
    var part4 = this.createVPart(
      this.thickness,
      10,
      this.width,
      false,
      this.coordinates,
      this.textureImg
    );

    var mattress = this.createUpperPart(
      this.length - this.thickness,
      20,
      this.width - this.thickness,
      this.coordinates,
      "Textures/mattress.jpg"
    );
    var head = this.createTopPart(this.length,this.height*2,this.thickness/2,this.coordinates,this.textureImg);
    var geometry = new THREE.BoxGeometry(
      this.length +20,
      this.height * 3.25 +5 ,
      this.width +20
    );
    var leg1 = this.createLeg(this.thickness,this.height/4,this.thickness,false,false,this.coordinates,this.textureImg);
    var leg2 = this.createLeg(this.thickness,this.height/4,this.thickness,false,true,this.coordinates,this.textureImg);
    var leg3 = this.createLeg(this.thickness,this.height/4,this.thickness,true,false,this.coordinates,this.textureImg);
    var leg4 = this.createLeg(this.thickness,this.height/4,this.thickness,true,true,this.coordinates,this.textureImg);
    var material = new THREE.MeshStandardMaterial({
      opacity: 0.0,
      transparent: true,
    });
    this.group = new THREE.Mesh(geometry, material);
    this.group.position.z = this.coordinates[2];
    this.group.position.y = this.coordinates[1] + (this.height * 3.25)/2;
    this.group.position.x = this.coordinates[0];
    this.group.add(this.base);
    this.group.add(part1);
    this.group.add(part2);
    this.group.add(part3);
    this.group.add(part4);
    this.group.add(leg1);
    this.group.add(leg2);
    this.group.add(leg3);
    this.group.add(leg4);
    this.group.add(mattress);
    this.group.add(head); 
    this.createPillow();
    return this.group;
  };
  createPillow(){
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
        '3DModels/pillow.fbx',
        (object) => {
          object.children[0].position.y = this.base.position.y+this.height +10
          object.children[0].rotation.y = 90 * Math.PI / 180;
          object.children[0].rotation.x = 45 * Math.PI / 180;
          object.children[0].scale.set(0.5,0.5,0.5);
          object.children[0].position.x = this.length/2 -20;
          object.children[0].position.z = -this.width/2 +this.thickness;
             this.group.add(object.children[0]);
           
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
  }
  createTopPart(length, height, width, [x, y, z], textureImg) {
    const geometry = new THREE.BoxGeometry(length , height , width);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    const texture = textureLoader.load(textureImg);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    var leg = new THREE.Mesh(geometry, material);
    leg.position.z = - this.width / 2 + width / 2 ;
    leg.position.y = this.base.position.y+this.height / 2 + height / 2;
    leg.position.x = 0;
    return leg;
  }
  createUpperPart(length, height, width, [x, y, z], textureImg) {
    const geometry = this.createBoxWithRoundedEdges(
      length,
      height,
      width,
      5,
      100
    );
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    const texture = textureLoader.load(textureImg);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(2,2);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    var mattress = new THREE.Mesh(geometry, [material, material]);
    mattress.position.z = 0;
    mattress.position.y = this.base.position.y+this.height / 2 + height / 2;
    mattress.position.x = 0;
    return mattress;
  }
  createBoxWithRoundedEdges(width, height, depth, radius0, smoothness) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(
      width - radius * 2,
      height - radius * 2,
      eps,
      Math.PI / 2,
      0,
      true
    );
    shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
    let geometry = new THREE.ExtrudeBufferGeometry(shape, {
      amount: depth - radius0 * 2,
      bevelEnabled: true,
      bevelSegments: smoothness * 2,
      steps: 1,
      bevelSize: radius,
      bevelThickness: radius0,
      curveSegments: smoothness,
      UVGenerator: THREE.ExtrudeBufferGeometry.BoundingBoxUVGenerator,
    });
    
    const uvAttribute = geometry.getAttribute( 'uv' );
    

for ( let i = 0; i < uvAttribute.count; i ++ ) {
    const uv = new THREE.Vector2();
    uv.fromBufferAttribute( uvAttribute, i );
    uv.x = (uv.x - 150) / 200;
    uv.y = (uv.y - 0) / 300;
    uvAttribute.setXY( i, uv.x, uv.y );
}
    geometry.center();

    return geometry;
  }
  createLeg(length, height, width, isFront, isLeft, [x, y, z], textureImg) {
    const geometry = new THREE.BoxGeometry(length, height, width);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    const texture = textureLoader.load(textureImg);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    var leg = new THREE.Mesh(geometry, material);

    leg.position.z = isFront ? this.width / 2 - length / 2 : -this.width / 2 + length / 2;
    leg.position.y = this.base.position.y+ -this.height / 2 - height / 2;
    leg.position.x = isLeft ? -this.length / 2 + width / 2 : this.length / 2 - width / 2;

    return leg;
  }
  createHPart(width, height, length, isFront, [x, y, z], textureImg) {
    const geometry = new THREE.BoxGeometry(width, height, length);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    const texture = textureLoader.load(textureImg);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    var leg = new THREE.Mesh(geometry, material);

    leg.position.z = isFront
      ? this.width / 2 - length / 2
      : -this.width / 2 + length / 2;
    leg.position.y = this.base.position.y+this.height / 2 + height / 2;
    leg.position.x = 0;

    return leg;
  }
  createVPart(width, height, length, isLeft, [x, y, z], textureImg) {
    const geometry = new THREE.BoxGeometry(width, height, length);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    const texture = textureLoader.load(textureImg);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    var leg = new THREE.Mesh(geometry, material);

    leg.position.z = 0;
    leg.position.y = this.base.position.y+this.height / 2 + height / 2;
    leg.position.x = isLeft
      ? -this.length / 2 + width / 2
      : this.length / 2 - width / 2;

    return leg;
  }
}
