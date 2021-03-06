import {
  BoxGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import "./style.css";
import { Size } from "./Size";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import GUI from "lil-gui";

const RENDER_CANVAS_SELECTOR = "canvas.root";
const DEFAULT_CUBE_COLOR = "#6898FD";

const size = new Size(window.innerWidth, window.innerHeight);
const boxGeometry = new BoxGeometry(1, 1, 1);
const cubeMaterial = new MeshBasicMaterial({ color: DEFAULT_CUBE_COLOR });
const cube = new Mesh(boxGeometry, cubeMaterial);
const cubeOutline = new LineSegments(
  new EdgesGeometry(boxGeometry),
  new LineBasicMaterial({ color: "white" })
);
const cubeGroup = new Group();
cubeGroup.add(cube, cubeOutline);

const camera = new PerspectiveCamera(50, size.aspect);
camera.position.z = 3;

const scene = new Scene();
scene.add(cubeGroup, camera);

const canvas = document.querySelector(RENDER_CANVAS_SELECTOR);
const controls = new OrbitControls(camera, canvas as HTMLElement);
// https://threejs.org/docs/#examples/en/controls/OrbitControls.dampingFactor
controls.enableDamping = true;
// controls.target.y = 1;
// controls.update();

const gui = new GUI({ title: "debug tools" });
gui.close();
const parameters = {
  color: DEFAULT_CUBE_COLOR,
  spin: () => {
    gsap.to(cubeGroup.rotation, {
      duration: 1,
      y: cube.rotation.y + Math.PI * 2,
    });
  },
  hideDebug: () => {
    gui.close();
  },
};
gui.add(cubeGroup.position, "y").min(-3).max(3).step(0.05);
gui.add(cubeGroup, "visible");
gui.add(cubeMaterial, "wireframe");
gui.addColor(parameters, "color").onChange(() => {
  cubeMaterial.color.set(parameters.color);
});
gui.add(parameters, "spin");
gui.add(parameters, "hideDebug").name("hide debug");

const renderer = new WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.render(scene, camera);

const cursor = new Vector2(0, 0);
addEventListener("mousemove", (event: MouseEvent) => {
  // x, y range: [-0.5, 0.5]
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = -(event.clientY / size.height - 0.5);
});

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
});

window.addEventListener("dblclick", async () => {
  const fullscreenElement =
    // @ts-ignore
    document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      await canvas.requestFullscreen();
    } else {
      // @ts-ignore
      await canvas.webkitRequestFullscreen();
    }
    return;
  }
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else {
    // @ts-ignore
    await document.webkitExitFullscreen();
  }
});

const renderFrame = () => {
  // camera.position.set(
  //   Math.sin(cursor.x * Math.PI * 2) * 3,
  //   cursor.y * 5,
  //   Math.cos(cursor.x * Math.PI * 2) * 3
  // );
  // camera.lookAt(cube.position);

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(renderFrame);
};

requestAnimationFrame(renderFrame);
