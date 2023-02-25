import { Mesh, Vector3 } from "three";

abstract class GameEntity {
  protected _position: Vector3;
  protected _mesh: Mesh = new Mesh();
  public get mesh() {
    return this._mesh;
  }

  constructor(position: Vector3) {
    this._position = position;
    this._mesh.position.set(
      this._position.x,
      this._position.y,
      this._position.z
    );
  }

  // methods
  public load = async () => {};
  public update = () => {};
}

export default GameEntity;
