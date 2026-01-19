import type { GameObject } from "./GameObject";
import { Input } from "./Input";
import { Timer } from "./Timer";

export abstract class Scene {
  protected game: Game;
  protected objects: GameObject[] = [];
  private timers: Timer[] = [];

  get width() {
    return this.game.width;
  }

  get height() {
    return this.game.height;
  }

  constructor(game: Game) {
    this.game = game;
  }

  add(object: GameObject, front = false) {
    if (front) {
      this.objects.unshift(object);
    } else {
      this.objects.push(object);
    }
  }

  remove(object: GameObject) {
    this.objects = this.objects.filter((obj) => obj !== object);
  }

  clear() {
    this.objects = [];
    this.timers = [];
  }

  public onEnter(): void {}
  public onExit(): void {}

  public update(delta: number): void {
    this.timers.forEach((t) => t.update(delta));
    this.timers = this.timers.filter((t) => !t.fired);

    for (let i = this.objects.length - 1; i >= 0; i--) {
      this.objects[i].update(delta);
    }

    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const a = this.objects[i];
        const b = this.objects[j];

        if (a.collidesWith(b)) {
          a.onCollision(b);
          b.onCollision(a);
        }
      }
    }
  }
  public render(ctx: CanvasRenderingContext2D): void {
    this.objects.forEach((obj) => obj.render(ctx));
  }

  public getObjects<T extends GameObject>(
    type: new (...args: any[]) => T
  ): T[] {
    return this.objects.filter((obj) => obj instanceof type) as T[];
  }

  getObjectsByTag(tag: string): GameObject[] {
    return this.objects.filter((obj) => obj.tag === tag);
  }

  public timer(timeout: number, callback: () => void): void {
    this.timers.push(new Timer(callback, { once: true, delay: timeout }));
  }
}

interface GameOptions {
  width: number;
  height: number;
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");

  canvas.style.display = "block";
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  canvas.getContext("2d")?.scale(devicePixelRatio, devicePixelRatio);

  return canvas;
}

export class Game {
  public readonly canvas: HTMLCanvasElement;
  public readonly width: number;
  public readonly height: number;

  private running: boolean = false;
  private animationId?: number;
  private lastTime: number = 0;

  private ctx: CanvasRenderingContext2D;
  private currentScene?: Scene;
  private scenes: Record<string, Scene> = {};

  private stateListeners: Set<() => void> = new Set();

  private _state: Record<string, any> = {};
  set state(s: Record<string, any>) {
    this._state = s;
    this.stateListeners.forEach((l) => l());
  }
  get state() {
    return this._state;
  }

  constructor({ width, height }: GameOptions) {
    this.width = width;
    this.height = height;

    this.canvas = createCanvas(width, height);
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D context");
    }
    this.ctx = ctx;
  }

  public start() {
    if (!this.running) {
      this.running = true;
      this.currentScene?.onEnter();
      this.lastTime = performance.now();
      this.animationId = requestAnimationFrame(this.gameLoop);
    }
  }

  public stop() {
    this.running = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  public addScene(key: string, scene: Scene) {
    if (this.scenes[key]) {
      throw new Error(`Scene with key "${key}" already exists.`);
    }

    this.scenes[key] = scene;

    if (!this.currentScene) {
      this.currentScene = scene;
    }
  }

  public changeScene(key: string) {
    const nextScene = this.scenes[key];
    if (!nextScene) {
      throw new Error(`Scene with key "${key}" does not exist.`);
    }

    if (this.running) {
      this.currentScene?.onExit?.();
      this.currentScene = nextScene;
      this.currentScene.onEnter?.();
    }
  }

  public subscribe = (listener: () => void) => {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  };

  public getSnapshot = () => {
    return this._state;
  };

  private gameLoop = (currentTime: number) => {
    if (!this.running) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.currentScene?.update(deltaTime);
    this.currentScene?.render(this.ctx);

    Input.update();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };
}
