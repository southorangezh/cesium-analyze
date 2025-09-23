//This file is automatically rebuilt by the Cesium build process.
export default "#ifdef GL_OES_standard_derivatives\n\
#extension GL_OES_standard_derivatives : enable\n\
#endif\n\
uniform vec4 u_intersectionColor;\n\
uniform float u_intersectionWidth;\n\
#if defined(VIEWSHED)\n\
uniform vec4 u_viewshedVisibleColor;\n\
uniform vec4 u_viewshedOccludedColor;\n\
#endif\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
uniform float u_environmentIntersectionWidth;\n\
uniform vec4 u_environmentIntersectionColor;\n\
vec4 getEnvironmentIntersectionColor()\n\
{\n\
return czm_gammaCorrect(u_environmentIntersectionColor);\n\
}\n\
#endif\n\
vec4 getIntersectionColor()\n\
{\n\
return czm_gammaCorrect(u_intersectionColor);\n\
}\n\
float getIntersectionWidth()\n\
{\n\
return u_intersectionWidth;\n\
}\n\
vec2 sensorCartesianToNormalizedConicTextureCoordinates(float radius, vec3 point)\n\
{\n\
return vec2(atan(point.z, sqrt(point.x * point.x + point.y * point.y)) * czm_oneOverTwoPi + 0.5, length(point) / radius);\n\
}\n\
vec2 sensorCartesianToNormalizedPolarTextureCoordinates(float radius, vec3 point)\n\
{\n\
return vec2(atan(point.y, point.x) * czm_oneOverTwoPi + 0.5, length(point) / radius);\n\
}\n\
vec2 sensor3dToSphericalTextureCoordinates(vec3 point)\n\
{\n\
return vec2(atan(point.y, point.x) * czm_oneOverTwoPi + 0.5, atan(point.z, sqrt(point.x * point.x + point.y * point.y)) * czm_oneOverPi + 0.5);\n\
}\n\
float ellipsoidHorizonHalfspaceSurfaceFunction(vec3 q, vec3 inverseRadii, vec3 point)\n\
{\n\
vec3 temp = inverseRadii * point;\n\
return dot(temp, q) - 1.0;\n\
}\n\
float ellipsoidHorizonSurfaceFunction(vec3 q, vec3 inverseRadii, vec3 point)\n\
{\n\
vec3 temp = inverseRadii * point - q;\n\
return dot(temp, q) / length(temp) + sqrt(dot(q, q) - 1.0);\n\
}\n\
float ellipsoidSurfaceFunction(vec3 inverseRadii, vec3 point)\n\
{\n\
vec3 scaled = inverseRadii * point;\n\
return dot(scaled, scaled) - 1.0;\n\
}\n\
bool inEllipsoidShadow(vec3 q, vec3 inverseRadii, vec3 pointWC)\n\
{\n\
return (ellipsoidHorizonHalfspaceSurfaceFunction(q, inverseRadii, pointWC) < 0.0)\n\
&& (ellipsoidHorizonSurfaceFunction(q, inverseRadii, pointWC) < 0.0);\n\
}\n\
bool isOnBoundary(float value, float epsilon)\n\
{\n\
float width = getIntersectionWidth();\n\
float tolerance = width * epsilon;\n\
#ifdef GL_OES_standard_derivatives\n\
float delta = max(abs(dFdx(value)), abs(dFdy(value)));\n\
float pixels = width * delta * czm_pixelRatio;\n\
float temp = abs(value);\n\
return (temp < tolerance && temp < pixels) || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);\n\
#else\n\
return abs(value) < tolerance;\n\
#endif\n\
}\n\
#if defined(ENVIRONMENT_CONSTRAINT) || defined(SHOW_ENVIRONMENT_INTERSECTION) || defined(VIEWSHED)\n\
uniform vec4 u_shadowMapLightPositionEC;\n\
uniform samplerCube u_shadowCubeMap;\n\
const float depthBias = 0.005;\n\
const float shadowOffset = 0.005;\n\
bool getShadowVisibility(vec3 pointEC, out float depth)\n\
{\n\
vec3 directionEC = pointEC - u_shadowMapLightPositionEC.xyz;\n\
float distance = length(directionEC);\n\
directionEC = normalize(directionEC);\n\
float radius = u_shadowMapLightPositionEC.w;\n\
vec3 directionWC  = czm_inverseViewRotation * directionEC;\n\
distance /= radius;\n\
depth = czm_unpackDepth(czm_textureCube(u_shadowCubeMap, directionWC));\n\
if (step(distance - depthBias, depth) != 0.0) {\n\
return false;\n\
}\n\
vec3 shadowRight = normalize(cross(vec3(0,1,0), directionWC));\n\
vec3 shadowUp = cross(directionWC, shadowRight);\n\
vec3 oneStepUp = normalize(directionWC + (shadowUp * shadowOffset));\n\
if (step(distance - depthBias, czm_unpackDepth(czm_textureCube(u_shadowCubeMap, oneStepUp))) != 0.0) {\n\
return false;\n\
}\n\
vec3 oneStepDown = normalize(directionWC - (shadowUp * shadowOffset));\n\
return step(distance - depthBias, czm_unpackDepth(czm_textureCube(u_shadowCubeMap, oneStepDown)))  == 0.0;\n\
}\n\
#endif\n\
#if defined(SHOW_ENVIRONMENT_INTERSECTION)\n\
bool showShadowIntersectionPoint(vec3 point, float depth, float width)\n\
{\n\
vec3 directionEC = point - u_shadowMapLightPositionEC.xyz;\n\
float distance = length(directionEC);\n\
float radius = u_shadowMapLightPositionEC.w;\n\
return abs(distance - depth * radius) < width;\n\
}\n\
#endif\n\
#if defined(VIEWSHED)\n\
vec4 getViewshedColor(vec3 positionEC, float depth)\n\
{\n\
bool isInShadow = getShadowVisibility(positionEC, depth);\n\
return czm_gammaCorrect(isInShadow ? u_viewshedOccludedColor : u_viewshedVisibleColor);\n\
}\n\
#endif\n\
";
