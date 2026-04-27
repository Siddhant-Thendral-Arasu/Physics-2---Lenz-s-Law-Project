// Physics: Handles current calculations for the sim
export const STATE = {
    direction: 0,
    orientation: 0,
    posY: 0,
    advancedStatus: false,
    radius: 3,
    arrowCount: 12
}

export function currentAtZ(z) {
    return (27 * z) / Math.pow(z * z + 9, 2.5);
}

export function getNormalizedCurrent(y) {
  const maxCurrent = currentAtZ(1.5);
  return currentAtZ(3 + y) / maxCurrent;
}

export function getDirectionalCurrent(y, direction, orientation) {
    const mag = getNormalizedCurrent(y);
    const isPositive = (direction === 1 && orientation === 0) || (direction === 0 && orientation === 1);
    return isPositive ? mag : -mag;
}