/**
 * Main Canvas renderer using ExcaliburJS Graphics API
 * Manages dual-rendering system (SVG as fallback, Canvas as opt-in)
 */
import { Engine, Scene, Actor, Color } from 'excalibur';
import { Vector } from 'excalibur';
import { Circle, Rectangle } from 'excalibur';
import {
  gridSvgWidth,
  gridSvgHeight,
} from './svg';
import { toCanvasCoord, toCanvasCoords } from './canvas-utils';
import { canvasLayers, getCanvasLayer } from './layers';

/**
 * Canvas renderer for Excalibur game
 */
export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private engine: Engine;
  private scene: Scene;

  constructor(engine: Engine, scene: Scene) {
    this.engine = engine;
    this.scene = scene;

    // Get 2D canvas context
    this.ctx = engine.canvas.getContext('2d')!;
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);
  }

  /**
   * Draw a circle using Graphics.Circle
   */
  drawCircle(
    layerName: string,
    x: number,
    y: number,
    radius: number,
    color: string,
  ): void {
    const layer = getCanvasLayer(layerName);
    if (!layer || !layer.visible) return;

    const actor = new Actor({
      pos: { x: toCanvasCoord(x), y: toCanvasCoord(y) },
      anchor: Vector.Half,
    });
    actor.graphics.use(new Circle({
      radius,
      color: Color.fromHex(color),
    }));
    this.scene.add(actor);
    layer.add(actor);
  }

  /**
   * Draw a rectangle using Graphics.Rectangle
   */
  drawRect(
    layerName: string,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    rx?: number,
  ): void {
    const layer = getCanvasLayer(layerName);
    if (!layer || !layer.visible) return;

    const actor = new Actor({
      pos: { x: toCanvasCoord(x), y: toCanvasCoord(y) },
      anchor: Vector.Half,
    });
    actor.graphics.use(new Rectangle({
      width,
      height,
      color: Color.fromHex(color),
    }));
    this.scene.add(actor);
    layer.add(actor);
  }

  /**
   * Update all Canvas actors for a frame
   * Should be called after modifying actor properties
   */
  updateActors(): void {
    // Excalibur handles actor updates automatically
    // This method is kept for API compatibility
  }

  /**
   * Clear and remove all actors from a specific layer
   */
  clearLayer(layerName: string): void {
    const layer = getCanvasLayer(layerName);
    if (!layer) return;

    layer.clear();
  }
}
