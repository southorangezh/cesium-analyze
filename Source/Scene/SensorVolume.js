import {
  BlendingState,
  BoundingSphere,
  Cartesian3,
  ClassificationType,
  ComponentDatatype,
  CullFace,
  DeveloperError,
  Material,
  Matrix3,
  Matrix4,
  StencilFunction,
  StencilOperation,
  clone,
  combine,
  defined,
  Math as CesiumMath,
  BufferUsage,
  DrawCommand,
  Pass,
  ShaderProgram,
  StencilConstants,
  VertexArray,
  Buffer,
  ShaderSource,
  RenderState,
  SensorVolumePortionToDisplay,
  IntersectionTests,
} from "@cesium/engine";
import SensorVolume3DVS from "../Shaders/SensorVolume3DVS.js";
import SensorSurfaceFS from "../Shaders/SensorSurfaceFS.js";
import ShadersSensorVolume from "../Shaders/SensorVolume.js";
import isZeroMatrix from "../Shaders/isZeroMatrix.js";

function Crossing() {
  this.index = undefined;
  this.v = new Cartesian3();
  this.r = new Cartesian3();
  this.cosine = undefined;
  this.sine = undefined;
  this.kind = undefined;
}

/**
 * @private
 * @ionsdk
 */
function SensorVolume() {}

SensorVolume.attributeLocations2D = {
  position: 0,
  cartographic: 1,
};
SensorVolume.numberOfFloatsPerVertex2D = 3 + 2; // (vec3 + vec2)

SensorVolume.attributeLocations3D = {
  position: 0,
  normal: 1,
};
SensorVolume.numberOfFloatsPerVertex3D = 2 * 3; // (2 Cartesians/vertex)(3 floats/Cartesian)

SensorVolume.numberOfSidesForCompleteCircle = 6;
SensorVolume.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand =
  SensorVolume.numberOfSidesForCompleteCircle * 4 * 3; // (number of sides for command)(4 triangles/side)(3 vertices/triangle)
SensorVolume.numberOfVerticesForCompleteHorizonPyramidCommand =
  SensorVolume.numberOfSidesForCompleteCircle * 2 * 3; // (number of sides for command)(2 triangles/side)(3 vertices/triangle)
SensorVolume.numberOfVerticesPerHorizonCommand = 6 * 2 * 3; // (6 rectangular faces/command)(2 triangles/face)(3 vertices/triangle)
SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand =
  SensorVolume.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand *
  SensorVolume.numberOfFloatsPerVertex3D;
SensorVolume.numberOfFloatsForCompleteHorizonPyramidCommand =
  SensorVolume.numberOfVerticesForCompleteHorizonPyramidCommand *
  SensorVolume.numberOfFloatsPerVertex3D;
SensorVolume.numberOfFloatsPerHorizonCommand =
  SensorVolume.numberOfVerticesPerHorizonCommand *
  SensorVolume.numberOfFloatsPerVertex3D;

SensorVolume.maximumRadius = 1000000000.0;

SensorVolume.makeVertexArray2D = function (sensor, context, buffer) {
  const stride =
    SensorVolume.numberOfFloatsPerVertex2D * Float32Array.BYTES_PER_ELEMENT;
  const attributes = [
    {
      index: SensorVolume.attributeLocations2D.position,
      vertexBuffer: buffer,
      componentsPerAttribute: 3,
      componentDatatype: ComponentDatatype.FLOAT,
      offsetInBytes: 0,
      strideInBytes: stride,
    },
    {
      index: SensorVolume.attributeLocations2D.cartographic,
      vertexBuffer: buffer,
      componentsPerAttribute: 2,
      componentDatatype: ComponentDatatype.FLOAT,
      offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
      strideInBytes: stride,
    },
  ];

  return new VertexArray({
    context: context,
    attributes: attributes,
  });
};

SensorVolume.makeVertexArray3D = function (sensor, context, buffer) {
  const stride =
    SensorVolume.numberOfFloatsPerVertex3D * Float32Array.BYTES_PER_ELEMENT;
  const attributes = [
    {
      index: SensorVolume.attributeLocations3D.position,
      vertexBuffer: buffer,
      componentsPerAttribute: 3,
      componentDatatype: ComponentDatatype.FLOAT,
      offsetInBytes: 0,
      strideInBytes: stride,
    },
    {
      index: SensorVolume.attributeLocations3D.normal,
      vertexBuffer: buffer,
      componentsPerAttribute: 3,
      componentDatatype: ComponentDatatype.FLOAT,
      offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
      strideInBytes: stride,
    },
  ];

  return new VertexArray({
    context: context,
    attributes: attributes,
  });
};

function getRenderState2D(context, isTranslucent) {
  if (isTranslucent) {
    return RenderState.fromCache({
      depthMask: false,
      blending: BlendingState.ALPHA_BLEND,
    });
  }
  return RenderState.fromCache({
    depthTest: {
      enabled: true,
    },
  });
}

SensorVolume.getRenderState3D = function (
  sensor,
  context,
  isTranslucent,
  cullFace,
) {
  if (isTranslucent) {
    // Render state for dome surface proxy geometry (used in the for loop to follow).
    return RenderState.fromCache({
      depthTest: {
        enabled: !sensor.showThroughEllipsoid,
      },
      depthMask: false,
      blending: BlendingState.ALPHA_BLEND,
      cull: {
        enabled: true,
        face: cullFace,
      },
    });
  }
  // Render state for dome surface proxy geometry (used in the for loop to follow).
  return RenderState.fromCache({
    depthTest: {
      enabled: true,
    },
    depthMask: true,
    cull: {
      enabled: true,
      face: cullFace,
    },
  });
};

SensorVolume.setRenderStates2D = function (sensor, context, isTranslucent) {
  const rs = getRenderState2D(context, isTranslucent);
  const pass = isTranslucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

  const length = 2;
  for (let index = 0; index < length; ++index) {
    const draw = sensor._drawCommands2D[index];
    const pick = sensor._pickCommands2D[index];

    draw.renderState = rs;
    draw.pass = pass;
    pick.renderState = rs;
    pick.pass = pass;
  }
};

SensorVolume.setEllipsoidHorizonSurfacesRenderStates3D = function (
  sensor,
  context,
  isTranslucent,
) {
  const rs = SensorVolume.getRenderState3D(
    sensor,
    context,
    isTranslucent,
    CullFace.FRONT,
  );
  const pass = isTranslucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

  const length = sensor._ellipsoidHorizonSurfaceColorCommands.length;
  for (let index = 0; index < length; ++index) {
    const ellipsoidHorizonSurfaceColorCommand =
      sensor._ellipsoidHorizonSurfaceColorCommands[index];
    ellipsoidHorizonSurfaceColorCommand.renderState = rs;
    ellipsoidHorizonSurfaceColorCommand.pass = pass;
  }
};

SensorVolume.setDomeSurfacesRenderStates3D = function (
  sensor,
  context,
  isTranslucent,
) {
  const rs = SensorVolume.getRenderState3D(
    sensor,
    context,
    isTranslucent,
    CullFace.FRONT,
  );
  const pass = isTranslucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

  const domeColorCommand = sensor._domeColorCommand;
  domeColorCommand.renderState = rs;
  domeColorCommand.pass = pass;
};

SensorVolume.initialize2D = function (sensor, context, isTranslucent) {
  const vertices = new Float32Array(
    4 * 3 * SensorVolume.numberOfFloatsPerVertex2D,
  ); // triangles*verticesPerTriangle*floatsPerVertex
  sensor._vertices2D = vertices;
  const numberOfFloatsPerCommand = 6 * SensorVolume.numberOfFloatsPerVertex2D;
  sensor._command1Vertices2D = new Float32Array(
    sensor._vertices2D.buffer,
    Float32Array.BYTES_PER_ELEMENT * 0,
    numberOfFloatsPerCommand,
  );
  sensor._command2Vertices2D = new Float32Array(
    sensor._vertices2D.buffer,
    Float32Array.BYTES_PER_ELEMENT * numberOfFloatsPerCommand,
    numberOfFloatsPerCommand,
  );

  const buffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  sensor._vertexBuffer2D = buffer;
  const array = SensorVolume.makeVertexArray2D(sensor, context, buffer);

  const rs = getRenderState2D(context, isTranslucent);
  const pass = isTranslucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

  sensor._drawCommands2D = [];
  sensor._pickCommands2D = [];
  const length = 2;
  for (let index = 0; index < length; ++index) {
    const draw = new DrawCommand({
      owner: sensor,
    });
    const pick = new DrawCommand({
      owner: sensor,
      pickOnly: true,
    });

    draw.vertexArray = array;
    draw.offset = 6 * index;
    draw.count = 6;
    draw.modelMatrix = Matrix4.clone(Matrix4.IDENTITY);
    draw.renderState = rs;
    draw.pass = pass;
    draw.boundingVolume = new BoundingSphere();
    sensor._drawCommands2D.push(draw);

    pick.vertexArray = array;
    pick.offset = 6 * index;
    pick.count = 6;
    pick.modelMatrix = draw.modelMatrix;
    pick.renderState = rs;
    pick.pass = pass;
    pick.boundingVolume = draw.boundingVolume;
    sensor._pickCommands2D.push(pick);
  }
};

function kDopFacetNormalName(i) {
  return `u_kDopFacetNormal${i}`;
}

function kDopImplicitSurfaceFunction(numberOfFacets) {
  let glsl = "";
  let result = "";
  for (let i = 0; i < numberOfFacets; ++i) {
    const uniform = kDopFacetNormalName(i);
    glsl += `uniform vec3 ${uniform};\n`;
    if (i === 0) {
      result += `\tfloat value = dot(displacement, ${uniform});\n`;
    } else {
      result += `\tvalue = max(value, dot(displacement, ${uniform}));\n`;
    }
  }
  glsl += `\nfloat sensorSurfaceFunction(vec3 displacement)\n{\n${result}\treturn value;\n}\n`;
  return glsl;
}

SensorVolume.initializeEllipsoidHorizonSurfaceCommands = function (
  sensor,
  context,
  number,
  primitiveType,
) {
  const length = number + 1; // Add one for the complete ellipsoid horizon surface command.

  sensor._ellipsoidHorizonSurfaceColorCommands = new Array(length);

  const horizonVertices = new Float32Array(
    SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand +
      SensorVolume.numberOfFloatsPerHorizonCommand * number,
  ); // vertices for each side.
  sensor._ellipsoidHorizonSurfaceCommandsVertices = horizonVertices;
  const horizonBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: horizonVertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  sensor._ellipsoidHorizonSurfaceCommandsBuffer = horizonBuffer;
  const horizonVertexArray = SensorVolume.makeVertexArray3D(
    sensor,
    context,
    horizonBuffer,
  );
  sensor._ellipsoidHorizonSurfaceCommandsVertexArray = horizonVertexArray;

  const source = kDopImplicitSurfaceFunction(4);

  for (let index = 0; index < length; ++index) {
    const command = new DrawCommand({
      primitiveType: primitiveType,
      vertexArray: horizonVertexArray,
      owner: sensor,
    });
    sensor._ellipsoidHorizonSurfaceColorCommands[index] = command;
    sensor._ellipsoidHorizonSurfaceColorCommandsSource[index] =
      index === 0 ? sensor._sensorGlsl : source;
  }
};

SensorVolume.setVertices2D = function (
  vertices,
  northEast,
  southEast,
  southWest,
  northWest,
  minLongitude,
  maxLongitude,
  minLatitude,
  maxLatitude,
) {
  let kk = 0;
  vertices[kk++] = southWest.z;
  vertices[kk++] = southWest.x;
  vertices[kk++] = southWest.y;
  vertices[kk++] = minLongitude;
  vertices[kk++] = minLatitude;

  vertices[kk++] = southEast.z;
  vertices[kk++] = southEast.x;
  vertices[kk++] = southEast.y;
  vertices[kk++] = maxLongitude;
  vertices[kk++] = minLatitude;

  vertices[kk++] = northEast.z;
  vertices[kk++] = northEast.x;
  vertices[kk++] = northEast.y;
  vertices[kk++] = maxLongitude;
  vertices[kk++] = maxLatitude;

  vertices[kk++] = northEast.z;
  vertices[kk++] = northEast.x;
  vertices[kk++] = northEast.y;
  vertices[kk++] = maxLongitude;
  vertices[kk++] = maxLatitude;

  vertices[kk++] = northWest.z;
  vertices[kk++] = northWest.x;
  vertices[kk++] = northWest.y;
  vertices[kk++] = minLongitude;
  vertices[kk++] = maxLatitude;

  vertices[kk++] = southWest.z;
  vertices[kk++] = southWest.x;
  vertices[kk++] = southWest.y;
  vertices[kk++] = minLongitude;
  vertices[kk++] = minLatitude;
};

SensorVolume.setBoundingSphere2D = function (points, sphere) {
  sphere = BoundingSphere.fromPoints(points, sphere);
  // swizzle center components
  const center = sphere.center;
  const x = center.x;
  const y = center.y;
  const z = center.z;
  center.x = z;
  center.y = x;
  center.z = y;

  return sphere;
};

SensorVolume.setShaderPrograms2D = function (
  sensor,
  context,
  sensorSourceVS,
  sensorSourceFS,
) {
  const drawSource = new ShaderSource({
    defines: [sensor.showIntersection ? "SHOW_INTERSECTION" : ""],
    sources: [
      isZeroMatrix,
      ShadersSensorVolume,
      sensor._sensorGlsl,
      sensor._ellipsoidSurfaceMaterial.shaderSource,
      sensorSourceFS,
    ],
  });
  const drawCommandsShaderProgram2D = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: sensor._drawCommandsShaderProgram2D,
    vertexShaderSource: sensorSourceVS,
    fragmentShaderSource: drawSource,
    attributeLocations: SensorVolume.attributeLocations2D,
  });
  sensor._drawCommandsShaderProgram2D = drawCommandsShaderProgram2D;

  const pickSource = new ShaderSource({
    defines: [sensor.showIntersection ? "SHOW_INTERSECTION" : ""],
    sources: [
      isZeroMatrix,
      ShadersSensorVolume,
      sensor._sensorGlsl,
      sensor._ellipsoidSurfaceMaterial.shaderSource,
      sensorSourceFS,
    ],
    pickColorQualifier: "uniform",
  });
  const pickCommandsShaderProgram2D = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: sensor._pickCommandsShaderProgram2D,
    vertexShaderSource: sensorSourceVS,
    fragmentShaderSource: pickSource,
    attributeLocations: SensorVolume.attributeLocations2D,
  });
  sensor._pickCommandsShaderProgram2D = pickCommandsShaderProgram2D;

  const pickUniforms = {
    czm_pickColor: function () {
      return sensor._pickId.color;
    },
  };

  const length = 2;
  for (let index = 0; index < length; ++index) {
    const draw = sensor._drawCommands2D[index];
    draw.shaderProgram = drawCommandsShaderProgram2D;
    draw.uniformMap = combine(
      combine(
        combine(sensor._uniforms, sensor._ellipsoidSurfaceMaterial._uniforms),
        sensor._sensorUniforms,
      ),
      sensor._uniforms2D,
    );

    const pick = sensor._pickCommands2D[index];
    pick.shaderProgram = pickCommandsShaderProgram2D;
    pick.uniformMap = combine(
      combine(
        combine(
          combine(sensor._uniforms, sensor._ellipsoidSurfaceMaterial._uniforms),
          sensor._sensorUniforms,
        ),
        sensor._uniforms2D,
      ),
      pickUniforms,
    );
  }
};

SensorVolume.destroyShaderPrograms2D = function (sensor) {
  if (defined(sensor._drawCommandsShaderProgram2D)) {
    sensor._drawCommandsShaderProgram2D.destroy();
  }
  if (defined(sensor._pickCommandsShaderProgram2D)) {
    sensor._pickCommandsShaderProgram2D.destroy();
  }
};

let n = new Cartesian3();
let temp = new Cartesian3();
let junk = new Cartesian3();

function computeBoundingPyramidalVertices(directions, center, sides, vertices) {
  const length = directions.length;
  let k = -1;
  let last = directions[length - 1];
  let lastSide = sides[length - 1];

  for (let index = 0; index < length; ++index) {
    const direction = directions[index];
    const side = sides[index];
    n = Cartesian3.normalize(Cartesian3.cross(direction, last, n), n);
    Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(side, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastSide, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);

    n = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.cross(lastSide, center, temp),
        Cartesian3.cross(side, center, junk),
        n,
      ),
      n,
    );
    Cartesian3.pack(side, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(center, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastSide, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);

    last = direction;
    lastSide = side;
  }
}

function computeBoundingPyramidalFrustumVertices(
  directions,
  frontCenter,
  frontSides,
  backCenter,
  backSides,
  vertices,
) {
  const length = directions.length;
  let k = -1;
  const lastIndex = length - 1;
  let previous = directions[lastIndex];
  let lastFront = frontSides[lastIndex];
  let lastBack = backSides[lastIndex];
  for (let index = 0; index < length; ++index) {
    const current = directions[index];
    const front = frontSides[index];
    const back = backSides[index];
    n = Cartesian3.normalize(Cartesian3.cross(current, previous, n), n);
    Cartesian3.pack(front, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(back, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastBack, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastBack, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastFront, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(front, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);

    n = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.cross(front, frontCenter, temp),
        Cartesian3.cross(lastFront, frontCenter, junk),
        n,
      ),
      n,
    );
    Cartesian3.pack(lastFront, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(frontCenter, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(front, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    n = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.cross(lastBack, backCenter, temp),
        Cartesian3.cross(back, backCenter, junk),
        n,
      ),
      n,
    );
    Cartesian3.pack(back, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(backCenter, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastBack, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);

    previous = current;
    lastFront = front;
    lastBack = back;
  }
}

// Scratch variables...
let d = new Cartesian3();
let direction = new Cartesian3();
let scaledDirection = new Cartesian3();
let reference = new Cartesian3();
let perpendicular = new Cartesian3();
let mostOrthogonalAxis = new Cartesian3();
let orthogonal = new Cartesian3();
const perpendicularPart = new Cartesian3();
const orthogonalPart = new Cartesian3();
let centerFront = new Cartesian3();
let centerBack = new Cartesian3();

SensorVolume.renderCompleteEllipsoidHorizonSurface = function (
  sensor,
  context,
  radius,
  p,
  q,
  qMagnitudeSquared,
  oneOverQ,
  qUnit,
  modelToWorld,
  worldToModel,
) {
  const numberOfSidesForCompleteCircle =
    SensorVolume.numberOfSidesForCompleteCircle;
  const directions = sensor._directions.slice(
    0,
    numberOfSidesForCompleteCircle,
  );
  const increment = CesiumMath.TWO_PI / numberOfSidesForCompleteCircle;

  const factor =
    Math.sqrt(1.0 - 1.0 / qMagnitudeSquared) /
    Math.cos(CesiumMath.PI / numberOfSidesForCompleteCircle);
  mostOrthogonalAxis = Cartesian3.mostOrthogonalAxis(qUnit, mostOrthogonalAxis);
  perpendicular = Cartesian3.normalize(
    Cartesian3.cross(mostOrthogonalAxis, qUnit, perpendicular),
    perpendicular,
  );
  orthogonal = Cartesian3.normalize(
    Cartesian3.cross(qUnit, perpendicular, orthogonal),
    orthogonal,
  );

  reference = Cartesian3.multiplyByScalar(qUnit, oneOverQ, reference);

  d = Cartesian3.negate(
    Cartesian3.normalize(Matrix3.multiplyByVector(worldToModel, p, d), d),
    d,
  );

  const factor2 = 1.0 - qMagnitudeSquared;

  const fronts = sensor._fronts.slice(0, numberOfSidesForCompleteCircle);
  const backs = sensor._backs.slice(0, numberOfSidesForCompleteCircle);
  for (let i = 0; i < SensorVolume.numberOfSidesForCompleteCircle; ++i) {
    const angle = -i * increment;
    temp = Cartesian3.add(
      Cartesian3.multiplyByScalar(
        perpendicular,
        Math.cos(angle),
        perpendicularPart,
      ),
      Cartesian3.multiplyByScalar(orthogonal, Math.sin(angle), orthogonalPart),
      temp,
    );
    temp = Cartesian3.add(
      reference,
      Cartesian3.multiplyByScalar(temp, factor, temp),
      temp,
    );
    temp = sensor.ellipsoid.transformPositionFromScaledSpace(temp, temp);
    temp = Cartesian3.subtract(temp, p, temp);
    direction = Cartesian3.normalize(temp, direction);
    direction = Matrix3.multiplyByVector(worldToModel, direction, direction);
    Cartesian3.clone(direction, directions[i]);
    scaledDirection = sensor.ellipsoid.transformPositionToScaledSpace(
      Matrix3.multiplyByVector(modelToWorld, direction, scaledDirection),
      scaledDirection,
    );
    fronts[i] = Cartesian3.multiplyByScalar(
      direction,
      factor2 / Cartesian3.dot(scaledDirection, q),
      fronts[i],
    );
    const dot = Cartesian3.dot(direction, d);
    backs[i] = Cartesian3.multiplyByScalar(direction, radius / dot, backs[i]);
  }

  scaledDirection = sensor.ellipsoid.transformPositionToScaledSpace(
    Matrix3.multiplyByVector(modelToWorld, d, scaledDirection),
    scaledDirection,
  );
  centerFront = Cartesian3.multiplyByScalar(
    d,
    factor2 / Cartesian3.dot(scaledDirection, q),
    centerFront,
  );
  centerBack = Cartesian3.multiplyByScalar(d, radius, centerBack);

  const numberOfFloats =
    sensor.portionToDisplay === SensorVolumePortionToDisplay.COMPLETE
      ? SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand
      : SensorVolume.numberOfFloatsForCompleteHorizonPyramidCommand;
  const vertices = new Float32Array(
    sensor._ellipsoidHorizonSurfaceCommandsVertices.buffer,
    0,
    numberOfFloats,
  );
  if (sensor.portionToDisplay === SensorVolumePortionToDisplay.COMPLETE) {
    computeBoundingPyramidalFrustumVertices(
      directions,
      centerFront,
      fronts,
      centerBack,
      backs,
      vertices,
    );
  } else if (
    sensor.showThroughEllipsoid ||
    sensor.portionToDisplay ===
      SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON
  ) {
    computeBoundingPyramidalVertices(directions, centerBack, backs, vertices);
  } else if (
    sensor.portionToDisplay ===
    SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON
  ) {
    computeBoundingPyramidalVertices(directions, centerFront, fronts, vertices);
  } else {
    throw new DeveloperError(
      "this.portionToDisplay is required and must be valid.",
    );
  }

  const uniforms = sensor._sensorUniforms;

  const command = sensor._ellipsoidHorizonSurfaceColorCommands[0];
  command.offset = 0;
  command.count =
    sensor.portionToDisplay === SensorVolumePortionToDisplay.COMPLETE
      ? SensorVolume.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand
      : SensorVolume.numberOfVerticesForCompleteHorizonPyramidCommand;
  command.boundingVolume = BoundingSphere.fromVertices(
    vertices,
    undefined,
    SensorVolume.numberOfFloatsPerVertex3D,
    command.boundingVolume,
  );
  command.uniformMap = combine(
    combine(
      combine(sensor._uniforms, sensor._ellipsoidHorizonSurfaceUniforms),
      sensor._ellipsoidHorizonSurfaceMaterial._uniforms,
    ),
    uniforms,
  );
  command.boundingVolume = BoundingSphere.transform(
    command.boundingVolume,
    sensor.modelMatrix,
    command.boundingVolume,
  );
  command.modelMatrix = sensor.modelMatrix;
  sensor._ellipsoidHorizonSurfaceCommandsBuffer.copyFromArrayView(vertices, 0);
  sensor._ellipsoidHorizonSurfaceColorCommandList.push(command);
};

// Scratch variables...
let v1 = new Cartesian3();
let v2 = new Cartesian3();
let v3 = new Cartesian3();
let v4 = new Cartesian3();
let p1 = new Cartesian3();
let p2 = new Cartesian3();
let p3 = new Cartesian3();
let p4 = new Cartesian3();
let r = new Cartesian3();
let v = new Cartesian3();
let s = new Cartesian3();
let d1 = new Cartesian3();
let d2 = new Cartesian3();
let d3 = new Cartesian3();
let d4 = new Cartesian3();
let t1 = new Cartesian3();
let t2 = new Cartesian3();
let sum = new Cartesian3();
let difference = new Cartesian3();
let crossProduct = new Cartesian3();
let bisector = new Cartesian3();
let unitBisector = new Cartesian3();
let inverseUnitBisector = new Cartesian3();
let other = new Cartesian3();
let stuff = new Cartesian3();
let lateral = new Cartesian3();
let longitudinal = new Cartesian3();
let twoMinusOne = new Cartesian3();
let threeMinusOne = new Cartesian3();
let fourMinusOne = new Cartesian3();

function computeBoundingGeometryNearCorners(
  radii,
  r1,
  r2,
  worldToModel,
  p,
  q,
  qMagnitudeSquared,
  portionToDisplay,
) {
  const oneOverMagnitudeSquaredQ = 1.0 / qMagnitudeSquared;

  reference = Cartesian3.multiplyByScalar(
    q,
    oneOverMagnitudeSquaredQ,
    reference,
  );

  crossProduct = Cartesian3.cross(r1, r2, crossProduct);
  const dotProduct = Cartesian3.dot(crossProduct, q);

  t1 = Cartesian3.subtract(r1, reference, t1); // r1 is the "off" crossing.
  t2 = Cartesian3.subtract(r2, reference, t2); // r2 is the "on" crossing.

  sum = Cartesian3.add(t1, t2, sum);
  bisector = Cartesian3.divideByScalar(sum, 2.0, bisector);
  const tMagnitudeSquared = 1.0 - oneOverMagnitudeSquaredQ;
  const tMagnitude = Math.sqrt(tMagnitudeSquared);

  const epsilon = CesiumMath.EPSILON5; // floating point precision for glsl use.
  if (dotProduct < -CesiumMath.EPSILON15) {
    unitBisector = Cartesian3.normalize(bisector, unitBisector);
    other = Cartesian3.multiplyByScalar(
      unitBisector,
      tMagnitude + epsilon,
      other,
    );
    if (
      portionToDisplay === SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON
    ) {
      difference = Cartesian3.subtract(r1, r2, difference);
      lateral = Cartesian3.multiplyByScalar(difference, 0.5, lateral);
      stuff = Cartesian3.add(other, reference, stuff);
      junk = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(stuff, p, junk),
        junk,
      );

      s = Cartesian3.multiplyComponents(r1, radii, s);
      v1 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v1),
        v1,
      );
      const factor1 = (qMagnitudeSquared - 1.0) / Cartesian3.dot(v1, junk);
      v1 = Matrix3.multiplyByScalar(v1, factor1, v1);
      d1 = Cartesian3.normalize(v1, d1);

      s = Cartesian3.multiplyComponents(r2, radii, s);
      v2 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v2),
        v2,
      );
      const factor2 = (qMagnitudeSquared - 1.0) / Cartesian3.dot(v2, junk);
      v2 = Matrix3.multiplyByScalar(v2, factor2, v2);
      d2 = Cartesian3.normalize(v2, d2);

      r = Cartesian3.subtract(stuff, lateral, r);
      s = Cartesian3.multiplyComponents(r, radii, s);
      v3 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v3),
        v3,
      );
      d3 = Cartesian3.normalize(v3, d3);

      r = Cartesian3.add(stuff, lateral, r);
      s = Cartesian3.multiplyComponents(r, radii, s);
      v4 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v4),
        v4,
      );
      d4 = Cartesian3.normalize(v4, d4);
    } else {
      const bisectorMagnitude = Cartesian3.magnitude(bisector);
      const factor = tMagnitudeSquared - tMagnitude * bisectorMagnitude;
      stuff = Cartesian3.multiplyByScalar(reference, factor + epsilon, stuff);

      longitudinal = Cartesian3.subtract(other, bisector, longitudinal);
      longitudinal = Cartesian3.multiplyByScalar(
        longitudinal,
        tMagnitudeSquared + epsilon,
        longitudinal,
      );
      longitudinal = Cartesian3.add(longitudinal, stuff, longitudinal);

      s = Cartesian3.multiplyComponents(r1, radii, s);
      v1 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v1),
        v1,
      );
      d1 = Cartesian3.normalize(v1, d1);

      s = Cartesian3.multiplyComponents(r2, radii, s);
      v2 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v2),
        v2,
      );
      d2 = Cartesian3.normalize(v2, d2);

      r = Cartesian3.add(r2, longitudinal, r);
      s = Cartesian3.multiplyComponents(r, radii, s);
      v3 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v3),
        v3,
      );
      d3 = Cartesian3.normalize(v3, d3);

      r = Cartesian3.add(r1, longitudinal, r);
      s = Cartesian3.multiplyComponents(r, radii, s);
      v4 = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v4),
        v4,
      );
      d4 = Cartesian3.normalize(v4, d4);
    }
  } else {
    difference = Cartesian3.subtract(r1, r2, difference);
    lateral = Cartesian3.multiplyByScalar(
      Cartesian3.normalize(difference, lateral),
      tMagnitude + epsilon,
      lateral,
    );
    if (Cartesian3.magnitudeSquared(sum) > CesiumMath.EPSILON15) {
      unitBisector = Cartesian3.normalize(bisector, unitBisector);
      inverseUnitBisector = Cartesian3.negate(
        unitBisector,
        inverseUnitBisector,
      );
    } else {
      inverseUnitBisector = Cartesian3.normalize(
        Cartesian3.cross(difference, reference, inverseUnitBisector),
        inverseUnitBisector,
      );
    }
    other = Cartesian3.multiplyByScalar(
      inverseUnitBisector,
      tMagnitude + epsilon,
      other,
    );

    r = Cartesian3.add(Cartesian3.add(bisector, lateral, r), reference, r);
    s = Cartesian3.multiplyComponents(r, radii, s);
    v1 = Matrix3.multiplyByVector(
      worldToModel,
      Cartesian3.subtract(s, p, v1),
      v1,
    );
    d1 = Cartesian3.normalize(v1, d1);

    r = Cartesian3.add(Cartesian3.subtract(bisector, lateral, r), reference, r);
    s = Cartesian3.multiplyComponents(r, radii, s);
    v2 = Matrix3.multiplyByVector(
      worldToModel,
      Cartesian3.subtract(s, p, v2),
      v2,
    );
    d2 = Cartesian3.normalize(v2, d2);

    r = Cartesian3.add(Cartesian3.subtract(other, lateral, r), reference, r);
    s = Cartesian3.multiplyComponents(r, radii, s);
    v3 = Matrix3.multiplyByVector(
      worldToModel,
      Cartesian3.subtract(s, p, v3),
      v3,
    );
    d3 = Cartesian3.normalize(v3, d3);

    r = Cartesian3.add(Cartesian3.add(other, lateral, r), reference, r);
    s = Cartesian3.multiplyComponents(r, radii, s);
    v4 = Matrix3.multiplyByVector(
      worldToModel,
      Cartesian3.subtract(s, p, v4),
      v4,
    );
    d4 = Cartesian3.normalize(v4, d4);
  }
}

function computeBoundingGeometryFarCorners(radius) {
  d = Cartesian3.normalize(
    Cartesian3.fromElements(
      d1.x + d2.x + d3.x + d4.x,
      d1.y + d2.y + d3.y + d4.y,
      d1.z + d2.z + d3.z + d4.z,
      d,
    ),
    d,
  );

  p1 = Cartesian3.multiplyByScalar(d1, radius / Cartesian3.dot(d1, d), p1);
  p2 = Cartesian3.multiplyByScalar(d2, radius / Cartesian3.dot(d2, d), p2);
  p3 = Cartesian3.multiplyByScalar(d3, radius / Cartesian3.dot(d3, d), p3);
  p4 = Cartesian3.multiplyByScalar(d4, radius / Cartesian3.dot(d4, d), p4);
}

// Scratch variables...
const firstFacetNormal = new Cartesian3();
const secondFacetNormal = new Cartesian3();
const thirdFacetNormal = new Cartesian3();
const fourthFacetNormal = new Cartesian3();

function computeBoundingGeometryForFrontFacet(
  radii,
  r1,
  r2,
  worldToModel,
  p,
  q,
  qMagnitudeSquared,
  radius,
  vertices,
  portionToDisplay,
) {
  computeBoundingGeometryNearCorners(
    radii,
    r1,
    r2,
    worldToModel,
    p,
    q,
    qMagnitudeSquared,
    portionToDisplay,
  );

  let k = 0;
  n = Cartesian3.normalize(Cartesian3.cross(d1, d2, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, k);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d2, d3, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d3, d4, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d4, d1, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  twoMinusOne = Cartesian3.subtract(v2, v1, twoMinusOne);
  threeMinusOne = Cartesian3.subtract(v3, v1, threeMinusOne);
  fourMinusOne = Cartesian3.subtract(v4, v1, fourMinusOne);

  n = Cartesian3.normalize(Cartesian3.cross(threeMinusOne, twoMinusOne, n), n);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(fourMinusOne, threeMinusOne, n), n);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  return {
    u_kDopFacetNormal0: function () {
      return Cartesian3.fromArray(vertices, 3, firstFacetNormal);
    },
    u_kDopFacetNormal1: function () {
      return Cartesian3.fromArray(vertices, 2 * 3 * 3 + 3, secondFacetNormal);
    },
    u_kDopFacetNormal2: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 2 + 3,
        thirdFacetNormal,
      );
    },
    u_kDopFacetNormal3: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 3 + 3,
        fourthFacetNormal,
      );
    },
  };
}

function computeBoundingGeometryForRearFacet(
  radii,
  r1,
  r2,
  worldToModel,
  p,
  q,
  qMagnitudeSquared,
  radius,
  vertices,
  portionToDisplay,
) {
  computeBoundingGeometryNearCorners(
    radii,
    r1,
    r2,
    worldToModel,
    p,
    q,
    qMagnitudeSquared,
    portionToDisplay,
  );
  computeBoundingGeometryFarCorners(radius);

  let k = 0;
  n = Cartesian3.normalize(Cartesian3.cross(d1, d2, n), n);
  Cartesian3.pack(v1, vertices, k);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d2, d3, n), n);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d3, d4, n), n);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d4, d1, n), n);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  twoMinusOne = Cartesian3.subtract(p2, p1, twoMinusOne);
  threeMinusOne = Cartesian3.subtract(p3, p1, threeMinusOne);
  fourMinusOne = Cartesian3.subtract(p4, p1, fourMinusOne);

  n = Cartesian3.normalize(Cartesian3.cross(threeMinusOne, twoMinusOne, n), n);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(fourMinusOne, threeMinusOne, n), n);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  twoMinusOne = Cartesian3.subtract(v2, v1, twoMinusOne);
  threeMinusOne = Cartesian3.subtract(v3, v1, threeMinusOne);
  fourMinusOne = Cartesian3.subtract(v4, v1, fourMinusOne);

  n = Cartesian3.normalize(Cartesian3.cross(twoMinusOne, threeMinusOne, n), n);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(threeMinusOne, fourMinusOne, n), n);
  Cartesian3.pack(v1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(v4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  return {
    u_kDopFacetNormal0: function () {
      return Cartesian3.fromArray(vertices, 3, firstFacetNormal);
    },
    u_kDopFacetNormal1: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 2 + 3,
        secondFacetNormal,
      );
    },
    u_kDopFacetNormal2: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 2 * 2 + 3,
        thirdFacetNormal,
      );
    },
    u_kDopFacetNormal3: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 2 * 3 + 3,
        fourthFacetNormal,
      );
    },
  };
}

function computeBoundingGeometryForCompleteFacet(
  radii,
  r1,
  r2,
  worldToModel,
  p,
  q,
  qMagnitudeSquared,
  radius,
  vertices,
  portionToDisplay,
) {
  computeBoundingGeometryNearCorners(
    radii,
    r1,
    r2,
    worldToModel,
    p,
    q,
    qMagnitudeSquared,
    portionToDisplay,
  );
  computeBoundingGeometryFarCorners(radius);

  let k = 0;
  n = Cartesian3.normalize(Cartesian3.cross(d1, d2, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, k);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d2, d3, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d3, d4, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(d4, d1, n), n);
  Cartesian3.pack(Cartesian3.ZERO, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  twoMinusOne = Cartesian3.subtract(p2, p1, twoMinusOne);
  threeMinusOne = Cartesian3.subtract(p3, p1, threeMinusOne);
  fourMinusOne = Cartesian3.subtract(p4, p1, fourMinusOne);

  n = Cartesian3.normalize(Cartesian3.cross(threeMinusOne, twoMinusOne, n), n);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p2, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  n = Cartesian3.normalize(Cartesian3.cross(fourMinusOne, threeMinusOne, n), n);
  Cartesian3.pack(p1, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p4, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);
  Cartesian3.pack(p3, vertices, ++k * 3);
  Cartesian3.pack(n, vertices, ++k * 3);

  return {
    u_kDopFacetNormal0: function () {
      return Cartesian3.fromArray(vertices, 3, firstFacetNormal);
    },
    u_kDopFacetNormal1: function () {
      return Cartesian3.fromArray(vertices, 2 * 3 * 3 + 3, secondFacetNormal);
    },
    u_kDopFacetNormal2: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 2 + 3,
        thirdFacetNormal,
      );
    },
    u_kDopFacetNormal3: function () {
      return Cartesian3.fromArray(
        vertices,
        2 * 3 * 3 * 3 + 3,
        fourthFacetNormal,
      );
    },
  };
}

SensorVolume.updateHorizonCommand = function (
  index,
  command,
  sensor,
  context,
  offCrossing,
  onCrossing,
  worldToModel,
  p,
  q,
  qMagnitudeSquared,
  radius,
) {
  let vertices;
  let uniforms;
  let numberOfVertices;
  if (sensor.portionToDisplay === SensorVolumePortionToDisplay.COMPLETE) {
    numberOfVertices = 12 * 3;
    vertices = new Float32Array(
      sensor._ellipsoidHorizonSurfaceCommandsVertices.buffer,
      Float32Array.BYTES_PER_ELEMENT *
        (SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand +
          SensorVolume.numberOfFloatsPerHorizonCommand * index),
      numberOfVertices * SensorVolume.numberOfFloatsPerVertex3D,
    );
    uniforms = computeBoundingGeometryForRearFacet(
      sensor.ellipsoid.radii,
      offCrossing,
      onCrossing,
      worldToModel,
      p,
      q,
      qMagnitudeSquared,
      radius,
      vertices,
      sensor.portionToDisplay,
    );
    command.boundingVolume = BoundingSphere.fromPoints(
      [v1, v2, v3, v4, p1, p2, p3, p4],
      command.boundingVolume,
    );
  } else if (
    sensor.showThroughEllipsoid ||
    sensor.portionToDisplay ===
      SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON
  ) {
    numberOfVertices = 6 * 3;
    vertices = new Float32Array(
      sensor._ellipsoidHorizonSurfaceCommandsVertices.buffer,
      Float32Array.BYTES_PER_ELEMENT *
        (SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand +
          SensorVolume.numberOfFloatsPerHorizonCommand * index),
      numberOfVertices * SensorVolume.numberOfFloatsPerVertex3D,
    );
    uniforms = computeBoundingGeometryForCompleteFacet(
      sensor.ellipsoid.radii,
      offCrossing,
      onCrossing,
      worldToModel,
      p,
      q,
      qMagnitudeSquared,
      radius,
      vertices,
      sensor.portionToDisplay,
    );
    command.boundingVolume = BoundingSphere.fromPoints(
      [Cartesian3.ZERO, p1, p2, p3, p4],
      command.boundingVolume,
    );
  } else if (
    sensor.portionToDisplay ===
    SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON
  ) {
    numberOfVertices = 6 * 3;
    vertices = new Float32Array(
      sensor._ellipsoidHorizonSurfaceCommandsVertices.buffer,
      Float32Array.BYTES_PER_ELEMENT *
        (SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand +
          SensorVolume.numberOfFloatsPerHorizonCommand * index),
      numberOfVertices * SensorVolume.numberOfFloatsPerVertex3D,
    );
    uniforms = computeBoundingGeometryForFrontFacet(
      sensor.ellipsoid.radii,
      offCrossing,
      onCrossing,
      worldToModel,
      p,
      q,
      qMagnitudeSquared,
      radius,
      vertices,
      sensor.portionToDisplay,
    );
    command.boundingVolume = BoundingSphere.fromPoints(
      [Cartesian3.ZERO, v1, v2, v3, v4],
      command.boundingVolume,
    );
  } else {
    throw new DeveloperError(
      "this.portionToDisplay is required and must be valid.",
    );
  }

  command.offset =
    SensorVolume.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand +
    SensorVolume.numberOfVerticesPerHorizonCommand * index;
  command.count = numberOfVertices;
  command.uniformMap = combine(
    combine(
      combine(sensor._uniforms, sensor._ellipsoidHorizonSurfaceUniforms),
      sensor._ellipsoidHorizonSurfaceMaterial._uniforms,
    ),
    uniforms,
  );
  command.boundingVolume = BoundingSphere.transform(
    command.boundingVolume,
    sensor.modelMatrix,
    command.boundingVolume,
  );
  command.modelMatrix = sensor.modelMatrix;

  sensor._ellipsoidHorizonSurfaceCommandsBuffer.copyFromArrayView(
    vertices,
    Float32Array.BYTES_PER_ELEMENT *
      (SensorVolume.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand +
        SensorVolume.numberOfFloatsPerHorizonCommand * index),
  );
};

function computeBoundingPyramidalFrustumVerticesFromIndices(
  directions,
  indices,
  frontCenter,
  frontSides,
  backCenter,
  backSides,
  vertices,
) {
  const length = indices.length;
  let k = -1;
  const lastIndex = length - 1;
  let previous = directions[indices[lastIndex]];
  let lastFront = frontSides[lastIndex];
  let lastBack = backSides[lastIndex];
  for (let index = 0; index < length; ++index) {
    const current = directions[indices[index]];
    const front = frontSides[index];
    const back = backSides[index];
    n = Cartesian3.normalize(Cartesian3.cross(current, previous, n), n);
    Cartesian3.pack(front, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(back, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastBack, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastBack, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastFront, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(front, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);

    n = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.cross(front, frontCenter, temp),
        Cartesian3.cross(lastFront, frontCenter, junk),
        n,
      ),
      n,
    );
    Cartesian3.pack(lastFront, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(frontCenter, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(front, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    n = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.cross(lastBack, backCenter, temp),
        Cartesian3.cross(back, backCenter, junk),
        n,
      ),
      n,
    );
    Cartesian3.pack(back, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(backCenter, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);
    Cartesian3.pack(lastBack, vertices, ++k * 3);
    Cartesian3.pack(n, vertices, ++k * 3);

    previous = current;
    lastFront = front;
    lastBack = back;
  }
}

function computeBoundingVertices(
  sensor,
  domeOnly,
  axis,
  directions,
  indices,
  radius,
  vertices,
) {
  const length = indices.length;

  let minDot = 1.0;
  let maxDot = -1.0;
  let lastIndex = indices[length - 1];
  for (let iii = 0; iii < length; ++iii) {
    const index = indices[iii];
    const previous = directions[lastIndex];
    const current = directions[index];
    minDot = Math.min(Cartesian3.dot(current, axis), minDot);
    bisector = Cartesian3.normalize(
      Cartesian3.add(previous, current, bisector),
      bisector,
    );
    maxDot = Math.max(Cartesian3.dot(bisector, axis), maxDot);
    lastIndex = index;
  }

  const fronts = sensor._fronts;
  const backs = sensor._backs;
  for (let i = 0; i < length; ++i) {
    const direction = directions[indices[i]];
    const dot = Cartesian3.dot(direction, axis);
    if (dot === 0.0) {
      fronts[i] = Cartesian3.multiplyByScalar(direction, radius, fronts[i]);
      backs[i] = Cartesian3.add(
        Cartesian3.multiplyByScalar(direction, radius, temp),
        Cartesian3.multiplyByScalar(axis, radius, junk),
        backs[i],
      );
    } else {
      fronts[i] = Cartesian3.subtract(
        Cartesian3.multiplyByScalar(direction, (radius * maxDot) / dot, temp),
        Cartesian3.multiplyByScalar(axis, radius * (maxDot - minDot), junk),
        fronts[i],
      );
      backs[i] = Cartesian3.add(
        Cartesian3.multiplyByScalar(direction, (radius * maxDot) / dot, temp),
        Cartesian3.multiplyByScalar(axis, radius * (1.0 - maxDot), junk),
        backs[i],
      );
    }
  }

  centerFront = domeOnly
    ? Cartesian3.multiplyByScalar(axis, radius * minDot, centerFront)
    : Cartesian3.negate(axis, centerFront);
  centerBack = Cartesian3.multiplyByScalar(axis, radius, centerBack);

  computeBoundingPyramidalFrustumVerticesFromIndices(
    directions,
    indices,
    centerFront,
    fronts,
    centerBack,
    backs,
    vertices,
  );
}

function updateDomeCommand(
  command,
  sensor,
  axis,
  directions,
  indices,
  radius,
  uniforms,
  boundingVolume,
) {
  const numberOfVertices = indices.length * 4 * 3; // (sides)(4 triangles/side)(3 vertices/triangle)
  const numberOfFloats =
    numberOfVertices * SensorVolume.numberOfFloatsPerVertex3D;

  const vertices = new Float32Array(
    sensor._domeCommandsVertices.buffer,
    0,
    numberOfFloats,
  );
  computeBoundingVertices(
    sensor,
    true,
    axis,
    directions,
    indices,
    radius,
    vertices,
  );

  command.offset = 0;
  command.count = numberOfVertices;
  BoundingSphere.fromVertices(
    vertices,
    undefined,
    SensorVolume.numberOfFloatsPerVertex3D,
    boundingVolume,
  );
  command.uniformMap = combine(
    combine(sensor._uniforms, sensor._domeSurfaceMaterial._uniforms),
    uniforms,
  );
  command.modelMatrix = sensor.modelMatrix;

  sensor._domeCommandsBuffer.copyFromArrayView(vertices, 0);

  return boundingVolume;
}

SensorVolume.initializeDomeCommand = function (
  sensor,
  axis,
  directions,
  indices,
  context,
  number,
  primitiveType,
  radius,
  uniforms,
) {
  const length = indices.length;
  const numberOfFloatsForCompleteDomeCommand =
    length * 4 * 3 * SensorVolume.numberOfFloatsPerVertex3D; // ("length" sides for command)(4 triangles/side)(3 vertices/triangle)(2 Cartesians/vertex)(3 floats/Cartesian)
  const domeVertices = new Float32Array(numberOfFloatsForCompleteDomeCommand); // vertices for each side.
  sensor._domeCommandsVertices = domeVertices;
  const domeBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: domeVertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  sensor._domeCommandsBuffer = domeBuffer;
  const domeVertexArray = SensorVolume.makeVertexArray3D(
    sensor,
    context,
    domeBuffer,
  );
  sensor._domeCommandsVertexArray = domeVertexArray;

  sensor._domeColorCommand.primitiveType = primitiveType;
  sensor._domeColorCommand.owner = sensor;
  sensor._domeColorCommand.vertexArray = domeVertexArray;
  updateDomeCommand(
    sensor._domeColorCommand,
    sensor,
    axis,
    directions,
    indices,
    radius,
    uniforms,
    sensor._completeDomeBoundingVolumeMC,
  );
};

SensorVolume.renderCompleteDome = function (sensor) {
  const command = sensor._domeColorCommand;
  command.boundingVolume = BoundingSphere.transform(
    sensor._completeDomeBoundingVolumeMC,
    sensor.modelMatrix,
    command.boundingVolume,
  );
  command.modelMatrix = sensor.modelMatrix;
  sensor._domeColorCommandToAdd = command;
};

SensorVolume.initializeSurfaceCommand = function (
  sensor,
  axis,
  directions,
  indices,
  context,
  primitiveType,
  radius,
) {
  if (defined(sensor._surfaceCommandVertexArray)) {
    sensor._surfaceCommandVertexArray.destroy();
  }

  const numberOfVertices = indices.length * 4 * 3; // (sides)(4 triangles/side)(3 vertices/triangle)
  const numberOfFloats =
    numberOfVertices * SensorVolume.numberOfFloatsPerVertex3D; // ("length" sides for command)(4 triangles/side)(3 vertices/triangle)(2 Cartesians/vertex)(3 floats/Cartesian)

  const vertices = new Float32Array(numberOfFloats);
  computeBoundingVertices(
    sensor,
    false,
    axis,
    directions,
    indices,
    radius,
    vertices,
  );
  BoundingSphere.fromVertices(
    vertices,
    undefined,
    SensorVolume.numberOfFloatsPerVertex3D,
    sensor._surfaceBoundingVolumeMC,
  );

  const surfaceBuffer = Buffer.createVertexBuffer({
    context: context,
    typedArray: vertices,
    usage: BufferUsage.STATIC_DRAW,
  });
  const surfaceVertexArray = SensorVolume.makeVertexArray3D(
    sensor,
    context,
    surfaceBuffer,
  );
  sensor._surfaceCommandVertexArray = surfaceVertexArray;

  const command = sensor._surfaceCommand;
  command.offset = 0;
  command.count = numberOfVertices;
  command.primitiveType = primitiveType;
  command.owner = sensor;
  command.vertexArray = surfaceVertexArray;
};

function createSurfaceRenderState(mask3DTiles, invertClassification, pick) {
  const blending =
    pick || invertClassification
      ? BlendingState.DISABLED
      : BlendingState.ALPHA_BLEND;
  const zPass = invertClassification
    ? StencilOperation.INCREMENT_WRAP
    : StencilOperation.KEEP; // Set the classification bit range to non-zero when invert classification is enabled
  const colorMask = !invertClassification;
  return RenderState.fromCache({
    depthTest: {
      enabled: false,
    },
    depthMask: false,
    blending: blending,
    cull: {
      enabled: true,
      face: CullFace.FRONT,
    },
    colorMask: {
      red: colorMask,
      green: colorMask,
      blue: colorMask,
      alpha: colorMask,
    },
    stencilTest: {
      enabled: mask3DTiles,
      frontFunction: StencilFunction.EQUAL,
      frontOperation: {
        fail: StencilOperation.KEEP,
        zFail: StencilOperation.KEEP,
        zPass: zPass,
      },
      backFunction: StencilFunction.EQUAL,
      backOperation: {
        fail: StencilOperation.KEEP,
        zFail: StencilOperation.KEEP,
        zPass: zPass,
      },
      reference: StencilConstants.CESIUM_3D_TILE_MASK,
      mask: StencilConstants.CESIUM_3D_TILE_MASK,
    },
    stencilMask: StencilConstants.CLASSIFICATION_MASK,
  });
}

function createDerivedCommand(command, name) {
  const derivedCommand = DrawCommand.shallowClone(
    command,
    command.derivedCommands[name],
  );
  command.derivedCommands[name] = derivedCommand;
  return derivedCommand;
}

function updateSurfaceCommands(sensor) {
  const command = sensor._surfaceCommand;
  command.boundingVolume = BoundingSphere.transform(
    sensor._surfaceBoundingVolumeMC,
    sensor.modelMatrix,
    command.boundingVolume,
  );
  command.modelMatrix = sensor._modelMatrix;
  command.renderState = createSurfaceRenderState(false, false, false);
  command.uniformMap = combine(
    combine(sensor._ellipsoidSurfaceMaterial._uniforms, sensor._uniforms),
    sensor._sensorUniforms,
  );
  command.shaderProgram = sensor._surfaceCommandShaderProgram;
  command.pass = Pass.TERRAIN_CLASSIFICATION;

  const derivedTilesetCommand = createDerivedCommand(command, "tileset");
  derivedTilesetCommand.renderState = createSurfaceRenderState(
    true,
    false,
    false,
  );
  derivedTilesetCommand.pass = Pass.CESIUM_3D_TILE_CLASSIFICATION;

  const derivedInvertClassificationCommand = createDerivedCommand(
    command,
    "invertClassification",
  );
  derivedInvertClassificationCommand.renderState = createSurfaceRenderState(
    true,
    true,
    false,
  );
  derivedInvertClassificationCommand.pass =
    Pass.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW;

  const derivedViewshedCommand = createDerivedCommand(command, "viewshed");
  derivedViewshedCommand.shaderProgram =
    sensor._surfaceCommandViewshedShaderProgram;
  derivedViewshedCommand.uniformMap = combine(
    combine(command.uniformMap, sensor._viewshedUniforms),
    sensor._shadowMapUniforms,
  );

  const derivedViewshedTilesetCommand = createDerivedCommand(
    derivedViewshedCommand,
    "tileset",
  );
  derivedViewshedTilesetCommand.renderState = createSurfaceRenderState(
    true,
    false,
    false,
  );
  derivedViewshedTilesetCommand.pass = Pass.CESIUM_3D_TILE_CLASSIFICATION;

  const derivedPickCommand = createDerivedCommand(command, "pick");
  derivedPickCommand.shaderProgram = sensor._surfaceCommandPickShaderProgram;
  derivedPickCommand.uniformMap = combine(
    command.uniformMap,
    sensor._pickUniforms,
  );
  derivedPickCommand.renderState = createSurfaceRenderState(false, false, true);
  derivedPickCommand.pickOnly = true;

  const derivedPickTilesetCommand = createDerivedCommand(
    derivedPickCommand,
    "tileset",
  );
  derivedPickTilesetCommand.renderState = createSurfaceRenderState(
    true,
    false,
    true,
  );
  derivedPickTilesetCommand.pass = Pass.CESIUM_3D_TILE_CLASSIFICATION;
}

function updateSurfaceShaderProgram(sensor, context) {
  const surfaceVertexShader = new ShaderSource({
    defines: ["DISABLE_GL_POSITION_LOG_DEPTH"],
    sources: [isZeroMatrix, SensorVolume3DVS],
  });

  const defines = [
    sensor.showThroughEllipsoid ? "SHOW_THROUGH_ELLIPSOID" : "",
    SensorVolumePortionToDisplay.toString(sensor.portionToDisplay),
  ];
  const sources = [
    isZeroMatrix,
    ShadersSensorVolume,
    sensor._sensorGlsl,
    sensor._ellipsoidSurfaceMaterial.shaderSource,
    SensorSurfaceFS,
  ];

  const surfaceFragmentShader = new ShaderSource({
    defines: defines,
    sources: sources,
  });

  sensor._surfaceCommandShaderProgram = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: sensor._surfaceCommandShaderProgram,
    vertexShaderSource: surfaceVertexShader,
    fragmentShaderSource: surfaceFragmentShader,
    attributeLocations: SensorVolume.attributeLocations3D,
  });

  const surfacePickFragmentShader = new ShaderSource({
    defines: defines,
    sources: sources,
    pickColorQualifier: "uniform",
  });

  sensor._surfaceCommandPickShaderProgram = ShaderProgram.replaceCache({
    context: context,
    shaderProgram: sensor._surfaceCommandPickShaderProgram,
    vertexShaderSource: surfaceVertexShader,
    fragmentShaderSource: surfacePickFragmentShader,
    attributeLocations: SensorVolume.attributeLocations3D,
  });

  if (sensor.showViewshed) {
    const surfaceViewshedFragmentShader = new ShaderSource({
      defines: defines.concat("VIEWSHED"),
      sources: sources,
    });

    sensor._surfaceCommandViewshedShaderProgram = ShaderProgram.replaceCache({
      context: context,
      shaderProgram: sensor._surfaceCommandViewshedShaderProgram,
      vertexShaderSource: surfaceVertexShader,
      fragmentShaderSource: surfaceViewshedFragmentShader,
      attributeLocations: SensorVolume.attributeLocations3D,
    });
  }
}

SensorVolume.updateSurface = function (sensor, context) {
  updateSurfaceShaderProgram(sensor, context);
  updateSurfaceCommands(sensor);
};

SensorVolume.addSurfaceCommand = function (sensor, frameState) {
  if (
    sensor.portionToDisplay ===
    SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON
  ) {
    return;
  }

  const classificationType = sensor.classificationType;
  const queueTerrainCommands =
    classificationType !== ClassificationType.CESIUM_3D_TILE;
  const queue3DTilesCommands =
    classificationType !== ClassificationType.TERRAIN;

  let command = sensor._surfaceCommand;

  // Update bounding volume for this command and all derived commands
  command.boundingVolume = BoundingSphere.transform(
    sensor._surfaceBoundingVolumeMC,
    sensor.modelMatrix,
    command.boundingVolume,
  );

  if (frameState.invertClassification) {
    frameState.commandList.push(command.derivedCommands.invertClassification);
  }

  if (frameState.passes.pick) {
    command = command.derivedCommands.pick;
  } else if (sensor.showViewshed) {
    command = command.derivedCommands.viewshed;
  }
  if (queueTerrainCommands) {
    frameState.commandList.push(command);
  }
  if (queue3DTilesCommands) {
    frameState.commandList.push(command.derivedCommands.tileset);
  }
};

SensorVolume.destroyShader = function (shader) {
  return shader && shader.destroy();
};

SensorVolume.destroyShaderProgram = function (command) {
  command.shaderProgram =
    command.shaderProgram && command.shaderProgram.destroy();
};

SensorVolume.destroyShaderPrograms = function (commands) {
  if (defined(commands)) {
    const length = commands.length;
    for (let index = 0; index < length; ++index) {
      SensorVolume.destroyShaderProgram(commands[index]);
    }
  }
};

// Scratch variables...
let b = new Cartesian3();
let bUnit = new Cartesian3();
let h = new Cartesian3();
let hUnit = new Cartesian3();
let w = new Cartesian3();
const m = new Matrix3();
let g = new Cartesian3();
let transverse = new Cartesian3();
let t = new Cartesian3();

SensorVolume.checkPlanarCrossings = function (
  ellipsoid,
  p,
  q,
  qUnit,
  oneOverQ,
  radiusSquared,
  modelToWorld,
  worldToModel,
  xAxis,
  yAxis,
  checkBisector,
  normal,
  bisector,
  bisectorMagnitudeSquared,
  portionToDisplay,
  index,
  info,
) {
  const crossings = info.crossings;

  b = ellipsoid.transformPositionFromScaledSpace(
    Matrix3.multiplyByVector(modelToWorld, normal, b),
    b,
  );
  bUnit = Cartesian3.normalize(b, bUnit);
  const cosineSigma = Cartesian3.dot(q, bUnit);

  h = Cartesian3.cross(bUnit, qUnit, h);
  const hMagnitudeSquared = Cartesian3.magnitudeSquared(h);

  let facetDoesNotIntersectEllipsoidHorizonSurface = true;
  if (cosineSigma <= 1.0 && hMagnitudeSquared > CesiumMath.EPSILON15) {
    hUnit = Cartesian3.normalize(h, hUnit);
    w = Cartesian3.fromElements(oneOverQ, cosineSigma, 0.0, w);
    Matrix3.fromRowMajorArray(
      [
        qUnit.x,
        qUnit.y,
        qUnit.z,
        bUnit.x,
        bUnit.y,
        bUnit.z,
        hUnit.x,
        hUnit.y,
        hUnit.z,
      ],
      m,
    );
    Matrix3.inverse(m, m);
    g = Matrix3.multiplyByVector(m, w, g);
    const gMagnitudeSquared = Cartesian3.magnitudeSquared(g);
    // gMagnitudeSquared == 1.0 indicates plane is tangent to limb and pair of crossings are same point.
    // If this occurs on the interval of the facet, we ignore the tangency.
    if (gMagnitudeSquared < 1.0) {
      // gMagnitudeSquared == 1.0 is tangent to sphere
      facetDoesNotIntersectEllipsoidHorizonSurface = false;
      transverse = Cartesian3.multiplyByScalar(
        hUnit,
        Math.sqrt(1.0 - gMagnitudeSquared),
        transverse,
      );
      r = Cartesian3.subtract(g, transverse, r);
      s = ellipsoid.transformPositionFromScaledSpace(r, s);
      v = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v),
        v,
      );
      d = Cartesian3.normalize(v, d);
      if (
        (portionToDisplay !== SensorVolumePortionToDisplay.COMPLETE ||
          Cartesian3.magnitudeSquared(v) <= radiusSquared) &&
        (checkBisector
          ? Cartesian3.dot(d, bisector) > bisectorMagnitudeSquared
          : true)
      ) {
        t = Cartesian3.normalize(Cartesian3.subtract(r, qUnit, t), t);
        const cosineOn = Cartesian3.dot(t, xAxis);
        const sineOn = Cartesian3.dot(t, yAxis);
        const cOn = crossings[info.count++];
        cOn.index = index;
        Cartesian3.clone(v, cOn.v);
        Cartesian3.clone(r, cOn.r);
        cOn.cosine = cosineOn;
        cOn.sine = sineOn;
        cOn.kind = 1;
      }
      r = Cartesian3.add(g, transverse, r);
      s = ellipsoid.transformPositionFromScaledSpace(r, s);
      v = Matrix3.multiplyByVector(
        worldToModel,
        Cartesian3.subtract(s, p, v),
        v,
      );
      d = Cartesian3.normalize(v, d);
      if (
        (portionToDisplay !== SensorVolumePortionToDisplay.COMPLETE ||
          Cartesian3.magnitudeSquared(v) <= radiusSquared) &&
        (checkBisector
          ? Cartesian3.dot(d, bisector) > bisectorMagnitudeSquared
          : true)
      ) {
        t = Cartesian3.normalize(Cartesian3.subtract(r, qUnit, t), t);
        const cosineOff = Cartesian3.dot(t, xAxis);
        const sineOff = Cartesian3.dot(t, yAxis);
        const cOff = crossings[info.count++];
        cOff.index = index;
        Cartesian3.clone(v, cOff.v);
        Cartesian3.clone(r, cOff.r);
        cOff.cosine = cosineOff;
        cOff.sine = sineOff;
        cOff.kind = -1;
      }
    }
  }

  return facetDoesNotIntersectEllipsoidHorizonSurface;
};

SensorVolume.angularSortUsingSineAndCosine = function (a, b) {
  function computeSortValue(o) {
    if (o.sine > 0.0) {
      return -o.cosine - 1.0;
    } else if (o.sine < 0.0) {
      return o.cosine + 1.0;
    } else if (o.cosine > 0.0) {
      return -2.0;
    } else if (o.cosine < 0.0) {
      return 0.0;
    }
    throw new DeveloperError(
      "Angle value is undefined (sine and cosine are both zero).",
    );
  }

  return computeSortValue(a) - computeSortValue(b);
};

let inverseRadial = new Matrix3();
let inverseScaling = new Matrix3();
let crossProductMatrix = new Matrix3();
let M = new Matrix3();
let A = new Matrix3();
let B = new Matrix3();
let B_T = new Matrix3();
let tempMatrix = new Matrix3();
let tempMatrix_T = new Matrix3();
let first = new Cartesian3();
let second = new Cartesian3();
let third = new Cartesian3();

SensorVolume.checkConicCrossings = function (
  ellipsoid,
  p,
  q,
  qMagnitudeSquared,
  qUnit,
  oneOverQ,
  scaledQ,
  radiusSquared,
  worldToModel,
  xAxis,
  yAxis,
  minimumClockAngle,
  minimumClockAngleSurfaceNormal,
  maximumClockAngle,
  maximumClockAngleSurfaceNormal,
  isPartialCone,
  axis,
  halfAngle,
  sense,
  portionToDisplay,
  index,
  info,
) {
  inverseRadial = Cartesian3.normalize(
    Cartesian3.negate(p, inverseRadial),
    inverseRadial,
  );
  const maximumApparentAngularSize = Math.asin(
    ellipsoid.maximumRadius / Cartesian3.magnitude(p),
  );

  let facetDoesNotIntersectEllipsoidHorizonSurface = true;

  if (
    qMagnitudeSquared > 1.0 &&
    Cartesian3.angleBetween(axis, inverseRadial) -
      maximumApparentAngularSize -
      halfAngle <=
      0.0
  ) {
    inverseScaling = Matrix3.fromScale(ellipsoid.radii, inverseScaling);

    // Determine the cross product equivalent matrix for the axis of the cone.
    crossProductMatrix = Matrix3.fromCrossProduct(axis, crossProductMatrix);

    // Compute the sine of the half angle.
    const sine = Math.sin(halfAngle);
    const sineSquared = sine * sine;

    // The constraint surface of the cone is based on the magnitude of the cross product equation.
    tempMatrix = Matrix3.fromUniformScale(sineSquared, tempMatrix);
    M = Matrix3.subtract(
      Matrix3.multiply(
        Matrix3.transpose(crossProductMatrix, tempMatrix_T),
        crossProductMatrix,
        M,
      ),
      tempMatrix,
      M,
    );

    // Construct a basis from the unit scaled position vector.
    // PERFORMANCE_IDEA: Use the xAxis and yAxis passed in (xAxis.cross(yAxis) = -qUnit).
    first = qUnit;
    second = Cartesian3.normalize(
      Cartesian3.cross(
        Cartesian3.mostOrthogonalAxis(first, second),
        first,
        second,
      ),
      second,
    );
    third = Cartesian3.normalize(Cartesian3.cross(first, second, third), third);

    // Get the rotation matrix from the basis to the ellipsoid semiaxes and its transpose.
    B_T = Matrix3.fromRowMajorArray(
      [
        first.x,
        first.y,
        first.z,
        second.x,
        second.y,
        second.z,
        third.x,
        third.y,
        third.z,
      ],
      B_T,
    );

    temp = Matrix3.multiplyByVector(M, p, temp);
    tempMatrix = Matrix3.multiply(B_T, inverseScaling, tempMatrix);
    tempMatrix_T = Matrix3.transpose(tempMatrix, tempMatrix_T);

    A = Matrix3.multiply(Matrix3.multiply(tempMatrix, M, A), tempMatrix_T, A);
    b = Cartesian3.multiplyByScalar(
      Matrix3.multiplyByVector(tempMatrix, temp, b),
      -2.0,
      b,
    );
    const c = Cartesian3.dot(p, temp);

    const xSquared = 1.0 / qMagnitudeSquared;
    const wSquared = 1.0 - xSquared;

    // Solve for the solutions to the expression in standard form:
    const solutions = IntersectionTests.quadraticVectorExpression(
      A,
      b,
      c,
      Math.sqrt(xSquared),
      Math.sqrt(wSquared),
    );

    let length = solutions.length;
    if (length > 0) {
      let m = [];

      const span = maximumClockAngle - minimumClockAngle;

      const cosine = Math.cos(halfAngle);

      B = Matrix3.transpose(B_T, B);

      for (let i = 0; i < length; ++i) {
        const u = solutions[i];

        r = Cartesian3.normalize(Matrix3.multiplyByVector(B, u, r), r);
        w = Cartesian3.subtract(r, q, w);
        v = ellipsoid.transformPositionFromScaledSpace(w, v);
        d = Cartesian3.normalize(v, d);

        const tangent = Cartesian3.dot(w, r);

        const cone = Cartesian3.dot(d, axis) - cosine;

        // Only accept the candidate vectors that truely satisfy all of the constraint equations.
        if (
          Math.abs(tangent) < CesiumMath.EPSILON4 &&
          Math.abs(cone) < CesiumMath.EPSILON4
        ) {
          facetDoesNotIntersectEllipsoidHorizonSurface = false;

          temp = Matrix3.multiplyByVector(worldToModel, d, temp);
          let isWithinClockAngleLimits;
          if (isPartialCone) {
            if (span < Math.PI) {
              isWithinClockAngleLimits =
                Math.max(
                  Cartesian3.dot(temp, maximumClockAngleSurfaceNormal),
                  Cartesian3.dot(temp, minimumClockAngleSurfaceNormal),
                ) < 0.0;
            } else if (span > Math.PI) {
              isWithinClockAngleLimits =
                Math.min(
                  Cartesian3.dot(temp, maximumClockAngleSurfaceNormal),
                  Cartesian3.dot(temp, minimumClockAngleSurfaceNormal),
                ) < 0.0;
            }
          } else {
            isWithinClockAngleLimits = true;
          }

          if (
            (portionToDisplay !== SensorVolumePortionToDisplay.COMPLETE ||
              Cartesian3.magnitudeSquared(v) <= radiusSquared) &&
            isWithinClockAngleLimits
          ) {
            t = Cartesian3.normalize(Cartesian3.subtract(r, qUnit, t), t);
            const cosineOn = Cartesian3.dot(t, xAxis);
            const sineOn = Cartesian3.dot(t, yAxis);
            const crossing = new Crossing();
            crossing.index = index;
            v = Matrix3.multiplyByVector(worldToModel, v, v);
            Cartesian3.clone(v, crossing.v);
            Cartesian3.clone(r, crossing.r);
            crossing.cosine = cosineOn;
            crossing.sine = sineOn;
            crossing.kind = 0; // This is determined duplicates are elliminated and the set is sorted.
            m.push(crossing);
          }
        }
      }

      // Elliminate any repeated solution vectors.
      length = m.length;
      for (let j = length - 1; j >= 0; --j) {
        let deleted = false;
        for (let k = j - 1; k >= 0 && !deleted; --k) {
          d1 = m[j].r;
          d2 = m[k].r;
          const dot = Cartesian3.dot(d1, d2);
          const cross = Cartesian3.magnitudeSquared(
            Cartesian3.cross(d1, d2, crossProduct),
          );
          if (dot > 0.0 && Math.abs(cross) < CesiumMath.EPSILON12) {
            m.splice(j, 1);
            deleted = true;
          }
        }
      }

      length = m.length;
      if (length > 0) {
        m = m.slice(0, length);
        m.sort(SensorVolume.angularSortUsingSineAndCosine);

        r = Cartesian3.clone(m[0].r, r);
        s = ellipsoid.transformPositionFromScaledSpace(r, s);
        v = Cartesian3.subtract(s, p, v);
        d = Cartesian3.normalize(v, d);
        n = ellipsoid.transformPositionToScaledSpace(r, n);
        // Compute cone normal.
        crossProduct = Cartesian3.normalize(
          Cartesian3.cross(
            Cartesian3.cross(axis, d, crossProduct),
            d,
            crossProduct,
          ),
          crossProduct,
        );
        // Compute clockwise direction.
        temp = Cartesian3.normalize(Cartesian3.cross(n, scaledQ, temp), temp);

        let kind = Cartesian3.dot(crossProduct, temp) > 0.0 ? sense : -sense;

        const crossings = info.crossings;
        length = m.length;
        for (let l = 0; l < length; ++l) {
          const source = m[l];
          const target = crossings[info.count++];
          target.index = source.index;
          Cartesian3.clone(source.v, target.v);
          Cartesian3.clone(source.r, target.r);
          target.cosine = source.cosine;
          target.sine = source.sine;
          target.kind = kind;
          kind *= -1;
        }
      }
    }
  }

  return facetDoesNotIntersectEllipsoidHorizonSurface;
};

SensorVolume.createEnvironmentOcclusionMaterial = function (
  originalMaterial,
  occlusionMaterial,
) {
  const original = clone(originalMaterial._template);
  original.uniforms = clone(originalMaterial.uniforms);
  const occlusion = clone(occlusionMaterial._template);
  occlusion.uniforms = clone(occlusionMaterial.uniforms);

  const source =
    "czm_material czm_getMaterial(czm_materialInput materialInput) \n" +
    "{ \n" +
    "    float depth; \n" +
    "    bool occluded = getShadowVisibility(-materialInput.positionToEyeEC, depth); \n" +
    "    if (occluded) \n" +
    "    { \n" +
    "        return occludedMaterial; \n" +
    "    } \n" +
    "    else \n" +
    "    { \n" +
    "        return domeMaterial; \n" +
    "    } \n" +
    "} \n";
  return new Material({
    strict: true,
    fabric: {
      materials: {
        domeMaterial: original,
        occludedMaterial: occlusion,
      },
      source: source,
    },
  });
};
export default SensorVolume;
