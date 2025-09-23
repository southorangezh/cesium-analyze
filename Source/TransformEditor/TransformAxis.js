import { Cartesian3, Color } from "@cesium/engine";

/**
 * @private
 * @ionsdk
 */
const TransformAxis = {
  X: "X",
  Y: "Y",
  Z: "Z",
};

TransformAxis.getValue = function (axis) {
  if (axis === TransformAxis.X) {
    return Cartesian3.UNIT_X;
  } else if (axis === TransformAxis.Y) {
    return Cartesian3.UNIT_Y;
  }
  return Cartesian3.UNIT_Z;
};

TransformAxis.getColor = function (axis) {
  if (axis === TransformAxis.X) {
    return Color.RED;
  } else if (axis === TransformAxis.Y) {
    return Color.GREEN;
  }
  return Color.BLUE;
};

export default Object.freeze(TransformAxis);
