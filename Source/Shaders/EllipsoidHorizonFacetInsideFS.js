//This file is automatically rebuilt by the Cesium build process.
export default "void main()\n\
{\n\
#ifdef ONLY_WIRE_FRAME\n\
out_FragColor = getMaterialColor();\n\
return;\n\
#endif\n\
vec3 sensorVertexWC = czm_model[3].xyz;\n\
vec3 sensorVertexEC = czm_modelView[3].xyz;\n\
czm_ray ray;\n\
if (!czm_isZeroMatrix(czm_inverseProjection))\n\
{\n\
ray = czm_ray(vec3(0.0), normalize(v_positionEC));\n\
}\n\
else\n\
{\n\
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));\n\
}\n\
ellipsoidHorizonCone horizonCone = ellipsoidHorizonConeNew(u_radii, u_inverseRadii, sensorVertexWC, u_q, u_inverseUnitQ, u_cosineAndSineOfHalfAperture.x, u_cosineAndSineOfHalfAperture.y);\n\
czm_raySegment horizonConeInterval = rayEllipsoidHorizonConeIntersectionInterval(ray, horizonCone);\n\
if (czm_isEmpty(horizonConeInterval))\n\
{\n\
discard;\n\
}\n\
vec3 stopEC = czm_pointAlongRay(ray, horizonConeInterval.stop);\n\
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;\n\
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);\n\
float stopZ = stopCC.z / stopCC.w;\n\
if ((stopZ < -1.0) || (stopZ > 1.0))\n\
{\n\
discard;\n\
}\n\
#if defined(ABOVE_ELLIPSOID_HORIZON)\n\
#elif defined(BELOW_ELLIPSOID_HORIZON)\n\
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
if (halfspaceValue < 0.0)\n\
{\n\
discard;\n\
}\n\
#endif\n\
#else //defined(COMPLETE)\n\
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
if (halfspaceValue > 0.0)\n\
{\n\
discard;\n\
}\n\
#endif\n\
if (distance(stopEC, sensorVertexEC) > u_sensorRadius)\n\
{\n\
discard;\n\
}\n\
vec3 stopMC = (czm_inverseModel * vec4(stopWC, 1.0)).xyz;\n\
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
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)\n\
if (isOnBoundary(sensorValue, czm_epsilon3) || isOnBoundary(halfspaceValue, czm_epsilon3))\n\
{\n\
out_FragColor = getIntersectionColor();\n\
}\n\
else\n\
{\n\
out_FragColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);\n\
}\n\
#else\n\
out_FragColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);\n\
#endif\n\
setDepth(stopEC);\n\
}\n\
";
