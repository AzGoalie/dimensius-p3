export type SequenceResult = "MATCH" | "COMPLETE" | "FAILURE";

export class SequenceManager {
  private target: number[] = [];
  private current: number[] = [];

  get targetSequence(): number[] {
    return [...this.target];
  }

  get currentInput(): number[] {
    return [...this.current];
  }

  generate(length: number, min: number, max: number): number[] {
    this.target = [];
    this.current = [];
    for (let i = 0; i < length; i++) {
      this.target.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return this.target;
  }

  checkInput(value: number): SequenceResult {
    if (this.target.length === 0) return "FAILURE";

    const expected = this.target[this.current.length];

    if (value === expected) {
      this.current.push(value);

      if (this.current.length === this.target.length) {
        return "COMPLETE";
      }
      return "MATCH";
    } else {
      this.resetProgress();
      return "FAILURE";
    }
  }

  resetProgress() {
    this.current = [];
  }

  clear() {
    this.target = [];
    this.current = [];
  }
}
