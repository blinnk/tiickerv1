import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';
import { DigitalGlitch } from 'three/examples/jsm/shaders/DigitalGlitch';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import gsap from 'gsap';
import TWEEN from '@tweenjs/tween.js';

import Model from './model';
import Coin from './coin';
import Text from './Text';
// import PostEffect from './PostEffect';

export default class Base {
  constructor(container = document.body) {
    this.container = container;
    this.canvas = document.getElementById('canvas-webgl');

    this.setup();
    this.camera();
    this.addObjects();
    this.eventListeners();
    this.controls();
    this.postEffects();
    this.animate();
    this.render();
  }

  setup() {
    this.textGroup = new THREE.Group();

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.scene = new THREE.Scene();
    this.sceneBack = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
      alpha: true,
    });
    this.renderer.autoClear = false;
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderBack = new THREE.WebGLRenderTarget(
      document.body.clientWidth,
      window.innerHeight
    );
    this.renderer.setPixelRatio = window.devicePixelRatio;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    this.container.appendChild(this.renderer.domElement);

    this.scene.fog = new THREE.Fog(0x000000, 1, 2000);
  }

  controls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
  }

  camera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.viewport.aspectRatio,
      1,
      100000
    );
    this.camera.position.set(0, -200, 10);
    this.cameraBack = this.camera.clone();
  }

  addObjects() {
    // mainbg
    this.object = new THREE.Object3D();

    this.scene.add(this.object);
    this.object.position.y += 30;

    this.geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      transparent: true,
      opacity: 1,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);

    for (let i = 0; i < 2000; i++) {
      const mesh = new THREE.Mesh(this.geometry, this.material);
      mesh.position.y += 200;
      mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      mesh.position.multiplyScalar(Math.random() * 1000);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * -2,
        Math.random() * 2
      );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * Math.PI * 3;
      this.object.add(mesh);
    }

    this.scene.add(new THREE.AmbientLight(0x222222));
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(1, 1, 1);
    this.scene.add(this.light);

    // this.effect3 = new ShaderPass(DigitalGlitch);
    // console.log(ShaderPass);
    // this.effect3.uniforms['amount'].value = 0.0005;
    // this.composer.addPass(this.effect3);

    //
    // icosahedron
    // this.icosGeom = new THREE.OctahedronGeometry(40, 1);

    // this.icosMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x000000,
    //   fog: true,
    //   wireframe: true,
    //   transparent: true,
    // });
    // this.icosahedron = new THREE.Mesh(this.icosGeom, this.icosMaterial);
    // this.icosahedron.position.y += 30;
    // this.scene.add(this.icosahedron);

    // this.octahedronModel = new Model({
    //   name: 'octahedron',
    //   file: './models/hedron.glb',
    //   scene: this.scene,
    //   placeOnLoad: true,
    // });

    this.planet = new THREE.Object3D();
    this.skelet = new THREE.Object3D();
    this.scene.add(this.planet);
    this.scene.add(this.skelet);

    this.planet.position.y = -650;
    this.skelet.position.y = -650;

    this.planetIco = new THREE.IcosahedronGeometry(17, 2);
    this.planetMat = new THREE.MeshPhongMaterial({
      color: 0xbd9779,
      flatShading: true,
      transparent: true,
      opacity: 1,
    });

    this.outer = new THREE.MeshPhongMaterial({
      color: 0xbd9779,
      wireframe: true,
      side: THREE.Doubleside,
      transparent: true,
      opacity: 1,
    });

    this.combinedMesh = new THREE.Mesh(this.planetIco, this.planetMat);
    this.combinedMesh.scale.x =
      this.combinedMesh.scale.y =
      this.combinedMesh.scale.z =
        28;
    this.planet.add(this.combinedMesh);

    this.combinedMesh = new THREE.Mesh(this.planetIco, this.outer);
    this.combinedMesh.scale.x =
      this.combinedMesh.scale.y =
      this.combinedMesh.scale.z =
        32;

    this.skelet.add(this.combinedMesh);

    this.coin = new Coin({
      scene: this.scene,
      camera: this.cameraBack,
      clock: this.clock,
    });

    this.text = new Text({
      text: 'CKER',
      scene: this.scene,
      group: this.textGroup,
    });
  }

  animate() {
    this.cameraPos = { x: -100, y: -100, z: -500 };

    let tweenA = new TWEEN.Tween(this.camera.position)
      .to(this.cameraPos, 5000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    this.text.pivot.position.set(-200, -200, -200);
    this.particlesPos = { x: 0, y: 0, z: -40 };
    let tweenB = new TWEEN.Tween(this.text.pivot.position)
      .to(this.particlesPos, 5000)
      .delay(300)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    tweenA.chain(tweenB);

    TWEEN.update(this.delta);

    let targetPosition = new THREE.Vector2(100, 100);
    let radius = 50;
    let objTL = gsap.timeline();
    objTL.to(this.camera.position, {
      z: 300,
    });
    let o = new THREE.Box3().setFromObject(this.coin.coinMesh);
    let center = o.getCenter(new THREE.Vector3());
    let sz = o.getCenter(new THREE.Vector3());
    // this.camera.position.x =
    //   targetPosition.x + Math.cos(Date.now() / 2000) * radius;
    // this.camera.position.z =
    //   targetPosition.y + Math.sin(Date.now() / 2000) * radius;
    // this.camera.lookAt(targetPosition);

    //     objTL.to(this.camera.position, {
    //       duration: 1000,
    //       x: center.x,
    //       y: center.y,
    //       z: center.z + sz.z,
    //       onUpdate: () => {
    //         this.camera.lookAt(center);
    //       },
    //       repeat: -1,
    //     });
    //     const startOrientation = this.camera.quaternion.clone();
    //     const targetOrientation = this.coin.coinMesh.quaternion.clone().normalize();
    //     objTL.to(
    //       {},
    //       {
    //         duration: 1,
    //         onUpdate: function () {
    //           this.camera.quaternion
    //             .copy(startOrientation)
    //             .slerp(targetOrientation, this.progress());
    //         },
    //       }
    //     );

    objTL.to(this.coin.particlesMaterial, {
      duration: 5,
      opacity: 0,
    });

    new TWEEN.Tween();

    objTL.to(this.coin.coinMaterials, {
      duration: 10,
      opacity: 1,
    });
  }

  postEffects() {
    // post
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.effect1 = new ShaderPass(DotScreenShader);
    this.effect1.uniforms['scale'].value = 4;
    this.composer.addPass(this.effect1);

    this.effect2 = new ShaderPass(RGBShiftShader);
    this.effect2.uniforms['amount'].value = 0.0005;
    this.composer.addPass(this.effect2);

    this.effect3 = new GlitchPass(0);
    this.composer.addPass(this.effect3);
  }

  render() {
    this.camera.lookAt(this.scene.position);

    requestAnimationFrame((animate) => {
      this.time = this.clock.getElapsedTime();
      this.delta = this.clock.getDelta();
      this.render(this.time);

      this.object.rotation.x += 0.0005;
      this.object.rotation.y += 0.001;
      // this.icosahedron.rotation.x -= 0.0005;
      // this.icosahedron.rotation.y += 0.001;

      this.planet.rotation.z += 0.001;
      this.planet.rotation.y = 0;
      this.planet.rotation.x = 0;
      this.skelet.rotation.z -= 0.001;
      this.skelet.rotation.y = 0;
      this.skelet.rotation.x = 0;

      this.camera.updateProjectionMatrix();
      this.controls.update();

      TWEEN.update();
      this.renderer.render(this.scene, this.camera);
      this.composer.render(this.time);

      // this.postEffect.render(this.time);
      this.renderer.clearDepth(this.time);
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.sceneBack, this.cameraBack);
    });
  }

  eventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.cameraBack.aspect = this.viewport.aspectRatio;
    this.cameraBack.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.composer.setSize(this.viewport.width, this.viewport.height);
  }

  get viewport() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspectRatio = width / height;

    this.aspectRatio = aspectRatio;

    return {
      width,
      height,
      aspectRatio,
    };
  }
}

const scene = new Base();
