class Color {
  constructor(colorName, r, g, b) {
    this.colorName = colorName;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  SetMatrixPosition(x,y)
  {
    this.x = x;
    this.y = y;
  }

  static StringToRGB(str) {
    return {
      r: parseInt(str.substring(0,2),16),
      g: parseInt(str.substring(2,4),16),
      b: parseInt(str.substring(4,6),16)
    };
  }
}
