/**
 * Layer management for dual-rendering system
 * - SVG layers for the original game rendering
 * - Canvas layers for Excalibur-based canvas rendering
 */

import { Actor, Engine, Scene } from 'excalibur';
import { addGridBackgroundToSvg, addGridToSvg } from './grid';
import {
  svgElement, boardOffsetX, boardOffsetY, boardSvgWidth, boardSvgHeight, gridCellSize, gridLineThickness,
} from './svg';
import { createSvgElement } from './svg-utils';
import { colors, shadowOpacity } from './colors';

// ============================================================================
// SVG LAYERS (Original system)
// ============================================================================

const addAnimalShadowLayer = () => {
  const animalShadowLayer = createSvgElement('g');
  animalShadowLayer.setAttribute('opacity', shadowOpacity);
  animalShadowLayer.setAttribute('transform', 'translate(.3,.3)');
  svgElement.append(animalShadowLayer);
  return animalShadowLayer;
};

const addAnimalLayer = () => {
  const animalLayer = createSvgElement('g');
  animalLayer.setAttribute('stroke-linecap', 'round');
  svgElement.append(animalLayer);
  return animalLayer;
};

const addFenceShadowLayer = () => {
  const fenceShadowLayer = createSvgElement('g');
  fenceShadowLayer.setAttribute('stroke-linecap', 'round');
  fenceShadowLayer.setAttribute('fill', 'none');
  fenceShadowLayer.setAttribute('stroke', colors.black);
  fenceShadowLayer.setAttribute('opacity', shadowOpacity);
  fenceShadowLayer.setAttribute('transform', 'translate(.5,.5)');
  svgElement.append(fenceShadowLayer);
  return fenceShadowLayer;
};

const addRockShadowLayer = () => {
  const rockShadowLayer = createSvgElement('g');
  rockShadowLayer.setAttribute('stroke-linecap', 'round');
  rockShadowLayer.setAttribute('fill', 'none');
  rockShadowLayer.setAttribute('stroke', colors.black);
  rockShadowLayer.setAttribute('opacity', shadowOpacity);
  rockShadowLayer.setAttribute('transform', 'translate(.3,.3)');
  svgElement.append(rockShadowLayer);
  return rockShadowLayer;
};

const addGridBlockLayer = () => {
  const gridBlockLayer = createSvgElement('g');
  gridBlockLayer.setAttribute('fill', 'none');
  svgElement.append(gridBlockLayer);
  return gridBlockLayer;
};

const addFenceLayer = () => {
  const fenceLayer = createSvgElement('g');
  fenceLayer.setAttribute('stroke-linecap', 'round');
  fenceLayer.setAttribute('fill', 'none');
  svgElement.append(fenceLayer);
  return fenceLayer;
};

const addBaseLayer = () => {
  const baseLayer = createSvgElement('g');
  baseLayer.setAttribute('fill', colors.base);
  svgElement.append(baseLayer);
  return baseLayer;
};

const addPathShadowLayer = () => {
  const pathShadowLayer = createSvgElement('g');
  pathShadowLayer.setAttribute('stroke-linecap', 'round');
  pathShadowLayer.setAttribute('fill', 'none');
  pathShadowLayer.setAttribute('stroke', colors.base);
  pathShadowLayer.setAttribute('stroke-width', 3.14);
  svgElement.append(pathShadowLayer);
  return pathShadowLayer;
};

const addPathLayer = () => {
  const pathLayer = createSvgElement('g');
  pathLayer.setAttribute('stroke-linecap', 'round');
  pathLayer.setAttribute('fill', 'none');
  pathLayer.setAttribute('stroke', colors.path);
  pathLayer.setAttribute('stroke-width', 3.14);
  svgElement.append(pathLayer);
  return pathLayer;
};

const addPersonLayer = () => {
  const personLayer = createSvgElement('g');
  personLayer.setAttribute('stroke-linecap', 'round');
  personLayer.setAttribute('fill', 'none');
  svgElement.append(personLayer);
  return personLayer;
};

const addPondLayer = () => {
  const pondLayer = createSvgElement('g');
  svgElement.append(pondLayer);
  return pondLayer;
};

const addYurtAndPersonShadowLayer = () => {
  const shadowLayer = createSvgElement('g');
  shadowLayer.setAttribute('stroke-linecap', 'round');
  shadowLayer.setAttribute('fill', 'none');
  shadowLayer.setAttribute('stroke', colors.black);
  shadowLayer.setAttribute('opacity', 0.2);
  svgElement.append(shadowLayer);
  return shadowLayer;
};

const addYurtLayer = () => {
  const yurtLayer = createSvgElement('g');
  yurtLayer.setAttribute('stroke-linecap', 'round');
  yurtLayer.setAttribute('fill', colors.yurt);
  svgElement.append(yurtLayer);
  return yurtLayer;
};

const addTreeShadowLayer = () => {
  const treeShadowLayer = createSvgElement('g');
  svgElement.append(treeShadowLayer);
  return treeShadowLayer;
};

const addTreeLayer = () => {
  const treeLayer = createSvgElement('g');
  svgElement.append(treeLayer);
  return treeLayer;
};

const addPinLayer = () => {
  const pinLayer = createSvgElement('g');
  pinLayer.setAttribute('stroke-linecap', 'round');
  svgElement.append(pinLayer);
  return pinLayer;
};

const addGridPointerLayer = () => {
  const gridPointerLayer = createSvgElement('rect');
  gridPointerLayer.setAttribute('width', `${boardSvgWidth + gridLineThickness}px`);
  gridPointerLayer.setAttribute('height', `${boardSvgHeight + gridLineThickness}px`);
  gridPointerLayer.setAttribute('transform', `translate(${boardOffsetX * gridCellSize - gridLineThickness} ${boardOffsetY * gridCellSize - gridLineThickness})`);
  gridPointerLayer.setAttribute('fill', 'none');
  gridPointerLayer.setAttribute('stroke-width', 0);
  gridPointerLayer.style.cursor = 'cell';
  gridPointerLayer.style.pointerEvents = 'all';
  svgElement.append(gridPointerLayer);
  return gridPointerLayer;
};

// Order is important here, because it determines stacking in the SVG
const svgLayers = {
  gridBackgroundLayer: addGridBackgroundToSvg(),
  pondLayer: addPondLayer(),
  gridLayer: addGridToSvg(),
  gridBlockLayer: addGridBlockLayer(),
  baseLayer: addBaseLayer(),
  pathShadowLayer: addPathShadowLayer(),
  rockShadowLayer: addRockShadowLayer(),
  pathLayer: addPathLayer(),
  animalShadowLayer: addAnimalShadowLayer(),
  yurtAndPersonShadowLayer: addYurtAndPersonShadowLayer(),
  animalLayer: addAnimalLayer(),
  personLayer: addPersonLayer(),
  fenceShadowLayer: addFenceShadowLayer(),
  fenceLayer: addFenceLayer(),
  treeShadowLayer: addTreeShadowLayer(),
  yurtLayer: addYurtLayer(),
  treeLayer: addTreeLayer(),
  pinLayer: addPinLayer(),
  gridPointerLayer: addGridPointerLayer(),
};

export const {
  animalLayer,
  animalShadowLayer,
  baseLayer,
  fenceLayer,
  fenceShadowLayer,
  gridBlockLayer,
  gridLayer,
  gridPointerLayer,
  pathLayer,
  pathShadowLayer,
  personLayer,
  pinLayer,
  pondLayer,
  rockShadowLayer,
  treeLayer,
  treeShadowLayer,
  yurtAndPersonShadowLayer,
  yurtLayer,
} = svgLayers;

export const clearLayers = () => {
  animalLayer.innerHTML = '';
  animalShadowLayer.innerHTML = '';
  baseLayer.innerHTML = '';
  fenceLayer.innerHTML = '';
  fenceShadowLayer.innerHTML = '';
  gridBlockLayer.innerHTML = '';
  pathLayer.innerHTML = '';
  pathShadowLayer.innerHTML = '';
  personLayer.innerHTML = '';
  pinLayer.innerHTML = '';
  pondLayer.innerHTML = '';
  rockShadowLayer.innerHTML = '';
  treeLayer.innerHTML = '';
  treeShadowLayer.innerHTML = '';
  yurtAndPersonShadowLayer.innerHTML = '';
  yurtLayer.innerHTML = '';
};

// ============================================================================
// CANVAS LAYERS (Excalibur-based system)
// ============================================================================

/**
 * Canvas layer wrapper since Excalibur 0.32.0 doesn't have SceneLayer API
 * This provides a simple layer interface for the canvas renderer
 */
class CanvasLayer {
  actors: Map<string, Actor> = new Map();
  visible: boolean = true;

  add(actor: Actor): void {
    this.actors.set(actor.id, actor);
  }

  remove(actor: Actor): void {
    this.actors.delete(actor.id);
  }

  clear(): void {
    this.actors.forEach((actor) => actor.kill());
    this.actors.clear();
  }
}

/**
 * Map of canvas layers for Excalibur-based rendering
 */
export const canvasLayers: Map<string, CanvasLayer> = new Map();

/**
 * Get a canvas layer by name
 * @param layerName - The name of the layer to retrieve
 * @returns The CanvasLayer or undefined if not found
 */
export const getCanvasLayer = (layerName: string): CanvasLayer | undefined => {
  if (!canvasLayers.has(layerName)) {
    canvasLayers.set(layerName, new CanvasLayer());
  }
  return canvasLayers.get(layerName);
};
