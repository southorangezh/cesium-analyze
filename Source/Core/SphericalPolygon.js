import { Cartesian3, defined } from "@cesium/engine";

const stride = 7;

/**
 * A simple polygon on the unit sphere {S2}.
 *
 * @private
 * @ionsdk
 */
function SphericalPolygon(vertices) {
  this._isConvex = undefined;
  this._vertices = [];
  this._directions = [];

  this._referenceAxis = undefined;
  this._referenceDistance = undefined;

  this._normalsAndBisectorsWithMagnitudeSquared = undefined;

  if (defined(vertices)) {
    this.vertices = vertices;
  }

  this._convexHull = [];
}

let chord21 = new Cartesian3();
let chord23 = new Cartesian3();
let average = new Cartesian3();

function computeCircumscribingConeFromThreePoints(p1, p2, p3, axis) {
  chord21 = Cartesian3.subtract(p1, p2, chord21);
  chord23 = Cartesian3.subtract(p3, p2, chord23);
  axis = Cartesian3.normalize(Cartesian3.cross(chord23, chord21, axis), axis);
  average = Cartesian3.divideByScalar(
    Cartesian3.add(Cartesian3.add(p1, p2, average), p3, average),
    3.0,
    average,
  );
  const distance = Cartesian3.dot(average, axis);
  return distance;
}

function computeCircumscribingConeFromTwoPoints(p1, p2, axis) {
  axis = Cartesian3.divideByScalar(Cartesian3.add(p1, p2, axis), 2.0, axis);
  const distance = Cartesian3.magnitude(axis);
  axis = Cartesian3.normalize(axis, axis);
  return distance;
}

const axis12 = new Cartesian3();
const axis23 = new Cartesian3();
const axis31 = new Cartesian3();

function computeMinimumBoundingConeFromThreePoints(p1, p2, p3, axis) {
  const distance12 = computeCircumscribingConeFromTwoPoints(p1, p2, axis12);
  const distance23 = computeCircumscribingConeFromTwoPoints(p2, p3, axis23);
  const distance31 = computeCircumscribingConeFromTwoPoints(p3, p1, axis31);

  if (distance12 <= distance23) {
    if (distance12 <= distance31) {
      // cone12 is largest.
      if (Cartesian3.dot(p3, axis12) >= distance12) {
        // p3 is inside cone12
        axis = Cartesian3.clone(axis12, axis);
        return distance12;
      }
      return computeCircumscribingConeFromThreePoints(p1, p2, p3, axis);
    } // cone 31 is largest.
    if (Cartesian3.dot(p2, axis31) >= distance31) {
      // p2 is inside cone31
      axis = Cartesian3.clone(axis31, axis);
      return distance31;
    }
    return computeCircumscribingConeFromThreePoints(p1, p2, p3, axis);
  } else if (distance23 <= distance31) {
    // cone23 is largest.
    if (Cartesian3.dot(p1, axis23) >= distance23) {
      // p1 is inside cone23
      axis = Cartesian3.clone(axis23, axis);
      return distance23;
    }
    return computeCircumscribingConeFromThreePoints(p1, p2, p3, axis);
  } // cone31 is largest.
  if (Cartesian3.dot(p2, axis31) >= distance31) {
    // p2 is inside cone31
    axis = Cartesian3.clone(axis31, axis);
    return distance31;
  }
  return computeCircumscribingConeFromThreePoints(p1, p2, p3, axis);
}

let lastNormal = new Cartesian3();
let nextNormal = new Cartesian3();
const crossProduct = new Cartesian3();

SphericalPolygon.findConvexHull = function (
  directions,
  sign,
  initialIndex,
  finalIndex,
  hull,
) {
  const numberOfVertices = directions.length;

  hull.length = 0;
  if (initialIndex < finalIndex) {
    for (let i = initialIndex; i <= finalIndex; ++i) {
      hull.push(i);
    }
  } else {
    for (let j = initialIndex; j < numberOfVertices; ++j) {
      hull.push(j);
    }
    for (let jj = 0; jj <= finalIndex; ++jj) {
      hull.push(jj);
    }
  }

  const originalLength = hull.length;

  let initialLength;
  do {
    initialLength = hull.length;
    let previousIndex = initialLength - 1;
    let index = 0;
    let nextIndex = 1;
    do {
      const lastDirection = directions[hull[previousIndex % hull.length]];
      const direction = directions[hull[index % hull.length]];
      const nextDirection = directions[hull[nextIndex % hull.length]];

      lastNormal = Cartesian3.cross(direction, lastDirection, lastNormal);
      nextNormal = Cartesian3.cross(nextDirection, direction, nextNormal);

      if (
        sign *
          Cartesian3.dot(
            Cartesian3.cross(lastNormal, nextNormal, crossProduct),
            direction,
          ) >=
        0.0
      ) {
        previousIndex = index;
        index = index + 1;
        nextIndex = index + 1;
      } else {
        hull.splice(index, 1);
      }
    } while (index !== hull.length);
  } while (hull.length !== initialLength);

  if (hull.length < 3) {
    hull.length = 0;
  } else if (hull.length !== originalLength) {
    let hole;
    hull.holes = [];

    for (let k = 0; k < hull.length - 1; ++k) {
      const current = hull[k];
      const next = hull[k + 1];
      const difference =
        current < next ? next - current : next + numberOfVertices - current;
      if (difference > 1) {
        hole = [];
        SphericalPolygon.findConvexHull(
          directions,
          sign * -1.0,
          current,
          next,
          hole,
        );
        if (hole.length !== 0) {
          hull.holes.push(hole);
        }
      }
    }

    const firstIndex = hull[0];
    const lastIndex = hull[hull.length - 1];
    if (lastIndex === finalIndex && firstIndex !== initialIndex) {
      hole = [];
      SphericalPolygon.findConvexHull(
        directions,
        sign * -1.0,
        finalIndex,
        firstIndex,
        hole,
      );
      if (hole.length !== 0) {
        hull.holes.push(hole);
      }
    } else if (lastIndex !== finalIndex && firstIndex === initialIndex) {
      hole = [];
      SphericalPolygon.findConvexHull(
        directions,
        sign * -1.0,
        lastIndex,
        initialIndex,
        hole,
      );
      if (hole.length !== 0) {
        hull.holes.push(hole);
      }
    } else if (lastIndex !== finalIndex && firstIndex !== initialIndex) {
      hole = [];
      SphericalPolygon.findConvexHull(
        directions,
        sign * -1.0,
        lastIndex,
        firstIndex,
        hole,
      );
      if (hole.length !== 0) {
        hull.holes.push(hole);
      }
    }
  }
};

const tempAxis = new Cartesian3();

SphericalPolygon.prototype.computeBoundingCone = function (convexHull) {
  const length = convexHull.length;

  for (let i = 0; i < length; ++i) {
    const first = this._directions[convexHull[i]];
    for (let j = i + 1; j < length; ++j) {
      const second = this._directions[convexHull[j]];
      for (let k = j + 1; k < length; ++k) {
        const third = this._directions[convexHull[k]];
        const tempDistance = computeMinimumBoundingConeFromThreePoints(
          first,
          second,
          third,
          tempAxis,
        );
        let l;
        for (l = 0; l < length; ++l) {
          if (l !== i && l !== j && l !== k) {
            const other = this._directions[convexHull[l]];
            if (Cartesian3.dot(other, tempAxis) < tempDistance) {
              break;
            }
          }
        }
        if (l === length) {
          this._referenceAxis = Cartesian3.clone(tempAxis, this._referenceAxis);
          this._referenceDistance = tempDistance;
        }
      }
    }
  }
};

SphericalPolygon.prototype.computeBoundingCone2 = function () {
  const convexHull = this.convexHull;
  const length = convexHull.length;

  // Find the two vertices with the greatest half-angle as the initial bounding cone.
  let index1 = -1;
  let index2 = -1;
  let distance = 1.0;
  for (let i = 0; i < length; ++i) {
    const first = this._directions[convexHull[i]];
    for (let j = i + 1; j < length; ++j) {
      const second = this._directions[convexHull[j]];
      const tempDistance = computeCircumscribingConeFromTwoPoints(
        first,
        second,
        tempAxis,
      );
      if (tempDistance < distance) {
        index1 = i;
        index2 = j;
        this._referenceAxis = Cartesian3.clone(tempAxis, this._referenceAxis);
        this._referenceDistance = tempDistance;
        distance = tempDistance;
      }
    }
  }

  // Form the set of vertices from the two vertices that define the initial bounding cone and the vertices which lay ouside.
  const hull = [];
  for (let k = 0; k < length; ++k) {
    if (k === index1 || k === index2) {
      hull.push(convexHull[k]);
    } else {
      const index = convexHull[k];
      const direction = this._directions[index];
      const dotProduct = Cartesian3.dot(direction, this._referenceAxis);
      if (dotProduct < this._referenceDistance) {
        hull.push(index);
      }
    }
  }

  // If there are vertices outside the bounding cone, find the minimum bounding cone.
  if (hull.length > 2) {
    this.computeBoundingCone(hull);
  }
};

let bisector = new Cartesian3();
let normal = new Cartesian3();
let initialNormal = new Cartesian3();
let finalDirection = new Cartesian3();
let lastDirection = new Cartesian3();

Object.defineProperties(SphericalPolygon.prototype, {
  /**
   * Gets a value indicating whether the spherical polygon is convex.
   *
   * @memberof SphericalPolygon.prototype
   *
   * @type {Boolean}
   * @readonly
   */
  isConvex: {
    get: function () {
      return this._isConvex;
    },
  },

  /**
   * Gets and sets the vertices which define the spherical polygon.  The list of vertices should conform to the following restrictions:
   * <ul>
   *    <li>Duplicate vertices are not allowed.</li>
   *    <li>Consecutive vertices should be less than 180 degrees apart.</li>
   * </ul>
   *
   * @memberof SphericalPolygon.prototype
   *
   * @type {Spherical[]}
   * @readonly
   */
  vertices: {
    get: function () {
      return this._vertices;
    },
    set: function (vertices) {
      if (defined(vertices)) {
        const length = vertices.length;
        const size = length * 2;

        this._normalsAndBisectorsWithMagnitudeSquared = new Float32Array(
          3 * size + length,
        );

        this._isConvex = true;
        finalDirection = Cartesian3.fromSpherical(
          vertices[length - 1],
          finalDirection,
        );
        lastDirection = Cartesian3.clone(finalDirection, lastDirection);

        for (let index = 0; index < length; ++index) {
          const direction = Cartesian3.fromSpherical(vertices[index]); // Allocation of array element.
          bisector = Cartesian3.divideByScalar(
            Cartesian3.add(lastDirection, direction, bisector),
            2.0,
            bisector,
          );
          normal = Cartesian3.normalize(
            Cartesian3.cross(direction, lastDirection, normal),
            normal,
          );

          if (index === 0) {
            initialNormal = Cartesian3.clone(normal, initialNormal);
          } else if (
            Cartesian3.dot(
              Cartesian3.cross(lastNormal, normal, crossProduct),
              lastDirection,
            ) < 0.0
          ) {
            this._isConvex = false;
          }

          this._directions[index] = direction;

          const offset = index * stride;
          this._normalsAndBisectorsWithMagnitudeSquared[offset] = normal.x;
          this._normalsAndBisectorsWithMagnitudeSquared[offset + 1] = normal.y;
          this._normalsAndBisectorsWithMagnitudeSquared[offset + 2] = normal.z;
          this._normalsAndBisectorsWithMagnitudeSquared[offset + 3] =
            bisector.x;
          this._normalsAndBisectorsWithMagnitudeSquared[offset + 4] =
            bisector.y;
          this._normalsAndBisectorsWithMagnitudeSquared[offset + 5] =
            bisector.z;
          this._normalsAndBisectorsWithMagnitudeSquared[offset + 6] =
            Cartesian3.magnitudeSquared(bisector);

          lastDirection = Cartesian3.clone(direction, lastDirection);
          lastNormal = Cartesian3.clone(normal, lastNormal);
        }
        if (
          Cartesian3.dot(
            Cartesian3.cross(lastNormal, initialNormal, crossProduct),
            finalDirection,
          ) < 0.0
        ) {
          this._isConvex = false;
        }

        this._vertices = vertices;
        this._convexHull = [];
        this._referenceAxis = undefined;
        this._referenceDistance = undefined;
      }
    },
  },

  /**
   * Gets the array of vertex indices which form the convex hull of this spherical polygon.
   *
   * @memberof SphericalPolygon.prototype
   *
   * @type {Number[]}
   * @readonly
   */
  convexHull: {
    get: function () {
      if (this._vertices.length !== 0 && this._convexHull.length === 0) {
        SphericalPolygon.findConvexHull(
          this._directions,
          1.0,
          0,
          this._vertices.length - 1,
          this._convexHull,
        );
      }
      return this._convexHull;
    },
  },

  /**
   * Gets the reference axis for the spherical polygon.
   * With the SphericalPolygon#referenceDistance, this axis defines the minimum bounding cone.
   *
   * @memberof SphericalPolygon.prototype
   *
   * @type {Cartesian3}
   * @readonly
   */
  referenceAxis: {
    get: function () {
      if (!defined(this._referenceAxis) && this.convexHull.length > 0) {
        this.computeBoundingCone2();
      }
      return this._referenceAxis;
    },
  },

  /**
   * Gets the reference distance for the spherical polygon.
   * With the SphericalPolygon#referenceAxis, this distance defines the minimum bounding cone.
   *
   * @memberof SphericalPolygon.prototype
   *
   * @type {Number}
   * @readonly
   */
  referenceDistance: {
    get: function () {
      if (!defined(this._referenceDistance) && this.convexHull.length > 0) {
        this.computeBoundingCone2();
      }
      return this._referenceDistance;
    },
  },
});
export default SphericalPolygon;
