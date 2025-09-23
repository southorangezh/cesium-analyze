//This file is automatically rebuilt by the Cesium build process.
export default "uniform vec3 u_radii;\n\
uniform vec3 u_inverseRadii;\n\
uniform float u_sensorRadius;\n\
uniform vec3 u_q;\n\
in vec3 v_positionWC;\n\
in vec3 v_positionEC;\n\
vec4 getMaterialColor()\n\
{\n\
czm_materialInput materialInput;\n\
czm_material material = czm_getMaterial(materialInput);\n\
return vec4(material.diffuse + material.emission, material.alpha);\n\
}\n\
void main()\n\
{\n\
vec2 coords = gl_FragCoord.xy / czm_viewport.zw;\n\
float depth = czm_unpackDepth(texture(czm_globeDepthTexture, coords));\n\
if (depth == 0.0)\n\
{\n\
discard;\n\
}\n\
vec4 positionEC = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);\n\
positionEC /= positionEC.w;\n\
vec4 positionWC = czm_inverseView * positionEC;\n\
vec4 positionMC = czm_inverseModelView * positionEC;\n\
vec3 sensorVertexEC = czm_modelView[3].xyz;\n\
if (distance(positionEC.xyz, sensorVertexEC) > u_sensorRadius)\n\
{\n\
discard;\n\
}\n\
#ifndef SHOW_THROUGH_ELLIPSOID\n\
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, positionWC.xyz);\n\
if (halfspaceValue < 0.0)\n\
{\n\
discard;\n\
}\n\
#endif\n\
float sensorValue = sensorSurfaceFunction(positionMC.xyz);\n\
if (sensorValue > 0.0)\n\
{\n\
discard;\n\
}\n\
#if defined(VIEWSHED)\n\
out_FragColor = getViewshedColor(positionEC.xyz, depth);\n\
#else\n\
out_FragColor = getMaterialColor();\n\
#endif\n\
}\n\
";
