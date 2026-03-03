import { createSvgElement } from './create-element';

// Re-export createSvgElement for convenience
export { createSvgElement };

/**
 * Create an SVG group element
 * @returns A new SVG group element
 */
export const createSvgGroup = (): SVGGElement => {
  return createSvgElement('g') as SVGGElement;
};

/**
 * Create an SVG rectangle element
 * @param x X position
 * @param y Y position
 * @param width Width
 * @param height Height
 * @returns A new SVG rect element
 */
export const createSvgRect = (
  x: number,
  y: number,
  width: number,
  height: number,
): SVGRectElement => {
  const rect = createSvgElement('rect') as SVGRectElement;
  rect.setAttribute('x', x.toString());
  rect.setAttribute('y', y.toString());
  rect.setAttribute('width', width.toString());
  rect.setAttribute('height', height.toString());
  return rect;
};

/**
 * Create an SVG circle element
 * @param cx Center X position
 * @param cy Center Y position
 * @param r Radius
 * @returns A new SVG circle element
 */
export const createSvgCircle = (
  cx: number,
  cy: number,
  r: number,
): SVGCircleElement => {
  const circle = createSvgElement('circle') as SVGCircleElement;
  circle.setAttribute('cx', cx.toString());
  circle.setAttribute('cy', cy.toString());
  circle.setAttribute('r', r.toString());
  return circle;
};

/**
 * Create an SVG path element
 * @param d Path data string
 * @returns A new SVG path element
 */
export const createSvgPath = (d: string): SVGPathElement => {
  const path = createSvgElement('path') as SVGPathElement;
  path.setAttribute('d', d);
  return path;
};

/**
 * Create an SVG text element
 * @param text Text content
 * @param x X position
 * @param y Y position
 * @returns A new SVG text element
 */
export const createSvgText = (
  text: string,
  x: number,
  y: number,
): SVGTextElement => {
  const textElement = createSvgElement('text') as SVGTextElement;
  textElement.textContent = text;
  textElement.setAttribute('x', x.toString());
  textElement.setAttribute('y', y.toString());
  return textElement;
};
