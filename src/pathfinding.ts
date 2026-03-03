import { paths } from './path';
import { gridWidth, gridHeight } from './svg';
import type { GridCell, PathRoute } from './types';

let gridData: GridCell[] = [];

/**
 * Update the grid data structure for pathfinding
 * Builds a graph of connected path cells
 */
export const updateGridData = (): void => {
  gridData = [];

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      gridData.push({ x, y, neighbors: [] });
    }
  }

  paths.forEach((path) => {
    const fromNode = gridData.find((d) => d.x === path.points[0].x && d.y === path.points[0].y);
    const toNode = gridData.find((d) => d.x === path.points[1].x && d.y === path.points[1].y);

    if (fromNode && toNode) {
      fromNode.neighbors.push({ x: path.points[1].x, y: path.points[1].y });
      toNode.neighbors.push({ x: path.points[0].x, y: path.points[0].y });
    }
  });
};

/**
 * Breadth-first search for pathfinding
 * @param currentGridData The current grid data structure
 * @param from Starting point
 * @param to Target points (can be multiple cells for farm destination)
 * @returns Array of path points, or undefined if no path found
 */
const breadthFirstSearch = (
  currentGridData: GridCell[],
  from: GridCell,
  to: GridCell[],
): PathRoute[] | undefined => {
  const queue: { node: GridCell; path: PathRoute[] }[] = [{ node: from, path: [] }];
  const visited: GridCell[] = [];

  while (queue.length) {
    const { node, path } = queue.shift()!;

    if (node === undefined) {
      // Not sure how nodes could be undefined but fine?
      return undefined;
    }

    // Are we at the end?
    if (to.find((t) => node.x === t.x && node.y === t.y)) {
      return path.concat({ x: node.x, y: node.y });
    }

    const hasVisited = visited
      .some((visitedNode) => visitedNode.x === node.x && visitedNode.y === node.y);

    if (!hasVisited) {
      visited.push(node);

      const verticalHorizontalNeighbors: GridCell[] = [];
      const diagonalNeighbors: GridCell[] = [];

      node.neighbors.forEach((neighbor) => {
        const neighborNode = currentGridData.find((c) => c.x === neighbor.x && c.y === neighbor.y);

        if (!neighborNode) return;

        if (Math.abs(neighbor.x - node.x) === 1 && neighbor.y === node.y) {
          verticalHorizontalNeighbors.push(neighborNode);
        } else if (Math.abs(neighbor.y - node.y) === 1 && neighbor.x === node.x) {
          verticalHorizontalNeighbors.push(neighborNode);
        } else {
          diagonalNeighbors.push(neighborNode);
        }
      });

      verticalHorizontalNeighbors.forEach((neighbor) => {
        const hasVisitedNeighbor = visited.some(
          (visitedNode) => visitedNode.x === neighbor.x && visitedNode.y === neighbor.y,
        );

        if (!hasVisitedNeighbor) {
          queue.push({
            node: currentGridData.find((c) => c.x === neighbor.x && c.y === neighbor.y)!,
            path: path.concat({
              ...node,
              distance: 1,
            }),
          });
        }
      });

      diagonalNeighbors.forEach((neighbor) => {
        const hasVisitedNeighbor = visited.some(
          (visitedNode) => visitedNode.x === neighbor.x && visitedNode.y === neighbor.y,
        );

        if (!hasVisitedNeighbor) {
          queue.push({
            node: currentGridData.find((c) => c.x === neighbor.x && c.y === neighbor.y)!,
            path: path.concat({
              ...node,
              distance: 1.41, // Approx Math.sqrt(2)
            }),
          });
        }
      });
    }
  }

  return undefined; // Can't get there at all!
};

/**
 * Find a route from one point to another using A* pathfinding
 * @param from Starting coordinates
 * @param to Target coordinates (can be multiple)
 * @returns Array of path points, or undefined if no path found
 */
export const findRoute = ({ from, to }: { from: { x: number; y: number }; to: { x: number; y: number }[] }): PathRoute[] | undefined => {
  // Convert from and to to actual grid nodes
  const fromNode = gridData.find((c) => c.x === from.x && c.y === from.y);
  const toNodes = gridData.filter((c) => to.find((f) => c.x === f.x && c.y === f.y));

  if (!fromNode || toNodes.length === 0) {
    return undefined;
  }

  return breadthFirstSearch(
    gridData,
    fromNode,
    toNodes,
  );
};
