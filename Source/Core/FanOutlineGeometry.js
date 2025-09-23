import {
  BoundingSphere,
  Cartesian3,
  ComponentDatatype,
  DeveloperError,
  Geometry,
  GeometryAttribute,
  GeometryAttributes,
  IndexDatatype,
  PrimitiveType,
  VertexFormat,
  buildModuleUrl,
  defined,
  Frozen,
} from "@cesium/engine";

let scratchCartesian = new Cartesian3();

/**
 * Describes the outline of a {@link FanGeometry}.
 *
 * @alias FanOutlineGeometry
 * @ionsdk
 * @constructor
 *
 * @param {Object} options An object with the following properties:
 * @param {Spherical[]} options.directions The directions, pointing outward from the origin, that defined the fan.
 * @param {Number} [options.radius] The radius at which to draw the fan.
 * @param {Boolean} [options.perDirectionRadius] When set to true, the magnitude of each direction is used in place of a constant radius.
 * @param {Number} [options.numberOfRings=6] The number of outline rings to draw, starting from the outer edge and equidistantly spaced towards the center.
 * @param {VertexFormat} [options.vertexFormat=VertexFormat.DEFAULT] The vertex attributes to be computed.
 */
function FanOutlineGeometry(options) {
  options = options ?? Frozen.EMPTY_OBJECT;

  //>>includeStart('debug', pragmas.debug);
  if (!defined(options.directions)) {
    throw new DeveloperError("options.directions is required");
  }
  if (!options.perDirectionRadius && !defined(options.radius)) {
    throw new DeveloperError(
      "options.radius is required when options.perDirectionRadius is undefined or false.",
    );
  }
  //>>includeEnd('debug');

  this._radius = options.radius;
  this._directions = options.directions;
  this._perDirectionRadius = options.perDirectionRadius;
  this._numberOfRings = options.numberOfRings ?? 6;
  this._vertexFormat = options.vertexFormat ?? VertexFormat.DEFAULT;
  this._workerPath = buildModuleUrl(
    "IonSdkGeometryWorkers/createFanOutlineGeometry.js",
  );
}

/**
 * Computes the geometric representation of a fan outline, including its vertices, indices, and a bounding sphere.
 *
 * @param {FanOutlineGeometry} fanGeometry A description of the fan.
 * @returns {Geometry|undefined} The computed vertices and indices.
 */
FanOutlineGeometry.createGeometry = function (fanGeometry) {
  //>>includeStart('debug', pragmas.debug);
  if (!defined(fanGeometry)) {
    throw new DeveloperError("fanGeometry is required");
  }
  //>>includeEnd('debug');

  const radius = fanGeometry._radius;
  const perDirectionRadius =
    defined(fanGeometry._perDirectionRadius) && fanGeometry._perDirectionRadius;
  const directions = fanGeometry._directions;
  const vertexFormat = fanGeometry._vertexFormat;
  const numberOfRings = fanGeometry._numberOfRings;

  let i;
  let x;
  let ring;
  let length;
  let maxRadius = 0;
  let positions;
  const directionsLength = directions.length;
  const attributes = new GeometryAttributes();

  if (vertexFormat.position) {
    x = 0;
    length = directionsLength * 3 * numberOfRings;
    positions = new Float64Array(length);

    for (ring = 0; ring < numberOfRings; ring++) {
      for (i = 0; i < directionsLength; i++) {
        scratchCartesian = Cartesian3.fromSpherical(
          directions[i],
          scratchCartesian,
        );
        const currentRadius = perDirectionRadius
          ? Cartesian3.magnitude(scratchCartesian)
          : radius;
        const ringRadius = (currentRadius / numberOfRings) * (ring + 1);
        scratchCartesian = Cartesian3.normalize(
          scratchCartesian,
          scratchCartesian,
        );

        positions[x++] = scratchCartesian.x * ringRadius;
        positions[x++] = scratchCartesian.y * ringRadius;
        positions[x++] = scratchCartesian.z * ringRadius;
        maxRadius = Math.max(maxRadius, currentRadius);
      }
    }

    attributes.position = new GeometryAttribute({
      componentDatatype: ComponentDatatype.DOUBLE,
      componentsPerAttribute: 3,
      values: positions,
    });
  }

  x = 0;
  length = directionsLength * 2 * numberOfRings;
  const indices = IndexDatatype.createTypedArray(length / 3, length);

  for (ring = 0; ring < numberOfRings; ring++) {
    const offset = ring * directionsLength;
    for (i = 0; i < directionsLength - 1; i++) {
      indices[x++] = i + offset;
      indices[x++] = i + 1 + offset;
    }
    indices[x++] = i + offset;
    indices[x++] = 0 + offset;
  }

  return new Geometry({
    attributes: attributes,
    indices: indices,
    primitiveType: PrimitiveType.LINES,
    boundingSphere: new BoundingSphere(Cartesian3.ZERO, maxRadius),
  });
};
export default FanOutlineGeometry;
