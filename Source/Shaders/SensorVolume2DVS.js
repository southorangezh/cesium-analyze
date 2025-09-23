//This file is automatically rebuilt by the Cesium build process.
export default "in vec4 position;\n\
in vec2 cartographic;\n\
out vec3 v_positionEC;\n\
out vec2 v_cartographic;\n\
void main()\n\
{\n\
gl_Position = czm_modelViewProjection * position;\n\
v_positionEC = (czm_modelView * position).xyz;\n\
v_cartographic = cartographic;\n\
}\n\
";
