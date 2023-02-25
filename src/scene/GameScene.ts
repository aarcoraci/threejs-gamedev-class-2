import {
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import GameEntity from "../entities/GameEntity";
import GameMap from "../map/GameMap";
import ResourceManager from "../utils/ResourceManager";

class GameScene {
  private static _instance = new GameScene();
  public static get instance() {
    return this._instance;
  }
  private _width: number;
  private _height: number;
  private _renderer: WebGLRenderer;
  private _camera: PerspectiveCamera;

  // three js scene
  private readonly _scene = new Scene();

  // game entities array
  private _gameEntities: GameEntity[] = [];

  private constructor() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(this._width, this._height);
    // find the target html element
    const targetElement = document.querySelector<HTMLDivElement>("#app");
    if (!targetElement) {
      throw "unable to find target element";
    }
    targetElement.appendChild(this._renderer.domElement);
    // setup camera
    const aspectRatio = this._width / this._height;
    this._camera = new PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    this._camera.position.set(7, 7, 15);

    // listen to size change
    window.addEventListener("resize", this.resize, false);

    // add the game map
    const gameMap = new GameMap(new Vector3(0, 0, 0), 15);
    this._gameEntities.push(gameMap);
  }

  private resize = () => {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer.setSize(this._width, this._height);
    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();
  };

  public load = async () => {
    // load game resources
    await ResourceManager.instance.load();

    // load game entities
    for (let index = 0; index < this._gameEntities.length; index++) {
      const element = this._gameEntities[index];
      await element.load();
      this._scene.add(element.mesh);
    }
    // add a light to the scene
    const light = new HemisphereLight(0xffffbb, 0x080820, 1);
    this._scene.add(light);
  };

  public render = () => {
    requestAnimationFrame(this.render);
    this._renderer.render(this._scene, this._camera);
  };
}

export default GameScene;
