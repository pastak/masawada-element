import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

const attr2vertex = (attr: string | null): [number, number, number] => {
  if (!attr) return [0, 0, 0];
  const t = attr.split(/\s*,\s*/).map((n) => parseFloat(n));
  return [t[0], t[1], t[2]];
};

class MasawadaElement extends HTMLElement {
  private obj?: THREE.Group

  private camera?: THREE.Camera

  private renderer?: THREE.WebGLRenderer

  private scene?: THREE.Scene

  static get observedAttributes() { return ['rotation']; }

  attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
    if (!this.obj) return;
    if (name === 'rotation') this.obj.rotation.set(...attr2vertex(newVal));
    if (this.renderer && this.scene && this.camera) { this.renderer.render(this.scene, this.camera); }
  }

  connectedCallback() {
    const autoRotate = this.hasAttribute('autoRotate');

    /*
    let width = Number(this.getAttribute('width'));
    let height = Number(this.getAttribute('height'));
    if (!(width && height)) {
      const rect = this.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
    */
    const [width, height] = [450, 600];

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(120, width / height, 1, 100);// 視野角,縦横比,手前の距離,奥の距離
    if (this.hasAttribute('cameraPosition')) {
      this.camera.position.set(...attr2vertex(this.getAttribute('cameraPosition')));
    } else {
      this.camera.position.set(0, 10, 20);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load('/models/masawada.png');
    const material = new THREE.MeshPhongMaterial({ map });

    const loader = new OBJLoader();
    loader.load(
      '/models/masawada.obj',
      (obj) => {
        this.obj = obj;
        this.obj.position.set(0, 0, 10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.obj.traverse((node: any) => {
          if (node.isMesh) node.material = material;
        });
        this.scene && this.scene.add(this.obj);

        const animate = () => {
          requestAnimationFrame(animate);
          if (autoRotate) obj.rotation.y += 0.01;
          if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
        };

        animate();
      },
    );
  }
}
window.customElements.define('masawada-3d', MasawadaElement);
