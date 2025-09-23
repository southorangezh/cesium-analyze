//This file is automatically rebuilt by the Cesium build process.
export default "uniform vec3 u_radii;\n\
uniform vec3 u_inverseRadii;\n\
uniform float u_sensorRadius;\n\
uniform vec3 u_q;\n\
uniform vec2 u_cosineAndSineOfConeAngle;\n\
in vec3 v_positionWC;\n\
in vec3 v_positionEC;\n\
vec4 getMaterialColor()\n\
{\n\
czm_materialInput materialInput;\n\
czm_material material = czm_getMaterial(materialInput);\n\
return vec4(material.diffuse + material.emission, material.alpha);\n\
}\n\
vec4 getSurfaceColor(infiniteCone cone, vec3 pointMC, vec3 pointWC, vec3 pointEC)\n\
{\n\
vec3 normalEC = coneNormal(cone, pointEC);\n\
normalEC = mix(-normalEC, normalEC, step(0.0, normalEC.z));\n\
vec3 positionToEyeEC = -pointEC;\n\
czm_materialInput materialInput;\n\
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(u_sensorRadius, pointMC);\n\
materialInput.str = pointMC / u_sensorRadius;\n\
materialInput.positionToEyeEC = positionToEyeEC;\n\
materialInput.normalEC = normalEC;\n\
czm_material material = czm_getMaterial(materialInput);\n\
return czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n\
}\n\
void main()\n\
{\n\
#ifdef ONLY_WIRE_FRAME\n\
out_FragColor = getMaterialColor();\n\
return;\n\
#endif\n\
vec3 sensorVertexWC = czm_model[3].xyz;\n\
vec3 sensorVertexEC = czm_modelView[3].xyz;\n\
vec3 sensorAxisEC = czm_modelView[2].xyz;\n\
czm_ray ray;\n\
if (!czm_isZeroMatrix(czm_inverseProjection))\n\
{\n\
ray = czm_ray(vec3(0.0), normalize(v_positionEC));\n\
}\n\
else\n\
{\n\
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));\n\
}\n\
infiniteCone cone = infiniteConeNew(sensorVertexEC, sensorAxisEC, u_cosineAndSineOfConeAngle.x, u_cosineAndSineOfConeAngle.y);\n\
czm_raySegment coneInterval = rayConeIntersectionInterval(ray, cone);\n\
if (czm_isEmpty(coneInterval))\n\
{\n\
discard;\n\
}\n\
float stop = (u_cosineAndSineOfConeAngle.x > 0.0) ? coneInterval.stop : coneInterval.start;\n\
vec3 stopEC = czm_pointAlongRay(ray, stop);\n\
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;\n\
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);\n\
float stopZ = stopCC.z / stopCC.w;\n\
if ((stopZ < -1.0) || (stopZ > 1.0))\n\
{\n\
discard;\n\
}\n\
float ellipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, stopWC);\n\
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
#if defined(ABOVE_ELLIPSOID_HORIZON)\n\
if (horizonValue < 0.0)\n\
{\n\
discard;\n\
}\n\
#elif defined(BELOW_ELLIPSOID_HORIZON)\n\
if (horizonValue > 0.0)\n\
{\n\
discard;\n\
}\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
if (ellipsoidValue < 0.0)\n\
{\n\
discard;\n\
}\n\
if (halfspaceValue < 0.0)\n\
{\n\
discard;\n\
}\n\
#endif\n\
#else //defined(COMPLETE)\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
if (ellipsoidValue < 0.0)\n\
{\n\
discard;\n\
}\n\
if (halfspaceValue < 0.0 && horizonValue < 0.0)\n\
{\n\
discard;\n\
}\n\
#endif\n\
#endif\n\
if (distance(stopEC, sensorVertexEC) > u_sensorRadius)\n\
{\n\
discard;\n\
}\n\
vec3 stopMC = (czm_inverseModelView * vec4(stopEC, 1.0)).xyz;\n\
float sensorValue = sensorSurfaceFunction(stopMC);\n\
if (sensorValue > 0.0)\n\
{\n\
discard;\n\
}\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
vec3 cameraVertexWC;\n\
if (!czm_isZeroMatrix(czm_inverseProjection))\n\
{\n\
cameraVertexWC = czm_inverseView[3].xyz;\n\
}\n\
else\n\
{\n\
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;\n\
}\n\
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))\n\
{\n\
discard;\n\
}\n\
#endif\n\
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
float depth;\n\
bool isInShadow = getShadowVisibility(v_positionEC, depth);\n\
#endif\n\
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)\n\
if (isInShadow)\n\
{\n\
discard;\n\
}\n\
#endif\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
if (showShadowIntersectionPoint(v_positionEC, depth, u_environmentIntersectionWidth))\n\
{\n\
out_FragColor = getEnvironmentIntersectionColor();\n\
setDepth(stopEC);\n\
return;\n\
}\n\
#endif\n\
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)\n\
if (isOnBoundary(ellipsoidValue, czm_epsilon3) && (halfspaceValue > 0.0))\n\
{\n\
out_FragColor = getIntersectionColor();\n\
}\n\
else\n\
{\n\
out_FragColor = getSurfaceColor(cone, stopMC, stopWC, stopEC);\n\
}\n\
#else\n\
out_FragColor = getSurfaceColor(cone, stopMC, stopWC, stopEC);\n\
#endif\n\
setDepth(stopEC);\n\
}\n\
";
