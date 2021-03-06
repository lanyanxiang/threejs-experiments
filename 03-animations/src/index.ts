import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import "./style.css";
import { Size } from "./size";
import gsap from "gsap";

const RENDER_CANVAS_SELECTOR = "canvas.root";

const size = new Size();
const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshBasicMaterial({ color: "#6898FD" })
);
const camera = new PerspectiveCamera(50, size.aspect);
camera.position.z = 3;

const scene = new Scene();
scene.add(cube, camera);
const canvas = document.querySelector(RENDER_CANVAS_SELECTOR);
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

gsap.to(cube.position, { duration: 1, x: 2 });

const beforeRender = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(beforeRender);
};

requestAnimationFrame(beforeRender);
