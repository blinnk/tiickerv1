const THREE = require('three');
import frag from './glsl/postEffect.frag';
import vert from './glsl/postEffect.vert';

export default class PostEffect {
  constructor(texture) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
      },
      texture: {
        type: 't',
        value: texture,
      },
      strengthZoom: {
        type: 'f',
        value: 0,
      },
      strengthGlitch: {
        type: 'f',
        value: 0,
      },
    };
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vert,
        fragmentShader: frag,
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time;
  }
  resize() {
    this.uniforms.resolution.value.set(
      document.body.clientWidth,
      window.innerHeight
    );
  }
}
