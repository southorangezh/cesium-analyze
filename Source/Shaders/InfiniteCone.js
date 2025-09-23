//This file is automatically rebuilt by the Cesium build process.
export default "struct infiniteCone\n\
{\n\
vec3 vertex;\n\
vec3 axis;\n\
float cosineOfHalfAperture;\n\
float sineOfHalfAperture;\n\
};\n\
infiniteCone infiniteConeNew(vec3 vertex, vec3 axis, float cosineOfHalfAperture, float sineOfHalfAperture)\n\
{\n\
return infiniteCone(vertex, axis, cosineOfHalfAperture, sineOfHalfAperture);\n\
}\n\
vec3 coneNormal(infiniteCone cone, vec3 pointOnCone)\n\
{\n\
vec3 s = pointOnCone - cone.vertex;\n\
vec3 sUnit = normalize(s);\n\
return normalize((cone.cosineOfHalfAperture * sUnit - cone.axis) / cone.sineOfHalfAperture);\n\
}\n\
czm_raySegment rayConeIntersectionInterval(czm_ray ray, infiniteCone cone)\n\
{\n\
vec3 temp = ray.origin - cone.vertex;\n\
float t2 = dot(temp, temp);\n\
float cosineNu = dot(ray.direction, cone.axis);\n\
if (t2 == 0.0)\n\
{\n\
if (cosineNu >= cone.cosineOfHalfAperture)\n\
{\n\
return czm_fullRaySegment;\n\
}\n\
else\n\
{\n\
return czm_emptyRaySegment;\n\
}\n\
}\n\
else\n\
{\n\
vec3 t = normalize(temp);\n\
float projection = dot(t, cone.axis);\n\
if (projection == cone.cosineOfHalfAperture)\n\
{\n\
vec3 u = ray.direction;\n\
mat3 crossProductMatrix = mat3(0.0, -u.z, u.y,\n\
u.z, 0.0, -u.x,\n\
-u.y, u.x, 0.0);\n\
if (length(crossProductMatrix * temp) == 0.0)\n\
{\n\
if (dot(temp, u) > 0.0)\n\
{\n\
return czm_fullRaySegment;\n\
}\n\
else\n\
{\n\
return czm_raySegment(0.0, length(temp));\n\
}\n\
}\n\
else\n\
{\n\
return czm_emptyRaySegment;\n\
}\n\
}\n\
else\n\
{\n\
float cosineAlpha2 = cone.cosineOfHalfAperture * cone.cosineOfHalfAperture;\n\
float cosineTau = dot(t, cone.axis);\n\
float cosineDelta = dot(t, ray.direction);\n\
float cosineNu2 = cosineNu * cosineNu;\n\
float cosineTau2 = cosineTau * cosineTau;\n\
float stuff = cosineTau * cosineNu;\n\
float positiveTerm = cosineNu2 + cosineTau2;\n\
float negativeTerm = (cosineDelta * cosineDelta - 1.0) * cosineAlpha2;\n\
float signedTerm = -2.0 * stuff * cosineDelta;\n\
if (signedTerm > 0.0)\n\
{\n\
positiveTerm = positiveTerm + signedTerm;\n\
}\n\
else if (signedTerm < 0.0)\n\
{\n\
negativeTerm = negativeTerm + signedTerm;\n\
}\n\
float d = 4.0 * cosineAlpha2 * (positiveTerm + negativeTerm);\n\
if (d < 0.0)\n\
{\n\
if (cone.cosineOfHalfAperture < 0.0)\n\
{\n\
return czm_fullRaySegment;\n\
}\n\
else\n\
{\n\
return czm_emptyRaySegment;\n\
}\n\
}\n\
else if (d > 0.0)\n\
{\n\
float a = cosineNu2 - cosineAlpha2;\n\
float c = cosineTau2 - cosineAlpha2;\n\
float b = 2.0 * (stuff - cosineDelta * cosineAlpha2);\n\
float s = (b == 0.0) ? 1.0 : sign(b);\n\
float q = -(b + s * sqrt(d)) / 2.0;\n\
float first = q / a;\n\
float second = c / q;\n\
if (second < first)\n\
{\n\
float thing = first;\n\
first = second;\n\
second = thing;\n\
}\n\
bool isPlane = (abs(cone.cosineOfHalfAperture) < czm_epsilon7);\n\
bool firstTest = (first >= 0.0) && (isPlane || !(sign(dot(t + first * ray.direction, cone.axis)) == -sign(cone.cosineOfHalfAperture)));\n\
bool secondTest = (second >= 0.0) && (isPlane || !(sign(dot(t + second * ray.direction, cone.axis)) == -sign(cone.cosineOfHalfAperture)));\n\
float m = sqrt(t2);\n\
if (cosineTau > cone.cosineOfHalfAperture)\n\
{\n\
if (firstTest && secondTest)\n\
{\n\
return czm_raySegment(m * first, m * second);\n\
}\n\
else if (firstTest)\n\
{\n\
return czm_raySegment(0.0, m * first);\n\
}\n\
else if (secondTest)\n\
{\n\
return czm_raySegment(0.0, m * second);\n\
}\n\
else\n\
{\n\
return czm_fullRaySegment;\n\
}\n\
}\n\
else\n\
{\n\
if (firstTest && secondTest)\n\
{\n\
return czm_raySegment(m * first, m * second);\n\
}\n\
else if (firstTest)\n\
{\n\
return czm_raySegment(m * first, czm_infinity);\n\
}\n\
else if (secondTest)\n\
{\n\
return czm_raySegment(m * second, czm_infinity);\n\
}\n\
else\n\
{\n\
return czm_emptyRaySegment;\n\
}\n\
}\n\
}\n\
else\n\
{\n\
if (cone.cosineOfHalfAperture == 0.0)\n\
{\n\
if (cosineTau >= 0.0)\n\
{\n\
if (cosineNu >= 0.0)\n\
{\n\
return czm_fullRaySegment;\n\
}\n\
else\n\
{\n\
return czm_raySegment(0.0, -sqrt(t2) * cosineTau / cosineNu);\n\
}\n\
}\n\
else\n\
{\n\
if (cosineNu <= 0.0)\n\
{\n\
return czm_emptyRaySegment;\n\
}\n\
else\n\
{\n\
return czm_raySegment(-sqrt(t2) * cosineTau / cosineNu, czm_infinity);\n\
}\n\
}\n\
}\n\
else\n\
{\n\
float a = cosineNu2 - cosineAlpha2;\n\
float c = cosineTau2 - cosineAlpha2;\n\
float b = 2.0 * (stuff - cosineDelta * cosineAlpha2);\n\
float root = (a == 0.0) ? -sign(b) * czm_infinity : (-sign(b) / sign(a)) * sqrt(c / a);\n\
bool isPlane = (abs(cone.cosineOfHalfAperture) < czm_epsilon7);\n\
bool rootTest = (root >= 0.0) && (isPlane || !(sign(dot(t + root * ray.direction, cone.axis)) == -sign(cone.cosineOfHalfAperture)));\n\
float m = sqrt(t2);\n\
if (cosineTau > cone.cosineOfHalfAperture)\n\
{\n\
if (rootTest)\n\
{\n\
return czm_raySegment(0.0, m * root);\n\
}\n\
else\n\
{\n\
return czm_fullRaySegment;\n\
}\n\
}\n\
else\n\
{\n\
if (rootTest)\n\
{\n\
if (c < 0.0)\n\
{\n\
float thing = m * root;\n\
return czm_raySegment(thing, thing);\n\
}\n\
else\n\
{\n\
float thing = m * root;\n\
return czm_raySegment(thing, czm_infinity);\n\
}\n\
}\n\
else\n\
{\n\
return czm_emptyRaySegment;\n\
}\n\
}\n\
}\n\
}\n\
}\n\
}\n\
}\n\
";
