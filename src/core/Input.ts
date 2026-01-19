class Input {
  private pressedKeys: Set<string> = new Set();
  private justPressedKeys: Set<string> = new Set();

  private bindings: Map<string, string[]> = new Map();

  constructor() {
    window.addEventListener("keydown", ({ code, repeat }) => {
      if (repeat) return;

      this.justPressedKeys.add(code);
      this.pressedKeys.add(code);
    });
    window.addEventListener("keyup", (e) => this.pressedKeys.delete(e.code));
  }

  update() {
    this.justPressedKeys.clear();
  }

  bindAction(action: string, keys: string[]) {
    this.bindings.set(action, keys);
  }

  isActionJustPressed(action: string): boolean {
    const keys = this.bindings.get(action);
    if (!keys) return false;
    return this.isAnyJustPressed(keys);
  }

  isActionDown(action: string): boolean {
    const keys = this.bindings.get(action);
    if (!keys) return false;
    return this.isDownAny(keys);
  }

  isAnyJustPressed(codes: string[]): boolean {
    return codes.some((code) => this.isJustPressed(code));
  }

  isDownAny(codes: string[]): boolean {
    return codes.some((code) => this.isDown(code));
  }

  isJustPressed(code: string): boolean {
    return this.justPressedKeys.has(code);
  }

  isDown(code: string): boolean {
    return this.pressedKeys.has(code);
  }

  getVector(
    negativeX: string,
    positiveX: string,
    negativeY: string,
    positiveY: string
  ): [x: number, y: number] {
    const x =
      (this.isActionDown(positiveX) ? 1 : 0) -
      (this.isActionDown(negativeX) ? 1 : 0);
    const y =
      (this.isActionDown(positiveY) ? 1 : 0) -
      (this.isActionDown(negativeY) ? 1 : 0);

    if (x === 0 && y === 0) return [0, 0];

    const length = Math.sqrt(x ** 2 + y ** 2);
    return [x / length, y / length];
  }
}

const input = new Input();
export { input as Input };
