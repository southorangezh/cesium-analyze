/**
 * An enum describing the x, y, and z axes and helper conversion functions.
 *
 * @enum {String}
 * @ionsdk
 */
const EditorMode = {
  /**
   * Translation mode.
   *
   * @type {Number}
   * @constant
   */
  TRANSLATION: "translation",

  /**
   * Rotation mode.
   *
   * @type {Number}
   * @constant
   */
  ROTATION: "rotation",

  /**
   * Scale mode.
   *
   * @type {Number}
   * @constant
   */
  SCALE: "scale",
};

export default Object.freeze(EditorMode);
