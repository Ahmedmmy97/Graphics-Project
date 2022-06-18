import * as THREE from '../common/three.js';
export class Chair{
    constructor(length,width,height, [x,y,z],textureImg) {
        this.length = length;
        this.width = width;
        this.height = height;
        this.coordinates = [x,y,z];
        this.textureImg = textureImg;
       
    }
    create = function(){
        var geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin("");
        var texture =  textureLoader.load(this.textureImg);
        var material = new THREE.MeshStandardMaterial({ map: texture });
        this. base = new THREE.Mesh(geometry, material);
        
        this. base.position.z = 0;
        this.base.position.y = 0;
        this.base.position.x = 0;
        this.base.rotation.x = (0 * Math.PI) / 180;
        this.base.rotation.y = (90 * Math.PI) / 180;
        this.leg1 = this.createLeg(this.height,this.width,this.height,false,false,this.coordinates,this.textureImg);
        this. leg2 = this.createLeg(this.height,this.width,this.height,false,true,this.coordinates,this.textureImg);
        this. leg3 = this.createLeg(this.height,this.width,this.height,true,false,this.coordinates,this.textureImg);
        this. leg4 = this.createLeg(this.height,this.width,this.height,true,true,this.coordinates,this.textureImg);
        this. upperLeft = this.createUpperPart(this.height,this.width,this.height,true,this.coordinates,this.textureImg)
        this. upperRight = this.createUpperPart(this.height,this.width,this.height,false,this.coordinates,this.textureImg)
        this. top = this.createTopPart(this.length,this.width,this.height,this.coordinates,this.textureImg);
        var geometry = new THREE.BoxGeometry(this.width+20, this.width*2 +20, this.width +20);
        var material = new THREE.MeshStandardMaterial({
            
            opacity: 0.0,
            transparent: true,
          });
        this. group = new THREE.Mesh(geometry, material);
        this. group.position.z = this.coordinates[2];
        this.group.position.y = this.coordinates[1];
        this.group.position.x = this.coordinates[0];
        this.group.add(this.base);
        this.group.add(this.leg1);
        this.group.add(this.leg2);
        this.group.add(this.leg3);
        this.group.add(this.leg4);
        this.group.add(this.upperLeft);
        this.group.add(this.upperRight);
        this.group.add(this.top);
        return this.group;
    }
   
    createTopPart(length,width,height,[x,y,z],textureImg){
        const geometry = new THREE.BoxGeometry(width+10, height+20, height);
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin("");
        const texture =  textureLoader.load(textureImg);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        var leg = new THREE.Mesh(geometry, material);
        leg.position.z = (-width/2 + height/2);
        leg.position.y =  (width - height/2);
        leg.position.x = x;
        return leg;
      }
    createUpperPart(length,width,height,isLeft,[x,y,z],textureImg){
        const geometry = new THREE.BoxGeometry(length, width, height);
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin("");
        const texture =  textureLoader.load(textureImg);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        var leg = new THREE.Mesh(geometry, material);
        leg.position.z = (-width/2 + height/2);
        leg.position.y = (width/2 - height/2);
        leg.position.x = (isLeft? width/2 -height/2 : -width/2 +height/2);
        return leg;
      }
    createLeg(length,width,height,isFront, isLeft,[x,y,z],textureImg){
        const geometry = new THREE.BoxGeometry(length, width, height);
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin("");
        const texture =  textureLoader.load(textureImg);
        const material = new THREE.MeshStandardMaterial({ map: texture });
         var leg = new THREE.Mesh(geometry, material);
         
         leg.position.z = (isFront?width/2 - length/2: -width/2 + length/2);
         leg.position.y = (-width/2 - length/2);
         leg.position.x = (isLeft?-width/2+length/2:width/2-length/2);
         
        return leg;
      }
}