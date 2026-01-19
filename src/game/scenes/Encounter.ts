import { assets } from "../../config";
import { Game, Scene } from "../../core/Game";
import { Input } from "../../core/Input";
import { Timer } from "../../core/Timer";
import { cloneAudio } from "../../utils";
import { Dimensius } from "../entities/Dimensius";
import { Player } from "../entities/Player";
import { VoidStar } from "../entities/VoidStar";
import { SequenceManager } from "../SequenceManager";

const PLAYER_DMG = 20;

export class Encounter extends Scene {
  private player: Player;
  private lives = 3;

  private score = 0;
  private multiplier = 1;
  private scoreTimer = new Timer(
    () => {
      this.score += 500 * this.multiplier;
      this.game.state = {
        ...this.game.state,
        score: this.score,
      };
    },
    { interval: 0.1 }
  );

  private sequenceManager: SequenceManager;
  private dimensius: Dimensius;

  constructor(game: Game) {
    super(game);

    this.player = new Player(this.width / 2, this.height / 2 + 125, this);
    this.player.tag = "player";

    this.dimensius = new Dimensius(this.width / 2, this.height / 2, this);
    this.add(this.dimensius);
    this.add(this.player);

    this.sequenceManager = new SequenceManager();

    this.game.state = {
      lives: this.lives,
      score: 100,
      currentInput: [],
      targetSequence: this.sequenceManager.generate(3, 1, 3),
    };
  }

  public onEnter(): void {
    Input.bindAction("moveUp", ["ArrowUp", "KeyW"]);
    Input.bindAction("moveDown", ["ArrowDown", "KeyS"]);
    Input.bindAction("moveLeft", ["ArrowLeft", "KeyA"]);
    Input.bindAction("moveRight", ["ArrowRight", "KeyD"]);

    Input.bindAction("skill1", ["Digit1", "Numpad1"]);
    Input.bindAction("skill2", ["Digit2", "Numpad2"]);
    Input.bindAction("skill3", ["Digit3", "Numpad3"]);

    this.spawnVoidStars();

    assets.audio.music.play();
    assets.audio.bloodlust.play();
  }

  public onExit(): void {}

  public update(delta: number): void {
    super.update(delta);
    this.scoreTimer.update(delta);

    if (Input.isActionJustPressed("skill1")) this.handleSequenceInput(1);
    if (Input.isActionJustPressed("skill2")) this.handleSequenceInput(2);
    if (Input.isActionJustPressed("skill3")) this.handleSequenceInput(3);

    this.checkPlayerBounds();

    if (this.dimensius.health <= 0) {
      this.game.stop();
      assets.audio.music.pause();
      assets.audio.music.currentTime = 0;
      this.game.state = {
        ...this.game.state,
        won: true,
      };
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(assets.images.background, 0, 0);

    super.render(ctx);
  }

  public death = () => {
    this.player.respawn();
    cloneAudio(assets.audio.alarm).play();

    this.lives = Math.max(this.lives - 1, 0);
    this.multiplier = 1;
    this.game.state = { ...this.game.state, lives: this.lives, multiplier: 1 };

    this.getObjectsByTag("tankpull").forEach((t) => this.remove(t));

    assets.audio.devour_loop.pause();
    assets.audio.devour_loop.currentTime = 0;

    if (this.lives === 0) {
      this.game.stop();
      this.game.state = { ...this.game.state, loss: true };
      assets.audio.music.pause();
      assets.audio.music.currentTime = 0;
    }
  };

  private spawnVoidStars = () => {
    const num = 8;
    const voidStars: VoidStar[] = [];
    for (let i = 0; i < num; i++) {
      this.timer(i * 1, () => {
        const angle = (i / num) * -Math.PI * 2;
        const voidStar = new VoidStar({
          center: { x: this.width / 2, y: this.height / 2 },
          initialAngle: angle,
          onDeath: this.death,
          // debugNumber: i,
        });
        voidStars.push(voidStar);
        this.add(voidStar, true);
      });
    }

    this.timer(8, () => voidStars.forEach((v) => v.start()));
  };

  private checkPlayerBounds() {
    // Keep the player within the arena
    const dx = this.player.position.x - this.width / 2;
    const dy = this.player.position.y - this.height / 2;
    const dist = Math.hypot(dx, dy);
    const maxDist = 300 - this.player.radius;

    if (dist > maxDist) {
      this.player.position.x = this.width / 2 + dx * (maxDist / dist);
      this.player.position.y = this.height / 2 + dy * (maxDist / dist);
    }
  }

  private handleSequenceInput(num: number) {
    const result = this.sequenceManager.checkInput(num);
    const currentInput = this.sequenceManager.currentInput;

    this.game.state = { ...this.game.state, currentInput };

    switch (result) {
      case "COMPLETE":
        cloneAudio(assets.audio.info).play();
        this.dimensius.takeDamage(PLAYER_DMG);
        this.multiplier++;

        this.game.state = {
          ...this.game.state,
          multiplier: this.multiplier,
          targetSequence: this.sequenceManager.generate(3, 1, 3),
          currentInput: [],
        };
        break;
      case "FAILURE":
        cloneAudio(assets.audio.wrong).play();
        this.multiplier = 1;
        this.game.state = { ...this.game.state, multiplier: 1 };
        break;
      case "MATCH":
        // Good input, waiting for next
        break;
    }
  }

  reset = () => {
    this.clear();

    this.player.respawn();
    this.dimensius.reset();

    this.lives = 3;
    this.score = 0;
    this.multiplier = 1;

    this.add(this.dimensius);
    this.add(this.player);
    this.spawnVoidStars();

    this.game.state = {
      lives: this.lives,
      score: 0,
      multiplier: 1,
      currentInput: [],
      targetSequence: this.sequenceManager.generate(3, 1, 3),
    };
  };
}
