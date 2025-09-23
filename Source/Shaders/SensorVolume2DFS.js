//This file is automatically rebuilt by the Cesium build process.
export default "uniform vec3 u_radii;\n\
uniform vec3 u_inverseRadii;\n\
uniform float u_sensorRadius;\n\
uniform float u_normalDirection;\n\
uniform vec3 u_q;\n\
uniform vec3 u_p;\n\
uniform mat3 u_inverseModel;\n\
in vec3 v_positionEC;\n\
in vec2 v_cartographic;\n\
vec4 getColor(float sensorRadius, vec3 pointEC, vec3 normalEC)\n\
{\n\
czm_materialInput materialInput;\n\
vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;\n\
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(sensorRadius, pointMC);\n\
materialInput.str = pointMC / sensorRadius;\n\
vec3 positionToEyeEC = -pointEC;\n\
materialInput.positionToEyeEC = positionToEyeEC;\n\
vec3 normal = normalize(normalEC);\n\
materialInput.normalEC = u_normalDirection * normal;\n\
czm_material material = czm_getMaterial(materialInput);\n\
return mix(czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC), vec4(material.diffuse, material.alpha), 0.4);\n\
}\n\
void main()\n\
{\n\
float longitude = v_cartographic.x;\n\
float latitude = v_cartographic.y;\n\
vec2 cosineAndSineLongitude = czm_cosineAndSine(longitude);\n\
vec2 cosineAndSineLatitude = czm_cosineAndSine(latitude);\n\
vec3 surfaceNormal = vec3(cosineAndSineLatitude.x * cosineAndSineLongitude.x, cosineAndSineLatitude.x * cosineAndSineLongitude.y, cosineAndSineLatitude.y);\n\
vec3 surfacePoint = u_radii * normalize(u_radii * surfaceNormal);\n\
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, surfacePoint);\n\
if (halfspaceValue < 0.0)\n\
{\n\
discard;\n\
}\n\
vec3 displacement = surfacePoint - u_p;\n\
float domeValue = (length(displacement) - u_sensorRadius) / u_sensorRadius;\n\
if (domeValue > 0.0)\n\
{\n\
discard;\n\
}\n\
vec3 positionMC = u_inverseModel * displacement;\n\
float sensorValue = sensorSurfaceFunction(positionMC);\n\
if (sensorValue > 0.0)\n\
{\n\
discard;\n\
}\n\
if (isOnBoundary(sensorValue, czm_epsilon3) || isOnBoundary(halfspaceValue, czm_epsilon3) || isOnBoundary(domeValue, czm_epsilon3))\n\
{\n\
out_FragColor = getIntersectionColor();\n\
}\n\
else\n\
{\n\
out_FragColor = getColor(u_sensorRadius, v_positionEC, surfaceNormal);\n\
}\n\
}\n\
";
