//This file is automatically rebuilt by the Cesium build process.
export default "vec4 getColor(float boundaryValue, vec3 pointMC, vec3 pointEC) {\n\
vec4 color;\n\
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)\n\
if (isOnBoundary(boundaryValue, czm_epsilon3))\n\
{\n\
color = getIntersectionColor();\n\
}\n\
else\n\
{\n\
color = getSurfaceColor(pointMC, pointEC);\n\
}\n\
#else\n\
color = getSurfaceColor(pointMC, pointEC);\n\
#endif\n\
return color;\n\
}\n\
void main()\n\
{\n\
#ifdef ONLY_WIRE_FRAME\n\
out_FragColor = getMaterialColor();\n\
return;\n\
#endif\n\
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
czm_raySegment sphereInterval = raySphereIntersectionInterval(ray, sensorVertexEC, u_sensorRadius);\n\
if (czm_isEmpty(sphereInterval))\n\
{\n\
discard;\n\
}\n\
vec3 startEC = czm_pointAlongRay(ray, sphereInterval.start);\n\
vec3 startWC = (czm_inverseView * vec4(startEC, 1.0)).xyz;\n\
vec3 stopEC = czm_pointAlongRay(ray, sphereInterval.stop);\n\
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;\n\
float startEllipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, startWC);\n\
float stopEllipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, stopWC);\n\
float startHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, startWC);\n\
float stopHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
vec3 startMC = (czm_inverseModelView * vec4(startEC, 1.0)).xyz;\n\
vec3 stopMC = (czm_inverseModelView * vec4(stopEC, 1.0)).xyz;\n\
float startSensorValue = sensorSurfaceFunction(startMC);\n\
float stopSensorValue = sensorSurfaceFunction(stopMC);\n\
#if defined(ABOVE_ELLIPSOID_HORIZON)\n\
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);\n\
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
bool discardStart = (startSensorValue > 0.0 || startHorizonValue < 0.0);\n\
bool discardStop = (stopSensorValue > 0.0 || stopHorizonValue < 0.0);\n\
#elif defined(BELOW_ELLIPSOID_HORIZON)\n\
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);\n\
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
bool discardStart = (startSensorValue > 0.0 || startEllipsoidValue < 0.0 || startHorizonValue > 0.0 || startHalfspaceValue < 0.0);\n\
bool discardStop = (stopSensorValue > 0.0 || stopEllipsoidValue < 0.0 || stopHorizonValue > 0.0 || stopHalfspaceValue < 0.0);\n\
#else\n\
bool discardStart = (startSensorValue > 0.0 || startHorizonValue > 0.0);\n\
bool discardStop = (stopSensorValue > 0.0 || stopHorizonValue > 0.0);\n\
#endif\n\
#else //defined(COMPLETE)\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);\n\
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);\n\
bool discardStart = (startSensorValue > 0.0 || startEllipsoidValue < 0.0 || (startHorizonValue < 0.0 && startHalfspaceValue < 0.0));\n\
bool discardStop = (stopSensorValue > 0.0 || stopEllipsoidValue < 0.0 || (stopHorizonValue < 0.0 && stopHalfspaceValue < 0.0));\n\
#else\n\
bool discardStart = (startSensorValue > 0.0);\n\
bool discardStop = (stopSensorValue > 0.0);\n\
#endif\n\
#endif\n\
vec4 startCC = czm_projection * vec4(startEC, 1.0);\n\
float startZ = startCC.z / startCC.w;\n\
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);\n\
float stopZ = stopCC.z / stopCC.w;\n\
discardStart = discardStart || (startZ < -1.0) || (startZ > 1.0);\n\
discardStop = discardStop || (stopZ < -1.0) || (stopZ > 1.0);\n\
vec3 cameraVertexWC;\n\
if (!czm_isZeroMatrix(czm_inverseProjection))\n\
{\n\
cameraVertexWC = czm_inverseView[3].xyz;\n\
}\n\
else\n\
{\n\
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;\n\
}\n\
if (discardStart && discardStop)\n\
{\n\
discard;\n\
}\n\
else if (discardStart)\n\
{\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))\n\
{\n\
discard;\n\
}\n\
#endif\n\
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
float depth;\n\
bool isInShadow = getShadowVisibility(stopEC, depth);\n\
#endif\n\
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)\n\
if (isInShadow)\n\
{\n\
discard;\n\
}\n\
#endif\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
if (showShadowIntersectionPoint(stopEC, depth, u_environmentIntersectionWidth))\n\
{\n\
out_FragColor = getEnvironmentIntersectionColor();\n\
setDepth(stopEC);\n\
return;\n\
}\n\
#endif\n\
out_FragColor = getColor(stopEllipsoidValue, stopMC, stopEC);\n\
setDepth(stopEC);\n\
}\n\
else if (discardStop)\n\
{\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, startWC))\n\
{\n\
discard;\n\
}\n\
#endif\n\
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
float depth;\n\
bool isInShadow = getShadowVisibility(startEC, depth);\n\
#endif\n\
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)\n\
if (isInShadow)\n\
{\n\
discard;\n\
}\n\
#endif\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
if (showShadowIntersectionPoint(startEC, depth, u_environmentIntersectionWidth))\n\
{\n\
out_FragColor = getEnvironmentIntersectionColor();\n\
setDepth(startEC);\n\
return;\n\
}\n\
#endif\n\
out_FragColor = getColor(startEllipsoidValue, startMC, startEC);\n\
setDepth(startEC);\n\
}\n\
else\n\
{\n\
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
float depth0;\n\
float depth1;\n\
bool startVisibility = getShadowVisibility(startEC, depth0);\n\
bool stopVisibility = getShadowVisibility(stopEC, depth1);\n\
#endif\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
vec4 startColor;\n\
if (showShadowIntersectionPoint(startEC, depth0, u_environmentIntersectionWidth))\n\
{\n\
startColor = getEnvironmentIntersectionColor();\n\
}\n\
else\n\
{\n\
startColor = getColor(startEllipsoidValue, startMC, startEC);\n\
}\n\
#else\n\
vec4 startColor = getColor(startEllipsoidValue, startMC, startEC);\n\
#endif\n\
#if !defined(SHOW_THROUGH_ELLIPSOID)\n\
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))\n\
{\n\
out_FragColor = startColor;\n\
}\n\
else\n\
#endif\n\
{\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
vec4 stopColor;\n\
if (showShadowIntersectionPoint(stopEC, depth1, u_environmentIntersectionWidth))\n\
{\n\
stopColor = getEnvironmentIntersectionColor();\n\
}\n\
else\n\
{\n\
stopColor = getColor(stopEllipsoidValue, stopMC, stopEC);\n\
}\n\
#else\n\
vec4 stopColor = getColor(stopEllipsoidValue, stopMC, stopEC);\n\
#endif\n\
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)\n\
if (startVisibility && stopVisibility)\n\
{\n\
discard;\n\
}\n\
else if (startVisibility)\n\
{\n\
out_FragColor = stopColor;\n\
}\n\
else if (stopVisibility)\n\
{\n\
out_FragColor = startColor;\n\
}\n\
else\n\
#endif\n\
{\n\
float alpha = 1.0 - (1.0 - stopColor.a) * (1.0 - startColor.a);\n\
out_FragColor = (alpha == 0.0) ? vec4(0.0) : mix(stopColor.a * stopColor, startColor, startColor.a) / alpha;\n\
out_FragColor.a = alpha;\n\
}\n\
}\n\
setDepth(startEC);\n\
}\n\
}\n\
";
