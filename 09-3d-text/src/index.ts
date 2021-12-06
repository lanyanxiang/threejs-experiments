import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";

/**
 * Base
 */
const gui = new GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new Scene();
const textureLoader = new TextureLoader();
const fontLoader = new FontLoader();
fontLoader.load("/fonts/readex-pro.json", () => {
  console.log("loaded");
});

const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
scene.add(cube);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;

const renderer = new WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();