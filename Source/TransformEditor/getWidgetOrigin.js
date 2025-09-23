import { Cartesian3, Check, Matrix4 } from "@cesium/engine";

const noScale = new Cartesian3(1.0, 1.0, 1.0);
const matrixScratch = new Matrix4();
const scaleScratch = new Cartesian3();

/**
 * Computes the transform editor widget origin from the transform and the origin offset
 * @param {Matrix4} transform The transform
 * @ionsdk
 * @param {Cartesian3} originOffset The offset from the transform origin
 * @param {Cartesian3} result
 * @return {Cartesian3}
 *
 * @private
 */
function getWidgetOrigin(transform, originOffset, result) {
  //>>includeStart('debug', pragmas.debug);
  Check.defined("transform", transform);
  Check.defined("originOffset", originOffset);
  Check.defined("result", result);
  //>>includeEnd('debug');

  const startScale = Matrix4.getScale(transform, scaleScratch);
  const modelMatrix = Matrix4.setScale(transform, noScale, matrixScratch);

  return Matrix4.multiplyByPoint(
    modelMatrix,
    Cartesian3.multiplyComponents(originOffset, startScale, result),
    result,
  );
}
export default getWidgetOrigin;
