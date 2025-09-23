//This file is automatically rebuilt by the Cesium build process.
export default "uniform vec3 u_radii;\n\
uniform vec3 u_inverseRadii;\n\
uniform float u_sensorRadius;\n\
uniform vec3 u_q;\n\
uniform vec3 u_inverseUnitQ;\n\
uniform vec2 u_cosineAndSineOfHalfAperture;\n\
in vec3 v_positionWC;\n\
in vec3 v_positionEC;\n\
struct ellipsoidHorizonCone\n\
{\n\
vec3 radii;\n\
vec3 inverseRadii;\n\
vec3 pointOutsideEllipsoid;\n\
infiniteCone coneInScaledSpace;\n\
};\n\
vec3 ellipsoidHorizonConeNormal(ellipsoidHorizonCone cone, vec3 pointOnCone)\n\
{\n\
vec3 pointOnScaledCone = cone.inverseRadii * pointOnCone;\n\
vec3 scaledNormal = coneNormal(cone.coneInScaledSpace, pointOnScaledCone);\n\
return normalize(czm_viewRotation * (cone.radii * scaledNormal));\n\
}\n\
ellipsoidHorizonCone ellipsoidHorizonConeNew(vec3 radii, vec3 inverseRadii, vec3 pointOutsideEllipsoid, vec3 q, vec3 axis, float cosineOfHalfAperture, float sineOfHalfAperture)\n\
{\n\
infiniteCone coneInScaledSpace = infiniteCone(q, axis, cosineOfHalfAperture, sineOfHalfAperture);\n\
return ellipsoidHorizonCone(radii, inverseRadii, pointOutsideEllipsoid, coneInScaledSpace);\n\
}\n\
czm_raySegment rayEllipsoidHorizonConeIntersectionInterval(czm_ray ray, ellipsoidHorizonCone cone)\n\
{\n\
vec3 origin = cone.inverseRadii * (czm_inverseView * vec4(ray.origin, 1.0)).xyz;\n\
vec3 direction = normalize(cone.inverseRadii * (czm_inverseViewRotation * ray.direction));\n\
czm_ray rayInScaledSpace = czm_ray(origin, direction);\n\
czm_raySegment interval = rayConeIntersectionInterval(rayInScaledSpace, cone.coneInScaledSpace);\n\
if (czm_isEmpty(interval))\n\
{\n\
return interval;\n\
}\n\
else\n\
{\n\
float start = interval.start;\n\
if (start != 0.0)\n\
{\n\
vec3 temp = (czm_view * vec4(cone.radii * czm_pointAlongRay(rayInScaledSpace, start), 1.0)).xyz;\n\
start = dot(temp, ray.direction);\n\
}\n\
float stop = interval.stop;\n\
if (stop != czm_infinity)\n\
{\n\
vec3 temp = (czm_view * vec4(cone.radii * czm_pointAlongRay(rayInScaledSpace, stop), 1.0)).xyz;\n\
stop = dot(temp, ray.direction);\n\
}\n\
return czm_raySegment(start, stop);\n\
}\n\
}\n\
vec4 getMaterialColor()\n\
{\n\
czm_materialInput materialInput;\n\
czm_material material = czm_getMaterial(materialInput);\n\
return vec4(material.diffuse + material.emission, material.alpha);\n\
}\n\
vec4 getSurfaceColor(ellipsoidHorizonCone cone, vec3 pointMC, vec3 pointWC, vec3 pointEC)\n\
{\n\
vec3 normalEC = ellipsoidHorizonConeNormal(cone, pointWC);\n\
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
";
