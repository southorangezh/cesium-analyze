import { Cartesian3, defined } from "@cesium/engine";

const stride = 7;
const normalsOffset = 0;

/**
 * @private
 * @ionsdk
 */
function SphericalPolygonShaderSupport() {}

function kDopFacetNormalName(i, j) {
  return `u_kDopFacetNormal_${i}_${j}`;
}

function convexHullImplicitSurfaceFunction(
  numberOfVertices,
  vertices,
  name,
  depth,
  normals,
  useUniformsForNormals,
) {
  const length = vertices.length;
  let glsl = "";
  let result = "";
  const even = depth % 2 === 0;
  const sign = even ? "+" : "-";
  const oppositeSign = even ? "-" : "+";
  const count = depth === 0 ? length : length - 1;
  for (let i = 0; i < count; ++i) {
    const j = i + 1 === length ? 0 : i + 1;
    const initialIndex = vertices[i];
    const finalIndex = vertices[j];
    const uniform =
      initialIndex < finalIndex
        ? kDopFacetNormalName(initialIndex, finalIndex)
        : kDopFacetNormalName(finalIndex, initialIndex);
    let argument;
    if (useUniformsForNormals) {
      argument = (initialIndex < finalIndex ? sign : oppositeSign) + uniform;
    } else {
      const normal = normals[uniform];
      argument = `${initialIndex < finalIndex ? sign : oppositeSign}vec3(${
        normal.x
      }, ${normal.y}, ${normal.z})`;
    }
    if (i === 0) {
      result += `\tfloat value = dot(direction, ${argument});\n`;
    } else {
      result += `\tvalue = max(value, dot(direction, ${argument}));\n`;
    }
  }
  glsl += `\nfloat ${name}(vec3 direction)\n{\n${result}\treturn value;\n}\n`;
  return glsl;
}

function sphericalPolygonImplicitSurfaceFunction(
  numberOfVertices,
  hull,
  name,
  depth,
  normals,
  useUniformsForNormals,
) {
  let result = "";
  if (defined(hull.holes)) {
    const deeper = depth + 1;
    for (let h = 0; h < hull.holes.length; ++h) {
      const functionName = `${name}_${h}`;
      result += sphericalPolygonImplicitSurfaceFunction(
        numberOfVertices,
        hull.holes[h],
        functionName,
        deeper,
        normals,
        useUniformsForNormals,
      );
    }
  }
  result += convexHullImplicitSurfaceFunction(
    numberOfVertices,
    hull,
    name,
    depth,
    normals,
    useUniformsForNormals,
  );
  return result;
}

function getNormals(directions, floats, hull, normals) {
  const numberOfVertices = directions.length;

  if (defined(hull.holes)) {
    for (let h = 0; h < hull.holes.length; ++h) {
      getNormals(directions, floats, hull.holes[h], normals);
    }
  }
  const length = hull.length;
  for (let i = 0; i < length; ++i) {
    const j = i + 1 === length ? 0 : i + 1;
    const initialIndex = hull[i];
    const finalIndex = hull[j];

    const lastDirection = directions[initialIndex];
    const direction = directions[finalIndex];
    const name =
      initialIndex < finalIndex
        ? kDopFacetNormalName(initialIndex, finalIndex)
        : kDopFacetNormalName(finalIndex, initialIndex);

    if (!defined(normals[name])) {
      const difference =
        initialIndex < finalIndex
          ? finalIndex - initialIndex
          : finalIndex + numberOfVertices - initialIndex;
      let temp = new Cartesian3();
      if (difference === 1) {
        temp = Cartesian3.fromArray(
          floats,
          finalIndex * stride + normalsOffset,
          temp,
        );
        temp = initialIndex < finalIndex ? temp : Cartesian3.negate(temp, temp);
      } else {
        temp =
          initialIndex < finalIndex
            ? Cartesian3.cross(direction, lastDirection, temp)
            : Cartesian3.cross(lastDirection, direction, temp);
      }
      normals[name] = temp;
    }
  }
}

function aggregateFunction(hull, functionName, variableName) {
  let result = `\tfloat ${variableName} = ${functionName}(direction);\n`;
  if (defined(hull.holes)) {
    for (let i = 0; i < hull.holes.length; ++i) {
      const variable = `${variableName}_${i}`;
      const name = `${functionName}_${i}`;
      const hole = hull.holes[i];
      result += `\tfloat ${variable} = -${name}(direction);\n`;
      if (defined(hole.holes)) {
        for (let j = 0; j < hole.holes.length; ++j) {
          const v = `${variable}_${j}`;
          result += aggregateFunction(hole.holes[j], `${name}_${j}`, v);
          result += `\t${variable} = min(${variable}, ${v});\n`;
        }
      }
      result += `\t${variableName} = max(${variableName}, ${variable});\n`;
    }
  }
  return result;
}

function returnUniform(value) {
  return function () {
    return value;
  };
}

SphericalPolygonShaderSupport.uniforms = function (sphericalPolygon) {
  const directions = sphericalPolygon._directions;
  const floats = sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared;
  const convexHull = sphericalPolygon.convexHull;

  const normals = {};
  getNormals(directions, floats, convexHull, normals);

  const uniforms = {};
  for (const normal in normals) {
    if (normals.hasOwnProperty(normal)) {
      uniforms[normal] = returnUniform(normals[normal]);
    }
  }
  return uniforms;
};

SphericalPolygonShaderSupport.implicitSurfaceFunction = function (
  sphericalPolygon,
  useUniformsForNormals,
) {
  const directions = sphericalPolygon._directions;
  const floats = sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared;
  const convexHull = sphericalPolygon.convexHull;

  const normals = {};
  getNormals(directions, floats, convexHull, normals);

  let glsl = "\n";
  if (useUniformsForNormals) {
    // Emit uniforms.
    for (const normal in normals) {
      if (normals.hasOwnProperty(normal)) {
        glsl += `uniform vec3 ${normal};\n`;
      }
    }
  }

  // Emit convex hull functions.
  const functionName = "convexHull";
  const variableName = "value";
  const depth = 0;
  glsl += sphericalPolygonImplicitSurfaceFunction(
    directions.length,
    convexHull,
    functionName,
    depth,
    normals,
    useUniformsForNormals,
  );
  // Emit implicit surface function.
  const result = aggregateFunction(convexHull, functionName, variableName);
  glsl += `\nfloat sensorSurfaceFunction(vec3 displacement)\n{\n\tvec3 direction = normalize(displacement);\n${result}\treturn ${variableName};\n}\n`;
  return glsl;
};
export default SphericalPolygonShaderSupport;
