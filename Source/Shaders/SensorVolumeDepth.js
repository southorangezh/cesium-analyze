//This file is automatically rebuilt by the Cesium build process.
export default "void setDepth(vec3 pointEC)\n\
{\n\
vec4 pointCC = czm_projection * vec4(pointEC, 1.0);\n\
#ifdef LOG_DEPTH\n\
czm_writeLogDepth(1.0 + pointCC.w);\n\
#else\n\
#ifdef WRITE_DEPTH\n\
#if __VERSION__ == 300 || defined(GL_EXT_frag_depth)\n\
float z = pointCC.z / pointCC.w;\n\
float n = czm_depthRange.near;\n\
float f = czm_depthRange.far;\n\
gl_FragDepth = (z * (f - n) + f + n) * 0.5;\n\
#endif\n\
#endif\n\
#endif\n\
}\n\
";
