//This file is automatically rebuilt by the Cesium build process.
export default "in vec4 position;\n\
in vec3 normal;\n\
out vec3 v_positionWC;\n\
out vec3 v_positionEC;\n\
out vec3 v_normalEC;\n\
void main()\n\
{\n\
gl_Position = czm_modelViewProjection * position;\n\
v_positionWC = (czm_model * position).xyz;\n\
v_positionEC = (czm_modelView * position).xyz;\n\
v_normalEC = czm_normal * normal;\n\
czm_vertexLogDepth();\n\
}\n\
";
