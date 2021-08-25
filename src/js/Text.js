import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import TWEEN from '@tweenjs/tween.js';
const arialBold = './fonts/Roboto Black_Regular.json';
const arialNarrowBold = './fonts/Roboto_Bold.json';
const tiickerSVG = './resources/Tii_Symbol_Listed2.svg';

export default class Text {
  constructor(obj) {
    this.text = obj.text;
    this.scene = obj.scene;
    this.textGroup = obj.group;

    this.load();
  }

  load() {
    let text = this.text;
    let textGroup = this.textGroup;
    let scene = this.scene;

    this.loader = new THREE.FontLoader();
    this.loader.load(
      getLongLetterNumber(text) > 1 ? arialNarrowBold : arialBold,
      function (font) {
        const geometry = new THREE.TextGeometry(text, {
          font: font,
          size:
            text.split('W').length - 1 > 2 ||
            (text.split('C').length - 1 > 0 && text.split('O').length - 1 > 0)
              ? 8
              : 10,
          height: 0.5,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 1,
          bevelSize: 0.1,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        let textM = new THREE.Mesh(
          geometry,
          new THREE.MeshStandardMaterial({
            rougness: 0.8,
            metalness: 0.8,
            color: new THREE.Color(0.2, 0.23, 0.27),
          })
        );

        textM.castShadow = false;
        textM.receiveShadow = false;
        // textM.rotateY(Math.PI);
        textM.position.x = 0;
        textM.position.z = 40;
        // textM.position.y = text.split('W').length - 1 > 2 ? -0.45 : -0.5;
        textM.scale.set(10, 10, 10);
        textM.name = 'text';
        textM.scale.z = 1;

        textGroup.add(textM);

        textGroup.position.x =
          (text.split('W').length - 1 > 1 || text.split('Z').length - 1 > 1) &&
          text.split('I').length - 1 < 1
            ? 0.1
            : text.split('I').length - 1 > 2
            ? -0.5
            : text.split('Z').length - 1 > 1
            ? -0.2
            : text.split('I').length - 1 > 0
            ? -0.2
            : 0;

        if (text.length == 1) {
          // console.log('number is 1');
          textGroup.position.x = text.split('I').length - 1 > 0 ? -1.3 : -1;
        }
        if (text.length == 2) {
          // console.log('number is 2');
          textGroup.position.x = text.split('I').length - 1 > 0 ? -1 : -0.5;
        }
        if (text.length == 3) {
          // console.log('number is 3');
          textGroup.position.x = text.split('I').length - 1 > 1 ? -0.8 : -0.3;
        }
      }
    );

    textGroup.position.z = -40;
    this.pivot = new THREE.Object3D();
    this.pivot.add(textGroup);
    scene.add(this.pivot);
  }
}

function getLongLetterNumber(word) {
  let badLetters = [
    'O',
    'C',
    'B',
    'A',
    'D',
    'G',
    'H',
    'K',
    'M',
    'N',
    'Q',
    'R',
    'U',
    'V',
    'W',
    'X',
    'Y',
  ];

  let numberOfLongLetters = 0;
  for (let i = 0; i < badLetters.length; i++) {
    numberOfLongLetters += word.split(badLetters[i]).length - 1;
  }
  numberOfLongLetters -= word.split('I').length - 1;
  return numberOfLongLetters;
}
