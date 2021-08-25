import * as THREE from 'three';
import a from '../assets/a1.jpg';
import aN from '../assets/nmapA2.png';
import b from '../assets/coinB.jpeg';
import bN from '../assets/nmapb22.png';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { DigitalGlitch } from 'three/examples/jsm/shaders/DigitalGlitch';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

import TWEEN from '@tweenjs/tween.js';
import gsap from 'gsap';

class Coin {
  constructor(obj) {
    this.layer = obj.layer;
    this.scene = obj.scene;
    this.camera = obj.camera;
    this.clock = obj.clock;

    this.init();
    this.lights();
    this.initParticles();
  }

  init() {
    this.texA = new THREE.TextureLoader().load(`${a}`);
    this.NMa = new THREE.TextureLoader().load(`${aN}`);

    this.texA.wrapS = THREE.RepeatWrapping;
    this.texA.repeat.set(0.675, 0.675);
    this.texA.center.set(0.5, 0.5);

    this.NMa.wrapS = THREE.RepeatWrapping;
    this.NMa.repeat.set(0.675, 0.675);
    this.NMa.center.set(0.5, 0.5);

    this.texB = new THREE.TextureLoader().load(`${b}`);
    this.NMb = new THREE.TextureLoader().load(`${bN}`);
    this.texB.wrapS = THREE.RepeatWrapping;
    this.texB.repeat.set(0.675, 0.675);
    this.texB.center.set(0.5, 0.5);

    this.texB.flipY = false;
    this.NMb.flipY = false;

    this.coinMaterialA = new THREE.MeshStandardMaterial({
      map: this.texA,
      normalMap: this.NMa,
      flatShading: true,
      normalScale: new THREE.Vector2(1, -1),
      metalness: 0.8,
      roughness: 0.475,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      // wireframe: true,
    });

    this.coinMaterialB = new THREE.MeshStandardMaterial({
      map: this.texB,
      normalMap: this.NMb,
      flatShading: true,
      normalScale: new THREE.Vector2(1, -1),
      metalness: 0.8,
      roughness: 0.475,
      side: THREE.DoubleSide,

      transparent: true,
      opacity: 0,
      // wireframe: true,
    });

    this.coinMaterialC = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.5,
      side: THREE.DoubleSide,

      transparent: true,
      opacity: 0,
      // wireframe: true,
    });

    this.coinMaterials = [
      this.coinMaterialC,
      this.coinMaterialA,
      this.coinMaterialB,
    ];

    this.coinGeometry = new THREE.CylinderGeometry(150, 150, 15, 200);
    this.coinMesh = new THREE.Mesh(this.coinGeometry, this.coinMaterials);
    this.coinMesh.rotation.x = (Math.PI / 2) * 1;
    this.coinMesh.rotation.y = (Math.PI / 2) * 1;

    console.log(this.coinGeometry);
    this.coinMesh.position.y += 25;
    this.mesh = this.scene.children[0];
    this.geometry = this.coinMesh.coinGeometry;
  }

  initParticles() {
    this.particlesMaterial = new THREE.PointsMaterial({
      color: 0x85bb65,
      size: 1,
      transparent: true,
      opacity: 1,
      morphTargets: true,
    });

    gsap.to(this.particlesMaterial, { opacity: 1, duration: 2 });

    const sampler = new MeshSurfaceSampler(this.coinMesh).build();
    const numParticles = 10000;
    this.particlesGeometry = new THREE.BufferGeometry();
    const particlesPosition = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const newPosition = new THREE.Vector3();
      sampler.sample(newPosition);
      particlesPosition.set(
        [newPosition.x, newPosition.y, newPosition.z],
        i * 3
      );
    }

    this.particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlesPosition, 3)
    );

    this.particles = new THREE.Points(
      this.particlesGeometry,
      this.particlesMaterial
    );

    this.particles.position.y += 25;
    this.particles.rotation.x = (Math.PI / 2) * 1;
    this.particles.rotation.y = (Math.PI / 2) * 1;

    this.scene.add(this.particles);
    this.scene.add(this.coinMesh);
  }

  lights() {
    this.width = 50.0;
    this.height = 100.0;
    this.widthT = 100.0;
    this.heightT = 20.0;

    RectAreaLightUniformsLib.init();

    this.lightR = new THREE.RectAreaLight(
      // 0xb8b483,
      0xffffff,
      1.2,
      this.width,
      this.height
    );

    this.lightT = new THREE.RectAreaLight(
      // 0xb8b483,

      0xffffff,
      5.0,
      this.widthT,
      this.heightT
    );

    this.lightR.position.set(0, -5.5, 0);
    this.lightT.position.set(0, 10.5, 20);
    this.lightR.lookAt(0, 0, 0);
    this.lightT.lookAt(0, 0, 0);

    // let helper = new RectAreaLightHelper(lightR);
    // let helper2 = new RectAreaLightHelper(lightT);
    // lightR.add(helper);
    // lightT.add(helper2);

    this.lights = [];
    this.lights[0] = new THREE.DirectionalLight(0xffffff, 1);
    this.lights[0].position.set(1, 0, 0);
    this.lights[1] = new THREE.DirectionalLight(0x11e8bb, 1);
    this.lights[1] = new THREE.DirectionalLight(0xffffff, 1);
    this.lights[1].position.set(0.75, 1, 0.5);
    this.lights[2] = new THREE.DirectionalLight(0x8200c9, 1);
    this.lights[2] = new THREE.DirectionalLight(0xffffff, 1);
    this.lights[2].position.set(-0.75, -1, 0.5);

    this.scene.add(this.lights[0]);
    this.scene.add(this.lights[1]);
    this.scene.add(this.lights[2]);
  }
}

export default Coin;
