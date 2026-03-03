/**
 * Create a generic HTML element
 * @param tagName The HTML tag name (defaults to 'div')
 * @returns A new HTML element
 */
export const createElement = (tagName: string = 'div'): HTMLElement => {
  return document.createElement(tagName) as HTMLElement;
};

/**
 * Create an SVG element
 * @param tagName The SVG tag name (defaults to 'g')
 * @returns A new SVG element
 */
export const createSvgElement = (tagName: string = 'g'): SVGElement => {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName) as SVGElement;
};
