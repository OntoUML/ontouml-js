import { Diamond, Path, Point, Rectangle, Text } from '../../src';

describe('Shape tests', () => {
  describe('Rectangular shapes', () => {
    it('should be created with default position and dimensions', () => {
      const rectangle = new Rectangle();

      expect(rectangle.getX()).toEqual(0);
      expect(rectangle.getY()).toEqual(0);
      expect(rectangle.width).toBeGreaterThan(0);
      expect(rectangle.height).toBeGreaterThan(0);
    });

    it('should support moving and resizing', () => {
      const text = new Text();
      text.setX(10);
      text.setY(20);
      text.width = 100;
      text.height = 50;

      expect(text.getX()).toEqual(10);
      expect(text.getY()).toEqual(20);
      expect(text.width).toEqual(100);
      expect(text.height).toEqual(50);
    });

    it('should reject non-positive dimensions', () => {
      const rectangle = new Rectangle();

      expect(() => (rectangle.width = 0)).toThrow();
      expect(() => (rectangle.height = -5)).toThrow();
    });

    it('should serialize into the schema shape', () => {
      const diamond = new Diamond(new Point(5, 6), 30, 40);
      const raw = diamond.toJSON();

      expect(raw.type).toEqual('Diamond');
      expect(raw.topLeft).toEqual({ x: 5, y: 6 });
      expect(raw.width).toEqual(30);
      expect(raw.height).toEqual(40);
    });
  });

  describe('Paths', () => {
    it('should accumulate points', () => {
      const path = new Path();
      path.moveTo(0, 0);
      path.moveTo(10, 20);

      expect(path.points).toHaveLength(2);
      expect(path.points[1].x).toEqual(10);
      expect(path.points[1].y).toEqual(20);
    });

    it('setting points should replace the previous ones', () => {
      const path = new Path([new Point(0, 0), new Point(1, 1)]);
      path.points = [new Point(2, 2)];

      expect(path.points).toHaveLength(1);
      expect(path.points[0].x).toEqual(2);
    });

    it('should serialize its points', () => {
      const path = new Path([new Point(0, 0), new Point(10, 20)]);
      const raw = path.toJSON();

      expect(raw.type).toEqual('Path');
      expect(raw.points).toEqual([
        { x: 0, y: 0 },
        { x: 10, y: 20 }
      ]);
    });
  });

  describe('Points', () => {
    it('should print as coordinates', () => {
      expect(new Point(3, 4).toString()).toEqual('(3, 4)');
    });
  });
});
