import { Engine, Scene, Input, InputArgs } from 'excalibur';
import {
  gridSvgWidth,
  gridSvgHeight,
  gridCellSize,
} from './svg';
import { canvasLayers } from './layers';

/**
 * ExcaliburJS engine wrapper that provides:
 * - Engine instance with scene setup
 * - Dual-rendering system (SVG as fallback, Canvas as opt-in)
 */

let useCanvas = false; // Default to SVG rendering

// Check for canvas rendering mode preference
const checkRenderMode = (): void => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('render');
  if (mode === 'canvas') {
    useCanvas = true;
    console.log('Excalibur Canvas rendering mode enabled');
  } else if (mode === 'svg') {
    useCanvas = false;
    console.log('Excalibur SVG rendering mode enabled');
  }
};

// Initialize on page load
if (typeof window !== 'undefined') {
  checkRenderMode();
  window.addEventListener('popstate', checkRenderMode);
}

export const engine = new Engine({
  width: gridSvgWidth,
  height: gridSvgHeight,
});

export const scene = new Scene();

// Toggle between SVG and Canvas rendering
export const setCanvasMode = (canvasMode: boolean): void => {
  useCanvas = canvasMode;
  if (canvasMode) {
    // Enable Canvas layers
    canvasLayers.forEach((layer) => {
      layer.visible = true;
    });
    console.log('Switched to Excalibur Canvas rendering');
  } else {
    // Disable Canvas layers, keep SVG rendering
    canvasLayers.forEach((layer) => {
      layer.visible = false;
    });
    console.log('Switched to SVG rendering');
  }
};

// Input handler to mirror current pointer system
export const createExcaliburInput = (pointerHandler: (event: PointerEvent) => void): InputArgs => ({
  pointer: {
    down: (event: PointerEvent) => {
      pointerHandler(event);
    },
  },
});

// Check render mode on initialization
checkRenderMode();
