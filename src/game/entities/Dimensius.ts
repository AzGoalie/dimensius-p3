import { assets } from "../../config";
import { GameObject } from "../../core/GameObject";
import { Timer } from "../../core/Timer";
import type { Encounter } from "../scenes/Encounter";
import { Devour } from "./Devour";
import { Player } from "./Player";
import { ProgressBar } from "./ProgressBar";
import { Shadowquake } from "./Shadowquake";
import { TankPull } from "./TankPull";

export class Dimensius extends GameObject {
  private stateTimer = new Timer(() => this.transitionState(), {
    interval: 10,
  });

  private readonly initialAttackSequence: [() => void, number][] = [
    [() => this.attackShadowquakes(), 10],
    [() => this.attackDevour(), 10],
    [() => this.attackTankPull(615, 440), 10],
    [() => this.attackShadowquakes(), 10],
    [() => this.attackDevour(), 10],
    [() => this.attackTankPull(165, 440), 10],
    [() => this.attackShadowquakes(), 10],
    [() => this.attackDevour(), 10],
    [() => this.attackTankPull(400, 50), 10],
  ];
  private attackSequence = [...this.initialAttackSequence];

  private sprite = assets.images.dimensius;
  private scene: Encounter;

  private maxHealth = 1000;
  public health = this.maxHealth;

  private healthBar: ProgressBar;
  private devour?: Devour;

  constructor(x: number, y: number, scene: Encounter) {
    super(x, y, 30);
    this.scene = scene;
    this.healthBar = new ProgressBar(this.health, this.maxHealth, 200, 10);
  }

  update(delta: number): void {
    this.stateTimer.update(delta);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.drawImage(
      this.sprite,
      this.position.x - this.sprite.width / 2,
      this.position.y - this.sprite.height / 2
    );
    ctx.restore();

    this.healthBar.render(ctx, this.position.x, this.position.y - 75);
  }

  onCollision(o: GameObject): void {
    if (o instanceof Player) {
      this.scene.death();

      if (this.devour) {
        this.scene.remove(this.devour);
        this.devour = undefined;
      }
    }
  }

  public takeDamage(dmg: number): void {
    this.health = Math.max(this.health - dmg, 0);
    this.healthBar.value = this.health;
  }

  private transitionState() {
    const seq = this.attackSequence.shift();
    if (seq) {
      seq[0]();
      this.stateTimer.interval = seq[1];
      this.attackSequence.push(seq);
    }
  }

  private attackShadowquakes() {
    const startIndex = Math.random() < 0.5 ? 1 : 2;
    const direction = startIndex === 1 ? 1 : -1;

    const numWaves = 3;
    const baseAngle = Math.PI / 2;

    const spawnWave = (i: number) => {
      const step = (i * direction + startIndex + numWaves) % numWaves;
      const angle = baseAngle + step * ((2 * Math.PI) / numWaves);

      const x = this.position.x + 150 * Math.cos(angle);
      const y = this.position.y + 150 * Math.sin(angle);
      const shadowquake = new Shadowquake(x, y, {
        x: this.position.x,
        y: this.position.y,
      });
      this.scene.add(shadowquake);

      this.scene.timer(10, () => this.scene.remove(shadowquake));
    };

    spawnWave(0);
    this.scene.timer(1.5, () => spawnWave(1));
    this.scene.timer(3, () => spawnWave(2));
  }

  private attackDevour() {
    const player = this.scene.getObjects(Player)[0];
    const d = new Devour(
      { x: this.position.x, y: this.position.y },
      player,
      () => {
        this.scene.remove(d);
        this.devour = undefined;
        player.voidStar?.consume();
      }
    );
    this.devour = d;
    this.scene.add(d, true);
  }

  private attackTankPull(x: number, y: number) {
    const player = this.scene.getObjects(Player)[0];
    const pull = new TankPull(x, y, player, this.scene);
    pull.tag = "tankpull";
    this.scene.add(pull, true);
  }

  reset = () => {
    this.health = this.maxHealth;
    this.attackSequence = [...this.initialAttackSequence];
    this.stateTimer = new Timer(() => this.transitionState(), {
      interval: 10,
    });

    this.healthBar.value = this.health;

    if (this.devour) {
      this.scene.remove(this.devour);
    }
    this.devour = undefined;
  };
}
