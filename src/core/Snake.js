export class Snake {
  constructor(color = "black") {
    this.segments = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];

    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };

    this.color = color;
  }

  setDirection(dx, dy) {
    const isOpposite = dx === -this.direction.x && dy === -this.direction.y;
    if (isOpposite) return;

    this.nextDirection = { x: dx, y: dy };
  }

  update() {
    this.direction = this.nextDirection;

    const head = this.segments[0];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    this.segments.unshift(newHead);
    this.segments.pop();
  }

  draw(ctx, tileSize) {
    ctx.fillStyle = this.color;

    const bodyPad = 4;
    const bodySize = tileSize - bodyPad;

    const headPad = 2;
    const headSize = tileSize - headPad;

    this.segments.forEach((seg, index) => {
      const pad = index === 0 ? headPad : bodyPad;
      const size = index === 0 ? headSize : bodySize;

      ctx.fillRect(
        seg.x * tileSize + pad / 2,
        seg.y * tileSize + pad / 2,
        size,
        size
      );
    });
  }
}
