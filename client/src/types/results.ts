class Result {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  public getText(): string {
    return this.text;
  }
}

export default Result;
