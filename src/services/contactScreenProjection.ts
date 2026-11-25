/** Lift the upper corners in screen-local coordinates, fixing both lower corners. */
export function contactTopProjection(width: number, height: number, leftLift: number, rightLift: number): number[] {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  const perspective = (leftLift - rightLift) / (1 + rightLift);
  return [
    1 + perspective, perspective * height / width, 0, perspective / width,
    0, 1 + leftLift, 0, 0,
    0, 0, 1, 0,
    0, -leftLift * height, 0, 1,
  ];
}
