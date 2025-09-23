/**
 * @license
 * Cesium Analytics SDK
 * Version 1.128
 *
 * Copyright 2012-2020 Cesium GS, Inc.
 * All rights reserved.
 *
 * Patents US9153063B2 US9865085B1 US9449424B2 US10592242
 * Patents pending US15/829,786 US16/850,266 US16/851,958
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for open-source Cesium license.
 */

var IonSdkSensors=(()=>{var Xt=Object.create;var Xi=Object.defineProperty;var er=Object.getOwnPropertyDescriptor;var nr=Object.getOwnPropertyNames;var ir=Object.getPrototypeOf,or=Object.prototype.hasOwnProperty;var tr=(e,i)=>()=>(i||e((i={exports:{}}).exports,i),i.exports),rr=(e,i)=>{for(var t in i)Xi(e,t,{get:i[t],enumerable:!0})},Vt=(e,i,t,s)=>{if(i&&typeof i=="object"||typeof i=="function")for(let a of nr(i))!or.call(e,a)&&a!==t&&Xi(e,a,{get:()=>i[a],enumerable:!(s=er(i,a))||s.enumerable});return e};var Ie=(e,i,t)=>(t=e!=null?Xt(ir(e)):{},Vt(i||!e||!e.__esModule?Xi(t,"default",{value:e,enumerable:!0}):t,e)),ar=e=>Vt(Xi({},"__esModule",{value:!0}),e);var we=tr((us,zt)=>{zt.exports=Cesium});var cs={};rr(cs,{ConicSensor:()=>go,ConicSensorGraphics:()=>si,ConicSensorVisualizer:()=>Po,CustomPatternSensor:()=>sn,CustomPatternSensorGraphics:()=>zi,CustomPatternSensorVisualizer:()=>Ho,RectangularSensor:()=>xo,RectangularSensorGraphics:()=>Ti,RectangularSensorVisualizer:()=>Do,SensorVolume:()=>w,SphericalPolygon:()=>Io,SphericalPolygonShaderSupport:()=>Bi,_shadersConicSensorInsideFS:()=>dn,_shadersConicSensorOutsideFS:()=>un,_shadersEllipsoidHorizonFacetFS:()=>zn,_shadersEllipsoidHorizonFacetInsideFS:()=>li,_shadersEllipsoidHorizonFacetOutsideFS:()=>ci,_shadersInfiniteCone:()=>xe,_shadersPlanarSensorVolumeFS:()=>Tn,_shadersPlanarSensorVolumeVS:()=>Pn,_shadersSensorDomeFS:()=>Hn,_shadersSensorDomeInsideFS:()=>di,_shadersSensorDomeOutsideFS:()=>ui,_shadersSensorSurfaceFS:()=>eo,_shadersSensorVolume:()=>le,_shadersSensorVolume2DFS:()=>mi,_shadersSensorVolume2DVS:()=>fi,_shadersSensorVolume3DVS:()=>Re,_shadersSensorVolumeDepth:()=>Ee,_shadersisZeroMatrix:()=>G,initializeSensors:()=>Ao,processCommonSensorProperties:()=>Mn,processConicSensor:()=>$i,processCustomPatternSensor:()=>Ki,processRectangularSensor:()=>Ji});var B=Ie(we(),1);function Hi(e){this._minimumClockAngle=void 0,this._minimumClockAngleSubscription=void 0,this._maximumClockAngle=void 0,this._maximumClockAngleSubscription=void 0,this._innerHalfAngle=void 0,this._innerHalfAngleSubscription=void 0,this._outerHalfAngle=void 0,this._outerHalfAngleSubscription=void 0,this._lateralSurfaceMaterial=void 0,this._lateralSurfaceMaterialSubscription=void 0,this._showLateralSurfaces=void 0,this._showLateralSurfacesSubscription=void 0,this._ellipsoidHorizonSurfaceMaterial=void 0,this._ellipsoidHorizonSurfaceMaterialSubscription=void 0,this._showEllipsoidHorizonSurfaces=void 0,this._showEllipsoidHorizonSurfacesSubscription=void 0,this._domeSurfaceMaterial=void 0,this._domeSurfaceMaterialSubscription=void 0,this._showDomeSurfaces=void 0,this._showDomeSurfacesSubscription=void 0,this._ellipsoidSurfaceMaterial=void 0,this._ellipsoidSurfaceMaterialSubscription=void 0,this._showEllipsoidSurfaces=void 0,this._showEllipsoidSurfacesSubscription=void 0,this._portionToDisplay=void 0,this._portionToDisplaySubscription=void 0,this._intersectionColor=void 0,this._intersectionColorSubscription=void 0,this._intersectionWidth=void 0,this._intersectionWidthSubscription=void 0,this._showIntersection=void 0,this._showIntersectionSubscription=void 0,this._showThroughEllipsoid=void 0,this._showThroughEllipsoidSubscription=void 0,this._radius=void 0,this._radiusSubscription=void 0,this._show=void 0,this._showSubscription=void 0,this._environmentConstraint=void 0,this._environmentConstraintSubscription=void 0,this._showEnvironmentOcclusion=void 0,this._showEnvironmentOcclusionSubscription=void 0,this._environmentOcclusionMaterial=void 0,this._environmentOcclusionMaterialSubscription=void 0,this._showEnvironmentIntersection=void 0,this._showEnvironmentIntersectionSubscription=void 0,this._environmentIntersectionColor=void 0,this._environmentIntersectionColorSubscription=void 0,this._environmentIntersectionWidth=void 0,this._environmentIntersectionWidthSubscription=void 0,this._showViewshed=void 0,this._showViewshedSubscription=void 0,this._viewshedVisibleColor=void 0,this._viewshedVisibleColorSubscription=void 0,this._viewshedOccludedColor=void 0,this._viewshedOccludedColorSubscription=void 0,this._viewshedResolution=void 0,this._viewshedResolutionSubscription=void 0,this._classificationType=void 0,this._classificationTypeSubscription=void 0,this._definitionChanged=new B.Event,this.merge(e??B.Frozen.EMPTY_OBJECT)}Object.defineProperties(Hi.prototype,{definitionChanged:{get:function(){return this._definitionChanged}},minimumClockAngle:(0,B.createPropertyDescriptor)("minimumClockAngle"),maximumClockAngle:(0,B.createPropertyDescriptor)("maximumClockAngle"),innerHalfAngle:(0,B.createPropertyDescriptor)("innerHalfAngle"),outerHalfAngle:(0,B.createPropertyDescriptor)("outerHalfAngle"),lateralSurfaceMaterial:(0,B.createMaterialPropertyDescriptor)("lateralSurfaceMaterial"),showLateralSurfaces:(0,B.createPropertyDescriptor)("showLateralSurfaces"),ellipsoidHorizonSurfaceMaterial:(0,B.createMaterialPropertyDescriptor)("ellipsoidHorizonSurfaceMaterial"),showEllipsoidHorizonSurfaces:(0,B.createPropertyDescriptor)("showEllipsoidHorizonSurfaces"),domeSurfaceMaterial:(0,B.createMaterialPropertyDescriptor)("domeSurfaceMaterial"),showDomeSurfaces:(0,B.createPropertyDescriptor)("showDomeSurfaces"),ellipsoidSurfaceMaterial:(0,B.createMaterialPropertyDescriptor)("ellipsoidSurfaceMaterial"),showEllipsoidSurfaces:(0,B.createPropertyDescriptor)("showEllipsoidSurfaces"),portionToDisplay:(0,B.createPropertyDescriptor)("portionToDisplay"),intersectionColor:(0,B.createPropertyDescriptor)("intersectionColor"),intersectionWidth:(0,B.createPropertyDescriptor)("intersectionWidth"),showIntersection:(0,B.createPropertyDescriptor)("showIntersection"),showThroughEllipsoid:(0,B.createPropertyDescriptor)("showThroughEllipsoid"),radius:(0,B.createPropertyDescriptor)("radius"),show:(0,B.createPropertyDescriptor)("show"),environmentConstraint:(0,B.createPropertyDescriptor)("environmentConstraint"),showEnvironmentOcclusion:(0,B.createPropertyDescriptor)("showEnvironmentOcclusion"),environmentOcclusionMaterial:(0,B.createMaterialPropertyDescriptor)("environmentOcclusionMaterial"),showEnvironmentIntersection:(0,B.createPropertyDescriptor)("showEnvironmentIntersection"),environmentIntersectionColor:(0,B.createPropertyDescriptor)("environmentIntersectionColor"),environmentIntersectionWidth:(0,B.createPropertyDescriptor)("environmentIntersectionWidth"),showViewshed:(0,B.createPropertyDescriptor)("showViewshed"),viewshedVisibleColor:(0,B.createPropertyDescriptor)("viewshedVisibleColor"),viewshedOccludedColor:(0,B.createPropertyDescriptor)("viewshedOccludedColor"),viewshedResolution:(0,B.createPropertyDescriptor)("viewshedResolution"),classificationType:(0,B.createPropertyDescriptor)("classificationType")});Hi.prototype.clone=function(e){return(0,B.defined)(e)||(e=new Hi),e.show=this.show,e.innerHalfAngle=this.innerHalfAngle,e.outerHalfAngle=this.outerHalfAngle,e.minimumClockAngle=this.minimumClockAngle,e.maximumClockAngle=this.maximumClockAngle,e.radius=this.radius,e.showIntersection=this.showIntersection,e.intersectionColor=this.intersectionColor,e.intersectionWidth=this.intersectionWidth,e.showThroughEllipsoid=this.showThroughEllipsoid,e.lateralSurfaceMaterial=this.lateralSurfaceMaterial,e.showLateralSurfaces=this.showLateralSurfaces,e.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial,e.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces,e.domeSurfaceMaterial=this.domeSurfaceMaterial,e.showDomeSurfaces=this.showDomeSurfaces,e.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial,e.showEllipsoidSurfaces=this.showEllipsoidSurfaces,e.portionToDisplay=this.portionToDisplay,e.environmentConstraint=this.environmentConstraint,e.showEnvironmentOcclusion=this.showEnvironmentOcclusion,e.environmentOcclusionMaterial=this.environmentOcclusionMaterial,e.showEnvironmentIntersection=this.showEnvironmentIntersection,e.environmentIntersectionColor=this.environmentIntersectionColor,e.environmentIntersectionWidth=this.environmentIntersectionWidth,e.showViewshed=this.showViewshed,e.viewshedVisibleColor=this.viewshedVisibleColor,e.viewshedOccludedColor=this.viewshedOccludedColor,e.viewshedResolution=this.viewshedResolution,e.classificationType=this.classificationType,e};Hi.prototype.merge=function(e){if(!(0,B.defined)(e))throw new B.DeveloperError("source is required.");this.show=this.show??e.show,this.innerHalfAngle=this.innerHalfAngle??e.innerHalfAngle,this.outerHalfAngle=this.outerHalfAngle??e.outerHalfAngle,this.minimumClockAngle=this.minimumClockAngle??e.minimumClockAngle,this.maximumClockAngle=this.maximumClockAngle??e.maximumClockAngle,this.radius=this.radius??e.radius,this.showIntersection=this.showIntersection??e.showIntersection,this.intersectionColor=this.intersectionColor??e.intersectionColor,this.intersectionWidth=this.intersectionWidth??e.intersectionWidth,this.showThroughEllipsoid=this.showThroughEllipsoid??e.showThroughEllipsoid,this.lateralSurfaceMaterial=this.lateralSurfaceMaterial??e.lateralSurfaceMaterial,this.showLateralSurfaces=this.showLateralSurfaces??e.showLateralSurfaces,this.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial??e.ellipsoidHorizonSurfaceMaterial,this.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces??e.showEllipsoidHorizonSurfaces,this.domeSurfaceMaterial=this.domeSurfaceMaterial??e.domeSurfaceMaterial,this.showDomeSurfaces=this.showDomeSurfaces??e.showDomeSurfaces,this.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial??e.ellipsoidSurfaceMaterial,this.showEllipsoidSurfaces=this.showEllipsoidSurfaces??e.showEllipsoidSurfaces,this.portionToDisplay=this.portionToDisplay??e.portionToDisplay,this.environmentConstraint=this.environmentConstraint??e.environmentConstraint,this.showEnvironmentOcclusion=this.showEnvironmentOcclusion??e.showEnvironmentOcclusion,this.environmentOcclusionMaterial=this.environmentOcclusionMaterial??e.environmentOcclusionMaterial,this.showEnvironmentIntersection=this.showEnvironmentIntersection??e.showEnvironmentIntersection,this.environmentIntersectionColor=this.environmentIntersectionColor??e.environmentIntersectionColor,this.environmentIntersectionWidth=this.environmentIntersectionWidth??e.environmentIntersectionWidth,this.showViewshed=this.showViewshed??e.showViewshed,this.viewshedVisibleColor=this.viewshedVisibleColor??e.viewshedVisibleColor,this.viewshedOccludedColor=this.viewshedOccludedColor??e.viewshedOccludedColor,this.viewshedResolution=this.viewshedResolution??e.viewshedResolution,this.classificationType=this.classificationType??e.classificationType};var si=Hi;var M=Ie(we(),1);var o=Ie(we(),1);var dn=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform vec3 u_q;
uniform vec2 u_cosineAndSineOfConeAngle;
in vec3 v_positionWC;
in vec3 v_positionEC;
vec4 getMaterialColor()
{
czm_materialInput materialInput;
czm_material material = czm_getMaterial(materialInput);
return vec4(material.diffuse + material.emission, material.alpha);
}
vec4 getSurfaceColor(infiniteCone cone, vec3 pointMC, vec3 pointWC, vec3 pointEC)
{
vec3 normalEC = coneNormal(cone, pointEC);
normalEC = mix(-normalEC, normalEC, step(0.0, normalEC.z));
vec3 positionToEyeEC = -pointEC;
czm_materialInput materialInput;
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(u_sensorRadius, pointMC);
materialInput.str = pointMC / u_sensorRadius;
materialInput.positionToEyeEC = positionToEyeEC;
materialInput.normalEC = normalEC;
czm_material material = czm_getMaterial(materialInput);
return czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
}
void main()
{
#ifdef ONLY_WIRE_FRAME
out_FragColor = getMaterialColor();
return;
#endif
vec3 sensorVertexWC = czm_model[3].xyz;
vec3 sensorVertexEC = czm_modelView[3].xyz;
vec3 sensorAxisEC = czm_modelView[2].xyz;
czm_ray ray;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
ray = czm_ray(vec3(0.0), normalize(v_positionEC));
}
else
{
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));
}
infiniteCone cone = infiniteConeNew(sensorVertexEC, sensorAxisEC, u_cosineAndSineOfConeAngle.x, u_cosineAndSineOfConeAngle.y);
czm_raySegment coneInterval = rayConeIntersectionInterval(ray, cone);
if (czm_isEmpty(coneInterval))
{
discard;
}
float stop = (u_cosineAndSineOfConeAngle.x > 0.0) ? coneInterval.stop : coneInterval.start;
vec3 stopEC = czm_pointAlongRay(ray, stop);
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);
float stopZ = stopCC.z / stopCC.w;
if ((stopZ < -1.0) || (stopZ > 1.0))
{
discard;
}
float ellipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, stopWC);
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
#if defined(ABOVE_ELLIPSOID_HORIZON)
if (horizonValue < 0.0)
{
discard;
}
#elif defined(BELOW_ELLIPSOID_HORIZON)
if (horizonValue > 0.0)
{
discard;
}
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (ellipsoidValue < 0.0)
{
discard;
}
if (halfspaceValue < 0.0)
{
discard;
}
#endif
#else //defined(COMPLETE)
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (ellipsoidValue < 0.0)
{
discard;
}
if (halfspaceValue < 0.0 && horizonValue < 0.0)
{
discard;
}
#endif
#endif
if (distance(stopEC, sensorVertexEC) > u_sensorRadius)
{
discard;
}
vec3 stopMC = (czm_inverseModelView * vec4(stopEC, 1.0)).xyz;
float sensorValue = sensorSurfaceFunction(stopMC);
if (sensorValue > 0.0)
{
discard;
}
#if !defined(SHOW_THROUGH_ELLIPSOID)
vec3 cameraVertexWC;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
cameraVertexWC = czm_inverseView[3].xyz;
}
else
{
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;
}
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
discard;
}
#endif
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(v_positionEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(v_positionEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
setDepth(stopEC);
return;
}
#endif
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(ellipsoidValue, czm_epsilon3) && (halfspaceValue > 0.0))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getSurfaceColor(cone, stopMC, stopWC, stopEC);
}
#else
out_FragColor = getSurfaceColor(cone, stopMC, stopWC, stopEC);
#endif
setDepth(stopEC);
}
`;var un=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform vec3 u_q;
uniform vec2 u_cosineAndSineOfConeAngle;
in vec3 v_positionWC;
in vec3 v_positionEC;
vec4 getMaterialColor()
{
czm_materialInput materialInput;
czm_material material = czm_getMaterial(materialInput);
return vec4(material.diffuse + material.emission, material.alpha);
}
vec4 getSurfaceColor(infiniteCone cone, vec3 pointMC, vec3 pointWC, vec3 pointEC)
{
vec3 normalEC = coneNormal(cone, pointEC);
normalEC = mix(-normalEC, normalEC, step(0.0, normalEC.z));
vec3 positionToEyeEC = -pointEC;
czm_materialInput materialInput;
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(u_sensorRadius, pointMC);
materialInput.str = pointMC / u_sensorRadius;
materialInput.positionToEyeEC = positionToEyeEC;
materialInput.normalEC = normalEC;
czm_material material = czm_getMaterial(materialInput);
return czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
}
vec4 getColor(float ellipsoidValue, float halfspaceValue, infiniteCone cone, vec3 pointMC, vec3 pointWC, vec3 pointEC)
{
vec4 color;
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(ellipsoidValue, czm_epsilon3) && (halfspaceValue > 0.0))
{
color = getIntersectionColor();
}
else
{
color = getSurfaceColor(cone, pointMC, pointWC, pointEC);
}
#else
color = getSurfaceColor(cone, pointMC, pointWC, pointEC);
#endif
return color;
}
void main()
{
#ifdef ONLY_WIRE_FRAME
out_FragColor = getMaterialColor();
return;
#endif
vec3 sensorVertexWC = czm_model[3].xyz;
vec3 sensorVertexEC = czm_modelView[3].xyz;
vec3 sensorAxisEC = czm_modelView[2].xyz;
czm_ray ray;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
ray = czm_ray(vec3(0.0), normalize(v_positionEC));
}
else
{
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));
}
infiniteCone cone = infiniteConeNew(sensorVertexEC, sensorAxisEC, u_cosineAndSineOfConeAngle.x, u_cosineAndSineOfConeAngle.y);
czm_raySegment coneInterval = rayConeIntersectionInterval(ray, cone);
if (czm_isEmpty(coneInterval))
{
discard;
}
vec3 startEC = czm_pointAlongRay(ray, coneInterval.start);
vec3 startWC = (czm_inverseView * vec4(startEC, 1.0)).xyz;
vec3 stopEC = czm_pointAlongRay(ray, coneInterval.stop);
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;
vec3 startMC = (czm_inverseModelView * vec4(startEC, 1.0)).xyz;
vec3 stopMC = (czm_inverseModelView * vec4(stopEC, 1.0)).xyz;
float startSensorValue = sensorSurfaceFunction(startMC);
float stopSensorValue = sensorSurfaceFunction(stopMC);
float startSphereValue = distance(startEC, sensorVertexEC) - u_sensorRadius;
float stopSphereValue = distance(stopEC, sensorVertexEC) - u_sensorRadius;
float startEllipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, startWC);
float stopEllipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, stopWC);
float startHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
vec3 cameraVertexWC;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
cameraVertexWC = czm_inverseView[3].xyz;
}
else
{
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;
}
#if defined(ABOVE_ELLIPSOID_HORIZON)
bool discardStart = (startHorizonValue < 0.0 || startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopHorizonValue < 0.0 || stopSensorValue > 0.0 || stopSphereValue > 0.0);
#elif defined(BELOW_ELLIPSOID_HORIZON)
#if !defined(SHOW_THROUGH_ELLIPSOID)
bool discardStart = (startHorizonValue > 0.0 || startHalfspaceValue < 0.0 || startEllipsoidValue < 0.0 || startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopHorizonValue > 0.0 || stopHalfspaceValue < 0.0 || stopEllipsoidValue < 0.0 || stopSensorValue > 0.0 || stopSphereValue > 0.0);
#else
bool discardStart = (startHorizonValue > 0.0 || startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopHorizonValue > 0.0 || stopSensorValue > 0.0 || stopSphereValue > 0.0);
#endif
#else //defined(COMPLETE)
#if !defined(SHOW_THROUGH_ELLIPSOID)
bool discardStart = ((startHorizonValue < 0.0 && startHalfspaceValue < 0.0) || startEllipsoidValue < 0.0 || startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = ((stopHorizonValue < 0.0 && stopHalfspaceValue < 0.0) || stopEllipsoidValue < 0.0 || stopSensorValue > 0.0 || stopSphereValue > 0.0);
#else
bool discardStart = (startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopSensorValue > 0.0 || stopSphereValue > 0.0);
#endif
#endif
vec4 startCC = czm_projection * vec4(startEC, 1.0);
float startZ = startCC.z / startCC.w;
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);
float stopZ = stopCC.z / stopCC.w;
discardStart = discardStart || (startZ < -1.0) || (startZ > 1.0);
discardStop = discardStop || (stopZ < -1.0) || (stopZ > 1.0);
if (discardStart && discardStop)
{
discard;
}
else if (discardStart)
{
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
discard;
}
#endif
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(stopEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(stopEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
setDepth(stopEC);
return;
}
#endif
out_FragColor = getColor(stopEllipsoidValue, stopHalfspaceValue, cone, stopMC, stopWC, stopEC);
setDepth(stopEC);
}
else if (discardStop)
{
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, startWC))
{
discard;
}
#endif
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(startEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(startEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
setDepth(startEC);
return;
}
#endif
out_FragColor = getColor(startEllipsoidValue, startHalfspaceValue, cone, startMC, startWC, startEC);
setDepth(startEC);
}
else
{
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth0;
float depth1;
bool startVisibility = getShadowVisibility(startEC, depth0);
bool stopVisibility = getShadowVisibility(stopEC, depth1);
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
vec4 startColor;
if (showShadowIntersectionPoint(startEC, depth0, u_environmentIntersectionWidth))
{
startColor = getEnvironmentIntersectionColor();
}
else
{
startColor = getColor(startEllipsoidValue, startHalfspaceValue, cone, startMC, startWC, startEC);
}
#else
vec4 startColor = getColor(startEllipsoidValue, startHalfspaceValue, cone, startMC, startWC, startEC);
#endif
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
out_FragColor = startColor;
}
else
#endif
{
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
vec4 stopColor;
if (showShadowIntersectionPoint(stopEC, depth1, u_environmentIntersectionWidth))
{
stopColor = getEnvironmentIntersectionColor();
}
else
{
stopColor = getColor(stopEllipsoidValue, stopHalfspaceValue, cone, stopMC, stopWC, stopEC);
}
#else
vec4 stopColor = getColor(stopEllipsoidValue, stopHalfspaceValue, cone, stopMC, stopWC, stopEC);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (startVisibility && stopVisibility)
{
discard;
}
else if (startVisibility)
{
out_FragColor = stopColor;
}
else if (stopVisibility)
{
out_FragColor = startColor;
}
else
#endif
{
float alpha = 1.0 - (1.0 - stopColor.a) * (1.0 - startColor.a);
out_FragColor = (alpha == 0.0) ? vec4(0.0) : mix(stopColor.a * stopColor, startColor, startColor.a) / alpha;
out_FragColor.a = alpha;
}
}
setDepth(startEC);
}
}
`;var zn=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform vec3 u_q;
uniform vec3 u_inverseUnitQ;
uniform vec2 u_cosineAndSineOfHalfAperture;
in vec3 v_positionWC;
in vec3 v_positionEC;
struct ellipsoidHorizonCone
{
vec3 radii;
vec3 inverseRadii;
vec3 pointOutsideEllipsoid;
infiniteCone coneInScaledSpace;
};
vec3 ellipsoidHorizonConeNormal(ellipsoidHorizonCone cone, vec3 pointOnCone)
{
vec3 pointOnScaledCone = cone.inverseRadii * pointOnCone;
vec3 scaledNormal = coneNormal(cone.coneInScaledSpace, pointOnScaledCone);
return normalize(czm_viewRotation * (cone.radii * scaledNormal));
}
ellipsoidHorizonCone ellipsoidHorizonConeNew(vec3 radii, vec3 inverseRadii, vec3 pointOutsideEllipsoid, vec3 q, vec3 axis, float cosineOfHalfAperture, float sineOfHalfAperture)
{
infiniteCone coneInScaledSpace = infiniteCone(q, axis, cosineOfHalfAperture, sineOfHalfAperture);
return ellipsoidHorizonCone(radii, inverseRadii, pointOutsideEllipsoid, coneInScaledSpace);
}
czm_raySegment rayEllipsoidHorizonConeIntersectionInterval(czm_ray ray, ellipsoidHorizonCone cone)
{
vec3 origin = cone.inverseRadii * (czm_inverseView * vec4(ray.origin, 1.0)).xyz;
vec3 direction = normalize(cone.inverseRadii * (czm_inverseViewRotation * ray.direction));
czm_ray rayInScaledSpace = czm_ray(origin, direction);
czm_raySegment interval = rayConeIntersectionInterval(rayInScaledSpace, cone.coneInScaledSpace);
if (czm_isEmpty(interval))
{
return interval;
}
else
{
float start = interval.start;
if (start != 0.0)
{
vec3 temp = (czm_view * vec4(cone.radii * czm_pointAlongRay(rayInScaledSpace, start), 1.0)).xyz;
start = dot(temp, ray.direction);
}
float stop = interval.stop;
if (stop != czm_infinity)
{
vec3 temp = (czm_view * vec4(cone.radii * czm_pointAlongRay(rayInScaledSpace, stop), 1.0)).xyz;
stop = dot(temp, ray.direction);
}
return czm_raySegment(start, stop);
}
}
vec4 getMaterialColor()
{
czm_materialInput materialInput;
czm_material material = czm_getMaterial(materialInput);
return vec4(material.diffuse + material.emission, material.alpha);
}
vec4 getSurfaceColor(ellipsoidHorizonCone cone, vec3 pointMC, vec3 pointWC, vec3 pointEC)
{
vec3 normalEC = ellipsoidHorizonConeNormal(cone, pointWC);
normalEC = mix(-normalEC, normalEC, step(0.0, normalEC.z));
vec3 positionToEyeEC = -pointEC;
czm_materialInput materialInput;
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(u_sensorRadius, pointMC);
materialInput.str = pointMC / u_sensorRadius;
materialInput.positionToEyeEC = positionToEyeEC;
materialInput.normalEC = normalEC;
czm_material material = czm_getMaterial(materialInput);
return czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
}
`;var li=`void main()
{
#ifdef ONLY_WIRE_FRAME
out_FragColor = getMaterialColor();
return;
#endif
vec3 sensorVertexWC = czm_model[3].xyz;
vec3 sensorVertexEC = czm_modelView[3].xyz;
czm_ray ray;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
ray = czm_ray(vec3(0.0), normalize(v_positionEC));
}
else
{
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));
}
ellipsoidHorizonCone horizonCone = ellipsoidHorizonConeNew(u_radii, u_inverseRadii, sensorVertexWC, u_q, u_inverseUnitQ, u_cosineAndSineOfHalfAperture.x, u_cosineAndSineOfHalfAperture.y);
czm_raySegment horizonConeInterval = rayEllipsoidHorizonConeIntersectionInterval(ray, horizonCone);
if (czm_isEmpty(horizonConeInterval))
{
discard;
}
vec3 stopEC = czm_pointAlongRay(ray, horizonConeInterval.stop);
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);
float stopZ = stopCC.z / stopCC.w;
if ((stopZ < -1.0) || (stopZ > 1.0))
{
discard;
}
#if defined(ABOVE_ELLIPSOID_HORIZON)
#elif defined(BELOW_ELLIPSOID_HORIZON)
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (halfspaceValue < 0.0)
{
discard;
}
#endif
#else //defined(COMPLETE)
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
if (halfspaceValue > 0.0)
{
discard;
}
#endif
if (distance(stopEC, sensorVertexEC) > u_sensorRadius)
{
discard;
}
vec3 stopMC = (czm_inverseModel * vec4(stopWC, 1.0)).xyz;
float sensorValue = sensorSurfaceFunction(stopMC);
if (sensorValue > 0.0)
{
discard;
}
#if !defined(SHOW_THROUGH_ELLIPSOID)
vec3 cameraVertexWC;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
cameraVertexWC = czm_inverseView[3].xyz;
}
else
{
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;
}
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
discard;
}
#endif
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(sensorValue, czm_epsilon3) || isOnBoundary(halfspaceValue, czm_epsilon3))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);
}
#else
out_FragColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);
#endif
setDepth(stopEC);
}
`;var ci=`void main()
{
#ifdef ONLY_WIRE_FRAME
out_FragColor = getMaterialColor();
return;
#endif
vec3 sensorVertexWC = czm_model[3].xyz;
vec3 sensorVertexEC = czm_modelView[3].xyz;
czm_ray ray;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
ray = czm_ray(vec3(0.0), normalize(v_positionEC));
}
else
{
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));
}
ellipsoidHorizonCone horizonCone = ellipsoidHorizonConeNew(u_radii, u_inverseRadii, sensorVertexWC, u_q, u_inverseUnitQ, u_cosineAndSineOfHalfAperture.x, u_cosineAndSineOfHalfAperture.y);
czm_raySegment horizonConeInterval = rayEllipsoidHorizonConeIntersectionInterval(ray, horizonCone);
if (czm_isEmpty(horizonConeInterval))
{
discard;
}
vec3 startEC = czm_pointAlongRay(ray, horizonConeInterval.start);
vec3 startWC = (czm_inverseView * vec4(startEC, 1.0)).xyz;
vec3 stopEC = czm_pointAlongRay(ray, horizonConeInterval.stop);
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;
vec3 startMC = (czm_inverseModel * vec4(startWC, 1.0)).xyz;
float startSensorValue = sensorSurfaceFunction(startMC);
vec3 stopMC = (czm_inverseModel * vec4(stopWC, 1.0)).xyz;
float stopSensorValue = sensorSurfaceFunction(stopMC);
float startSphereValue = distance(startEC, sensorVertexEC) - u_sensorRadius;
float stopSphereValue = distance(stopEC, sensorVertexEC) - u_sensorRadius;
#if defined(ABOVE_ELLIPSOID_HORIZON)
bool discardStart = (startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopSensorValue > 0.0 || stopSphereValue > 0.0);
#elif defined(BELOW_ELLIPSOID_HORIZON)
float startHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
#if !defined(SHOW_THROUGH_ELLIPSOID)
bool discardStart = (startHalfspaceValue < 0.0 || startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopHalfspaceValue < 0.0 || stopSensorValue > 0.0 || stopSphereValue > 0.0);
#else
bool discardStart = (startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopSensorValue > 0.0 || stopSphereValue > 0.0);
#endif
#else //defined(COMPLETE)
float startHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
bool discardStart = (startHalfspaceValue > 0.0 || startSensorValue > 0.0 || startSphereValue > 0.0);
bool discardStop = (stopHalfspaceValue > 0.0 || stopSensorValue > 0.0 || stopSphereValue > 0.0);
#endif
vec4 startCC = czm_projection * vec4(startEC, 1.0);
float startZ = startCC.z / startCC.w;
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);
float stopZ = stopCC.z / stopCC.w;
discardStart = discardStart || (startZ < -1.0) || (startZ > 1.0);
discardStop = discardStop || (stopZ < -1.0) || (stopZ > 1.0);
vec3 cameraVertexWC;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
cameraVertexWC = czm_inverseView[3].xyz;
}
else
{
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;
}
if (discardStart && discardStop)
{
discard;
}
else if (discardStart)
{
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
discard;
}
#endif
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(stopSensorValue, czm_epsilon3) || isOnBoundary(stopHalfspaceValue, czm_epsilon3))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);
}
#else
out_FragColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);
#endif
setDepth(stopEC);
}
else if (discardStop)
{
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, startWC))
{
discard;
}
#endif
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(startSensorValue, czm_epsilon3) || isOnBoundary(startHalfspaceValue, czm_epsilon3))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getSurfaceColor(horizonCone, startMC, startWC, startEC);
}
#else
out_FragColor = getSurfaceColor(horizonCone, startMC, startWC, startEC);
#endif
setDepth(startEC);
}
else
{
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
vec4 startColor;
if (isOnBoundary(startSensorValue, czm_epsilon3) || isOnBoundary(startHalfspaceValue, czm_epsilon3))
{
startColor = getIntersectionColor();
}
else
{
startColor = getSurfaceColor(horizonCone, startMC, startWC, startEC);
}
#else
vec4 startColor = getSurfaceColor(horizonCone, startMC, startWC, startEC);
#endif
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
out_FragColor = startColor;
}
else
#endif
{
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
vec4 stopColor;
if (isOnBoundary(stopSensorValue, czm_epsilon3) || isOnBoundary(stopHalfspaceValue, czm_epsilon3))
{
stopColor = getIntersectionColor();
}
else
{
stopColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);
}
#else
vec4 stopColor = getSurfaceColor(horizonCone, stopMC, stopWC, stopEC);
#endif
float alpha = 1.0 - (1.0 - stopColor.a) * (1.0 - startColor.a);
out_FragColor = (alpha == 0.0) ? vec4(0.0) : mix(stopColor.a * stopColor, startColor, startColor.a) / alpha;
out_FragColor.a = alpha;
}
setDepth(startEC);
}
}
`;var xe=`struct infiniteCone
{
vec3 vertex;
vec3 axis;
float cosineOfHalfAperture;
float sineOfHalfAperture;
};
infiniteCone infiniteConeNew(vec3 vertex, vec3 axis, float cosineOfHalfAperture, float sineOfHalfAperture)
{
return infiniteCone(vertex, axis, cosineOfHalfAperture, sineOfHalfAperture);
}
vec3 coneNormal(infiniteCone cone, vec3 pointOnCone)
{
vec3 s = pointOnCone - cone.vertex;
vec3 sUnit = normalize(s);
return normalize((cone.cosineOfHalfAperture * sUnit - cone.axis) / cone.sineOfHalfAperture);
}
czm_raySegment rayConeIntersectionInterval(czm_ray ray, infiniteCone cone)
{
vec3 temp = ray.origin - cone.vertex;
float t2 = dot(temp, temp);
float cosineNu = dot(ray.direction, cone.axis);
if (t2 == 0.0)
{
if (cosineNu >= cone.cosineOfHalfAperture)
{
return czm_fullRaySegment;
}
else
{
return czm_emptyRaySegment;
}
}
else
{
vec3 t = normalize(temp);
float projection = dot(t, cone.axis);
if (projection == cone.cosineOfHalfAperture)
{
vec3 u = ray.direction;
mat3 crossProductMatrix = mat3(0.0, -u.z, u.y,
u.z, 0.0, -u.x,
-u.y, u.x, 0.0);
if (length(crossProductMatrix * temp) == 0.0)
{
if (dot(temp, u) > 0.0)
{
return czm_fullRaySegment;
}
else
{
return czm_raySegment(0.0, length(temp));
}
}
else
{
return czm_emptyRaySegment;
}
}
else
{
float cosineAlpha2 = cone.cosineOfHalfAperture * cone.cosineOfHalfAperture;
float cosineTau = dot(t, cone.axis);
float cosineDelta = dot(t, ray.direction);
float cosineNu2 = cosineNu * cosineNu;
float cosineTau2 = cosineTau * cosineTau;
float stuff = cosineTau * cosineNu;
float positiveTerm = cosineNu2 + cosineTau2;
float negativeTerm = (cosineDelta * cosineDelta - 1.0) * cosineAlpha2;
float signedTerm = -2.0 * stuff * cosineDelta;
if (signedTerm > 0.0)
{
positiveTerm = positiveTerm + signedTerm;
}
else if (signedTerm < 0.0)
{
negativeTerm = negativeTerm + signedTerm;
}
float d = 4.0 * cosineAlpha2 * (positiveTerm + negativeTerm);
if (d < 0.0)
{
if (cone.cosineOfHalfAperture < 0.0)
{
return czm_fullRaySegment;
}
else
{
return czm_emptyRaySegment;
}
}
else if (d > 0.0)
{
float a = cosineNu2 - cosineAlpha2;
float c = cosineTau2 - cosineAlpha2;
float b = 2.0 * (stuff - cosineDelta * cosineAlpha2);
float s = (b == 0.0) ? 1.0 : sign(b);
float q = -(b + s * sqrt(d)) / 2.0;
float first = q / a;
float second = c / q;
if (second < first)
{
float thing = first;
first = second;
second = thing;
}
bool isPlane = (abs(cone.cosineOfHalfAperture) < czm_epsilon7);
bool firstTest = (first >= 0.0) && (isPlane || !(sign(dot(t + first * ray.direction, cone.axis)) == -sign(cone.cosineOfHalfAperture)));
bool secondTest = (second >= 0.0) && (isPlane || !(sign(dot(t + second * ray.direction, cone.axis)) == -sign(cone.cosineOfHalfAperture)));
float m = sqrt(t2);
if (cosineTau > cone.cosineOfHalfAperture)
{
if (firstTest && secondTest)
{
return czm_raySegment(m * first, m * second);
}
else if (firstTest)
{
return czm_raySegment(0.0, m * first);
}
else if (secondTest)
{
return czm_raySegment(0.0, m * second);
}
else
{
return czm_fullRaySegment;
}
}
else
{
if (firstTest && secondTest)
{
return czm_raySegment(m * first, m * second);
}
else if (firstTest)
{
return czm_raySegment(m * first, czm_infinity);
}
else if (secondTest)
{
return czm_raySegment(m * second, czm_infinity);
}
else
{
return czm_emptyRaySegment;
}
}
}
else
{
if (cone.cosineOfHalfAperture == 0.0)
{
if (cosineTau >= 0.0)
{
if (cosineNu >= 0.0)
{
return czm_fullRaySegment;
}
else
{
return czm_raySegment(0.0, -sqrt(t2) * cosineTau / cosineNu);
}
}
else
{
if (cosineNu <= 0.0)
{
return czm_emptyRaySegment;
}
else
{
return czm_raySegment(-sqrt(t2) * cosineTau / cosineNu, czm_infinity);
}
}
}
else
{
float a = cosineNu2 - cosineAlpha2;
float c = cosineTau2 - cosineAlpha2;
float b = 2.0 * (stuff - cosineDelta * cosineAlpha2);
float root = (a == 0.0) ? -sign(b) * czm_infinity : (-sign(b) / sign(a)) * sqrt(c / a);
bool isPlane = (abs(cone.cosineOfHalfAperture) < czm_epsilon7);
bool rootTest = (root >= 0.0) && (isPlane || !(sign(dot(t + root * ray.direction, cone.axis)) == -sign(cone.cosineOfHalfAperture)));
float m = sqrt(t2);
if (cosineTau > cone.cosineOfHalfAperture)
{
if (rootTest)
{
return czm_raySegment(0.0, m * root);
}
else
{
return czm_fullRaySegment;
}
}
else
{
if (rootTest)
{
if (c < 0.0)
{
float thing = m * root;
return czm_raySegment(thing, thing);
}
else
{
float thing = m * root;
return czm_raySegment(thing, czm_infinity);
}
}
else
{
return czm_emptyRaySegment;
}
}
}
}
}
}
}
`;var Tn=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform float u_normalDirection;
uniform vec3 u_q;
in vec3 v_positionWC;
in vec3 v_positionEC;
in vec3 v_normalEC;
vec4 getColor(float sensorRadius, vec3 pointEC, vec3 normalEC)
{
czm_materialInput materialInput;
vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;
#if defined(CONIC_TEXTURE_COORDINATES)
materialInput.st = sensorCartesianToNormalizedConicTextureCoordinates(sensorRadius, pointMC);
#else
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(sensorRadius, pointMC);
#endif
materialInput.str = pointMC / sensorRadius;
vec3 positionToEyeEC = -pointEC;
materialInput.positionToEyeEC = positionToEyeEC;
vec3 normal = normalize(normalEC);
materialInput.normalEC = u_normalDirection * normal;
czm_material material = czm_getMaterial(materialInput);
return mix(czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC), vec4(material.diffuse, material.alpha), 0.4);
}
void main()
{
vec3 sensorVertexEC = czm_modelView[3].xyz;
float ellipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, v_positionWC);
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, v_positionWC);
#if defined(ABOVE_ELLIPSOID_HORIZON)
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, v_positionWC);
if (horizonValue < 0.0)
{
discard;
}
#elif defined(BELOW_ELLIPSOID_HORIZON)
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, v_positionWC);
if (horizonValue > 0.0)
{
discard;
}
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (ellipsoidValue < 0.0)
{
discard;
}
if (halfspaceValue < 0.0)
{
discard;
}
#endif
#else //defined(COMPLETE)
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (ellipsoidValue < 0.0)
{
discard;
}
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, v_positionWC);
if (halfspaceValue < 0.0 && horizonValue < 0.0)
{
discard;
}
#endif
#endif
if (distance(v_positionEC, sensorVertexEC) > u_sensorRadius)
{
discard;
}
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(v_positionEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(v_positionEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
czm_writeLogDepth();
return;
}
#endif
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(ellipsoidValue, czm_epsilon3) && (halfspaceValue > 0.0))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getColor(u_sensorRadius, v_positionEC, v_normalEC);
}
#else
out_FragColor = getColor(u_sensorRadius, v_positionEC, v_normalEC);
#endif
czm_writeLogDepth();
}
`;var Pn=`in vec4 position;
in vec3 normal;
out vec3 v_positionWC;
out vec3 v_positionEC;
out vec3 v_normalEC;
void main()
{
gl_Position = czm_modelViewProjection * position;
v_positionWC = (czm_model * position).xyz;
v_positionEC = (czm_modelView * position).xyz;
v_normalEC = czm_normal * normal;
czm_vertexLogDepth();
}
`;var Hn=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform vec3 u_q;
in vec3 v_positionWC;
in vec3 v_positionEC;
in vec3 v_normalEC;
czm_raySegment raySphereIntersectionInterval(czm_ray ray, vec3 sensorVertexEC, float radius)
{
vec3 point = ray.origin - sensorVertexEC;
float t2 = dot(point, point);
float a = 1.0;
float b = 2.0 * dot(ray.direction, point);
float c = t2 - radius * radius;
if (c > 0.0)
{
if (b > 0.0)
{
return czm_emptyRaySegment;
}
else
{
float d = b * b - 4.0 * a * c;
if (d < 0.0)
{
return czm_emptyRaySegment;
}
else if (d > 0.0)
{
float s = (b == 0.0) ? 1.0 : sign(b);
float q = -(b + s * sqrt(d)) / 2.0;
float first = q / a;
float second = c / q;
if (second < first)
{
return czm_raySegment(second, first);
}
else
{
return czm_raySegment(first, second);
}
}
else
{
return czm_emptyRaySegment;
}
}
}
else if (c < 0.0)
{
float d = b * b - 4.0 * a * c;
float s = (b == 0.0) ? 1.0 : sign(b);
float q = -(b + s * sqrt(d)) / 2.0;
float first = q / a;
float second = c / q;
if (second < first)
{
return czm_raySegment(0.0, first);
}
else
{
return czm_raySegment(0.0, second);
}
}
else
{
if (b > 0.0)
{
return czm_emptyRaySegment;
}
else
{
float d = b * b - 4.0 * a * c;
if (d > 0.0)
{
float s = (b == 0.0) ? 1.0 : sign(b);
float q = -(b + s * sqrt(d)) / 2.0;
float first = q / a;
float second = c / q;
if (second < first)
{
return czm_raySegment(0.0, first);
}
else
{
return czm_raySegment(0.0, second);
}
}
else
{
return czm_emptyRaySegment;
}
}
}
}
vec4 getMaterialColor()
{
czm_materialInput materialInput;
czm_material material = czm_getMaterial(materialInput);
return vec4(material.diffuse + material.emission, material.alpha);
}
vec4 getSurfaceColor(vec3 pointMC, vec3 pointEC)
{
vec3 normalEC = normalize(pointEC);
normalEC = mix(-normalEC, normalEC, step(0.0, normalEC.z));
vec3 positionToEyeEC = -pointEC;
czm_materialInput materialInput;
materialInput.st = sensor3dToSphericalTextureCoordinates(pointMC);
materialInput.str = pointMC / u_sensorRadius;
materialInput.positionToEyeEC = positionToEyeEC;
materialInput.normalEC = normalEC;
czm_material material = czm_getMaterial(materialInput);
return czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
}
`;var di=`void main()
{
#ifdef ONLY_WIRE_FRAME
out_FragColor = getMaterialColor();
return;
#endif
vec3 sensorVertexEC = czm_modelView[3].xyz;
czm_ray ray;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
ray = czm_ray(vec3(0.0), normalize(v_positionEC));
}
else
{
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));
}
czm_raySegment sphereInterval = raySphereIntersectionInterval(ray, sensorVertexEC, u_sensorRadius);
if (czm_isEmpty(sphereInterval))
{
discard;
}
vec3 stopEC = czm_pointAlongRay(ray, sphereInterval.stop);
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);
float stopZ = stopCC.z / stopCC.w;
if ((stopZ < -1.0) || (stopZ > 1.0))
{
discard;
}
float ellipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, stopWC);
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
#if defined(ABOVE_ELLIPSOID_HORIZON)
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
if (horizonValue < 0.0)
{
discard;
}
#elif defined(BELOW_ELLIPSOID_HORIZON)
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
if (horizonValue > 0.0)
{
discard;
}
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (ellipsoidValue < 0.0)
{
discard;
}
if (halfspaceValue < 0.0)
{
discard;
}
#endif
#else //defined(COMPLETE)
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (ellipsoidValue < 0.0)
{
discard;
}
float horizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
if (halfspaceValue < 0.0 && horizonValue < 0.0)
{
discard;
}
#endif
#endif
vec3 stopMC = (czm_inverseModelView * vec4(stopEC, 1.0)).xyz;
float sensorValue = sensorSurfaceFunction(stopMC);
if (sensorValue > 0.0)
{
discard;
}
#if !defined(SHOW_THROUGH_ELLIPSOID)
vec3 cameraVertexWC;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
cameraVertexWC = czm_inverseView[3].xyz;
}
else
{
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;
}
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
discard;
}
#endif
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(stopEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(stopEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
setDepth(stopEC);
return;
}
#endif
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(ellipsoidValue, czm_epsilon3))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getSurfaceColor(stopMC, stopEC);
}
#else
out_FragColor = getSurfaceColor(stopMC, stopEC);
#endif
setDepth(stopEC);
}
`;var ui=`vec4 getColor(float boundaryValue, vec3 pointMC, vec3 pointEC) {
vec4 color;
#if defined(SHOW_INTERSECTION) && !defined(ABOVE_ELLIPSOID_HORIZON)
if (isOnBoundary(boundaryValue, czm_epsilon3))
{
color = getIntersectionColor();
}
else
{
color = getSurfaceColor(pointMC, pointEC);
}
#else
color = getSurfaceColor(pointMC, pointEC);
#endif
return color;
}
void main()
{
#ifdef ONLY_WIRE_FRAME
out_FragColor = getMaterialColor();
return;
#endif
vec3 sensorVertexEC = czm_modelView[3].xyz;
czm_ray ray;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
ray = czm_ray(vec3(0.0), normalize(v_positionEC));
}
else
{
ray = czm_ray(vec3(v_positionEC.xy, 0.0), vec3(0.0, 0.0, -1.0));
}
czm_raySegment sphereInterval = raySphereIntersectionInterval(ray, sensorVertexEC, u_sensorRadius);
if (czm_isEmpty(sphereInterval))
{
discard;
}
vec3 startEC = czm_pointAlongRay(ray, sphereInterval.start);
vec3 startWC = (czm_inverseView * vec4(startEC, 1.0)).xyz;
vec3 stopEC = czm_pointAlongRay(ray, sphereInterval.stop);
vec3 stopWC = (czm_inverseView * vec4(stopEC, 1.0)).xyz;
float startEllipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, startWC);
float stopEllipsoidValue = ellipsoidSurfaceFunction(u_inverseRadii, stopWC);
float startHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHalfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, stopWC);
vec3 startMC = (czm_inverseModelView * vec4(startEC, 1.0)).xyz;
vec3 stopMC = (czm_inverseModelView * vec4(stopEC, 1.0)).xyz;
float startSensorValue = sensorSurfaceFunction(startMC);
float stopSensorValue = sensorSurfaceFunction(stopMC);
#if defined(ABOVE_ELLIPSOID_HORIZON)
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
bool discardStart = (startSensorValue > 0.0 || startHorizonValue < 0.0);
bool discardStop = (stopSensorValue > 0.0 || stopHorizonValue < 0.0);
#elif defined(BELOW_ELLIPSOID_HORIZON)
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
#if !defined(SHOW_THROUGH_ELLIPSOID)
bool discardStart = (startSensorValue > 0.0 || startEllipsoidValue < 0.0 || startHorizonValue > 0.0 || startHalfspaceValue < 0.0);
bool discardStop = (stopSensorValue > 0.0 || stopEllipsoidValue < 0.0 || stopHorizonValue > 0.0 || stopHalfspaceValue < 0.0);
#else
bool discardStart = (startSensorValue > 0.0 || startHorizonValue > 0.0);
bool discardStop = (stopSensorValue > 0.0 || stopHorizonValue > 0.0);
#endif
#else //defined(COMPLETE)
#if !defined(SHOW_THROUGH_ELLIPSOID)
float startHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, startWC);
float stopHorizonValue = ellipsoidHorizonSurfaceFunction(u_q, u_inverseRadii, stopWC);
bool discardStart = (startSensorValue > 0.0 || startEllipsoidValue < 0.0 || (startHorizonValue < 0.0 && startHalfspaceValue < 0.0));
bool discardStop = (stopSensorValue > 0.0 || stopEllipsoidValue < 0.0 || (stopHorizonValue < 0.0 && stopHalfspaceValue < 0.0));
#else
bool discardStart = (startSensorValue > 0.0);
bool discardStop = (stopSensorValue > 0.0);
#endif
#endif
vec4 startCC = czm_projection * vec4(startEC, 1.0);
float startZ = startCC.z / startCC.w;
vec4 stopCC = czm_projection * vec4(stopEC, 1.0);
float stopZ = stopCC.z / stopCC.w;
discardStart = discardStart || (startZ < -1.0) || (startZ > 1.0);
discardStop = discardStop || (stopZ < -1.0) || (stopZ > 1.0);
vec3 cameraVertexWC;
if (!czm_isZeroMatrix(czm_inverseProjection))
{
cameraVertexWC = czm_inverseView[3].xyz;
}
else
{
cameraVertexWC = (czm_inverseView * vec4(v_positionEC.xy, 0.0, 1.0)).xyz;
}
if (discardStart && discardStop)
{
discard;
}
else if (discardStart)
{
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
discard;
}
#endif
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(stopEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(stopEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
setDepth(stopEC);
return;
}
#endif
out_FragColor = getColor(stopEllipsoidValue, stopMC, stopEC);
setDepth(stopEC);
}
else if (discardStop)
{
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, startWC))
{
discard;
}
#endif
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth;
bool isInShadow = getShadowVisibility(startEC, depth);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (isInShadow)
{
discard;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
if (showShadowIntersectionPoint(startEC, depth, u_environmentIntersectionWidth))
{
out_FragColor = getEnvironmentIntersectionColor();
setDepth(startEC);
return;
}
#endif
out_FragColor = getColor(startEllipsoidValue, startMC, startEC);
setDepth(startEC);
}
else
{
#if (defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)) || defined(SHOW_ENVIRONMENT_INTERSECTION)
float depth0;
float depth1;
bool startVisibility = getShadowVisibility(startEC, depth0);
bool stopVisibility = getShadowVisibility(stopEC, depth1);
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
vec4 startColor;
if (showShadowIntersectionPoint(startEC, depth0, u_environmentIntersectionWidth))
{
startColor = getEnvironmentIntersectionColor();
}
else
{
startColor = getColor(startEllipsoidValue, startMC, startEC);
}
#else
vec4 startColor = getColor(startEllipsoidValue, startMC, startEC);
#endif
#if !defined(SHOW_THROUGH_ELLIPSOID)
if (inEllipsoidShadow(u_inverseRadii * cameraVertexWC, u_inverseRadii, stopWC))
{
out_FragColor = startColor;
}
else
#endif
{
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
vec4 stopColor;
if (showShadowIntersectionPoint(stopEC, depth1, u_environmentIntersectionWidth))
{
stopColor = getEnvironmentIntersectionColor();
}
else
{
stopColor = getColor(stopEllipsoidValue, stopMC, stopEC);
}
#else
vec4 stopColor = getColor(stopEllipsoidValue, stopMC, stopEC);
#endif
#if defined(ENVIRONMENT_CONSTRAINT) && !defined(SHOW_ENVIRONMENT_OCCLUSION)
if (startVisibility && stopVisibility)
{
discard;
}
else if (startVisibility)
{
out_FragColor = stopColor;
}
else if (stopVisibility)
{
out_FragColor = startColor;
}
else
#endif
{
float alpha = 1.0 - (1.0 - stopColor.a) * (1.0 - startColor.a);
out_FragColor = (alpha == 0.0) ? vec4(0.0) : mix(stopColor.a * stopColor, startColor, startColor.a) / alpha;
out_FragColor.a = alpha;
}
}
setDepth(startEC);
}
}
`;var le=`#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
uniform vec4 u_intersectionColor;
uniform float u_intersectionWidth;
#if defined(VIEWSHED)
uniform vec4 u_viewshedVisibleColor;
uniform vec4 u_viewshedOccludedColor;
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
uniform float u_environmentIntersectionWidth;
uniform vec4 u_environmentIntersectionColor;
vec4 getEnvironmentIntersectionColor()
{
return czm_gammaCorrect(u_environmentIntersectionColor);
}
#endif
vec4 getIntersectionColor()
{
return czm_gammaCorrect(u_intersectionColor);
}
float getIntersectionWidth()
{
return u_intersectionWidth;
}
vec2 sensorCartesianToNormalizedConicTextureCoordinates(float radius, vec3 point)
{
return vec2(atan(point.z, sqrt(point.x * point.x + point.y * point.y)) * czm_oneOverTwoPi + 0.5, length(point) / radius);
}
vec2 sensorCartesianToNormalizedPolarTextureCoordinates(float radius, vec3 point)
{
return vec2(atan(point.y, point.x) * czm_oneOverTwoPi + 0.5, length(point) / radius);
}
vec2 sensor3dToSphericalTextureCoordinates(vec3 point)
{
return vec2(atan(point.y, point.x) * czm_oneOverTwoPi + 0.5, atan(point.z, sqrt(point.x * point.x + point.y * point.y)) * czm_oneOverPi + 0.5);
}
float ellipsoidHorizonHalfspaceSurfaceFunction(vec3 q, vec3 inverseRadii, vec3 point)
{
vec3 temp = inverseRadii * point;
return dot(temp, q) - 1.0;
}
float ellipsoidHorizonSurfaceFunction(vec3 q, vec3 inverseRadii, vec3 point)
{
vec3 temp = inverseRadii * point - q;
return dot(temp, q) / length(temp) + sqrt(dot(q, q) - 1.0);
}
float ellipsoidSurfaceFunction(vec3 inverseRadii, vec3 point)
{
vec3 scaled = inverseRadii * point;
return dot(scaled, scaled) - 1.0;
}
bool inEllipsoidShadow(vec3 q, vec3 inverseRadii, vec3 pointWC)
{
return (ellipsoidHorizonHalfspaceSurfaceFunction(q, inverseRadii, pointWC) < 0.0)
&& (ellipsoidHorizonSurfaceFunction(q, inverseRadii, pointWC) < 0.0);
}
bool isOnBoundary(float value, float epsilon)
{
float width = getIntersectionWidth();
float tolerance = width * epsilon;
#ifdef GL_OES_standard_derivatives
float delta = max(abs(dFdx(value)), abs(dFdy(value)));
float pixels = width * delta * czm_pixelRatio;
float temp = abs(value);
return (temp < tolerance && temp < pixels) || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);
#else
return abs(value) < tolerance;
#endif
}
#if defined(ENVIRONMENT_CONSTRAINT) || defined(SHOW_ENVIRONMENT_INTERSECTION) || defined(VIEWSHED)
uniform vec4 u_shadowMapLightPositionEC;
uniform samplerCube u_shadowCubeMap;
const float depthBias = 0.005;
const float shadowOffset = 0.005;
bool getShadowVisibility(vec3 pointEC, out float depth)
{
vec3 directionEC = pointEC - u_shadowMapLightPositionEC.xyz;
float distance = length(directionEC);
directionEC = normalize(directionEC);
float radius = u_shadowMapLightPositionEC.w;
vec3 directionWC  = czm_inverseViewRotation * directionEC;
distance /= radius;
depth = czm_unpackDepth(czm_textureCube(u_shadowCubeMap, directionWC));
if (step(distance - depthBias, depth) != 0.0) {
return false;
}
vec3 shadowRight = normalize(cross(vec3(0,1,0), directionWC));
vec3 shadowUp = cross(directionWC, shadowRight);
vec3 oneStepUp = normalize(directionWC + (shadowUp * shadowOffset));
if (step(distance - depthBias, czm_unpackDepth(czm_textureCube(u_shadowCubeMap, oneStepUp))) != 0.0) {
return false;
}
vec3 oneStepDown = normalize(directionWC - (shadowUp * shadowOffset));
return step(distance - depthBias, czm_unpackDepth(czm_textureCube(u_shadowCubeMap, oneStepDown)))  == 0.0;
}
#endif
#if defined(SHOW_ENVIRONMENT_INTERSECTION)
bool showShadowIntersectionPoint(vec3 point, float depth, float width)
{
vec3 directionEC = point - u_shadowMapLightPositionEC.xyz;
float distance = length(directionEC);
float radius = u_shadowMapLightPositionEC.w;
return abs(distance - depth * radius) < width;
}
#endif
#if defined(VIEWSHED)
vec4 getViewshedColor(vec3 positionEC, float depth)
{
bool isInShadow = getShadowVisibility(positionEC, depth);
return czm_gammaCorrect(isInShadow ? u_viewshedOccludedColor : u_viewshedVisibleColor);
}
#endif
`;var mi=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform float u_normalDirection;
uniform vec3 u_q;
uniform vec3 u_p;
uniform mat3 u_inverseModel;
in vec3 v_positionEC;
in vec2 v_cartographic;
vec4 getColor(float sensorRadius, vec3 pointEC, vec3 normalEC)
{
czm_materialInput materialInput;
vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;
materialInput.st = sensorCartesianToNormalizedPolarTextureCoordinates(sensorRadius, pointMC);
materialInput.str = pointMC / sensorRadius;
vec3 positionToEyeEC = -pointEC;
materialInput.positionToEyeEC = positionToEyeEC;
vec3 normal = normalize(normalEC);
materialInput.normalEC = u_normalDirection * normal;
czm_material material = czm_getMaterial(materialInput);
return mix(czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC), vec4(material.diffuse, material.alpha), 0.4);
}
void main()
{
float longitude = v_cartographic.x;
float latitude = v_cartographic.y;
vec2 cosineAndSineLongitude = czm_cosineAndSine(longitude);
vec2 cosineAndSineLatitude = czm_cosineAndSine(latitude);
vec3 surfaceNormal = vec3(cosineAndSineLatitude.x * cosineAndSineLongitude.x, cosineAndSineLatitude.x * cosineAndSineLongitude.y, cosineAndSineLatitude.y);
vec3 surfacePoint = u_radii * normalize(u_radii * surfaceNormal);
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, surfacePoint);
if (halfspaceValue < 0.0)
{
discard;
}
vec3 displacement = surfacePoint - u_p;
float domeValue = (length(displacement) - u_sensorRadius) / u_sensorRadius;
if (domeValue > 0.0)
{
discard;
}
vec3 positionMC = u_inverseModel * displacement;
float sensorValue = sensorSurfaceFunction(positionMC);
if (sensorValue > 0.0)
{
discard;
}
if (isOnBoundary(sensorValue, czm_epsilon3) || isOnBoundary(halfspaceValue, czm_epsilon3) || isOnBoundary(domeValue, czm_epsilon3))
{
out_FragColor = getIntersectionColor();
}
else
{
out_FragColor = getColor(u_sensorRadius, v_positionEC, surfaceNormal);
}
}
`;var fi=`in vec4 position;
in vec2 cartographic;
out vec3 v_positionEC;
out vec2 v_cartographic;
void main()
{
gl_Position = czm_modelViewProjection * position;
v_positionEC = (czm_modelView * position).xyz;
v_cartographic = cartographic;
}
`;var Re=`in vec4 position;
in vec3 normal;
out vec3 v_positionWC;
out vec3 v_positionEC;
out vec3 v_normalEC;
void main()
{
vec4 clip = czm_modelViewProjection * position;
clip.z = min( clip.z, clip.w );
gl_Position = clip;
v_positionWC = (czm_model * position).xyz;
v_positionEC = (czm_modelView * position).xyz;
v_normalEC = czm_normal * normal;
czm_vertexLogDepth();
}
`;var Ee=`void setDepth(vec3 pointEC)
{
vec4 pointCC = czm_projection * vec4(pointEC, 1.0);
#ifdef LOG_DEPTH
czm_writeLogDepth(1.0 + pointCC.w);
#else
#ifdef WRITE_DEPTH
#if __VERSION__ == 300 || defined(GL_EXT_frag_depth)
float z = pointCC.z / pointCC.w;
float n = czm_depthRange.near;
float f = czm_depthRange.far;
gl_FragDepth = (z * (f - n) + f + n) * 0.5;
#endif
#endif
#endif
}
`;var n=Ie(we(),1);var eo=`uniform vec3 u_radii;
uniform vec3 u_inverseRadii;
uniform float u_sensorRadius;
uniform vec3 u_q;
in vec3 v_positionWC;
in vec3 v_positionEC;
vec4 getMaterialColor()
{
czm_materialInput materialInput;
czm_material material = czm_getMaterial(materialInput);
return vec4(material.diffuse + material.emission, material.alpha);
}
void main()
{
vec2 coords = gl_FragCoord.xy / czm_viewport.zw;
float depth = czm_unpackDepth(texture(czm_globeDepthTexture, coords));
if (depth == 0.0)
{
discard;
}
vec4 positionEC = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
positionEC /= positionEC.w;
vec4 positionWC = czm_inverseView * positionEC;
vec4 positionMC = czm_inverseModelView * positionEC;
vec3 sensorVertexEC = czm_modelView[3].xyz;
if (distance(positionEC.xyz, sensorVertexEC) > u_sensorRadius)
{
discard;
}
#ifndef SHOW_THROUGH_ELLIPSOID
float halfspaceValue = ellipsoidHorizonHalfspaceSurfaceFunction(u_q, u_inverseRadii, positionWC.xyz);
if (halfspaceValue < 0.0)
{
discard;
}
#endif
float sensorValue = sensorSurfaceFunction(positionMC.xyz);
if (sensorValue > 0.0)
{
discard;
}
#if defined(VIEWSHED)
out_FragColor = getViewshedColor(positionEC.xyz, depth);
#else
out_FragColor = getMaterialColor();
#endif
}
`;var G=`bool czm_isZeroMatrix(mat4 matrix)
{
return matrix == mat4(0.0);
}
`;function sr(){this.index=void 0,this.v=new n.Cartesian3,this.r=new n.Cartesian3,this.cosine=void 0,this.sine=void 0,this.kind=void 0}function v(){}v.attributeLocations2D={position:0,cartographic:1};v.numberOfFloatsPerVertex2D=5;v.attributeLocations3D={position:0,normal:1};v.numberOfFloatsPerVertex3D=2*3;v.numberOfSidesForCompleteCircle=6;v.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand=v.numberOfSidesForCompleteCircle*4*3;v.numberOfVerticesForCompleteHorizonPyramidCommand=v.numberOfSidesForCompleteCircle*2*3;v.numberOfVerticesPerHorizonCommand=6*2*3;v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand=v.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand*v.numberOfFloatsPerVertex3D;v.numberOfFloatsForCompleteHorizonPyramidCommand=v.numberOfVerticesForCompleteHorizonPyramidCommand*v.numberOfFloatsPerVertex3D;v.numberOfFloatsPerHorizonCommand=v.numberOfVerticesPerHorizonCommand*v.numberOfFloatsPerVertex3D;v.maximumRadius=1e9;v.makeVertexArray2D=function(e,i,t){let s=v.numberOfFloatsPerVertex2D*Float32Array.BYTES_PER_ELEMENT,a=[{index:v.attributeLocations2D.position,vertexBuffer:t,componentsPerAttribute:3,componentDatatype:n.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:s},{index:v.attributeLocations2D.cartographic,vertexBuffer:t,componentsPerAttribute:2,componentDatatype:n.ComponentDatatype.FLOAT,offsetInBytes:3*Float32Array.BYTES_PER_ELEMENT,strideInBytes:s}];return new n.VertexArray({context:i,attributes:a})};v.makeVertexArray3D=function(e,i,t){let s=v.numberOfFloatsPerVertex3D*Float32Array.BYTES_PER_ELEMENT,a=[{index:v.attributeLocations3D.position,vertexBuffer:t,componentsPerAttribute:3,componentDatatype:n.ComponentDatatype.FLOAT,offsetInBytes:0,strideInBytes:s},{index:v.attributeLocations3D.normal,vertexBuffer:t,componentsPerAttribute:3,componentDatatype:n.ComponentDatatype.FLOAT,offsetInBytes:3*Float32Array.BYTES_PER_ELEMENT,strideInBytes:s}];return new n.VertexArray({context:i,attributes:a})};function Pt(e,i){return i?n.RenderState.fromCache({depthMask:!1,blending:n.BlendingState.ALPHA_BLEND}):n.RenderState.fromCache({depthTest:{enabled:!0}})}v.getRenderState3D=function(e,i,t,s){return t?n.RenderState.fromCache({depthTest:{enabled:!e.showThroughEllipsoid},depthMask:!1,blending:n.BlendingState.ALPHA_BLEND,cull:{enabled:!0,face:s}}):n.RenderState.fromCache({depthTest:{enabled:!0},depthMask:!0,cull:{enabled:!0,face:s}})};v.setRenderStates2D=function(e,i,t){let s=Pt(i,t),a=t?n.Pass.TRANSLUCENT:n.Pass.OPAQUE,l=2;for(let m=0;m<l;++m){let d=e._drawCommands2D[m],r=e._pickCommands2D[m];d.renderState=s,d.pass=a,r.renderState=s,r.pass=a}};v.setEllipsoidHorizonSurfacesRenderStates3D=function(e,i,t){let s=v.getRenderState3D(e,i,t,n.CullFace.FRONT),a=t?n.Pass.TRANSLUCENT:n.Pass.OPAQUE,l=e._ellipsoidHorizonSurfaceColorCommands.length;for(let m=0;m<l;++m){let d=e._ellipsoidHorizonSurfaceColorCommands[m];d.renderState=s,d.pass=a}};v.setDomeSurfacesRenderStates3D=function(e,i,t){let s=v.getRenderState3D(e,i,t,n.CullFace.FRONT),a=t?n.Pass.TRANSLUCENT:n.Pass.OPAQUE,l=e._domeColorCommand;l.renderState=s,l.pass=a};v.initialize2D=function(e,i,t){let s=new Float32Array(12*v.numberOfFloatsPerVertex2D);e._vertices2D=s;let a=6*v.numberOfFloatsPerVertex2D;e._command1Vertices2D=new Float32Array(e._vertices2D.buffer,Float32Array.BYTES_PER_ELEMENT*0,a),e._command2Vertices2D=new Float32Array(e._vertices2D.buffer,Float32Array.BYTES_PER_ELEMENT*a,a);let l=n.Buffer.createVertexBuffer({context:i,typedArray:s,usage:n.BufferUsage.STATIC_DRAW});e._vertexBuffer2D=l;let m=v.makeVertexArray2D(e,i,l),d=Pt(i,t),r=t?n.Pass.TRANSLUCENT:n.Pass.OPAQUE;e._drawCommands2D=[],e._pickCommands2D=[];let f=2;for(let c=0;c<f;++c){let h=new n.DrawCommand({owner:e}),_=new n.DrawCommand({owner:e,pickOnly:!0});h.vertexArray=m,h.offset=6*c,h.count=6,h.modelMatrix=n.Matrix4.clone(n.Matrix4.IDENTITY),h.renderState=d,h.pass=r,h.boundingVolume=new n.BoundingSphere,e._drawCommands2D.push(h),_.vertexArray=m,_.offset=6*c,_.count=6,_.modelMatrix=h.modelMatrix,_.renderState=d,_.pass=r,_.boundingVolume=h.boundingVolume,e._pickCommands2D.push(_)}};function lr(e){return`u_kDopFacetNormal${e}`}function cr(e){let i="",t="";for(let s=0;s<e;++s){let a=lr(s);i+=`uniform vec3 ${a};
`,s===0?t+=`	float value = dot(displacement, ${a});
`:t+=`	value = max(value, dot(displacement, ${a}));
`}return i+=`
float sensorSurfaceFunction(vec3 displacement)
{
${t}	return value;
}
`,i}v.initializeEllipsoidHorizonSurfaceCommands=function(e,i,t,s){let a=t+1;e._ellipsoidHorizonSurfaceColorCommands=new Array(a);let l=new Float32Array(v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand+v.numberOfFloatsPerHorizonCommand*t);e._ellipsoidHorizonSurfaceCommandsVertices=l;let m=n.Buffer.createVertexBuffer({context:i,typedArray:l,usage:n.BufferUsage.STATIC_DRAW});e._ellipsoidHorizonSurfaceCommandsBuffer=m;let d=v.makeVertexArray3D(e,i,m);e._ellipsoidHorizonSurfaceCommandsVertexArray=d;let r=cr(4);for(let f=0;f<a;++f){let c=new n.DrawCommand({primitiveType:s,vertexArray:d,owner:e});e._ellipsoidHorizonSurfaceColorCommands[f]=c,e._ellipsoidHorizonSurfaceColorCommandsSource[f]=f===0?e._sensorGlsl:r}};v.setVertices2D=function(e,i,t,s,a,l,m,d,r){let f=0;e[f++]=s.z,e[f++]=s.x,e[f++]=s.y,e[f++]=l,e[f++]=d,e[f++]=t.z,e[f++]=t.x,e[f++]=t.y,e[f++]=m,e[f++]=d,e[f++]=i.z,e[f++]=i.x,e[f++]=i.y,e[f++]=m,e[f++]=r,e[f++]=i.z,e[f++]=i.x,e[f++]=i.y,e[f++]=m,e[f++]=r,e[f++]=a.z,e[f++]=a.x,e[f++]=a.y,e[f++]=l,e[f++]=r,e[f++]=s.z,e[f++]=s.x,e[f++]=s.y,e[f++]=l,e[f++]=d};v.setBoundingSphere2D=function(e,i){i=n.BoundingSphere.fromPoints(e,i);let t=i.center,s=t.x,a=t.y,l=t.z;return t.x=l,t.y=s,t.z=a,i};v.setShaderPrograms2D=function(e,i,t,s){let a=new n.ShaderSource({defines:[e.showIntersection?"SHOW_INTERSECTION":""],sources:[G,le,e._sensorGlsl,e._ellipsoidSurfaceMaterial.shaderSource,s]}),l=n.ShaderProgram.replaceCache({context:i,shaderProgram:e._drawCommandsShaderProgram2D,vertexShaderSource:t,fragmentShaderSource:a,attributeLocations:v.attributeLocations2D});e._drawCommandsShaderProgram2D=l;let m=new n.ShaderSource({defines:[e.showIntersection?"SHOW_INTERSECTION":""],sources:[G,le,e._sensorGlsl,e._ellipsoidSurfaceMaterial.shaderSource,s],pickColorQualifier:"uniform"}),d=n.ShaderProgram.replaceCache({context:i,shaderProgram:e._pickCommandsShaderProgram2D,vertexShaderSource:t,fragmentShaderSource:m,attributeLocations:v.attributeLocations2D});e._pickCommandsShaderProgram2D=d;let r={czm_pickColor:function(){return e._pickId.color}},f=2;for(let c=0;c<f;++c){let h=e._drawCommands2D[c];h.shaderProgram=l,h.uniformMap=(0,n.combine)((0,n.combine)((0,n.combine)(e._uniforms,e._ellipsoidSurfaceMaterial._uniforms),e._sensorUniforms),e._uniforms2D);let _=e._pickCommands2D[c];_.shaderProgram=d,_.uniformMap=(0,n.combine)((0,n.combine)((0,n.combine)((0,n.combine)(e._uniforms,e._ellipsoidSurfaceMaterial._uniforms),e._sensorUniforms),e._uniforms2D),r)}};v.destroyShaderPrograms2D=function(e){(0,n.defined)(e._drawCommandsShaderProgram2D)&&e._drawCommandsShaderProgram2D.destroy(),(0,n.defined)(e._pickCommandsShaderProgram2D)&&e._pickCommandsShaderProgram2D.destroy()};var p=new n.Cartesian3,$=new n.Cartesian3,ke=new n.Cartesian3;function Tt(e,i,t,s){let a=e.length,l=-1,m=e[a-1],d=t[a-1];for(let r=0;r<a;++r){let f=e[r],c=t[r];p=n.Cartesian3.normalize(n.Cartesian3.cross(f,m,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,s,++l*3),n.Cartesian3.pack(p,s,++l*3),n.Cartesian3.pack(c,s,++l*3),n.Cartesian3.pack(p,s,++l*3),n.Cartesian3.pack(d,s,++l*3),n.Cartesian3.pack(p,s,++l*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.cross(d,i,$),n.Cartesian3.cross(c,i,ke),p),p),n.Cartesian3.pack(c,s,++l*3),n.Cartesian3.pack(p,s,++l*3),n.Cartesian3.pack(i,s,++l*3),n.Cartesian3.pack(p,s,++l*3),n.Cartesian3.pack(d,s,++l*3),n.Cartesian3.pack(p,s,++l*3),m=f,d=c}}function dr(e,i,t,s,a,l){let m=e.length,d=-1,r=m-1,f=e[r],c=t[r],h=a[r];for(let _=0;_<m;++_){let C=e[_],g=t[_],S=a[_];p=n.Cartesian3.normalize(n.Cartesian3.cross(C,f,p),p),n.Cartesian3.pack(g,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(S,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(h,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(h,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(c,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(g,l,++d*3),n.Cartesian3.pack(p,l,++d*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.cross(g,i,$),n.Cartesian3.cross(c,i,ke),p),p),n.Cartesian3.pack(c,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(i,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(g,l,++d*3),n.Cartesian3.pack(p,l,++d*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.cross(h,s,$),n.Cartesian3.cross(S,s,ke),p),p),n.Cartesian3.pack(S,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(s,l,++d*3),n.Cartesian3.pack(p,l,++d*3),n.Cartesian3.pack(h,l,++d*3),n.Cartesian3.pack(p,l,++d*3),f=C,c=g,h=S}}var oe=new n.Cartesian3,on=new n.Cartesian3,xn=new n.Cartesian3,De=new n.Cartesian3,xi=new n.Cartesian3,No=new n.Cartesian3,no=new n.Cartesian3,ur=new n.Cartesian3,mr=new n.Cartesian3,Rn=new n.Cartesian3,Gn=new n.Cartesian3;v.renderCompleteEllipsoidHorizonSurface=function(e,i,t,s,a,l,m,d,r,f){let c=v.numberOfSidesForCompleteCircle,h=e._directions.slice(0,c),_=n.Math.TWO_PI/c,C=Math.sqrt(1-1/l)/Math.cos(n.Math.PI/c);No=n.Cartesian3.mostOrthogonalAxis(d,No),xi=n.Cartesian3.normalize(n.Cartesian3.cross(No,d,xi),xi),no=n.Cartesian3.normalize(n.Cartesian3.cross(d,xi,no),no),De=n.Cartesian3.multiplyByScalar(d,m,De),oe=n.Cartesian3.negate(n.Cartesian3.normalize(n.Matrix3.multiplyByVector(f,s,oe),oe),oe);let g=1-l,S=e._fronts.slice(0,c),E=e._backs.slice(0,c);for(let x=0;x<v.numberOfSidesForCompleteCircle;++x){let j=-x*_;$=n.Cartesian3.add(n.Cartesian3.multiplyByScalar(xi,Math.cos(j),ur),n.Cartesian3.multiplyByScalar(no,Math.sin(j),mr),$),$=n.Cartesian3.add(De,n.Cartesian3.multiplyByScalar($,C,$),$),$=e.ellipsoid.transformPositionFromScaledSpace($,$),$=n.Cartesian3.subtract($,s,$),on=n.Cartesian3.normalize($,on),on=n.Matrix3.multiplyByVector(f,on,on),n.Cartesian3.clone(on,h[x]),xn=e.ellipsoid.transformPositionToScaledSpace(n.Matrix3.multiplyByVector(r,on,xn),xn),S[x]=n.Cartesian3.multiplyByScalar(on,g/n.Cartesian3.dot(xn,a),S[x]);let A=n.Cartesian3.dot(on,oe);E[x]=n.Cartesian3.multiplyByScalar(on,t/A,E[x])}xn=e.ellipsoid.transformPositionToScaledSpace(n.Matrix3.multiplyByVector(r,oe,xn),xn),Rn=n.Cartesian3.multiplyByScalar(oe,g/n.Cartesian3.dot(xn,a),Rn),Gn=n.Cartesian3.multiplyByScalar(oe,t,Gn);let V=e.portionToDisplay===n.SensorVolumePortionToDisplay.COMPLETE?v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand:v.numberOfFloatsForCompleteHorizonPyramidCommand,O=new Float32Array(e._ellipsoidHorizonSurfaceCommandsVertices.buffer,0,V);if(e.portionToDisplay===n.SensorVolumePortionToDisplay.COMPLETE)dr(h,Rn,S,Gn,E,O);else if(e.showThroughEllipsoid||e.portionToDisplay===n.SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON)Tt(h,Gn,E,O);else if(e.portionToDisplay===n.SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON)Tt(h,Rn,S,O);else throw new n.DeveloperError("this.portionToDisplay is required and must be valid.");let I=e._sensorUniforms,y=e._ellipsoidHorizonSurfaceColorCommands[0];y.offset=0,y.count=e.portionToDisplay===n.SensorVolumePortionToDisplay.COMPLETE?v.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand:v.numberOfVerticesForCompleteHorizonPyramidCommand,y.boundingVolume=n.BoundingSphere.fromVertices(O,void 0,v.numberOfFloatsPerVertex3D,y.boundingVolume),y.uniformMap=(0,n.combine)((0,n.combine)((0,n.combine)(e._uniforms,e._ellipsoidHorizonSurfaceUniforms),e._ellipsoidHorizonSurfaceMaterial._uniforms),I),y.boundingVolume=n.BoundingSphere.transform(y.boundingVolume,e.modelMatrix,y.boundingVolume),y.modelMatrix=e.modelMatrix,e._ellipsoidHorizonSurfaceCommandsBuffer.copyFromArrayView(O,0),e._ellipsoidHorizonSurfaceColorCommandList.push(y)};var J=new n.Cartesian3,ae=new n.Cartesian3,ce=new n.Cartesian3,ue=new n.Cartesian3,Se=new n.Cartesian3,We=new n.Cartesian3,He=new n.Cartesian3,Le=new n.Cartesian3,R=new n.Cartesian3,me=new n.Cartesian3,F=new n.Cartesian3,pe=new n.Cartesian3,_e=new n.Cartesian3,ve=new n.Cartesian3,Me=new n.Cartesian3,Ro=new n.Cartesian3,ko=new n.Cartesian3,io=new n.Cartesian3,Bn=new n.Cartesian3,mn=new n.Cartesian3,Ue=new n.Cartesian3,hi=new n.Cartesian3,pi=new n.Cartesian3,Dn=new n.Cartesian3,An=new n.Cartesian3,en=new n.Cartesian3,tn=new n.Cartesian3,Ge=new n.Cartesian3,ye=new n.Cartesian3,Ze=new n.Cartesian3;function Fo(e,i,t,s,a,l,m,d){let r=1/m;De=n.Cartesian3.multiplyByScalar(l,r,De),mn=n.Cartesian3.cross(i,t,mn);let f=n.Cartesian3.dot(mn,l);Ro=n.Cartesian3.subtract(i,De,Ro),ko=n.Cartesian3.subtract(t,De,ko),io=n.Cartesian3.add(Ro,ko,io),Ue=n.Cartesian3.divideByScalar(io,2,Ue);let c=1-r,h=Math.sqrt(c),_=n.Math.EPSILON5;if(f<-n.Math.EPSILON15)if(hi=n.Cartesian3.normalize(Ue,hi),Dn=n.Cartesian3.multiplyByScalar(hi,h+_,Dn),d===n.SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON){Bn=n.Cartesian3.subtract(i,t,Bn),en=n.Cartesian3.multiplyByScalar(Bn,.5,en),An=n.Cartesian3.add(Dn,De,An),ke=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(An,a,ke),ke),F=n.Cartesian3.multiplyComponents(i,e,F),J=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,J),J);let C=(m-1)/n.Cartesian3.dot(J,ke);J=n.Matrix3.multiplyByScalar(J,C,J),pe=n.Cartesian3.normalize(J,pe),F=n.Cartesian3.multiplyComponents(t,e,F),ae=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ae),ae);let g=(m-1)/n.Cartesian3.dot(ae,ke);ae=n.Matrix3.multiplyByScalar(ae,g,ae),_e=n.Cartesian3.normalize(ae,_e),R=n.Cartesian3.subtract(An,en,R),F=n.Cartesian3.multiplyComponents(R,e,F),ce=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ce),ce),ve=n.Cartesian3.normalize(ce,ve),R=n.Cartesian3.add(An,en,R),F=n.Cartesian3.multiplyComponents(R,e,F),ue=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ue),ue),Me=n.Cartesian3.normalize(ue,Me)}else{let C=n.Cartesian3.magnitude(Ue),g=c-h*C;An=n.Cartesian3.multiplyByScalar(De,g+_,An),tn=n.Cartesian3.subtract(Dn,Ue,tn),tn=n.Cartesian3.multiplyByScalar(tn,c+_,tn),tn=n.Cartesian3.add(tn,An,tn),F=n.Cartesian3.multiplyComponents(i,e,F),J=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,J),J),pe=n.Cartesian3.normalize(J,pe),F=n.Cartesian3.multiplyComponents(t,e,F),ae=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ae),ae),_e=n.Cartesian3.normalize(ae,_e),R=n.Cartesian3.add(t,tn,R),F=n.Cartesian3.multiplyComponents(R,e,F),ce=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ce),ce),ve=n.Cartesian3.normalize(ce,ve),R=n.Cartesian3.add(i,tn,R),F=n.Cartesian3.multiplyComponents(R,e,F),ue=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ue),ue),Me=n.Cartesian3.normalize(ue,Me)}else Bn=n.Cartesian3.subtract(i,t,Bn),en=n.Cartesian3.multiplyByScalar(n.Cartesian3.normalize(Bn,en),h+_,en),n.Cartesian3.magnitudeSquared(io)>n.Math.EPSILON15?(hi=n.Cartesian3.normalize(Ue,hi),pi=n.Cartesian3.negate(hi,pi)):pi=n.Cartesian3.normalize(n.Cartesian3.cross(Bn,De,pi),pi),Dn=n.Cartesian3.multiplyByScalar(pi,h+_,Dn),R=n.Cartesian3.add(n.Cartesian3.add(Ue,en,R),De,R),F=n.Cartesian3.multiplyComponents(R,e,F),J=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,J),J),pe=n.Cartesian3.normalize(J,pe),R=n.Cartesian3.add(n.Cartesian3.subtract(Ue,en,R),De,R),F=n.Cartesian3.multiplyComponents(R,e,F),ae=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ae),ae),_e=n.Cartesian3.normalize(ae,_e),R=n.Cartesian3.add(n.Cartesian3.subtract(Dn,en,R),De,R),F=n.Cartesian3.multiplyComponents(R,e,F),ce=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ce),ce),ve=n.Cartesian3.normalize(ce,ve),R=n.Cartesian3.add(n.Cartesian3.add(Dn,en,R),De,R),F=n.Cartesian3.multiplyComponents(R,e,F),ue=n.Matrix3.multiplyByVector(s,n.Cartesian3.subtract(F,a,ue),ue),Me=n.Cartesian3.normalize(ue,Me)}function Ht(e){oe=n.Cartesian3.normalize(n.Cartesian3.fromElements(pe.x+_e.x+ve.x+Me.x,pe.y+_e.y+ve.y+Me.y,pe.z+_e.z+ve.z+Me.z,oe),oe),Se=n.Cartesian3.multiplyByScalar(pe,e/n.Cartesian3.dot(pe,oe),Se),We=n.Cartesian3.multiplyByScalar(_e,e/n.Cartesian3.dot(_e,oe),We),He=n.Cartesian3.multiplyByScalar(ve,e/n.Cartesian3.dot(ve,oe),He),Le=n.Cartesian3.multiplyByScalar(Me,e/n.Cartesian3.dot(Me,oe),Le)}var Bo=new n.Cartesian3,qo=new n.Cartesian3,Uo=new n.Cartesian3,Go=new n.Cartesian3;function fr(e,i,t,s,a,l,m,d,r,f){Fo(e,i,t,s,a,l,m,f);let c=0;return p=n.Cartesian3.normalize(n.Cartesian3.cross(pe,_e,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,c),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(_e,ve,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(ve,Me,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(Me,pe,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),Ge=n.Cartesian3.subtract(ae,J,Ge),ye=n.Cartesian3.subtract(ce,J,ye),Ze=n.Cartesian3.subtract(ue,J,Ze),p=n.Cartesian3.normalize(n.Cartesian3.cross(ye,Ge,p),p),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(Ze,ye,p),p),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),{u_kDopFacetNormal0:function(){return n.Cartesian3.fromArray(r,3,Bo)},u_kDopFacetNormal1:function(){return n.Cartesian3.fromArray(r,2*3*3+3,qo)},u_kDopFacetNormal2:function(){return n.Cartesian3.fromArray(r,2*3*3*2+3,Uo)},u_kDopFacetNormal3:function(){return n.Cartesian3.fromArray(r,2*3*3*3+3,Go)}}}function hr(e,i,t,s,a,l,m,d,r,f){Fo(e,i,t,s,a,l,m,f),Ht(d);let c=0;return p=n.Cartesian3.normalize(n.Cartesian3.cross(pe,_e,p),p),n.Cartesian3.pack(J,r,c),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(_e,ve,p),p),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(ve,Me,p),p),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(Me,pe,p),p),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),Ge=n.Cartesian3.subtract(We,Se,Ge),ye=n.Cartesian3.subtract(He,Se,ye),Ze=n.Cartesian3.subtract(Le,Se,Ze),p=n.Cartesian3.normalize(n.Cartesian3.cross(ye,Ge,p),p),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(Ze,ye,p),p),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),Ge=n.Cartesian3.subtract(ae,J,Ge),ye=n.Cartesian3.subtract(ce,J,ye),Ze=n.Cartesian3.subtract(ue,J,Ze),p=n.Cartesian3.normalize(n.Cartesian3.cross(Ge,ye,p),p),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ae,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(ye,Ze,p),p),n.Cartesian3.pack(J,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ce,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(ue,r,++c*3),n.Cartesian3.pack(p,r,++c*3),{u_kDopFacetNormal0:function(){return n.Cartesian3.fromArray(r,3,Bo)},u_kDopFacetNormal1:function(){return n.Cartesian3.fromArray(r,2*3*3*2+3,qo)},u_kDopFacetNormal2:function(){return n.Cartesian3.fromArray(r,2*3*3*2*2+3,Uo)},u_kDopFacetNormal3:function(){return n.Cartesian3.fromArray(r,2*3*3*2*3+3,Go)}}}function pr(e,i,t,s,a,l,m,d,r,f){Fo(e,i,t,s,a,l,m,f),Ht(d);let c=0;return p=n.Cartesian3.normalize(n.Cartesian3.cross(pe,_e,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,c),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(_e,ve,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(ve,Me,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(Me,pe,p),p),n.Cartesian3.pack(n.Cartesian3.ZERO,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),Ge=n.Cartesian3.subtract(We,Se,Ge),ye=n.Cartesian3.subtract(He,Se,ye),Ze=n.Cartesian3.subtract(Le,Se,Ze),p=n.Cartesian3.normalize(n.Cartesian3.cross(ye,Ge,p),p),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(We,r,++c*3),n.Cartesian3.pack(p,r,++c*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(Ze,ye,p),p),n.Cartesian3.pack(Se,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(Le,r,++c*3),n.Cartesian3.pack(p,r,++c*3),n.Cartesian3.pack(He,r,++c*3),n.Cartesian3.pack(p,r,++c*3),{u_kDopFacetNormal0:function(){return n.Cartesian3.fromArray(r,3,Bo)},u_kDopFacetNormal1:function(){return n.Cartesian3.fromArray(r,2*3*3+3,qo)},u_kDopFacetNormal2:function(){return n.Cartesian3.fromArray(r,2*3*3*2+3,Uo)},u_kDopFacetNormal3:function(){return n.Cartesian3.fromArray(r,2*3*3*3+3,Go)}}}v.updateHorizonCommand=function(e,i,t,s,a,l,m,d,r,f,c){let h,_,C;if(t.portionToDisplay===n.SensorVolumePortionToDisplay.COMPLETE)C=12*3,h=new Float32Array(t._ellipsoidHorizonSurfaceCommandsVertices.buffer,Float32Array.BYTES_PER_ELEMENT*(v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand+v.numberOfFloatsPerHorizonCommand*e),C*v.numberOfFloatsPerVertex3D),_=hr(t.ellipsoid.radii,a,l,m,d,r,f,c,h,t.portionToDisplay),i.boundingVolume=n.BoundingSphere.fromPoints([J,ae,ce,ue,Se,We,He,Le],i.boundingVolume);else if(t.showThroughEllipsoid||t.portionToDisplay===n.SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON)C=6*3,h=new Float32Array(t._ellipsoidHorizonSurfaceCommandsVertices.buffer,Float32Array.BYTES_PER_ELEMENT*(v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand+v.numberOfFloatsPerHorizonCommand*e),C*v.numberOfFloatsPerVertex3D),_=pr(t.ellipsoid.radii,a,l,m,d,r,f,c,h,t.portionToDisplay),i.boundingVolume=n.BoundingSphere.fromPoints([n.Cartesian3.ZERO,Se,We,He,Le],i.boundingVolume);else if(t.portionToDisplay===n.SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON)C=6*3,h=new Float32Array(t._ellipsoidHorizonSurfaceCommandsVertices.buffer,Float32Array.BYTES_PER_ELEMENT*(v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand+v.numberOfFloatsPerHorizonCommand*e),C*v.numberOfFloatsPerVertex3D),_=fr(t.ellipsoid.radii,a,l,m,d,r,f,c,h,t.portionToDisplay),i.boundingVolume=n.BoundingSphere.fromPoints([n.Cartesian3.ZERO,J,ae,ce,ue],i.boundingVolume);else throw new n.DeveloperError("this.portionToDisplay is required and must be valid.");i.offset=v.numberOfVerticesForCompleteHorizonPyramidalFrustumCommand+v.numberOfVerticesPerHorizonCommand*e,i.count=C,i.uniformMap=(0,n.combine)((0,n.combine)((0,n.combine)(t._uniforms,t._ellipsoidHorizonSurfaceUniforms),t._ellipsoidHorizonSurfaceMaterial._uniforms),_),i.boundingVolume=n.BoundingSphere.transform(i.boundingVolume,t.modelMatrix,i.boundingVolume),i.modelMatrix=t.modelMatrix,t._ellipsoidHorizonSurfaceCommandsBuffer.copyFromArrayView(h,Float32Array.BYTES_PER_ELEMENT*(v.numberOfFloatsForCompleteHorizonPyramidalFrustumCommand+v.numberOfFloatsPerHorizonCommand*e))};function _r(e,i,t,s,a,l,m){let d=i.length,r=-1,f=d-1,c=e[i[f]],h=s[f],_=l[f];for(let C=0;C<d;++C){let g=e[i[C]],S=s[C],E=l[C];p=n.Cartesian3.normalize(n.Cartesian3.cross(g,c,p),p),n.Cartesian3.pack(S,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(E,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(_,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(_,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(h,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(S,m,++r*3),n.Cartesian3.pack(p,m,++r*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.cross(S,t,$),n.Cartesian3.cross(h,t,ke),p),p),n.Cartesian3.pack(h,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(t,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(S,m,++r*3),n.Cartesian3.pack(p,m,++r*3),p=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.cross(_,a,$),n.Cartesian3.cross(E,a,ke),p),p),n.Cartesian3.pack(E,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(a,m,++r*3),n.Cartesian3.pack(p,m,++r*3),n.Cartesian3.pack(_,m,++r*3),n.Cartesian3.pack(p,m,++r*3),c=g,h=S,_=E}}function xt(e,i,t,s,a,l,m){let d=a.length,r=1,f=-1,c=a[d-1];for(let C=0;C<d;++C){let g=a[C],S=s[c],E=s[g];r=Math.min(n.Cartesian3.dot(E,t),r),Ue=n.Cartesian3.normalize(n.Cartesian3.add(S,E,Ue),Ue),f=Math.max(n.Cartesian3.dot(Ue,t),f),c=g}let h=e._fronts,_=e._backs;for(let C=0;C<d;++C){let g=s[a[C]],S=n.Cartesian3.dot(g,t);S===0?(h[C]=n.Cartesian3.multiplyByScalar(g,l,h[C]),_[C]=n.Cartesian3.add(n.Cartesian3.multiplyByScalar(g,l,$),n.Cartesian3.multiplyByScalar(t,l,ke),_[C])):(h[C]=n.Cartesian3.subtract(n.Cartesian3.multiplyByScalar(g,l*f/S,$),n.Cartesian3.multiplyByScalar(t,l*(f-r),ke),h[C]),_[C]=n.Cartesian3.add(n.Cartesian3.multiplyByScalar(g,l*f/S,$),n.Cartesian3.multiplyByScalar(t,l*(1-f),ke),_[C]))}Rn=i?n.Cartesian3.multiplyByScalar(t,l*r,Rn):n.Cartesian3.negate(t,Rn),Gn=n.Cartesian3.multiplyByScalar(t,l,Gn),_r(s,a,Rn,h,Gn,_,m)}function Cr(e,i,t,s,a,l,m,d){let r=a.length*4*3,f=r*v.numberOfFloatsPerVertex3D,c=new Float32Array(i._domeCommandsVertices.buffer,0,f);return xt(i,!0,t,s,a,l,c),e.offset=0,e.count=r,n.BoundingSphere.fromVertices(c,void 0,v.numberOfFloatsPerVertex3D,d),e.uniformMap=(0,n.combine)((0,n.combine)(i._uniforms,i._domeSurfaceMaterial._uniforms),m),e.modelMatrix=i.modelMatrix,i._domeCommandsBuffer.copyFromArrayView(c,0),d}v.initializeDomeCommand=function(e,i,t,s,a,l,m,d,r){let c=s.length*4*3*v.numberOfFloatsPerVertex3D,h=new Float32Array(c);e._domeCommandsVertices=h;let _=n.Buffer.createVertexBuffer({context:a,typedArray:h,usage:n.BufferUsage.STATIC_DRAW});e._domeCommandsBuffer=_;let C=v.makeVertexArray3D(e,a,_);e._domeCommandsVertexArray=C,e._domeColorCommand.primitiveType=m,e._domeColorCommand.owner=e,e._domeColorCommand.vertexArray=C,Cr(e._domeColorCommand,e,i,t,s,d,r,e._completeDomeBoundingVolumeMC)};v.renderCompleteDome=function(e){let i=e._domeColorCommand;i.boundingVolume=n.BoundingSphere.transform(e._completeDomeBoundingVolumeMC,e.modelMatrix,i.boundingVolume),i.modelMatrix=e.modelMatrix,e._domeColorCommandToAdd=i};v.initializeSurfaceCommand=function(e,i,t,s,a,l,m){(0,n.defined)(e._surfaceCommandVertexArray)&&e._surfaceCommandVertexArray.destroy();let d=s.length*4*3,r=d*v.numberOfFloatsPerVertex3D,f=new Float32Array(r);xt(e,!1,i,t,s,m,f),n.BoundingSphere.fromVertices(f,void 0,v.numberOfFloatsPerVertex3D,e._surfaceBoundingVolumeMC);let c=n.Buffer.createVertexBuffer({context:a,typedArray:f,usage:n.BufferUsage.STATIC_DRAW}),h=v.makeVertexArray3D(e,a,c);e._surfaceCommandVertexArray=h;let _=e._surfaceCommand;_.offset=0,_.count=d,_.primitiveType=l,_.owner=e,_.vertexArray=h};function _i(e,i,t){let s=t||i?n.BlendingState.DISABLED:n.BlendingState.ALPHA_BLEND,a=i?n.StencilOperation.INCREMENT_WRAP:n.StencilOperation.KEEP,l=!i;return n.RenderState.fromCache({depthTest:{enabled:!1},depthMask:!1,blending:s,cull:{enabled:!0,face:n.CullFace.FRONT},colorMask:{red:l,green:l,blue:l,alpha:l},stencilTest:{enabled:e,frontFunction:n.StencilFunction.EQUAL,frontOperation:{fail:n.StencilOperation.KEEP,zFail:n.StencilOperation.KEEP,zPass:a},backFunction:n.StencilFunction.EQUAL,backOperation:{fail:n.StencilOperation.KEEP,zFail:n.StencilOperation.KEEP,zPass:a},reference:n.StencilConstants.CESIUM_3D_TILE_MASK,mask:n.StencilConstants.CESIUM_3D_TILE_MASK},stencilMask:n.StencilConstants.CLASSIFICATION_MASK})}function Ci(e,i){let t=n.DrawCommand.shallowClone(e,e.derivedCommands[i]);return e.derivedCommands[i]=t,t}function Sr(e){let i=e._surfaceCommand;i.boundingVolume=n.BoundingSphere.transform(e._surfaceBoundingVolumeMC,e.modelMatrix,i.boundingVolume),i.modelMatrix=e._modelMatrix,i.renderState=_i(!1,!1,!1),i.uniformMap=(0,n.combine)((0,n.combine)(e._ellipsoidSurfaceMaterial._uniforms,e._uniforms),e._sensorUniforms),i.shaderProgram=e._surfaceCommandShaderProgram,i.pass=n.Pass.TERRAIN_CLASSIFICATION;let t=Ci(i,"tileset");t.renderState=_i(!0,!1,!1),t.pass=n.Pass.CESIUM_3D_TILE_CLASSIFICATION;let s=Ci(i,"invertClassification");s.renderState=_i(!0,!0,!1),s.pass=n.Pass.CESIUM_3D_TILE_CLASSIFICATION_IGNORE_SHOW;let a=Ci(i,"viewshed");a.shaderProgram=e._surfaceCommandViewshedShaderProgram,a.uniformMap=(0,n.combine)((0,n.combine)(i.uniformMap,e._viewshedUniforms),e._shadowMapUniforms);let l=Ci(a,"tileset");l.renderState=_i(!0,!1,!1),l.pass=n.Pass.CESIUM_3D_TILE_CLASSIFICATION;let m=Ci(i,"pick");m.shaderProgram=e._surfaceCommandPickShaderProgram,m.uniformMap=(0,n.combine)(i.uniformMap,e._pickUniforms),m.renderState=_i(!1,!1,!0),m.pickOnly=!0;let d=Ci(m,"tileset");d.renderState=_i(!0,!1,!0),d.pass=n.Pass.CESIUM_3D_TILE_CLASSIFICATION}function gr(e,i){let t=new n.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),s=[e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",n.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],a=[G,le,e._sensorGlsl,e._ellipsoidSurfaceMaterial.shaderSource,eo],l=new n.ShaderSource({defines:s,sources:a});e._surfaceCommandShaderProgram=n.ShaderProgram.replaceCache({context:i,shaderProgram:e._surfaceCommandShaderProgram,vertexShaderSource:t,fragmentShaderSource:l,attributeLocations:v.attributeLocations3D});let m=new n.ShaderSource({defines:s,sources:a,pickColorQualifier:"uniform"});if(e._surfaceCommandPickShaderProgram=n.ShaderProgram.replaceCache({context:i,shaderProgram:e._surfaceCommandPickShaderProgram,vertexShaderSource:t,fragmentShaderSource:m,attributeLocations:v.attributeLocations3D}),e.showViewshed){let d=new n.ShaderSource({defines:s.concat("VIEWSHED"),sources:a});e._surfaceCommandViewshedShaderProgram=n.ShaderProgram.replaceCache({context:i,shaderProgram:e._surfaceCommandViewshedShaderProgram,vertexShaderSource:t,fragmentShaderSource:d,attributeLocations:v.attributeLocations3D})}}v.updateSurface=function(e,i){gr(e,i),Sr(e)};v.addSurfaceCommand=function(e,i){if(e.portionToDisplay===n.SensorVolumePortionToDisplay.ABOVE_ELLIPSOID_HORIZON)return;let t=e.classificationType,s=t!==n.ClassificationType.CESIUM_3D_TILE,a=t!==n.ClassificationType.TERRAIN,l=e._surfaceCommand;l.boundingVolume=n.BoundingSphere.transform(e._surfaceBoundingVolumeMC,e.modelMatrix,l.boundingVolume),i.invertClassification&&i.commandList.push(l.derivedCommands.invertClassification),i.passes.pick?l=l.derivedCommands.pick:e.showViewshed&&(l=l.derivedCommands.viewshed),s&&i.commandList.push(l),a&&i.commandList.push(l.derivedCommands.tileset)};v.destroyShader=function(e){return e&&e.destroy()};v.destroyShaderProgram=function(e){e.shaderProgram=e.shaderProgram&&e.shaderProgram.destroy()};v.destroyShaderPrograms=function(e){if((0,n.defined)(e)){let i=e.length;for(let t=0;t<i;++t)v.destroyShaderProgram(e[t])}};var kn=new n.Cartesian3,qn=new n.Cartesian3,oo=new n.Cartesian3,Si=new n.Cartesian3,Zn=new n.Cartesian3,to=new n.Matrix3,Di=new n.Cartesian3,ro=new n.Cartesian3,Pe=new n.Cartesian3;v.checkPlanarCrossings=function(e,i,t,s,a,l,m,d,r,f,c,h,_,C,g,S,E){let V=E.crossings;kn=e.transformPositionFromScaledSpace(n.Matrix3.multiplyByVector(m,h,kn),kn),qn=n.Cartesian3.normalize(kn,qn);let O=n.Cartesian3.dot(t,qn);oo=n.Cartesian3.cross(qn,s,oo);let I=n.Cartesian3.magnitudeSquared(oo),y=!0;if(O<=1&&I>n.Math.EPSILON15){Si=n.Cartesian3.normalize(oo,Si),Zn=n.Cartesian3.fromElements(a,O,0,Zn),n.Matrix3.fromRowMajorArray([s.x,s.y,s.z,qn.x,qn.y,qn.z,Si.x,Si.y,Si.z],to),n.Matrix3.inverse(to,to),Di=n.Matrix3.multiplyByVector(to,Zn,Di);let x=n.Cartesian3.magnitudeSquared(Di);if(x<1){if(y=!1,ro=n.Cartesian3.multiplyByScalar(Si,Math.sqrt(1-x),ro),R=n.Cartesian3.subtract(Di,ro,R),F=e.transformPositionFromScaledSpace(R,F),me=n.Matrix3.multiplyByVector(d,n.Cartesian3.subtract(F,i,me),me),oe=n.Cartesian3.normalize(me,oe),(g!==n.SensorVolumePortionToDisplay.COMPLETE||n.Cartesian3.magnitudeSquared(me)<=l)&&(!c||n.Cartesian3.dot(oe,_)>C)){Pe=n.Cartesian3.normalize(n.Cartesian3.subtract(R,s,Pe),Pe);let j=n.Cartesian3.dot(Pe,r),A=n.Cartesian3.dot(Pe,f),P=V[E.count++];P.index=S,n.Cartesian3.clone(me,P.v),n.Cartesian3.clone(R,P.r),P.cosine=j,P.sine=A,P.kind=1}if(R=n.Cartesian3.add(Di,ro,R),F=e.transformPositionFromScaledSpace(R,F),me=n.Matrix3.multiplyByVector(d,n.Cartesian3.subtract(F,i,me),me),oe=n.Cartesian3.normalize(me,oe),(g!==n.SensorVolumePortionToDisplay.COMPLETE||n.Cartesian3.magnitudeSquared(me)<=l)&&(!c||n.Cartesian3.dot(oe,_)>C)){Pe=n.Cartesian3.normalize(n.Cartesian3.subtract(R,s,Pe),Pe);let j=n.Cartesian3.dot(Pe,r),A=n.Cartesian3.dot(Pe,f),P=V[E.count++];P.index=S,n.Cartesian3.clone(me,P.v),n.Cartesian3.clone(R,P.r),P.cosine=j,P.sine=A,P.kind=-1}}}return y};v.angularSortUsingSineAndCosine=function(e,i){function t(s){if(s.sine>0)return-s.cosine-1;if(s.sine<0)return s.cosine+1;if(s.cosine>0)return-2;if(s.cosine<0)return 0;throw new n.DeveloperError("Angle value is undefined (sine and cosine are both zero).")}return t(e)-t(i)};var ao=new n.Matrix3,Wo=new n.Matrix3,so=new n.Matrix3,Ai=new n.Matrix3,lo=new n.Matrix3,Lo=new n.Matrix3,co=new n.Matrix3,bn=new n.Matrix3,uo=new n.Matrix3,Un=new n.Cartesian3,Nn=new n.Cartesian3,gi=new n.Cartesian3;v.checkConicCrossings=function(e,i,t,s,a,l,m,d,r,f,c,h,_,C,g,S,E,V,O,I,y,x){ao=n.Cartesian3.normalize(n.Cartesian3.negate(i,ao),ao);let j=Math.asin(e.maximumRadius/n.Cartesian3.magnitude(i)),A=!0;if(s>1&&n.Cartesian3.angleBetween(E,ao)-j-V<=0){Wo=n.Matrix3.fromScale(e.radii,Wo),so=n.Matrix3.fromCrossProduct(E,so);let P=Math.sin(V),Q=P*P;bn=n.Matrix3.fromUniformScale(Q,bn),Ai=n.Matrix3.subtract(n.Matrix3.multiply(n.Matrix3.transpose(so,uo),so,Ai),bn,Ai),Un=a,Nn=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.mostOrthogonalAxis(Un,Nn),Un,Nn),Nn),gi=n.Cartesian3.normalize(n.Cartesian3.cross(Un,Nn,gi),gi),co=n.Matrix3.fromRowMajorArray([Un.x,Un.y,Un.z,Nn.x,Nn.y,Nn.z,gi.x,gi.y,gi.z],co),$=n.Matrix3.multiplyByVector(Ai,i,$),bn=n.Matrix3.multiply(co,Wo,bn),uo=n.Matrix3.transpose(bn,uo),lo=n.Matrix3.multiply(n.Matrix3.multiply(bn,Ai,lo),uo,lo),kn=n.Cartesian3.multiplyByScalar(n.Matrix3.multiplyByVector(bn,$,kn),-2,kn);let K=n.Cartesian3.dot(i,$),ie=1/s,se=1-ie,re=n.IntersectionTests.quadraticVectorExpression(lo,kn,K,Math.sqrt(ie),Math.sqrt(se)),ge=re.length;if(ge>0){let ne=[],N=C-h,Ne=Math.cos(V);Lo=n.Matrix3.transpose(co,Lo);for(let de=0;de<ge;++de){let b=re[de];R=n.Cartesian3.normalize(n.Matrix3.multiplyByVector(Lo,b,R),R),Zn=n.Cartesian3.subtract(R,t,Zn),me=e.transformPositionFromScaledSpace(Zn,me),oe=n.Cartesian3.normalize(me,oe);let k=n.Cartesian3.dot(Zn,R),Y=n.Cartesian3.dot(oe,E)-Ne;if(Math.abs(k)<n.Math.EPSILON4&&Math.abs(Y)<n.Math.EPSILON4){A=!1,$=n.Matrix3.multiplyByVector(r,oe,$);let H;if(S?N<Math.PI?H=Math.max(n.Cartesian3.dot($,g),n.Cartesian3.dot($,_))<0:N>Math.PI&&(H=Math.min(n.Cartesian3.dot($,g),n.Cartesian3.dot($,_))<0):H=!0,(I!==n.SensorVolumePortionToDisplay.COMPLETE||n.Cartesian3.magnitudeSquared(me)<=d)&&H){Pe=n.Cartesian3.normalize(n.Cartesian3.subtract(R,a,Pe),Pe);let U=n.Cartesian3.dot(Pe,f),he=n.Cartesian3.dot(Pe,c),ee=new sr;ee.index=y,me=n.Matrix3.multiplyByVector(r,me,me),n.Cartesian3.clone(me,ee.v),n.Cartesian3.clone(R,ee.r),ee.cosine=U,ee.sine=he,ee.kind=0,ne.push(ee)}}}ge=ne.length;for(let de=ge-1;de>=0;--de){let b=!1;for(let k=de-1;k>=0&&!b;--k){pe=ne[de].r,_e=ne[k].r;let Y=n.Cartesian3.dot(pe,_e),H=n.Cartesian3.magnitudeSquared(n.Cartesian3.cross(pe,_e,mn));Y>0&&Math.abs(H)<n.Math.EPSILON12&&(ne.splice(de,1),b=!0)}}if(ge=ne.length,ge>0){ne=ne.slice(0,ge),ne.sort(v.angularSortUsingSineAndCosine),R=n.Cartesian3.clone(ne[0].r,R),F=e.transformPositionFromScaledSpace(R,F),me=n.Cartesian3.subtract(F,i,me),oe=n.Cartesian3.normalize(me,oe),p=e.transformPositionToScaledSpace(R,p),mn=n.Cartesian3.normalize(n.Cartesian3.cross(n.Cartesian3.cross(E,oe,mn),oe,mn),mn),$=n.Cartesian3.normalize(n.Cartesian3.cross(p,m,$),$);let de=n.Cartesian3.dot(mn,$)>0?O:-O,b=x.crossings;ge=ne.length;for(let k=0;k<ge;++k){let Y=ne[k],H=b[x.count++];H.index=Y.index,n.Cartesian3.clone(Y.v,H.v),n.Cartesian3.clone(Y.r,H.r),H.cosine=Y.cosine,H.sine=Y.sine,H.kind=de,de*=-1}}}}return A};v.createEnvironmentOcclusionMaterial=function(e,i){let t=(0,n.clone)(e._template);t.uniforms=(0,n.clone)(e.uniforms);let s=(0,n.clone)(i._template);s.uniforms=(0,n.clone)(i.uniforms);let a=`czm_material czm_getMaterial(czm_materialInput materialInput) 
{ 
    float depth; 
    bool occluded = getShadowVisibility(-materialInput.positionToEyeEC, depth); 
    if (occluded) 
    { 
        return occludedMaterial; 
    } 
    else 
    { 
        return domeMaterial; 
    } 
} 
`;return new n.Material({strict:!0,fabric:{materials:{domeMaterial:t,occludedMaterial:s},source:a}})};var w=v;function wr(){this.index=void 0,this.v=new o.Cartesian3,this.r=new o.Cartesian3,this.cosine=void 0,this.sine=void 0,this.kind=void 0}function Qn(e){e=e??o.Frozen.EMPTY_OBJECT,this._pickId=void 0,this._pickPrimitive=e._pickPrimitive??this,this._vertices2D=void 0,this._command1Vertices2D=void 0,this._command2Vertices2D=void 0,this._vertexArray2D=void 0,this._vertexBuffer2D=void 0,this._drawCommands2D=void 0,this._drawCommandsShaderProgram2D=void 0,this._pickCommands2D=void 0,this._pickCommandsShaderProgram2D=void 0,this._numberOfCommands2D=0,this._ellipsoidHorizonSurfaceCommandsVertices=void 0,this._ellipsoidHorizonSurfaceCommandsVertexArray=void 0,this._ellipsoidHorizonSurfaceCommandsBuffer=void 0,this._ellipsoidHorizonSurfaceColorCommandList=[],this._domeCommandsVertices=void 0,this._domeCommandsVertexArray=void 0,this._domeCommandsBuffer=void 0,this._domeColorCommandToAdd=void 0,this._completeDomeBoundingVolumeMC=new o.BoundingSphere,this._surfaceCommandVertexArray=void 0,this._surfaceCommandShaderProgram=void 0,this._surfaceCommandPickShaderProgram=void 0,this._surfaceCommandViewshedShaderProgram=void 0,this._surfaceCommand=new o.DrawCommand,this._surfaceBoundingVolumeMC=new o.BoundingSphere,this._lateralPlanarCommandsVertexArray=void 0,this._lateralPlanarBoundingSphere=new o.BoundingSphere,this._lateralPlanarBoundingSphereWC=new o.BoundingSphere,this._lateralInnerConicCommandsVertexArray=void 0,this._lateralInnerConicBoundingSphere=new o.BoundingSphere,this._lateralInnerConicBoundingSphereWC=new o.BoundingSphere,this._lateralOuterConicCommandsVertexArray=void 0,this._lateralOuterConicBoundingSphere=new o.BoundingSphere,this._lateralOuterConicBoundingSphereWC=new o.BoundingSphere,this._lateralInnerConicCommand=new o.DrawCommand({boundingVolume:this._lateralInnerConicBoundingSphereWC,owner:this}),this._lateralInnerConicCommandInsideShaderProgram=void 0,this._lateralInnerConicCommandOutsideShaderProgram=void 0,this._lateralInnerConicPickCommand=new o.DrawCommand({boundingVolume:this._lateralInnerConicBoundingSphereWC,owner:this,pickOnly:!0}),this._lateralOuterConicCommand=new o.DrawCommand({boundingVolume:this._lateralOuterConicBoundingSphereWC,owner:this}),this._lateralOuterConicCommandInsideShaderProgram=void 0,this._lateralOuterConicCommandOutsideShaderProgram=void 0,this._lateralOuterConicPickCommand=new o.DrawCommand({boundingVolume:this._lateralOuterConicBoundingSphereWC,owner:this,pickOnly:!0}),this._frontFaceColorCommand=new o.DrawCommand({boundingVolume:this._lateralPlanarBoundingSphereWC,owner:this}),this._backFaceColorCommand=new o.DrawCommand({boundingVolume:this._lateralPlanarBoundingSphereWC,owner:this}),this._pickCommand=new o.DrawCommand({boundingVolume:this._lateralPlanarBoundingSphereWC,owner:this,pickOnly:!0}),this._ellipsoidHorizonSurfaceColorCommands=[],this._ellipsoidHorizonSurfaceColorCommandsSource=[],this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram=[],this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram=[],this._domeColorCommand=new o.DrawCommand({owner:this}),this._domeColorCommandSource=void 0,this._domeColorCommandInsideShaderProgram=void 0,this._domeColorCommandOutsideShaderProgram=void 0,this._ellipsoid=e.ellipsoid??o.Ellipsoid.WGS84,this.show=e.show??!0,this.portionToDisplay=e.portionToDisplay??o.SensorVolumePortionToDisplay.COMPLETE,this._portionToDisplay=this.portionToDisplay,this.modelMatrix=o.Matrix4.clone(e.modelMatrix??o.Matrix4.IDENTITY),this._modelMatrix=void 0,this.lateralSurfaceMaterial=(0,o.defined)(e.lateralSurfaceMaterial)?e.lateralSurfaceMaterial:o.Material.fromType(o.Material.ColorType),this._lateralSurfaceMaterial=void 0,this._lateralSurfaceIsTranslucent=void 0,this.showLateralSurfaces=e.showLateralSurfaces??!0,this.ellipsoidHorizonSurfaceMaterial=(0,o.defined)(e.ellipsoidHorizonSurfaceMaterial)?e.ellipsoidHorizonSurfaceMaterial:void 0,this._ellipsoidHorizonSurfaceMaterial=void 0,this._ellipsoidHorizonSurfaceIsTranslucent=void 0,this.showEllipsoidHorizonSurfaces=e.showEllipsoidHorizonSurfaces??!0,this.ellipsoidSurfaceMaterial=(0,o.defined)(e.ellipsoidSurfaceMaterial)?e.ellipsoidSurfaceMaterial:void 0,this._ellipsoidSurfaceMaterial=void 0,this._ellipsoidSurfaceIsTranslucent=void 0,this.showEllipsoidSurfaces=e.showEllipsoidSurfaces??!0,this._showEllipsoidSurfaces=this.showEllipsoidSurfaces,this.domeSurfaceMaterial=(0,o.defined)(e.domeSurfaceMaterial)?e.domeSurfaceMaterial:void 0,this._domeSurfaceMaterial=void 0,this._domeSurfaceIsTranslucent=void 0,this.showDomeSurfaces=e.showDomeSurfaces??!0,this.showIntersection=e.showIntersection??!0,this._showIntersection=this.showIntersection,this.intersectionColor=o.Color.clone(e.intersectionColor??o.Color.WHITE),this.intersectionWidth=e.intersectionWidth??5,this.showThroughEllipsoid=e.showThroughEllipsoid??!1,this._showThroughEllipsoid=this.showThroughEllipsoid,this.environmentConstraint=e.environmentConstraint??!1,this._environmentConstraint=this.environmentConstraint,this.showEnvironmentOcclusion=e.showEnvironmentOcclusion??!1,this._showEnvironmentOcclusion=this.showEnvironmentOcclusion,this.environmentOcclusionMaterial=(0,o.defined)(e.environmentOcclusionMaterial)?e.environmentOcclusionMaterial:o.Material.fromType(o.Material.ColorType),this._environmentOcclusionMaterial=void 0,this._environmentOcclusionLateralMaterial=void 0,this._environmentOcclusionDomeMaterial=void 0,this.showEnvironmentIntersection=e.showEnvironmentIntersection??!1,this._showEnvironmentIntersection=this.showEnvironmentIntersection,this.environmentIntersectionColor=o.Color.clone(e.environmentIntersectionColor??o.Color.WHITE),this.environmentIntersectionWidth=e.environmentIntersectionWidth??5,this.showViewshed=e.showViewshed??!1,this._showViewshed=this.showViewshed,this.viewshedVisibleColor=(0,o.defined)(e.viewshedVisibleColor)?o.Color.clone(e.viewshedVisibleColor):o.Color.LIME.withAlpha(.5),this.viewshedOccludedColor=(0,o.defined)(e.viewshedOccludedColor)?o.Color.clone(e.viewshedOccludedColor):o.Color.RED.withAlpha(.5),this.viewshedResolution=e.viewshedResolution??2048,this._viewshedResolution=this.viewshedResolution,this.classificationType=e.classificationType??o.ClassificationType.BOTH,this.id=e.id,this._id=void 0,this.debugShowCrossingPoints=e.debugShowCrossingPoints??!1,this._debugLabelCollection=void 0,this.debugShowProxyGeometry=e.debugShowProxyGeometry??!1,this.debugShowBoundingVolume=e.debugShowBoundingVolume??!1,this.debugShowShadowMap=e.debugShowShadowMap??!1,this._updatePickCommands=!0,this._definitionChanged=!0,this._hasInnerCone=void 0,this._hasOuterCone=void 0,this._isPartialCone=void 0,this._radius=e.radius??Number.POSITIVE_INFINITY,this._outerHalfAngle=e.outerHalfAngle??o.Math.PI_OVER_TWO,this._innerHalfAngle=e.innerHalfAngle??0,this._maximumClockAngle=e.maximumClockAngle??o.Math.TWO_PI,this._minimumClockAngle=e.minimumClockAngle??0,this._cosineOfInnerHalfAngle=void 0,this._cosineOfOuterHalfAngle=void 0,this._cosineAndSineOfInnerHalfAngle=new o.Cartesian2,this._cosineAndSineOfOuterHalfAngle=new o.Cartesian2,this._minimumClockAngleSurfaceNormal=new o.Cartesian3,this._minimumClockAngleSurfaceFacetBisector=new o.Cartesian3,this._minimumClockAngleSurfaceFacetBisectorMagnitudeSquared=0,this._maximumClockAngleSurfaceNormal=new o.Cartesian3,this._maximumClockAngleSurfaceFacetBisector=new o.Cartesian3,this._maximumClockAngleSurfaceFacetBisectorMagnitudeSquared=0;let i=this;this._uniforms={u_radii:function(){return i._ellipsoid.radii},u_inverseRadii:function(){return i._ellipsoid.oneOverRadii},u_sensorRadius:function(){return isFinite(i._radius)?i._radius:w.maximumRadius},u_q:function(){return i._q},u_intersectionColor:function(){return i.intersectionColor},u_intersectionWidth:function(){return i.intersectionWidth},u_normalDirection:function(){return 1}},this._clockUniforms={u_minimumClockAngleSurfaceNormal:function(){return i._minimumClockAngleSurfaceNormal},u_maximumClockAngleSurfaceNormal:function(){return i._maximumClockAngleSurfaceNormal}},this._coneUniforms={u_cosineOfInnerHalfAngle:function(){return i._cosineOfInnerHalfAngle},u_cosineOfOuterHalfAngle:function(){return i._cosineOfOuterHalfAngle}},this._innerConeUniform={u_cosineAndSineOfConeAngle:function(){return i._cosineAndSineOfInnerHalfAngle}},this._outerConeUniform={u_cosineAndSineOfConeAngle:function(){return i._cosineAndSineOfOuterHalfAngle}},this._pickUniforms={czm_pickColor:function(){return i._pickId.color}},this._viewshedUniforms={u_viewshedVisibleColor:function(){return i.viewshedVisibleColor},u_viewshedOccludedColor:function(){return i.viewshedOccludedColor}},this._ellipsoidHorizonSurfaceUniforms={u_inverseUnitQ:function(){return i._inverseUnitQ},u_cosineAndSineOfHalfAperture:function(){return i._cosineAndSineOfHalfAperture}},this._inverseModelRotation=new o.Matrix3,this._uniforms2D={u_p:function(){return i._p},u_inverseModel:function(){return i._inverseModelRotation}},this._mode=o.SceneMode.SCENE3D,this._sensorGlsl=void 0,this._sensorUniforms=void 0,this._shadowMapUniforms=void 0,this._shadowMap=void 0,this._fronts=[],this._backs=[],this._directions=[],this._crossings=[],this._p=new o.Cartesian3,this._q=new o.Cartesian3,this._unitQ=new o.Cartesian3,this._inverseUnitQ=new o.Cartesian3,this._qMagnitudeSquared=void 0,this._qMagnitudeSquaredMinusOne=void 0,this._cosineAndSineOfHalfAperture=new o.Cartesian2}Object.defineProperties(Qn.prototype,{radius:{get:function(){return this._radius},set:function(e){this._radius!==e&&(this._radius=e,this._definitionChanged=!0)}},ellipsoid:{get:function(){return this._ellipsoid}},outerHalfAngle:{get:function(){return this._outerHalfAngle},set:function(e){this._outerHalfAngle!==e&&(this._outerHalfAngle=e,this._definitionChanged=!0)}},innerHalfAngle:{get:function(){return this._innerHalfAngle},set:function(e){this._innerHalfAngle!==e&&(this._innerHalfAngle=e,this._definitionChanged=!0)}},maximumClockAngle:{get:function(){return this._maximumClockAngle},set:function(e){this._maximumClockAngle!==e&&(this._maximumClockAngle=e,this._definitionChanged=!0)}},minimumClockAngle:{get:function(){return this._minimumClockAngle},set:function(e){this._minimumClockAngle!==e&&(this._minimumClockAngle=e,this._definitionChanged=!0)}}});function ki(e,i){i&=e._hasInnerCone||e._hasOuterCone;let t=`
`;if(i&&(t+=`uniform float u_cosineOfOuterHalfAngle;
`,e._hasInnerCone&&(t+=`uniform float u_cosineOfInnerHalfAngle;
`)),e._isPartialCone&&(t+=`uniform vec3 u_maximumClockAngleSurfaceNormal;
`,t+=`uniform vec3 u_minimumClockAngleSurfaceNormal;
`),t+=`
`,t+=`float sensorSurfaceFunction(vec3 pointMC)
`,t+=`{
`,t+=`	vec3 direction = normalize(pointMC);
`,i&&(e._hasInnerCone?(t+=`	float value = direction.z - u_cosineOfInnerHalfAngle;
`,e._hasOuterCone&&(t+=`	value = max(value, u_cosineOfOuterHalfAngle - direction.z);
`)):t+=`	float value = u_cosineOfOuterHalfAngle - direction.z;
`),e._isPartialCone){let s=e._maximumClockAngle-e._minimumClockAngle;s<Math.PI?t+=`	float wedge = max(dot(direction, u_maximumClockAngleSurfaceNormal), dot(direction, u_minimumClockAngleSurfaceNormal));
`:s>Math.PI?t+=`	float wedge = min(dot(direction, u_maximumClockAngleSurfaceNormal), dot(direction, u_minimumClockAngleSurfaceNormal));
`:t+=`	float wedge = dot(direction, u_minimumClockAngleSurfaceNormal);
`,i?t+=`	value = max(value, wedge);
`:t+=`	float value = wedge;
`}return!i&&!e._isPartialCone?t+=`	return -1.0;
`:t+=`	return value;
`,t+=`}
`,t}function Er(e,i){let t=e._cosineOfOuterHalfAngle-i.z;if(e._hasInnerCone){let s=i.z-e._cosineOfInnerHalfAngle;return Math.max(s,t)<0}return t<0}function Or(e,i){let t=o.Cartesian3.dot(i,e._minimumClockAngleSurfaceNormal),s=o.Cartesian3.dot(i,e._maximumClockAngleSurfaceNormal),a=e._maximumClockAngle-e._minimumClockAngle;return a<Math.PI?Math.max(t,s)<0:a>Math.PI?Math.min(t,s)<0:t<0}function te(e,i,t,s,a,l){return o.Cartesian3.pack(e,a,l),l+=3,o.Cartesian3.pack(s,a,l),l+=3,o.Cartesian3.pack(i,a,l),l+=3,o.Cartesian3.pack(s,a,l),l+=3,o.Cartesian3.pack(t,a,l),l+=3,o.Cartesian3.pack(s,a,l),l+=3,l}var mo=new o.Cartesian3,Zo=new o.Cartesian3,jo=new o.Cartesian3,nt=new o.Cartesian3,it=new o.Cartesian3,ot=new o.Cartesian3,tt=new o.Cartesian3;function Ir(e,i,t,s,a,l){let m=o.Math.TWO_PI/l,r=(i-e)/m,f=r%1!==0?Math.ceil(r):Math.ceil(r)+1,c=a/Math.cos(Math.PI/l),h=3*w.numberOfFloatsPerVertex3D,_=f*2,C=new Float32Array(_*h),g=nt,S=it,E=ot,V=tt,O=0,I=Math.cos(t),y=Math.sin(t),x=Math.cos(s),j=Math.sin(s);Zo=o.Cartesian3.fromElements(y,-I,0,Zo),jo=o.Cartesian3.fromElements(-y,I,0,jo);let A=c*Math.sin(e),P=c*Math.cos(e);g=o.Cartesian3.fromElements(I*A,y*A,P,g),E=o.Cartesian3.fromElements(x*A,j*A,P,E);let Q=f>1?e+(r%1+1)*m/2:i;for(let K=0;K<f;++K){A=c*Math.sin(Q),P=c*Math.cos(Q),S=o.Cartesian3.fromElements(I*A,y*A,P,S),V=o.Cartesian3.fromElements(x*A,j*A,P,V),O=te(o.Cartesian3.ZERO,S,g,Zo,C,O),O=te(o.Cartesian3.ZERO,E,V,jo,C,O);let ie=g;g=S,S=ie,ie=E,E=V,V=ie,Q=K+1===f-1?i:Q+m}return C}var vr=new o.Cartesian3,Mr=new o.Cartesian3,yr=new o.Cartesian3,Vr=new o.Cartesian3,fo=o.Cartesian3.negate(o.Cartesian3.UNIT_Z,new o.Cartesian3),Qo=new o.Cartesian3,Yo=new o.Cartesian3,Ei=new o.Cartesian2,Oi=new o.Cartesian2,be=new o.Cartesian2,Oe=new o.Cartesian2,W=new o.Cartesian3;function Rt(e,i,t,s,a,l,m,d,r){let f=o.Math.TWO_PI/m,c=a-s,h=r?c/f:m,_=h%1!==0?Math.ceil(h):Math.ceil(h)+1,C=l*Math.cos(t),g=l*Math.cos(i),S,E;t<o.Math.PI_OVER_TWO?(E=l*Math.sin(i),S=l*Math.sin(t)/Math.cos(Math.PI/m)):i<o.Math.PI_OVER_TWO?(E=l*Math.min(Math.sin(i),Math.sin(t)),S=l/Math.cos(Math.PI/m)):(E=l*Math.sin(t),S=l*Math.sin(i)/Math.cos(Math.PI/m)),e||(E=o.Math.EPSILON2,C=Math.min(C,0),g=Math.max(g,0));let V=3*w.numberOfFloatsPerVertex3D,O=_*(r&&c<Math.PI&&d?6:4)+(r?c<Math.PI&&d?6:4:0),I=new Float32Array(O*V),y=nt,x=ot,j=vr,A=Mr,P=it,Q=tt,K=yr,ie=Vr,se=Math.cos(a),re=Math.sin(a);Oi=o.Cartesian2.fromElements(se,re,Oi),se=Math.cos(s),re=Math.sin(s),Ei=o.Cartesian2.fromElements(se,re,Ei),be=o.Cartesian2.divideByScalar(o.Cartesian2.add(Ei,Oi,be),2,be);let ge=o.Cartesian2.magnitudeSquared(be);Oe=o.Cartesian2.fromElements(se,re,Oe);let ne=c<Math.PI&&d?E*ge/o.Cartesian2.dot(Oe,be):0;x=o.Cartesian3.fromElements(se*ne,re*ne,C,x),A=o.Cartesian3.fromElements(se*ne,re*ne,g,A),Q=o.Cartesian3.fromElements(se*S,re*S,C,Q),ie=o.Cartesian3.fromElements(se*S,re*S,g,ie);let N=0;r&&c<Math.PI&&(W=o.Cartesian3.fromElements(Math.sin(s),-Math.cos(s),0,W),N=te(x,Q,ie,W,I,N),N=te(ie,A,x,W,I,N));let Ne=s+(h%1+1)*f/2;for(let de=0;de<_;++de){se=Math.cos(Ne),re=Math.sin(Ne),Oe=o.Cartesian2.fromElements(se,re,Oe),ne=c<Math.PI&&d?E*ge/o.Cartesian2.dot(Oe,be):0,y=o.Cartesian3.fromElements(se*ne,re*ne,C,y),j=o.Cartesian3.fromElements(se*ne,re*ne,g,j),P=o.Cartesian3.fromElements(se*S,re*S,C,P),K=o.Cartesian3.fromElements(se*S,re*S,g,K),c<Math.PI&&d?(N=te(P,Q,x,fo,I,N),N=te(x,y,P,fo,I,N)):N=te(P,Q,x,fo,I,N),W=o.Cartesian3.normalize(o.Cartesian3.cross(o.Cartesian3.subtract(K,P,Qo),o.Cartesian3.subtract(Q,P,Yo),W),W),N=te(Q,P,K,W,I,N),N=te(K,ie,Q,W,I,N),c<Math.PI&&d?(N=te(A,ie,K,o.Cartesian3.UNIT_Z,I,N),N=te(K,j,A,o.Cartesian3.UNIT_Z,I,N)):N=te(ie,K,A,o.Cartesian3.UNIT_Z,I,N);let b=x;x=y,y=b,b=A,A=j,j=b,b=Q,Q=P,P=b,b=ie,ie=K,K=b,Ne=de+1===_-1?a:Ne+f}return r&&c<Math.PI&&(W=o.Cartesian3.fromElements(-Math.sin(a),Math.cos(a),0,W),N=te(ie,Q,x,W,I,N),N=te(x,A,ie,W,I,N)),r&&(se=Math.cos(s),re=Math.sin(s),Oe=o.Cartesian2.fromElements(se,re,Oe),ne=c<Math.PI&&d?E*ge/o.Cartesian2.dot(Oe,be):0,y=o.Cartesian3.fromElements(se*ne,re*ne,C,y),j=o.Cartesian3.fromElements(se*ne,re*ne,g,j),c>=Math.PI?(P=o.Cartesian3.fromElements(se*S,re*S,C,P),K=o.Cartesian3.fromElements(se*S,re*S,g,K),W=o.Cartesian3.normalize(o.Cartesian3.cross(o.Cartesian3.subtract(K,P,Qo),o.Cartesian3.subtract(Q,P,Yo),W),W),N=te(Q,P,K,W,I,N),N=te(K,ie,Q,W,I,N),N=te(A,ie,K,o.Cartesian3.UNIT_Z,I,N),N=te(y,P,Q,fo,I,N)):d&&(W=o.Cartesian3.normalize(o.Cartesian3.cross(o.Cartesian3.subtract(x,y,Qo),o.Cartesian3.subtract(j,y,Yo),W),W),N=te(A,x,y,W,I,N),N=te(y,j,A,W,I,N))),I}function zr(e,i,t,s,a,l,m,d,r,f,c,h){let _=Rt(!0,s,a,l,m,d,r,f,c);e._domeCommandsVertices=_;let C=o.Buffer.createVertexBuffer({context:i,typedArray:_,usage:o.BufferUsage.STATIC_DRAW});e._domeCommandsBuffer=C;let g=w.makeVertexArray3D(e,i,C);e._domeCommandsVertexArray=g;let S=e._domeColorCommand,E=o.BoundingSphere.fromVertices(_,void 0,w.numberOfFloatsPerVertex3D,e._completeDomeBoundingVolumeMC);S.uniformMap=(0,o.combine)((0,o.combine)(e._uniforms,e._domeSurfaceMaterial._uniforms),h),S.boundingVolume=o.BoundingSphere.transform(E,e.modelMatrix,S.boundingVolume),S.modelMatrix=e.modelMatrix,e._domeCommandsBuffer.copyFromArrayView(_,0),S.primitiveType=t,S.owner=e,S.vertexArray=g}function Tr(e,i,t,s,a,l,m,d,r,f,c){(0,o.defined)(e._surfaceCommandVertexArray)&&e._surfaceCommandVertexArray.destroy();let h=Rt(!1,s,a,l,m,d,r,f,c);o.BoundingSphere.fromVertices(h,void 0,w.numberOfFloatsPerVertex3D,e._surfaceBoundingVolumeMC);let _=o.Buffer.createVertexBuffer({context:i,typedArray:h,usage:o.BufferUsage.STATIC_DRAW}),C=w.makeVertexArray3D(e,i,_);e._surfaceCommandVertexArray=C;let g=e._surfaceCommand;g.primitiveType=t,g.owner=e,g.vertexArray=C}function Dt(e,i,t,s,a,l){let m=o.Math.TWO_PI/a,d=t-i,r=l?d/m:a,f=r%1!==0?Math.ceil(r):Math.ceil(r)+1;if(e>o.Math.PI_OVER_TWO){let K=i;i=t,t=K,m=-m}let c=s*Math.cos(e),h=s*Math.sin(e),_=h/Math.cos(Math.PI/a),C=3*w.numberOfFloatsPerVertex3D,g=f*(l&&d<Math.PI?3:2)+(l?d<Math.PI?3:2:0),S=new Float32Array(g*C),E=nt,V=ot,O=it,I=tt,y=Math.cos(t),x=Math.sin(t);Oi=o.Cartesian2.fromElements(y,x,Oi),y=Math.cos(i),x=Math.sin(i),Ei=o.Cartesian2.fromElements(y,x,Ei),be=o.Cartesian2.divideByScalar(o.Cartesian2.add(Ei,Oi,be),2,be);let j=o.Cartesian2.magnitudeSquared(be);Oe=o.Cartesian2.fromElements(y,x,Oe);let A=d<Math.PI?h*j/o.Cartesian2.dot(Oe,be):0;V=o.Cartesian3.fromElements(y*A,x*A,c,V),I=o.Cartesian3.fromElements(y*_,x*_,c,I);let P=0;l&&d<Math.PI&&(W=o.Cartesian3.fromElements(Math.sin(i),-Math.cos(i),0,W),P=te(o.Cartesian3.ZERO,I,V,W,S,P));let Q=i+(r%1+1)*m/2;for(let K=0;K<f;++K){y=Math.cos(Q),x=Math.sin(Q),Oe=o.Cartesian2.fromElements(y,x,Oe),A=d<Math.PI?h*j/o.Cartesian2.dot(Oe,be):0,E=o.Cartesian3.fromElements(y*A,x*A,c,E),O=o.Cartesian3.fromElements(y*_,x*_,c,O),W=o.Cartesian3.normalize(o.Cartesian3.cross(O,I,W),W),P=te(o.Cartesian3.ZERO,O,I,W,S,P),d<Math.PI?(P=te(V,I,O,o.Cartesian3.UNIT_Z,S,P),P=te(O,E,V,o.Cartesian3.UNIT_Z,S,P)):P=te(I,O,V,o.Cartesian3.UNIT_Z,S,P);let ie=V;V=E,E=ie,ie=I,I=O,O=ie,Q=K+1===f-1?t:Q+m}return l&&d<Math.PI&&(W=o.Cartesian3.fromElements(-Math.sin(t),Math.cos(t),0,W),P=te(o.Cartesian3.ZERO,V,I,W,S,P)),l&&(y=Math.cos(i),x=Math.sin(i),Oe=o.Cartesian2.fromElements(y,x,Oe),A=d<Math.PI?h*j/o.Cartesian2.dot(Oe,be):0,E=o.Cartesian3.fromElements(y*A,x*A,c,E),d<Math.PI?(W=o.Cartesian3.normalize(o.Cartesian3.cross(E,V,W),W),P=te(o.Cartesian3.ZERO,E,V,W,S,P)):(O=o.Cartesian3.fromElements(y*_,x*_,c,O),W=o.Cartesian3.normalize(o.Cartesian3.cross(O,I,W),W),P=te(o.Cartesian3.ZERO,O,I,W,S,P),P=te(V,I,O,o.Cartesian3.UNIT_Z,S,P))),S}function Pr(e,i){let t=isFinite(e.radius)?e.radius:w.maximumRadius,s=w.numberOfSidesForCompleteCircle,a=Dt(e._outerHalfAngle,e._minimumClockAngle,e._maximumClockAngle,t,s,e._isPartialCone);o.BoundingSphere.fromVertices(a,void 0,6,e._lateralOuterConicBoundingSphere);let l=o.Buffer.createVertexBuffer({context:i,typedArray:a,usage:o.BufferUsage.STATIC_DRAW});e._lateralOuterConicCommandsVertexArray=w.makeVertexArray3D(e,i,l),e._lateralOuterConicCommand.vertexArray=e._lateralOuterConicCommandsVertexArray,e._lateralOuterConicPickCommand.vertexArray=e._lateralOuterConicCommandsVertexArray,e._isPartialCone?(e._lateralOuterConicCommand.uniformMap=(0,o.combine)((0,o.combine)(e._uniforms,e._clockUniforms),e._outerConeUniform),e._lateralOuterConicPickCommand.uniformMap=(0,o.combine)((0,o.combine)(e._uniforms,e._clockUniforms),e._outerConeUniform)):(e._lateralOuterConicCommand.uniformMap=(0,o.combine)(e._uniforms,e._outerConeUniform),e._lateralOuterConicPickCommand.uniformMap=(0,o.combine)(e._uniforms,e._outerConeUniform)),e._hasInnerCone&&(a=Dt(e._innerHalfAngle,e._minimumClockAngle,e._maximumClockAngle,t,s,e._isPartialCone),o.BoundingSphere.fromVertices(a,void 0,6,e._lateralInnerConicBoundingSphere),l=o.Buffer.createVertexBuffer({context:i,typedArray:a,usage:o.BufferUsage.STATIC_DRAW}),e._lateralInnerConicCommandsVertexArray=w.makeVertexArray3D(e,i,l),e._lateralInnerConicCommand.vertexArray=e._lateralInnerConicCommandsVertexArray,e._lateralInnerConicPickCommand.vertexArray=e._lateralInnerConicCommandsVertexArray,e._isPartialCone?(e._lateralInnerConicCommand.uniformMap=(0,o.combine)((0,o.combine)(e._uniforms,e._clockUniforms),e._innerConeUniform),e._lateralInnerConicPickCommand.uniformMap=(0,o.combine)((0,o.combine)(e._uniforms,e._clockUniforms),e._innerConeUniform)):(e._lateralInnerConicCommand.uniformMap=(0,o.combine)(e._uniforms,e._innerConeUniform),e._lateralInnerConicPickCommand.uniformMap=(0,o.combine)(e._uniforms,e._innerConeUniform)));let m=4;if(e._crossings.length===0){for(let c=0;c<2*m;++c)e._crossings[c]=new wr;for(let c=0;c<w.numberOfSidesForCompleteCircle;++c)e._directions[c]=new o.Cartesian3,e._fronts[c]=new o.Cartesian3,e._backs[c]=new o.Cartesian3}let d=e.debugShowProxyGeometry?o.PrimitiveType.LINES:e._frontFaceColorCommand.primitiveType;w.initializeEllipsoidHorizonSurfaceCommands(e,i,m,d),zr(e,i,d,e._innerHalfAngle,e._outerHalfAngle,e._minimumClockAngle,e._maximumClockAngle,t,w.numberOfSidesForCompleteCircle,e._hasInnerCone,e._isPartialCone,e._sensorUniforms),Tr(e,i,d,e._innerHalfAngle,e._outerHalfAngle,e._minimumClockAngle,e._maximumClockAngle,t,w.numberOfSidesForCompleteCircle,e._hasInnerCone,e._isPartialCone),a=Ir(e._innerHalfAngle,e._outerHalfAngle,e._minimumClockAngle,e._maximumClockAngle,t,w.numberOfSidesForCompleteCircle),o.BoundingSphere.fromVertices(a,void 0,6,e._lateralPlanarBoundingSphere);let r=o.Buffer.createVertexBuffer({context:i,typedArray:a,usage:o.BufferUsage.STATIC_DRAW}),f=w.makeVertexArray3D(e,i,r);e._lateralPlanarCommandsVertexArray=f,e._frontFaceColorCommand.vertexArray=f,e._backFaceColorCommand.vertexArray=f,e._pickCommand.vertexArray=f}function Hr(e,i){e._hasInnerCone&&(e._lateralInnerConicCommandsVertexArray=e._lateralInnerConicCommandsVertexArray&&e._lateralInnerConicCommandsVertexArray.destroy()),e._lateralOuterConicCommandsVertexArray=e._lateralOuterConicCommandsVertexArray&&e._lateralOuterConicCommandsVertexArray.destroy(),e._lateralPlanarCommandsVertexArray=e._lateralPlanarCommandsVertexArray&&e._lateralPlanarCommandsVertexArray.destroy(),Pr(e,i)}function xr(e,i,t){let s=w.getRenderState3D(e,i,t,o.CullFace.BACK),a=t?o.Pass.TRANSLUCENT:o.Pass.OPAQUE;e._frontFaceColorCommand.renderState=s,e._frontFaceColorCommand.pass=a,e._pickCommand.renderState=s,e._pickCommand.pass=a,e._backFaceColorCommand.renderState=w.getRenderState3D(e,i,!0,o.CullFace.FRONT),e._backFaceColorCommand.pass=a,s=w.getRenderState3D(e,i,t,o.CullFace.FRONT),e._hasInnerCone&&(e._lateralInnerConicCommand.renderState=s,e._lateralInnerConicCommand.pass=a,e._lateralInnerConicPickCommand.renderState=s,e._lateralInnerConicPickCommand.pass=a),e._lateralOuterConicCommand.renderState=s,e._lateralOuterConicCommand.pass=a,e._lateralOuterConicPickCommand.renderState=s,e._lateralOuterConicPickCommand.pass=a}var fn=new o.Matrix3,je=new o.Matrix3,Fe=new o.Cartesian3,Ae=new o.Cartesian3,Qe=new o.Cartesian3,$e=new o.Cartesian3,At=new o.Cartesian3,ho=new o.Cartesian3,bt=new o.Cartesian3,$o=new o.Cartesian3,Ko=new o.Cartesian3,hn=new o.Cartesian3,rn=new o.Cartesian3,Jo=new o.Cartesian3,po=new o.Cartesian3,Ke=new o.Cartesian3,Je=new o.Cartesian3;function Dr(e,i){fn=o.Matrix4.getMatrix3(e.modelMatrix,fn),je=o.Matrix3.transpose(fn,je),Fe=o.Matrix4.getTranslation(e.modelMatrix,Fe),Ae=e._ellipsoid.transformPositionToScaledSpace(Fe,Ae);let t=o.Cartesian3.magnitudeSquared(Ae),s=isFinite(e.radius)?e.radius:w.maximumRadius,a=1/Math.sqrt(t);if(a<1){let l=t-1,m=s*s,d=o.Cartesian3.magnitudeSquared(e._ellipsoid.transformPositionToScaledSpace(Ae,Jo));if(isFinite(e.radius)&&e.portionToDisplay===o.SensorVolumePortionToDisplay.COMPLETE&&l*l>m*d)w.renderCompleteDome(e);else{Qe=o.Cartesian3.normalize(Ae,Qe),ho=o.Cartesian3.negate(o.Matrix3.multiplyByVector(je,Fe,ho),ho);let r=!0,f=!0;Ko=o.Cartesian3.mostOrthogonalAxis(Qe,Ko),rn=o.Cartesian3.normalize(o.Cartesian3.cross(Ko,Qe,rn),rn),hn=o.Cartesian3.normalize(o.Cartesian3.cross(Qe,rn,hn),hn);let c={crossings:e._crossings,count:0};mo=o.Cartesian3.normalize(ho,mo),r=Er(e,mo)&&(e._isPartialCone?Or(e,mo):!0);let h=0;if(po=o.Matrix3.getColumn(fn,2,po),e._outerHalfAngle===o.Math.PI_OVER_TWO){let g=e._isPartialCone;Ke=o.Cartesian3.fromElements(Math.cos(e._minimumClockAngle),Math.sin(e._minimumClockAngle),0,Ke),Je=o.Cartesian3.fromElements(Math.cos(e._maximumClockAngle),Math.sin(e._maximumClockAngle),0,Je),$e=o.Cartesian3.divideByScalar(o.Cartesian3.add(Ke,Je,$e),2,$e);let S=o.Cartesian3.magnitudeSquared($e);W=o.Cartesian3.negate(o.Cartesian3.UNIT_Z,W),f&=w.checkPlanarCrossings(e._ellipsoid,Fe,Ae,Qe,a,m,fn,je,hn,rn,g,W,$e,S,e._portionToDisplay,h++,c)}else f&=w.checkConicCrossings(e._ellipsoid,Fe,Ae,t,Qe,a,Jo,m,je,hn,rn,e._minimumClockAngle,e._minimumClockAngleSurfaceNormal,e._maximumClockAngle,e._maximumClockAngleSurfaceNormal,e._isPartialCone,po,e._outerHalfAngle,1,e._portionToDisplay,h++,c);if(e._isPartialCone&&(f&=w.checkPlanarCrossings(e._ellipsoid,Fe,Ae,Qe,a,m,fn,je,hn,rn,!0,e._minimumClockAngleSurfaceNormal,e._minimumClockAngleSurfaceFacetBisector,e._minimumClockAngleSurfaceFacetBisectorMagnitudeSquared,e._portionToDisplay,h++,c),f&=w.checkPlanarCrossings(e._ellipsoid,Fe,Ae,Qe,a,m,fn,je,hn,rn,!0,e._maximumClockAngleSurfaceNormal,e._maximumClockAngleSurfaceFacetBisector,e._maximumClockAngleSurfaceFacetBisectorMagnitudeSquared,e._portionToDisplay,h++,c)),e._hasInnerCone)if(e._innerHalfAngle===o.Math.PI_OVER_TWO){let g=e._isPartialCone;Ke=o.Cartesian3.fromElements(Math.cos(e._minimumClockAngle),Math.sin(e._minimumClockAngle),0,Ke),Je=o.Cartesian3.fromElements(Math.cos(e._maximumClockAngle),Math.sin(e._maximumClockAngle),0,Je),$e=o.Cartesian3.divideByScalar(o.Cartesian3.add(Ke,Je,$e),2,$e);let S=o.Cartesian3.magnitudeSquared($e);W=o.Cartesian3.clone(o.Cartesian3.UNIT_Z,W),f&=w.checkPlanarCrossings(e._ellipsoid,Fe,Ae,Qe,a,m,fn,je,hn,rn,g,W,$e,S,e._portionToDisplay,h++,c)}else f&=w.checkConicCrossings(e._ellipsoid,Fe,Ae,t,Qe,a,Jo,m,je,hn,rn,e._minimumClockAngle,e._minimumClockAngleSurfaceNormal,e._maximumClockAngle,e._maximumClockAngleSurfaceNormal,e._isPartialCone,po,e._innerHalfAngle,-1,e._portionToDisplay,h++,c);let _=c.count,C=c.crossings;if(_>0&&t>1){C=C.slice(0,_),C.sort(w.angularSortUsingSineAndCosine);let g=e._debugLabelCollection;(0,o.defined)(g)&&g.removeAll();let S=!1,E=!1,V=!1,O=0;for(let I=0;I<_;++I){let y=C[I];if(e.debugShowCrossingPoints&&g.add({position:y.v,text:(y.kind===1?"+":"-")+y.index.toString()}),y.kind===1&&(E?(o.Cartesian3.clone(y.r,bt),S=!0):(o.Cartesian3.clone(y.r,At),V=!0)),S&&E){let x=e._ellipsoidHorizonSurfaceColorCommands[O+1];w.updateHorizonCommand(O,x,e,i,$o,bt,je,Fe,Ae,t,s),e._ellipsoidHorizonSurfaceColorCommandList.push(x),S=!1,E=!1,++O}y.kind===-1&&(o.Cartesian3.clone(y.r,$o),E=!0)}if(V&&E){let I=e._ellipsoidHorizonSurfaceColorCommands[O+1];w.updateHorizonCommand(O,I,e,i,$o,At,je,Fe,Ae,t,s),e._ellipsoidHorizonSurfaceColorCommandList.push(I),++O}}isFinite(e.radius)&&w.renderCompleteDome(e),f&&r&&w.renderCompleteEllipsoidHorizonSurface(e,i,s,Fe,Ae,t,a,Qe,fn,je)}}else isFinite(e.radius)&&e.portionToDisplay!==o.SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON&&w.renderCompleteDome(e)}var bi=new o.Cartesian3,Wn=new o.Cartesian3,wi=new o.Cartesian3,_o=new o.Cartesian3,Nt=new o.Cartesian3,Co=new o.Cartesian3,So=new o.Cartesian3,Xo=new o.Cartesian3,et=new o.Cartesian3,Ni=new o.Cartesian3,Ri=new o.Cartesian3,Ve=new o.Cartographic,jn=[new o.Cartesian3,new o.Cartesian3,new o.Cartesian3,new o.Cartesian3],pn=jn[0],_n=jn[1],Cn=jn[2],Sn=jn[3];function Ar(e,i,t,s,a,l,m){if(e._qMagnitudeSquared<=1)return;if(s||a){Math.abs(e._unitQ.z)===1?Wn=o.Cartesian3.clone(o.Cartesian3.UNIT_Y,Wn):Wn=o.Cartesian3.normalize(o.Cartesian3.cross(o.Cartesian3.UNIT_Z,e._unitQ,Wn),Wn),bi=o.Cartesian3.normalize(o.Cartesian3.cross(e._unitQ,Wn,bi),bi),wi=o.Cartesian3.multiplyByScalar(e._q,1/e._qMagnitudeSquared,wi);let C=Math.sqrt(e._qMagnitudeSquaredMinusOne/e._qMagnitudeSquared);Nt=o.Cartesian3.multiplyByScalar(Wn,C,Nt),_o=o.Cartesian3.multiplyByScalar(bi,C,_o),Xo=o.Cartesian3.add(wi,_o,Xo),et=o.Cartesian3.subtract(wi,_o,et);let g=e._ellipsoid.cartesianToCartographic(Xo,Ve).latitude,S=e._ellipsoid.cartesianToCartographic(et,Ve).latitude,E=Math.sqrt(e._qMagnitudeSquaredMinusOne)*e._unitQ.z/Math.sqrt(e._unitQ.x*e._unitQ.x+e._unitQ.y*e._unitQ.y),V,O;if(Math.abs(E)<1){let I=Math.sqrt(1-E*E);Co=o.Cartesian3.multiplyByScalar(bi,E,Co),So=o.Cartesian3.multiplyByScalar(Wn,I,So),Ni=o.Cartesian3.add(wi,o.Cartesian3.multiplyByScalar(o.Cartesian3.add(Co,So,Ni),C,Ni),Ni),Ri=o.Cartesian3.add(wi,o.Cartesian3.multiplyByScalar(o.Cartesian3.subtract(Co,So,Ri),C,Ri),Ri),V=e._ellipsoid.cartesianToCartographic(Ni,Ve).longitude,O=e._ellipsoid.cartesianToCartographic(Ri,Ve).longitude}else V=o.Math.PI,O=-o.Math.PI,E>0?g=o.Math.PI_OVER_TWO:S=-o.Math.PI_OVER_TWO;e._numberOfCommands2D=0,V<O?(pn=i.mapProjection.project(o.Cartographic.fromRadians(V,g,0,Ve),pn),_n=i.mapProjection.project(o.Cartographic.fromRadians(V,S,0,Ve),_n),Cn=i.mapProjection.project(o.Cartographic.fromRadians(-o.Math.PI,S,0,Ve),Cn),Sn=i.mapProjection.project(o.Cartographic.fromRadians(-o.Math.PI,g,0,Ve),Sn),w.setVertices2D(e._command1Vertices2D,pn,_n,Cn,Sn,-o.Math.PI,V,S,g),e._drawCommands2D[0].boundingVolume=w.setBoundingSphere2D(jn,e._drawCommands2D[0].boundingVolume),pn=i.mapProjection.project(o.Cartographic.fromRadians(o.Math.PI,g,0,Ve),pn),_n=i.mapProjection.project(o.Cartographic.fromRadians(o.Math.PI,S,0,Ve),_n),Cn=i.mapProjection.project(o.Cartographic.fromRadians(O,S,0,Ve),Cn),Sn=i.mapProjection.project(o.Cartographic.fromRadians(O,g,0,Ve),Sn),w.setVertices2D(e._command2Vertices2D,pn,_n,Cn,Sn,O,o.Math.PI,S,g),e._drawCommands2D[1].boundingVolume=w.setBoundingSphere2D(jn,e._drawCommands2D[1].boundingVolume),e._vertexBuffer2D.copyFromArrayView(e._vertices2D.buffer),e._numberOfCommands2D=2):(pn=i.mapProjection.project(o.Cartographic.fromRadians(V,g,0,Ve),pn),_n=i.mapProjection.project(o.Cartographic.fromRadians(V,S,0,Ve),_n),Cn=i.mapProjection.project(o.Cartographic.fromRadians(O,S,0,Ve),Cn),Sn=i.mapProjection.project(o.Cartographic.fromRadians(O,g,0,Ve),Sn),w.setVertices2D(e._command1Vertices2D,pn,_n,Cn,Sn,O,V,S,g),e._drawCommands2D[0].boundingVolume=w.setBoundingSphere2D(jn,e._drawCommands2D[0].boundingVolume),e._vertexBuffer2D.copyFromArrayView(e._command1Vertices2D,0),e._numberOfCommands2D=1)}let d=i.context,r=e._ellipsoidSurfaceMaterial.isTranslucent();e._ellipsoidSurfaceIsTranslucent!==r&&(e._ellipsoidSurfaceIsTranslucent=r,w.setRenderStates2D(e,d,r)),(t||m||l||!(0,o.defined)(e._drawCommandsShaderProgram2D)||!(0,o.defined)(e._pickCommandsShaderProgram2D))&&w.setShaderPrograms2D(e,d,fi,mi);let f=e.debugShowBoundingVolume,c=i.commandList,h=i.passes,_=e._numberOfCommands2D;if(h.render&&e.showEllipsoidSurfaces)for(let C=0;C<_;++C){let g=e._drawCommands2D[C];g.debugShowBoundingVolume=f,c.push(g)}if(h.pick&&e.showEllipsoidSurfaces)for(let C=0;C<_;++C)c.push(e._pickCommands2D[C])}var Ye=new o.Cartesian3,br=new o.Cartesian4;function Nr(e,i,t,s,a,l,m,d,r,f,c){if(!o.SensorVolumePortionToDisplay.validate(e.portionToDisplay))throw new o.DeveloperError("sensor.portionToDisplay is required and must be valid.");let h=e._debugLabelCollection;e.debugShowCrossingPoints&&!(0,o.defined)(h)?(h=new o.LabelCollection,e._debugLabelCollection=h):!e.debugShowCrossingPoints&&(0,o.defined)(h)&&(h.destroy(),e._debugLabelCollection=void 0);let _=i.context,C=e._showThroughEllipsoid!==e.showThroughEllipsoid;e._showThroughEllipsoid=e.showThroughEllipsoid;let g=e._showEllipsoidSurfaces!==e.showEllipsoidSurfaces;e._showEllipsoidSurfaces=e.showEllipsoidSurfaces;let S=e._portionToDisplay!==e.portionToDisplay;e._portionToDisplay=e.portionToDisplay;let E=e._environmentConstraint!==e.environmentConstraint;e._environmentConstraint=e.environmentConstraint;let V=e._showEnvironmentOcclusion!==e.showEnvironmentOcclusion;e._showEnvironmentOcclusion=e.showEnvironmentOcclusion;let O=e._showEnvironmentIntersection!==e.showEnvironmentIntersection;e._showEnvironmentIntersection=e.showEnvironmentIntersection;let I=e._showViewshed!==e.showViewshed;e._showViewshed=e.showViewshed;let y=e._viewshedResolution!==e.viewshedResolution;if(e._viewshedResolution=e.viewshedResolution,(E||I||y||(e.environmentConstraint||e.showEnvironmentIntersection||e.showViewshed)&&!(0,o.defined)(e._shadowMap))&&((0,o.defined)(e._shadowMap)&&(e._shadowMap.destroy(),e._shadowMap=void 0),(e.environmentConstraint||e.showEnvironmentIntersection||e.showViewshed)&&(e._shadowMap=new o.ShadowMap({context:_,lightCamera:{frustum:new o.PerspectiveFrustum,directionWC:o.Cartesian3.clone(o.Cartesian3.UNIT_X),positionWC:new o.Cartesian3},isPointLight:!0,fromLightSource:!1,size:e.viewshedResolution}),e._shadowMapUniforms={u_shadowMapLightPositionEC:function(){return e._shadowMap._lightPositionEC},u_shadowCubeMap:function(){return e._shadowMap._shadowMapTexture}})),(0,o.defined)(e._shadowMap)){if(s||E||I||y){let H=o.Matrix4.getColumn(e.modelMatrix,3,br);o.Cartesian3.fromCartesian4(H,e._shadowMap._lightCamera.positionWC)}e._shadowMap._pointLightRadius=e._radius,e._shadowMap.debugShow=e.debugShowShadowMap,e.showEnvironmentIntersection&&(e._shadowMap._pointLightRadius*=1.01),i.shadowMaps.push(e._shadowMap)}(s||a||S||t)&&(e._hasInnerCone&&(o.BoundingSphere.transform(e._lateralInnerConicBoundingSphere,e.modelMatrix,e._lateralInnerConicBoundingSphereWC),e._lateralInnerConicCommand.modelMatrix=e.modelMatrix,e._lateralInnerConicPickCommand.modelMatrix=e.modelMatrix),o.BoundingSphere.transform(e._lateralOuterConicBoundingSphere,e.modelMatrix,e._lateralOuterConicBoundingSphereWC),e._lateralOuterConicCommand.modelMatrix=e.modelMatrix,e._lateralOuterConicPickCommand.modelMatrix=e.modelMatrix,o.BoundingSphere.transform(e._lateralPlanarBoundingSphere,e.modelMatrix,e._lateralPlanarBoundingSphereWC),e._frontFaceColorCommand.modelMatrix=e.modelMatrix,e._backFaceColorCommand.modelMatrix=e.modelMatrix,e._pickCommand.modelMatrix=e.modelMatrix,e._ellipsoidHorizonSurfaceColorCommandList.length=0,e._domeColorCommandToAdd=void 0,Dr(e,_));let x=e.lateralSurfaceMaterial.isTranslucent();(t||C||e._lateralSurfaceIsTranslucent!==x||!(0,o.defined)(e._frontFaceColorCommand.renderState))&&(e._lateralSurfaceIsTranslucent=x,xr(e,_,x));let j=e._ellipsoidHorizonSurfaceMaterial.isTranslucent();(t||C||e._ellipsoidHorizonSurfaceIsTranslucent!==j||E)&&!e.environmentConstraint&&(e._ellipsoidHorizonSurfaceIsTranslucent=j,w.setEllipsoidHorizonSurfacesRenderStates3D(e,_,j));let A=e._domeSurfaceMaterial.isTranslucent();(t||C||e._domeSurfaceIsTranslucent!==A)&&(e._domeSurfaceIsTranslucent=A,w.setDomeSurfacesRenderStates3D(e,_,A));let P=e.debugShowProxyGeometry?o.PrimitiveType.LINES:e._frontFaceColorCommand.primitiveType,Q=t||S||a||l||m||E||V||f||O||C,K=(t||S||a||l||d||E||C)&&!e.environmentConstraint,ie=t||S||a||l||r||E||V||f||O||C,se=Q||K||ie||I||g||c;Ye=o.Cartesian3.normalize(o.Matrix3.multiplyByVector(e._inverseModelRotation,o.Cartesian3.subtract(i.camera.positionWC,e._p,Ye),Ye),Ye);let re;e._hasInnerCone&&(re=Ye.z>e._cosineOfInnerHalfAngle);let ge=Ye.z>e._cosineOfOuterHalfAngle;if(Q){let H;if(!e.showEnvironmentOcclusion||!e.showEnvironmentIntersection?H=e._lateralSurfaceMaterial:H=e._environmentOcclusionLateralMaterial,e._hasInnerCone){let cn=e._lateralInnerConicCommand,vt=ki(e,!1);cn.uniformMap=(0,o.combine)(H._uniforms,cn.uniformMap),cn.primitiveType=P,(e.environmentConstraint||e.showEnvironmentIntersection)&&(cn.uniformMap=(0,o.combine)(cn.uniformMap,e._shadowMapUniforms)),e.showEnvironmentIntersection&&(cn.uniformMap.u_environmentIntersectionWidth=function(){return e.environmentIntersectionWidth},cn.uniformMap.u_environmentIntersectionColor=function(){return e.environmentIntersectionColor});let Mt=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),yt=[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",e.environmentConstraint?"ENVIRONMENT_CONSTRAINT":"",e.showEnvironmentOcclusion?"SHOW_ENVIRONMENT_OCCLUSION":"",e.showEnvironmentIntersection?"SHOW_ENVIRONMENT_INTERSECTION":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],Kt=new o.ShaderSource({defines:yt,sources:[G,le,Ee,vt,H.shaderSource,xe,dn]});e._lateralInnerConicCommandInsideShaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._lateralInnerConicCommandInsideShaderProgram,vertexShaderSource:Mt,fragmentShaderSource:Kt,attributeLocations:w.attributeLocations3D});let Jt=new o.ShaderSource({defines:yt,sources:[G,le,Ee,vt,H.shaderSource,xe,un]});e._lateralInnerConicCommandOutsideShaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._lateralInnerConicCommandOutsideShaderProgram,vertexShaderSource:Mt,fragmentShaderSource:Jt,attributeLocations:w.attributeLocations3D})}let U=e._lateralOuterConicCommand,he=ki(e,!1);U.primitiveType=P,U.uniformMap=(0,o.combine)(H._uniforms,U.uniformMap),(e.environmentConstraint||e.showEnvironmentIntersection)&&(U.uniformMap=(0,o.combine)(U.uniformMap,e._shadowMapUniforms)),e.showEnvironmentIntersection&&(U.uniformMap.u_environmentIntersectionWidth=function(){return e.environmentIntersectionWidth},U.uniformMap.u_environmentIntersectionColor=function(){return e.environmentIntersectionColor});let ee=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),Be=[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",e.environmentConstraint?"ENVIRONMENT_CONSTRAINT":"",e.showEnvironmentOcclusion?"SHOW_ENVIRONMENT_OCCLUSION":"",e.showEnvironmentIntersection?"SHOW_ENVIRONMENT_INTERSECTION":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],Vn=new o.ShaderSource({defines:Be,sources:[G,le,Ee,he,H.shaderSource,xe,dn]});e._lateralOuterConicCommandInsideShaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._lateralOuterConicCommandInsideShaderProgram,vertexShaderSource:ee,fragmentShaderSource:Vn,attributeLocations:w.attributeLocations3D});let Pi=new o.ShaderSource({defines:Be,sources:[G,le,Ee,he,H.shaderSource,xe,un]});e._lateralOuterConicCommandOutsideShaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._lateralOuterConicCommandOutsideShaderProgram,vertexShaderSource:ee,fragmentShaderSource:Pi,attributeLocations:w.attributeLocations3D});let qe=e._frontFaceColorCommand,ln=e._backFaceColorCommand,ai=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Pn]}),bo=new o.ShaderSource({defines:[e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",e.environmentConstraint?"ENVIRONMENT_CONSTRAINT":"",e.showEnvironmentOcclusion?"SHOW_ENVIRONMENT_OCCLUSION":"",e.showEnvironmentIntersection?"SHOW_ENVIRONMENT_INTERSECTION":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay),"CONIC_TEXTURE_COORDINATES"],sources:[G,le,H.shaderSource,Tn]});qe.shaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:qe.shaderProgram,vertexShaderSource:ai,fragmentShaderSource:bo,attributeLocations:w.attributeLocations3D}),qe.uniformMap=(0,o.combine)(e._uniforms,H._uniforms),ln.shaderProgram=qe.shaderProgram,ln.uniformMap=(0,o.combine)(e._uniforms,H._uniforms),ln.uniformMap.u_normalDirection=function(){return-1},(e.environmentConstraint||e.showEnvironmentIntersection)&&(qe.uniformMap=(0,o.combine)(qe.uniformMap,e._shadowMapUniforms),ln.uniformMap=(0,o.combine)(ln.uniformMap,e._shadowMapUniforms)),e.showEnvironmentIntersection&&(qe.uniformMap.u_environmentIntersectionWidth=ln.uniformMap.u_environmentIntersectionWidth=function(){return e.environmentIntersectionWidth},qe.uniformMap.u_environmentIntersectionColor=ln.uniformMap.u_environmentIntersectionColor=function(){return e.environmentIntersectionColor})}if(e._hasInnerCone){let H=e._lateralInnerConicCommand;H.shaderProgram=re?e._innerHalfAngle<o.Math.PI_OVER_TWO?e._lateralInnerConicCommandInsideShaderProgram:e._lateralInnerConicCommandOutsideShaderProgram:e._innerHalfAngle<o.Math.PI_OVER_TWO?e._lateralInnerConicCommandOutsideShaderProgram:e._lateralInnerConicCommandInsideShaderProgram}let ne=e._lateralOuterConicCommand;ne.shaderProgram=ge?e._outerHalfAngle<o.Math.PI_OVER_TWO?e._lateralOuterConicCommandInsideShaderProgram:e._lateralOuterConicCommandOutsideShaderProgram:e._outerHalfAngle<o.Math.PI_OVER_TWO?e._lateralOuterConicCommandOutsideShaderProgram:e._lateralOuterConicCommandInsideShaderProgram,Ye=o.Cartesian3.subtract(e._ellipsoid.transformPositionToScaledSpace(i.camera.positionWC,Ye),e._q,Ye);let Ne=o.Cartesian3.dot(Ye,e._q)/o.Cartesian3.magnitude(Ye)<-Math.sqrt(e._qMagnitudeSquaredMinusOne),de=o.Cartesian3.magnitudeSquared(o.Cartesian3.subtract(i.camera.positionWC,e._p,Ye))<e.radius*e.radius;if(K){let H=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),U=[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],he=e._ellipsoidHorizonSurfaceColorCommands.length;for(let ee=0;ee<he;++ee){let Be=e._ellipsoidHorizonSurfaceColorCommands[ee],Vn=e._ellipsoidHorizonSurfaceColorCommandsSource[ee];Be.uniformMap=(0,o.combine)(e._ellipsoidHorizonSurfaceMaterial._uniforms,Be.uniformMap),Be.primitiveType=P;let Pi=new o.ShaderSource({defines:U,sources:[G,le,Ee,Vn,e._ellipsoidHorizonSurfaceMaterial.shaderSource,xe,zn,li]});e._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[ee]=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[ee],vertexShaderSource:H,fragmentShaderSource:Pi,attributeLocations:w.attributeLocations3D});let qe=new o.ShaderSource({defines:U,sources:[G,le,Ee,Vn,e._ellipsoidHorizonSurfaceMaterial.shaderSource,xe,zn,ci]});e._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[ee]=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[ee],vertexShaderSource:H,fragmentShaderSource:qe,attributeLocations:w.attributeLocations3D})}}if(!e.environmentConstraint){let H=e._ellipsoidHorizonSurfaceColorCommands.length;for(let U=0;U<H;++U){let he=e._ellipsoidHorizonSurfaceColorCommands[U];he.shaderProgram=Ne?e._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[U]:e._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[U]}}let b=e._domeColorCommand;if(ie){let H;!e.showEnvironmentOcclusion||!e.environmentConstraint?H=e._domeSurfaceMaterial:H=e._environmentOcclusionDomeMaterial;let U=e._sensorGlsl;b.uniformMap=(0,o.combine)(H._uniforms,b.uniformMap),b.primitiveType=P,(e.environmentConstraint||e.showEnvironmentIntersection)&&(b.uniformMap=(0,o.combine)(b.uniformMap,e._shadowMapUniforms)),e.showEnvironmentIntersection&&(b.uniformMap.u_environmentIntersectionWidth=function(){return e.environmentIntersectionWidth},b.uniformMap.u_environmentIntersectionColor=function(){return e.environmentIntersectionColor});let he=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),ee=[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",e.environmentConstraint?"ENVIRONMENT_CONSTRAINT":"",e.showEnvironmentOcclusion?"SHOW_ENVIRONMENT_OCCLUSION":"",e.showEnvironmentIntersection?"SHOW_ENVIRONMENT_INTERSECTION":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],Be=new o.ShaderSource({defines:ee,sources:[G,le,Ee,U,H.shaderSource,Hn,di]});e._domeColorCommandInsideShaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._domeColorCommandInsideShaderProgram,vertexShaderSource:he,fragmentShaderSource:Be,attributeLocations:w.attributeLocations3D});let Vn=new o.ShaderSource({defines:ee,sources:[G,le,Ee,U,H.shaderSource,Hn,ui]});e._domeColorCommandOutsideShaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:e._domeColorCommandOutsideShaderProgram,vertexShaderSource:he,fragmentShaderSource:Vn,attributeLocations:w.attributeLocations3D})}b.shaderProgram=de?e._domeColorCommandInsideShaderProgram:e._domeColorCommandOutsideShaderProgram;let k=i.commandList,Y=i.passes;if(rt(_)&&(e.showEllipsoidSurfaces||e.showViewshed)&&(se&&w.updateSurface(e,_),(Y.render||Y.pick)&&w.addSurfaceCommand(e,i)),Y.render){let H=e.debugShowBoundingVolume;if(e.showLateralSurfaces&&(e._frontFaceColorCommand.debugShowBoundingVolume=H,e._backFaceColorCommand.debugShowBoundingVolume=H,e._lateralInnerConicCommand.debugShowBoundingVolume=H,e._lateralOuterConicCommand.debugShowBoundingVolume=H,e._hasInnerCone?k.push(e._lateralInnerConicCommand,e._lateralOuterConicCommand):k.push(e._lateralOuterConicCommand),e._isPartialCone&&k.push(e._backFaceColorCommand,e._frontFaceColorCommand)),e.showEllipsoidHorizonSurfaces&&!e.environmentConstraint){let U=e._ellipsoidHorizonSurfaceColorCommandList.length;for(let he=0;he<U;++he){let ee=e._ellipsoidHorizonSurfaceColorCommandList[he];ee.debugShowBoundingVolume=H,k.push(ee)}}if(e.showDomeSurfaces){let U=e._domeColorCommandToAdd;(0,o.defined)(U)&&(U.debugShowBoundingVolume=H,k.push(U))}}if(e._updatePickCommands=e._updatePickCommands||t||m||l,Y.pick){let H=e._pickCommand;if(e._updatePickCommands||!(0,o.defined)(H.shaderProgram)){e._updatePickCommands=!1;let U=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]});if(e._hasInnerCone){let ln=re?e._innerHalfAngle<o.Math.PI_OVER_TWO?dn:un:e._innerHalfAngle<o.Math.PI_OVER_TWO?un:dn,ai=e._lateralInnerConicPickCommand,bo=ki(e,!1);ai.uniformMap=(0,o.combine)((0,o.combine)(e._lateralSurfaceMaterial._uniforms,ai.uniformMap),e._pickUniforms);let cn=new o.ShaderSource({defines:[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],sources:[G,le,Ee,bo,e._lateralSurfaceMaterial.shaderSource,xe,ln],pickColorQualifier:"uniform"});ai.shaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:ai.shaderProgram,vertexShaderSource:U,fragmentShaderSource:cn,attributeLocations:w.attributeLocations3D})}let he=ge?e._outerHalfAngle<o.Math.PI_OVER_TWO?dn:un:e._outerHalfAngle<o.Math.PI_OVER_TWO?un:dn,ee=e._lateralOuterConicPickCommand,Be=ki(e,!1);ee.uniformMap=(0,o.combine)((0,o.combine)(e._lateralSurfaceMaterial._uniforms,ee.uniformMap),e._pickUniforms);let Vn=new o.ShaderSource({defines:[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],sources:[G,le,Ee,Be,e._lateralSurfaceMaterial.shaderSource,xe,he],pickColorQualifier:"uniform"});ee.shaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:ee.shaderProgram,vertexShaderSource:U,fragmentShaderSource:Vn,attributeLocations:w.attributeLocations3D}),H.uniformMap=(0,o.combine)((0,o.combine)(e._uniforms,e._lateralSurfaceMaterial._uniforms),e._pickUniforms);let Pi=new o.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Pn]}),qe=new o.ShaderSource({defines:[e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",o.SensorVolumePortionToDisplay.toString(e.portionToDisplay),"CONIC_TEXTURE_COORDINATES"],sources:[G,le,e._lateralSurfaceMaterial.shaderSource,Tn],pickColorQualifier:"uniform"});H.shaderProgram=o.ShaderProgram.replaceCache({context:_,shaderProgram:H.shaderProgram,vertexShaderSource:Pi,fragmentShaderSource:qe,attributeLocations:w.attributeLocations3D})}e._hasInnerCone?k.push(e._lateralInnerConicPickCommand,e._lateralOuterConicPickCommand):k.push(e._lateralOuterConicPickCommand),e._isPartialCone&&k.push(H)}e.debugShowCrossingPoints&&(h.modelMatrix=e.modelMatrix,h.update(i))}Qn.prototype.update=function(e){if(!this.show)return;if(this.radius<0)throw new o.DeveloperError("this.radius must be greater than or equal to zero.");if(!(0,o.defined)(this.lateralSurfaceMaterial))throw new o.DeveloperError("this.lateralSurfaceMaterial must be defined.");if(this._definitionChanged){if(this._innerHalfAngle<0||this._innerHalfAngle>o.Math.PI)throw new o.DeveloperError("this.innerHalfAngle must be between zero and pi.");if(this._outerHalfAngle<0||this._outerHalfAngle>o.Math.PI)throw new o.DeveloperError("this.outerHalfAngle must be between zero and pi.");if(this._innerHalfAngle>=this._outerHalfAngle)throw new o.DeveloperError("this.innerHalfAngle must be less than this.outerHalfAngle.");if(this._minimumClockAngle<-o.Math.TWO_PI||this._minimumClockAngle>o.Math.TWO_PI)throw new o.DeveloperError("this.minimumClockAngle must be between negative two pi and positive two pi.");if(this._maximumClockAngle<-o.Math.TWO_PI||this._maximumClockAngle>o.Math.TWO_PI)throw new o.DeveloperError("this.maximumClockAngle must be between negative two pi and positive two pi.");if(this._minimumClockAngle>=this._maximumClockAngle)throw new o.DeveloperError("this.minimumClockAngle must be less than this.maximumClockAngle.")}if(this._definitionChanged){this._hasInnerCone=this._innerHalfAngle!==0,this._hasOuterCone=this._outerHalfAngle!==Math.PI;let O=this._minimumClockAngle,I=this._maximumClockAngle,y=O+(I-O)%o.Math.TWO_PI;y===O?(y+=o.Math.TWO_PI,this._isPartialCone=!1):this._isPartialCone=!0,this._maximumClockAngle!==y&&(this._maximumClockAngle=y)}let i=e.context,t=this._id!==this.id;this._id=this.id,e.passes.pick&&(!(0,o.defined)(this._pickId)||t)&&(this._pickId=this._pickId&&this._pickId.destroy(),this._pickId=i.createPickId({primitive:this._pickPrimitive,id:this.id}));let s=this._lateralSurfaceMaterial!==this.lateralSurfaceMaterial;s&&(this._lateralSurfaceMaterial=this.lateralSurfaceMaterial,this._lateralSurfaceMaterial.update(i));let a=(0,o.defined)(this.ellipsoidHorizonSurfaceMaterial)?this.ellipsoidHorizonSurfaceMaterial:this.lateralSurfaceMaterial,l=(0,o.defined)(this.domeSurfaceMaterial)?this.domeSurfaceMaterial:this.lateralSurfaceMaterial,m=(0,o.defined)(this.ellipsoidSurfaceMaterial)?this.ellipsoidSurfaceMaterial:this.lateralSurfaceMaterial,d=this._ellipsoidHorizonSurfaceMaterial!==a;d&&(this._ellipsoidHorizonSurfaceMaterial=a,this._ellipsoidHorizonSurfaceMaterial.update(i));let r=this._domeSurfaceMaterial!==l;r&&(this._domeSurfaceMaterial=l,this._domeSurfaceMaterial.update(i));let f=this._ellipsoidSurfaceMaterial!==m;f&&(this._ellipsoidSurfaceMaterial=m,this._ellipsoidSurfaceMaterial.update(i));let c=this._environmentOcclusionMaterial!==this.environmentOcclusionMaterial;c&&(this._environmentOcclusionMaterial=this.environmentOcclusionMaterial,this._environmentOcclusionMaterial.update(i));let h=this._showEnvironmentOcclusion!==this.showEnvironmentOcclusion;this.showEnvironmentOcclusion&&this.environmentConstraint&&((s||c||h)&&(this._environmentOcclusionLateralMaterial=this._environmentOcclusionLateralMaterial&&this._environmentOcclusionLateralMaterial.destroy(),this._environmentOcclusionLateralMaterial=w.createEnvironmentOcclusionMaterial(this._lateralSurfaceMaterial,this._environmentOcclusionMaterial),this._environmentOcclusionLateralMaterial.update(i)),(r||c||h)&&(this._environmentOcclusionDomeMaterial=this._environmentOcclusionDomeMaterial&&this._environmentOcclusionDomeMaterial.destroy(),this._environmentOcclusionDomeMaterial=w.createEnvironmentOcclusionMaterial(this._domeSurfaceMaterial,this._environmentOcclusionMaterial),this._environmentOcclusionDomeMaterial.update(i)),this._environmentOcclusionLateralMaterial.materials.domeMaterial.uniforms=this._lateralSurfaceMaterial.uniforms,this._environmentOcclusionLateralMaterial.materials.occludedMaterial.uniforms=this._environmentOcclusionMaterial.uniforms,this._environmentOcclusionDomeMaterial.materials.domeMaterial.uniforms=this._domeSurfaceMaterial.uniforms,this._environmentOcclusionDomeMaterial.materials.occludedMaterial.uniforms=this._environmentOcclusionMaterial.uniforms);let _=this.modelMatrix,C=!o.Matrix4.equals(_,this._modelMatrix);if(C){this._modelMatrix=o.Matrix4.clone(_,this._modelMatrix),this._inverseModelRotation=o.Matrix3.inverse(o.Matrix4.getMatrix3(_,this._inverseModelRotation),this._inverseModelRotation),this._p=o.Matrix4.getTranslation(_,this._p),this._q=this._ellipsoid.transformPositionToScaledSpace(this._p,this._q),this._qMagnitudeSquared=o.Cartesian3.magnitudeSquared(this._q),this._qMagnitudeSquaredMinusOne=this._qMagnitudeSquared-1,o.Cartesian3.normalize(this._q,this._unitQ),o.Cartesian3.multiplyByScalar(this._unitQ,-1,this._inverseUnitQ);let O=1/this._qMagnitudeSquared;this._cosineAndSineOfHalfAperture.y=Math.sqrt(O);let I=1-O;this._cosineAndSineOfHalfAperture.x=Math.sqrt(I)}let g=e.mode,S=this._mode!==g;this._mode=g;let E=this._showIntersection!==this.showIntersection;this._showIntersection=this.showIntersection;let V=this._definitionChanged;if(V){this._definitionChanged=!1,this._sensorGlsl=ki(this,!0),this._sensorUniforms=(0,o.combine)(this._clockUniforms,this._coneUniforms);let O=Math.cos(this._outerHalfAngle),I=Math.sin(this._outerHalfAngle);if(this._cosineAndSineOfOuterHalfAngle.x=O,this._cosineAndSineOfOuterHalfAngle.y=I,this._cosineOfOuterHalfAngle=O,this._hasInnerCone&&(this._cosineAndSineOfInnerHalfAngle.x=Math.cos(this._innerHalfAngle),this._cosineAndSineOfInnerHalfAngle.y=Math.sin(this._innerHalfAngle),this._cosineOfInnerHalfAngle=this._cosineAndSineOfInnerHalfAngle.x),this._isPartialCone){let y=Math.cos(this._innerHalfAngle),x=Math.sin(this._innerHalfAngle),j=this._minimumClockAngle,A=Math.cos(j),P=Math.sin(j);o.Cartesian3.fromElements(P,-A,0,this._minimumClockAngleSurfaceNormal),Ke=o.Cartesian3.fromElements(A*x,P*x,y,Ke),Je=o.Cartesian3.fromElements(A*I,P*I,O,Je),o.Cartesian3.divideByScalar(o.Cartesian3.add(Ke,Je,$e),2,this._minimumClockAngleSurfaceFacetBisector),this._minimumClockAngleSurfaceFacetBisectorMagnitudeSquared=o.Cartesian3.magnitudeSquared(this._minimumClockAngleSurfaceFacetBisector);let Q=this._maximumClockAngle;A=Math.cos(Q),P=Math.sin(Q),o.Cartesian3.fromElements(-P,A,0,this._maximumClockAngleSurfaceNormal),Ke=o.Cartesian3.fromElements(A*I,P*I,O,Ke),Je=o.Cartesian3.fromElements(A*x,P*x,y,Je),o.Cartesian3.divideByScalar(o.Cartesian3.add(Ke,Je,$e),2,this._maximumClockAngleSurfaceFacetBisector),this._maximumClockAngleSurfaceFacetBisectorMagnitudeSquared=o.Cartesian3.magnitudeSquared(this._maximumClockAngleSurfaceFacetBisector)}}(V||!(0,o.defined)(this._lateralPlanarCommandsVertexArray))&&Hr(this,i),g===o.SceneMode.SCENE3D?Nr(this,e,V,C,S,E,s,d,r,c,f):(g===o.SceneMode.SCENE2D||g===o.SceneMode.COLUMBUS_VIEW)&&((!(0,o.defined)(this._drawCommands2D)||this._drawCommands2D.length===0)&&w.initialize2D(this,i,this._ellipsoidSurfaceMaterial.isTranslucent()),Ar(this,e,V,C,S,E,f))};function rt(e){return e.depthTexture}Qn.ellipsoidSurfaceIn3DSupported=function(e){return rt(e.context)};Qn.viewshedSupported=function(e){return rt(e.context)};Qn.prototype.isDestroyed=function(){return!1};Qn.prototype.destroy=function(){w.destroyShaderPrograms2D(this),this._hasInnerCone&&(this._lateralInnerConicCommandsVertexArray=this._lateralInnerConicCommandsVertexArray&&this._lateralInnerConicCommandsVertexArray.destroy(),this._lateralInnerConicCommandInsideShaderProgram=w.destroyShader(this._lateralInnerConicCommandInsideShaderProgram),this._lateralInnerConicCommandOutsideShaderProgram=w.destroyShader(this._lateralInnerConicCommandOutsideShaderProgram),this._lateralInnerConicCommand.shaderProgram=void 0,w.destroyShaderProgram(this._lateralInnerConicPickCommand)),this._lateralOuterConicCommandsVertexArray=this._lateralOuterConicCommandsVertexArray&&this._lateralOuterConicCommandsVertexArray.destroy(),this._lateralOuterConicCommandInsideShaderProgram=w.destroyShader(this._lateralOuterConicCommandInsideShaderProgram),this._lateralOuterConicCommandOutsideShaderProgram=w.destroyShader(this._lateralOuterConicCommandOutsideShaderProgram),this._lateralOuterConicCommand.shaderProgram=void 0,w.destroyShaderProgram(this._lateralOuterConicPickCommand),this._lateralPlanarCommandsVertexArray=this._lateralPlanarCommandsVertexArray&&this._lateralPlanarCommandsVertexArray.destroy(),w.destroyShaderProgram(this._frontFaceColorCommand),this._ellipsoidHorizonSurfaceCommandsVertexArray=this._ellipsoidHorizonSurfaceCommandsVertexArray&&this._ellipsoidHorizonSurfaceCommandsVertexArray.destroy();let e=this._ellipsoidHorizonSurfaceColorCommands.length;for(let i=0;i<e;++i)this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i]=w.destroyShader(this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i]),this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i]=w.destroyShader(this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i]),this._ellipsoidHorizonSurfaceColorCommands[i].shaderProgram=void 0;return this._domeColorCommandInsideShaderProgram=w.destroyShader(this._domeColorCommandInsideShaderProgram),this._domeColorCommandOutsideShaderProgram=w.destroyShader(this._domeColorCommandOutsideShaderProgram),this._domeColorCommand.shaderProgram=void 0,this._domeCommandsVertexArray=this._domeCommandsVertexArray&&this._domeCommandsVertexArray.destroy(),this._surfaceCommandShaderProgram=w.destroyShader(this._surfaceCommandShaderProgram),this._surfaceCommandPickShaderProgram=w.destroyShader(this._surfaceCommandPickShaderProgram),this._surfaceCommandViewshedShaderProgram=w.destroyShader(this._surfaceCommandViewshedShaderProgram),this._surfaceCommandVertexArray=this._surfaceCommandVertexArray&&this._surfaceCommandVertexArray.destroy(),w.destroyShaderProgram(this._pickCommand),this._pickId=this._pickId&&this._pickId.destroy(),this._shadowMap=this._shadowMap&&this._shadowMap.destroy(),(0,o.destroyObject)(this)};var go=Qn;var u=Ie(we(),1);var D=Ie(we(),1),Rr=7;function an(e){this._isConvex=void 0,this._vertices=[],this._directions=[],this._referenceAxis=void 0,this._referenceDistance=void 0,this._normalsAndBisectorsWithMagnitudeSquared=void 0,(0,D.defined)(e)&&(this.vertices=e),this._convexHull=[]}var at=new D.Cartesian3,st=new D.Cartesian3,Wi=new D.Cartesian3;function wo(e,i,t,s){return at=D.Cartesian3.subtract(e,i,at),st=D.Cartesian3.subtract(t,i,st),s=D.Cartesian3.normalize(D.Cartesian3.cross(st,at,s),s),Wi=D.Cartesian3.divideByScalar(D.Cartesian3.add(D.Cartesian3.add(e,i,Wi),t,Wi),3,Wi),D.Cartesian3.dot(Wi,s)}function Oo(e,i,t){t=D.Cartesian3.divideByScalar(D.Cartesian3.add(e,i,t),2,t);let s=D.Cartesian3.magnitude(t);return t=D.Cartesian3.normalize(t,t),s}var lt=new D.Cartesian3,ct=new D.Cartesian3,Li=new D.Cartesian3;function kr(e,i,t,s){let a=Oo(e,i,lt),l=Oo(i,t,ct),m=Oo(t,e,Li);return a<=l?a<=m?D.Cartesian3.dot(t,lt)>=a?(s=D.Cartesian3.clone(lt,s),a):wo(e,i,t,s):D.Cartesian3.dot(i,Li)>=m?(s=D.Cartesian3.clone(Li,s),m):wo(e,i,t,s):l<=m?D.Cartesian3.dot(e,ct)>=l?(s=D.Cartesian3.clone(ct,s),l):wo(e,i,t,s):D.Cartesian3.dot(i,Li)>=m?(s=D.Cartesian3.clone(Li,s),m):wo(e,i,t,s)}var Kn=new D.Cartesian3,dt=new D.Cartesian3,mt=new D.Cartesian3;an.findConvexHull=function(e,i,t,s,a){let l=e.length;if(a.length=0,t<s)for(let r=t;r<=s;++r)a.push(r);else{for(let r=t;r<l;++r)a.push(r);for(let r=0;r<=s;++r)a.push(r)}let m=a.length,d;do{d=a.length;let r=d-1,f=0,c=1;do{let h=e[a[r%a.length]],_=e[a[f%a.length]],C=e[a[c%a.length]];Kn=D.Cartesian3.cross(_,h,Kn),dt=D.Cartesian3.cross(C,_,dt),i*D.Cartesian3.dot(D.Cartesian3.cross(Kn,dt,mt),_)>=0?(r=f,f=f+1,c=f+1):a.splice(f,1)}while(f!==a.length)}while(a.length!==d);if(a.length<3)a.length=0;else if(a.length!==m){let r;a.holes=[];for(let h=0;h<a.length-1;++h){let _=a[h],C=a[h+1];(_<C?C-_:C+l-_)>1&&(r=[],an.findConvexHull(e,i*-1,_,C,r),r.length!==0&&a.holes.push(r))}let f=a[0],c=a[a.length-1];c===s&&f!==t?(r=[],an.findConvexHull(e,i*-1,s,f,r),r.length!==0&&a.holes.push(r)):c!==s&&f===t?(r=[],an.findConvexHull(e,i*-1,c,t,r),r.length!==0&&a.holes.push(r)):c!==s&&f!==t&&(r=[],an.findConvexHull(e,i*-1,c,f,r),r.length!==0&&a.holes.push(r))}};var Fi=new D.Cartesian3;an.prototype.computeBoundingCone=function(e){let i=e.length;for(let t=0;t<i;++t){let s=this._directions[e[t]];for(let a=t+1;a<i;++a){let l=this._directions[e[a]];for(let m=a+1;m<i;++m){let d=this._directions[e[m]],r=kr(s,l,d,Fi),f;for(f=0;f<i;++f)if(f!==t&&f!==a&&f!==m){let c=this._directions[e[f]];if(D.Cartesian3.dot(c,Fi)<r)break}f===i&&(this._referenceAxis=D.Cartesian3.clone(Fi,this._referenceAxis),this._referenceDistance=r)}}}};an.prototype.computeBoundingCone2=function(){let e=this.convexHull,i=e.length,t=-1,s=-1,a=1;for(let m=0;m<i;++m){let d=this._directions[e[m]];for(let r=m+1;r<i;++r){let f=this._directions[e[r]],c=Oo(d,f,Fi);c<a&&(t=m,s=r,this._referenceAxis=D.Cartesian3.clone(Fi,this._referenceAxis),this._referenceDistance=c,a=c)}}let l=[];for(let m=0;m<i;++m)if(m===t||m===s)l.push(e[m]);else{let d=e[m],r=this._directions[d];D.Cartesian3.dot(r,this._referenceAxis)<this._referenceDistance&&l.push(d)}l.length>2&&this.computeBoundingCone(l)};var Yn=new D.Cartesian3,gn=new D.Cartesian3,ut=new D.Cartesian3,Eo=new D.Cartesian3,$n=new D.Cartesian3;Object.defineProperties(an.prototype,{isConvex:{get:function(){return this._isConvex}},vertices:{get:function(){return this._vertices},set:function(e){if((0,D.defined)(e)){let i=e.length,t=i*2;this._normalsAndBisectorsWithMagnitudeSquared=new Float32Array(3*t+i),this._isConvex=!0,Eo=D.Cartesian3.fromSpherical(e[i-1],Eo),$n=D.Cartesian3.clone(Eo,$n);for(let s=0;s<i;++s){let a=D.Cartesian3.fromSpherical(e[s]);Yn=D.Cartesian3.divideByScalar(D.Cartesian3.add($n,a,Yn),2,Yn),gn=D.Cartesian3.normalize(D.Cartesian3.cross(a,$n,gn),gn),s===0?ut=D.Cartesian3.clone(gn,ut):D.Cartesian3.dot(D.Cartesian3.cross(Kn,gn,mt),$n)<0&&(this._isConvex=!1),this._directions[s]=a;let l=s*Rr;this._normalsAndBisectorsWithMagnitudeSquared[l]=gn.x,this._normalsAndBisectorsWithMagnitudeSquared[l+1]=gn.y,this._normalsAndBisectorsWithMagnitudeSquared[l+2]=gn.z,this._normalsAndBisectorsWithMagnitudeSquared[l+3]=Yn.x,this._normalsAndBisectorsWithMagnitudeSquared[l+4]=Yn.y,this._normalsAndBisectorsWithMagnitudeSquared[l+5]=Yn.z,this._normalsAndBisectorsWithMagnitudeSquared[l+6]=D.Cartesian3.magnitudeSquared(Yn),$n=D.Cartesian3.clone(a,$n),Kn=D.Cartesian3.clone(gn,Kn)}D.Cartesian3.dot(D.Cartesian3.cross(Kn,ut,mt),Eo)<0&&(this._isConvex=!1),this._vertices=e,this._convexHull=[],this._referenceAxis=void 0,this._referenceDistance=void 0}}},convexHull:{get:function(){return this._vertices.length!==0&&this._convexHull.length===0&&an.findConvexHull(this._directions,1,0,this._vertices.length-1,this._convexHull),this._convexHull}},referenceAxis:{get:function(){return!(0,D.defined)(this._referenceAxis)&&this.convexHull.length>0&&this.computeBoundingCone2(),this._referenceAxis}},referenceDistance:{get:function(){return!(0,D.defined)(this._referenceDistance)&&this.convexHull.length>0&&this.computeBoundingCone2(),this._referenceDistance}}});var Io=an;var Xe=Ie(we(),1),Wr=7,Lr=0;function ft(){}function vo(e,i){return`u_kDopFacetNormal_${e}_${i}`}function Fr(e,i,t,s,a,l){let m=i.length,d="",r="",f=s%2===0,c=f?"+":"-",h=f?"-":"+",_=s===0?m:m-1;for(let C=0;C<_;++C){let g=C+1===m?0:C+1,S=i[C],E=i[g],V=S<E?vo(S,E):vo(E,S),O;if(l)O=(S<E?c:h)+V;else{let I=a[V];O=`${S<E?c:h}vec3(${I.x}, ${I.y}, ${I.z})`}C===0?r+=`	float value = dot(direction, ${O});
`:r+=`	value = max(value, dot(direction, ${O}));
`}return d+=`
float ${t}(vec3 direction)
{
${r}	return value;
}
`,d}function kt(e,i,t,s,a,l){let m="";if((0,Xe.defined)(i.holes)){let d=s+1;for(let r=0;r<i.holes.length;++r){let f=`${t}_${r}`;m+=kt(e,i.holes[r],f,d,a,l)}}return m+=Fr(e,i,t,s,a,l),m}function ht(e,i,t,s){let a=e.length;if((0,Xe.defined)(t.holes))for(let m=0;m<t.holes.length;++m)ht(e,i,t.holes[m],s);let l=t.length;for(let m=0;m<l;++m){let d=m+1===l?0:m+1,r=t[m],f=t[d],c=e[r],h=e[f],_=r<f?vo(r,f):vo(f,r);if(!(0,Xe.defined)(s[_])){let C=r<f?f-r:f+a-r,g=new Xe.Cartesian3;C===1?(g=Xe.Cartesian3.fromArray(i,f*Wr+Lr,g),g=r<f?g:Xe.Cartesian3.negate(g,g)):g=r<f?Xe.Cartesian3.cross(h,c,g):Xe.Cartesian3.cross(c,h,g),s[_]=g}}}function Wt(e,i,t){let s=`	float ${t} = ${i}(direction);
`;if((0,Xe.defined)(e.holes))for(let a=0;a<e.holes.length;++a){let l=`${t}_${a}`,m=`${i}_${a}`,d=e.holes[a];if(s+=`	float ${l} = -${m}(direction);
`,(0,Xe.defined)(d.holes))for(let r=0;r<d.holes.length;++r){let f=`${l}_${r}`;s+=Wt(d.holes[r],`${m}_${r}`,f),s+=`	${l} = min(${l}, ${f});
`}s+=`	${t} = max(${t}, ${l});
`}return s}function Br(e){return function(){return e}}ft.uniforms=function(e){let i=e._directions,t=e._normalsAndBisectorsWithMagnitudeSquared,s=e.convexHull,a={};ht(i,t,s,a);let l={};for(let m in a)a.hasOwnProperty(m)&&(l[m]=Br(a[m]));return l};ft.implicitSurfaceFunction=function(e,i){let t=e._directions,s=e._normalsAndBisectorsWithMagnitudeSquared,a=e.convexHull,l={};ht(t,s,a,l);let m=`
`;if(i)for(let h in l)l.hasOwnProperty(h)&&(m+=`uniform vec3 ${h};
`);let d="convexHull",r="value";m+=kt(t.length,a,d,0,l,i);let c=Wt(a,d,r);return m+=`
float sensorSurfaceFunction(vec3 displacement)
{
	vec3 direction = normalize(displacement);
${c}	return ${r};
}
`,m};var Bi=ft;function qr(){this.index=void 0,this.v=new u.Cartesian3,this.r=new u.Cartesian3,this.cosine=void 0,this.sine=void 0,this.kind=void 0}function ni(e){e=e??u.Frozen.EMPTY_OBJECT,this._pickId=void 0,this._pickPrimitive=e._pickPrimitive??this,this._vertices2D=void 0,this._command1Vertices2D=void 0,this._command2Vertices2D=void 0,this._vertexArray2D=void 0,this._vertexBuffer2D=void 0,this._drawCommands2D=void 0,this._drawCommandsShaderProgram2D=void 0,this._pickCommands2D=void 0,this._pickCommandsShaderProgram2D=void 0,this._numberOfCommands2D=0,this._ellipsoidHorizonSurfaceCommandsVertices=void 0,this._ellipsoidHorizonSurfaceCommandsVertexArray=void 0,this._ellipsoidHorizonSurfaceCommandsBuffer=void 0,this._ellipsoidHorizonSurfaceColorCommandList=[],this._domeCommandsVertices=void 0,this._domeCommandsVertexArray=void 0,this._domeCommandsBuffer=void 0,this._domeColorCommandToAdd=void 0,this._completeDomeBoundingVolumeMC=new u.BoundingSphere,this._surfaceCommandVertexArray=void 0,this._surfaceCommandShaderProgram=void 0,this._surfaceCommandPickShaderProgram=void 0,this._surfaceCommandViewshedShaderProgram=void 0,this._surfaceCommand=new u.DrawCommand,this._surfaceBoundingVolumeMC=new u.BoundingSphere,this._lateralPlanarCommandsVertexArray=void 0,this._lateralPlanarBoundingSphere=new u.BoundingSphere,this._lateralPlanarBoundingSphereWC=new u.BoundingSphere,this._frontFaceColorCommand=new u.DrawCommand({boundingVolume:this._lateralPlanarBoundingSphereWC,owner:this}),this._backFaceColorCommand=new u.DrawCommand({boundingVolume:this._lateralPlanarBoundingSphereWC,owner:this}),this._pickCommand=new u.DrawCommand({boundingVolume:this._lateralPlanarBoundingSphereWC,owner:this,pickOnly:!0}),this._ellipsoidHorizonSurfaceColorCommands=[],this._ellipsoidHorizonSurfaceColorCommandsSource=[],this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram=[],this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram=[],this._domeColorCommand=new u.DrawCommand({owner:this}),this._domeColorCommandSource=void 0,this._domeColorCommandInsideShaderProgram=void 0,this._domeColorCommandOutsideShaderProgram=void 0,this._ellipsoid=e.ellipsoid??u.Ellipsoid.WGS84,this.show=e.show??!0,this.portionToDisplay=e.portionToDisplay??u.SensorVolumePortionToDisplay.COMPLETE,this._portionToDisplay=this.portionToDisplay,this.modelMatrix=u.Matrix4.clone(e.modelMatrix??u.Matrix4.IDENTITY),this._modelMatrix=void 0,this.lateralSurfaceMaterial=(0,u.defined)(e.lateralSurfaceMaterial)?e.lateralSurfaceMaterial:u.Material.fromType(u.Material.ColorType),this._lateralSurfaceMaterial=void 0,this._lateralSurfaceIsTranslucent=void 0,this.showLateralSurfaces=e.showLateralSurfaces??!0,this.ellipsoidHorizonSurfaceMaterial=(0,u.defined)(e.ellipsoidHorizonSurfaceMaterial)?e.ellipsoidHorizonSurfaceMaterial:void 0,this._ellipsoidHorizonSurfaceMaterial=void 0,this._ellipsoidHorizonSurfaceIsTranslucent=void 0,this.showEllipsoidHorizonSurfaces=e.showEllipsoidHorizonSurfaces??!0,this.ellipsoidSurfaceMaterial=(0,u.defined)(e.ellipsoidSurfaceMaterial)?e.ellipsoidSurfaceMaterial:void 0,this._ellipsoidSurfaceMaterial=void 0,this._ellipsoidSurfaceIsTranslucent=void 0,this.showEllipsoidSurfaces=e.showEllipsoidSurfaces??!0,this._showEllipsoidSurfaces=this.showEllipsoidSurfaces,this.domeSurfaceMaterial=(0,u.defined)(e.domeSurfaceMaterial)?e.domeSurfaceMaterial:void 0,this._domeSurfaceMaterial=void 0,this._domeSurfaceIsTranslucent=void 0,this.showDomeSurfaces=e.showDomeSurfaces??!0,this.showIntersection=e.showIntersection??!0,this._showIntersection=this.showIntersection,this.intersectionColor=u.Color.clone(e.intersectionColor??u.Color.WHITE),this.intersectionWidth=e.intersectionWidth??5,this.showThroughEllipsoid=e.showThroughEllipsoid??!1,this._showThroughEllipsoid=this.showThroughEllipsoid,this.environmentConstraint=e.environmentConstraint??!1,this._environmentConstraint=this.environmentConstraint,this.showEnvironmentOcclusion=e.showEnvironmentOcclusion??!1,this._showEnvironmentOcclusion=this.showEnvironmentOcclusion,this.environmentOcclusionMaterial=(0,u.defined)(e.environmentOcclusionMaterial)?e.environmentOcclusionMaterial:u.Material.fromType(u.Material.ColorType),this._environmentOcclusionMaterial=void 0,this._environmentOcclusionLateralMaterial=void 0,this._environmentOcclusionDomeMaterial=void 0,this.showEnvironmentIntersection=e.showEnvironmentIntersection??!1,this._showEnvironmentIntersection=this.showEnvironmentIntersection,this.environmentIntersectionColor=u.Color.clone(e.environmentIntersectionColor??u.Color.WHITE),this.environmentIntersectionWidth=e.environmentIntersectionWidth??5,this.showViewshed=e.showViewshed??!1,this._showViewshed=this.showViewshed,this.viewshedVisibleColor=(0,u.defined)(e.viewshedVisibleColor)?u.Color.clone(e.viewshedVisibleColor):u.Color.LIME.withAlpha(.5),this.viewshedOccludedColor=(0,u.defined)(e.viewshedOccludedColor)?u.Color.clone(e.viewshedOccludedColor):u.Color.RED.withAlpha(.5),this.viewshedResolution=e.viewshedResolution??2048,this._viewshedResolution=this.viewshedResolution,this.classificationType=e.classificationType??u.ClassificationType.BOTH,this.id=e.id,this._id=void 0,this.debugShowCrossingPoints=e.debugShowCrossingPoints??!1,this._debugLabelCollection=void 0,this.debugShowProxyGeometry=e.debugShowProxyGeometry??!1,this.debugShowBoundingVolume=e.debugShowBoundingVolume??!1,this.debugShowShadowMap=e.debugShowShadowMap??!1,this._sphericalPolygon=new Io,this._definitionChanged=!1,this._useUniformsForNormals=!1,this._radius=e.radius??Number.POSITIVE_INFINITY,this.directions=e.directions;let i=this;this._uniforms={u_radii:function(){return i._ellipsoid.radii},u_inverseRadii:function(){return i._ellipsoid.oneOverRadii},u_sensorRadius:function(){return isFinite(i._radius)?i._radius:w.maximumRadius},u_q:function(){return i._q},u_intersectionColor:function(){return i.intersectionColor},u_intersectionWidth:function(){return i.intersectionWidth},u_normalDirection:function(){return 1}},this._pickUniforms={czm_pickColor:function(){return i._pickId.color}},this._viewshedUniforms={u_viewshedVisibleColor:function(){return i.viewshedVisibleColor},u_viewshedOccludedColor:function(){return i.viewshedOccludedColor}},this._ellipsoidHorizonSurfaceUniforms={u_inverseUnitQ:function(){return i._inverseUnitQ},u_cosineAndSineOfHalfAperture:function(){return i._cosineAndSineOfHalfAperture}},this._inverseModelRotation=new u.Matrix3,this._uniforms2D={u_p:function(){return i._p},u_inverseModel:function(){return i._inverseModelRotation}},this._mode=u.SceneMode.SCENE3D,this._sensorGlsl=void 0,this._sensorUniforms=void 0,this._shadowMapUniforms=void 0,this._shadowMap=void 0,this._fronts=[],this._backs=[],this._directions=[],this._crossings=[],this._p=new u.Cartesian3,this._q=new u.Cartesian3,this._unitQ=new u.Cartesian3,this._inverseUnitQ=new u.Cartesian3,this._qMagnitudeSquared=void 0,this._qMagnitudeSquaredMinusOne=void 0,this._cosineAndSineOfHalfAperture=new u.Cartesian2}Object.defineProperties(ni.prototype,{radius:{get:function(){return this._radius},set:function(e){this._radius!==e&&(this._radius=e,this._definitionChanged=!0)}},ellipsoid:{get:function(){return this._ellipsoid}},directions:{get:function(){return this._sphericalPolygon.vertices},set:function(e){this._sphericalPolygon.vertices=(0,u.arrayRemoveDuplicates)(e,Ur,!0),this._definitionChanged=!0}}});function Ur(e,i,t){return t=t??0,e===i||(0,u.defined)(e)&&(0,u.defined)(i)&&Math.abs(e.clock-i.clock)<=t&&Math.abs(e.cone-i.cone)<=t}var Ii=new u.Cartesian3,vi=new u.Cartesian3,Te=new u.Cartesian3,Lt=new u.Cartesian3;function Gr(e,i){let t=isFinite(e.radius)?e.radius:w.maximumRadius,s=e._sphericalPolygon._directions,a=s.length,l=Math.max(a,w.numberOfSidesForCompleteCircle),m=e._fronts.length;if(m>l)e._directions.length=l,e._fronts.length=l,e._backs.length=l;else if(m<l)for(let S=m;S<l;++S)e._directions[S]=new u.Cartesian3,e._fronts[S]=new u.Cartesian3,e._backs[S]=new u.Cartesian3;let d=e.debugShowProxyGeometry?u.PrimitiveType.LINES:e._frontFaceColorCommand.primitiveType,r=a;if(l=2*r,m=e._crossings.length,m>l)e._crossings.length=l;else if(m<l)for(let S=m;S<l;++S)e._crossings[S]=new qr;w.initializeEllipsoidHorizonSurfaceCommands(e,i,r,d),w.initializeDomeCommand(e,e._sphericalPolygon.referenceAxis,s,e._sphericalPolygon.convexHull,i,a,d,t,e._sensorUniforms),w.initializeSurfaceCommand(e,e._sphericalPolygon.referenceAxis,s,e._sphericalPolygon.convexHull,i,d,t,e._sensorUniforms);let f=a*3,c=new Float32Array(f+3);for(let S=a-2,E=a-1,V=0;V<a;S=E++,E=V++){let O=s[S],I=s[E],y=s[V],x=2*t/Math.min(u.Cartesian3.magnitude(u.Cartesian3.add(O,I,Lt)),u.Cartesian3.magnitude(u.Cartesian3.add(I,y,Lt)));c[E*3]=x*I.x,c[E*3+1]=x*I.y,c[E*3+2]=x*I.z}c[f]=0,c[f+1]=0,c[f+2]=0,u.BoundingSphere.fromVertices(c,void 0,3,e._lateralPlanarBoundingSphere);let h=new Float32Array(a*3*w.numberOfFloatsPerVertex3D),_=0;for(let S=a-1,E=0;E<a;S=E++)Ii=u.Cartesian3.unpack(c,S*3,Ii),vi=u.Cartesian3.unpack(c,E*3,vi),Te=u.Cartesian3.normalize(u.Cartesian3.cross(vi,Ii,Te),Te),h[_++]=0,h[_++]=0,h[_++]=0,h[_++]=Te.x,h[_++]=Te.y,h[_++]=Te.z,h[_++]=vi.x,h[_++]=vi.y,h[_++]=vi.z,h[_++]=Te.x,h[_++]=Te.y,h[_++]=Te.z,h[_++]=Ii.x,h[_++]=Ii.y,h[_++]=Ii.z,h[_++]=Te.x,h[_++]=Te.y,h[_++]=Te.z;let C=u.Buffer.createVertexBuffer({context:i,typedArray:h,usage:u.BufferUsage.STATIC_DRAW}),g=w.makeVertexArray3D(e,i,C);e._lateralPlanarCommandsVertexArray=g,e._frontFaceColorCommand.vertexArray=g,e._backFaceColorCommand.vertexArray=g,e._pickCommand.vertexArray=g}function Zr(e,i){e._lateralPlanarCommandsVertexArray=e._lateralPlanarCommandsVertexArray&&e._lateralPlanarCommandsVertexArray.destroy(),Gr(e,i)}function jr(e,i,t){let s=w.getRenderState3D(e,i,t,u.CullFace.BACK),a=t?u.Pass.TRANSLUCENT:u.Pass.OPAQUE;e._frontFaceColorCommand.renderState=s,e._frontFaceColorCommand.pass=a,e._pickCommand.renderState=s,e._pickCommand.pass=a,e._backFaceColorCommand.renderState=w.getRenderState3D(e,i,!0,u.CullFace.FRONT),e._backFaceColorCommand.pass=a}var qi=new u.Matrix3,Jn=new u.Matrix3,Ln=new u.Cartesian3,wn=new u.Cartesian3,Xn=new u.Cartesian3,pt=new u.Cartesian3,Ft=new u.Cartesian3,Mo=new u.Cartesian3,Bt=new u.Cartesian3,_t=new u.Cartesian3,Ct=new u.Cartesian3,yo=new u.Cartesian3,Ui=new u.Cartesian3,Qr=new u.Cartesian3;function Yr(e,i){qi=u.Matrix4.getMatrix3(e.modelMatrix,qi),Jn=u.Matrix3.transpose(qi,Jn),Ln=u.Matrix4.getTranslation(e.modelMatrix,Ln),wn=e._ellipsoid.transformPositionToScaledSpace(Ln,wn);let t=u.Cartesian3.magnitudeSquared(wn),s=isFinite(e.radius)?e.radius:w.maximumRadius,a=1/Math.sqrt(t);if(a<1){let l=t-1,m=s*s,d=u.Cartesian3.magnitudeSquared(e._ellipsoid.transformPositionToScaledSpace(wn,Qr));if(isFinite(e.radius)&&e.portionToDisplay===u.SensorVolumePortionToDisplay.COMPLETE&&l*l>m*d)w.renderCompleteDome(e);else{Xn=u.Cartesian3.normalize(wn,Xn),Mo=u.Cartesian3.negate(u.Matrix3.multiplyByVector(Jn,Ln,Mo),Mo);let r=!0,f=!0;Ct=u.Cartesian3.mostOrthogonalAxis(Xn,Ct),Ui=u.Cartesian3.normalize(u.Cartesian3.cross(Ct,Xn,Ui),Ui),yo=u.Cartesian3.normalize(u.Cartesian3.cross(Xn,Ui,yo),yo);let c={crossings:e._crossings,count:0},h=e._sphericalPolygon.vertices.length;for(let g=0;g<h;++g){let S=g*7;Te=u.Cartesian3.fromArray(e._sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared,S,Te),pt=u.Cartesian3.fromArray(e._sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared,S+3,pt);let E=e._sphericalPolygon._normalsAndBisectorsWithMagnitudeSquared[S+6];r=u.Cartesian3.dot(Mo,Te)<0?r:!1,f&=w.checkPlanarCrossings(e._ellipsoid,Ln,wn,Xn,a,m,qi,Jn,yo,Ui,!0,Te,pt,E,e._portionToDisplay,g,c)}let _=c.count,C=c.crossings;if(_>0&&t>1){e._sphericalPolygon.isConvex||(C=C.slice(0,_),C.sort(w.angularSortUsingSineAndCosine));let g=e._debugLabelCollection;(0,u.defined)(g)&&g.removeAll();let S=!1,E=!1,V=!1,O=0;for(let I=0;I<_;++I){let y=C[I];if(e.debugShowCrossingPoints&&g.add({position:y.v,text:(y.kind===1?"+":"-")+y.index.toString()}),y.kind===1&&(E?(u.Cartesian3.clone(y.r,Bt),S=!0):(u.Cartesian3.clone(y.r,Ft),V=!0)),S&&E){let x=e._ellipsoidHorizonSurfaceColorCommands[O+1];w.updateHorizonCommand(O,x,e,i,_t,Bt,Jn,Ln,wn,t,s),e._ellipsoidHorizonSurfaceColorCommandList.push(x),S=!1,E=!1,++O}y.kind===-1&&(u.Cartesian3.clone(y.r,_t),E=!0)}if(V&&E){let I=e._ellipsoidHorizonSurfaceColorCommands[O+1];w.updateHorizonCommand(O,I,e,i,_t,Ft,Jn,Ln,wn,t,s),e._ellipsoidHorizonSurfaceColorCommandList.push(I),++O}}isFinite(e.radius)&&w.renderCompleteDome(e),f&&r&&w.renderCompleteEllipsoidHorizonSurface(e,i,s,Ln,wn,t,a,Xn,qi,Jn)}}else isFinite(e.radius)&&e.portionToDisplay!==u.SensorVolumePortionToDisplay.BELOW_ELLIPSOID_HORIZON&&w.renderCompleteDome(e)}var Gi=new u.Cartesian3,Fn=new u.Cartesian3,Mi=new u.Cartesian3,Vo=new u.Cartesian3,qt=new u.Cartesian3,zo=new u.Cartesian3,To=new u.Cartesian3,St=new u.Cartesian3,gt=new u.Cartesian3,Zi=new u.Cartesian3,ji=new u.Cartesian3,ze=new u.Cartographic,ei=[new u.Cartesian3,new u.Cartesian3,new u.Cartesian3,new u.Cartesian3],En=ei[0],On=ei[1],In=ei[2],vn=ei[3];function $r(e,i,t,s,a,l,m){if(e._qMagnitudeSquared<=1)return;if(s||a){Math.abs(e._unitQ.z)===1?Fn=u.Cartesian3.clone(u.Cartesian3.UNIT_Y,Fn):Fn=u.Cartesian3.normalize(u.Cartesian3.cross(u.Cartesian3.UNIT_Z,e._unitQ,Fn),Fn),Gi=u.Cartesian3.normalize(u.Cartesian3.cross(e._unitQ,Fn,Gi),Gi),Mi=u.Cartesian3.multiplyByScalar(e._q,1/e._qMagnitudeSquared,Mi);let C=Math.sqrt(e._qMagnitudeSquaredMinusOne/e._qMagnitudeSquared);qt=u.Cartesian3.multiplyByScalar(Fn,C,qt),Vo=u.Cartesian3.multiplyByScalar(Gi,C,Vo),St=u.Cartesian3.add(Mi,Vo,St),gt=u.Cartesian3.subtract(Mi,Vo,gt);let g=e._ellipsoid.cartesianToCartographic(St,ze).latitude,S=e._ellipsoid.cartesianToCartographic(gt,ze).latitude,E=Math.sqrt(e._qMagnitudeSquaredMinusOne)*e._unitQ.z/Math.sqrt(e._unitQ.x*e._unitQ.x+e._unitQ.y*e._unitQ.y),V,O;if(Math.abs(E)<1){let I=Math.sqrt(1-E*E);zo=u.Cartesian3.multiplyByScalar(Gi,E,zo),To=u.Cartesian3.multiplyByScalar(Fn,I,To),Zi=u.Cartesian3.add(Mi,u.Cartesian3.multiplyByScalar(u.Cartesian3.add(zo,To,Zi),C,Zi),Zi),ji=u.Cartesian3.add(Mi,u.Cartesian3.multiplyByScalar(u.Cartesian3.subtract(zo,To,ji),C,ji),ji),V=e._ellipsoid.cartesianToCartographic(Zi,ze).longitude,O=e._ellipsoid.cartesianToCartographic(ji,ze).longitude}else V=u.Math.PI,O=-u.Math.PI,E>0?g=u.Math.PI_OVER_TWO:S=-u.Math.PI_OVER_TWO;e._numberOfCommands2D=0,V<O?(En=i.mapProjection.project(u.Cartographic.fromRadians(V,g,0,ze),En),On=i.mapProjection.project(u.Cartographic.fromRadians(V,S,0,ze),On),In=i.mapProjection.project(u.Cartographic.fromRadians(-u.Math.PI,S,0,ze),In),vn=i.mapProjection.project(u.Cartographic.fromRadians(-u.Math.PI,g,0,ze),vn),w.setVertices2D(e._command1Vertices2D,En,On,In,vn,-u.Math.PI,V,S,g),e._drawCommands2D[0].boundingVolume=w.setBoundingSphere2D(ei,e._drawCommands2D[0].boundingVolume),En=i.mapProjection.project(u.Cartographic.fromRadians(u.Math.PI,g,0,ze),En),On=i.mapProjection.project(u.Cartographic.fromRadians(u.Math.PI,S,0,ze),On),In=i.mapProjection.project(u.Cartographic.fromRadians(O,S,0,ze),In),vn=i.mapProjection.project(u.Cartographic.fromRadians(O,g,0,ze),vn),w.setVertices2D(e._command2Vertices2D,En,On,In,vn,O,u.Math.PI,S,g),e._drawCommands2D[1].boundingVolume=w.setBoundingSphere2D(ei,e._drawCommands2D[1].boundingVolume),e._vertexBuffer2D.copyFromArrayView(e._vertices2D.buffer),e._numberOfCommands2D=2):(En=i.mapProjection.project(u.Cartographic.fromRadians(V,g,0,ze),En),On=i.mapProjection.project(u.Cartographic.fromRadians(V,S,0,ze),On),In=i.mapProjection.project(u.Cartographic.fromRadians(O,S,0,ze),In),vn=i.mapProjection.project(u.Cartographic.fromRadians(O,g,0,ze),vn),w.setVertices2D(e._command1Vertices2D,En,On,In,vn,O,V,S,g),e._drawCommands2D[0].boundingVolume=w.setBoundingSphere2D(ei,e._drawCommands2D[0].boundingVolume),e._vertexBuffer2D.copyFromArrayView(e._command1Vertices2D,0),e._numberOfCommands2D=1)}let d=i.context,r=e._ellipsoidSurfaceMaterial.isTranslucent();e._ellipsoidSurfaceIsTranslucent!==r&&(e._ellipsoidSurfaceIsTranslucent=r,w.setRenderStates2D(e,d,r)),(t||m||l||!(0,u.defined)(e._drawCommandsShaderProgram2D)||!(0,u.defined)(e._pickCommandsShaderProgram2D))&&w.setShaderPrograms2D(e,d,fi,mi);let f=e.debugShowBoundingVolume,c=i.commandList,h=i.passes,_=e._numberOfCommands2D;if(h.render&&e.showEllipsoidSurfaces)for(let C=0;C<_;++C){let g=e._drawCommands2D[C];g.debugShowBoundingVolume=f,c.push(g)}if(h.pick&&e.showEllipsoidSurfaces)for(let C=0;C<_;++C)c.push(e._pickCommands2D[C])}var yi=new u.Cartesian3,Kr=new u.Cartesian4;function Jr(e,i,t,s,a,l,m,d,r,f,c){if(!u.SensorVolumePortionToDisplay.validate(e.portionToDisplay))throw new u.DeveloperError("sensor.portionToDisplay is required and must be valid.");let h=e._debugLabelCollection;e.debugShowCrossingPoints&&!(0,u.defined)(h)?(h=new u.LabelCollection,e._debugLabelCollection=h):!e.debugShowCrossingPoints&&(0,u.defined)(h)&&(h.destroy(),e._debugLabelCollection=void 0);let _=i.context,C=e._showThroughEllipsoid!==e.showThroughEllipsoid;e._showThroughEllipsoid=e.showThroughEllipsoid;let g=e._showEllipsoidSurfaces!==e.showEllipsoidSurfaces;e._showEllipsoidSurfaces=e.showEllipsoidSurfaces;let S=e._portionToDisplay!==e.portionToDisplay;e._portionToDisplay=e.portionToDisplay;let E=e._environmentConstraint!==e.environmentConstraint;e._environmentConstraint=e.environmentConstraint;let V=e._showEnvironmentOcclusion!==e.showEnvironmentOcclusion;e._showEnvironmentOcclusion=e.showEnvironmentOcclusion;let O=e._showEnvironmentIntersection!==e.showEnvironmentIntersection;e._showEnvironmentIntersection=e.showEnvironmentIntersection;let I=e._showViewshed!==e.showViewshed;e._showViewshed=e.showViewshed;let y=e._viewshedResolution!==e.viewshedResolution;if(e._viewshedResolution=e.viewshedResolution,(E||I||y||(e.environmentConstraint||e.showEnvironmentIntersection||e.showViewshed)&&!(0,u.defined)(e._shadowMap))&&((0,u.defined)(e._shadowMap)&&(e._shadowMap.destroy(),e._shadowMap=void 0),(e.environmentConstraint||e.showEnvironmentIntersection||e.showViewshed)&&(e._shadowMap=new u.ShadowMap({context:_,lightCamera:{frustum:new u.PerspectiveFrustum,directionWC:u.Cartesian3.clone(u.Cartesian3.UNIT_X),positionWC:new u.Cartesian3},isPointLight:!0,fromLightSource:!1,size:e.viewshedResolution}),e._shadowMapUniforms={u_shadowMapLightPositionEC:function(){return e._shadowMap._lightPositionEC},u_shadowCubeMap:function(){return e._shadowMap._shadowMapTexture}})),(0,u.defined)(e._shadowMap)){if(s||E||I||y){let b=u.Matrix4.getColumn(e.modelMatrix,3,Kr);u.Cartesian3.fromCartesian4(b,e._shadowMap._lightCamera.positionWC)}e._shadowMap._pointLightRadius=e._radius,e._shadowMap.debugShow=e.debugShowShadowMap,e.showEnvironmentIntersection&&(e._shadowMap._pointLightRadius*=1.01),i.shadowMaps.push(e._shadowMap)}(s||a||S||t)&&(u.BoundingSphere.transform(e._lateralPlanarBoundingSphere,e.modelMatrix,e._lateralPlanarBoundingSphereWC),e._frontFaceColorCommand.modelMatrix=e.modelMatrix,e._backFaceColorCommand.modelMatrix=e.modelMatrix,e._pickCommand.modelMatrix=e.modelMatrix,e._ellipsoidHorizonSurfaceColorCommandList.length=0,e._domeColorCommandToAdd=void 0,Yr(e,_));let x=e.lateralSurfaceMaterial.isTranslucent();(C||e._lateralSurfaceIsTranslucent!==x||!(0,u.defined)(e._frontFaceColorCommand.renderState))&&(e._lateralSurfaceIsTranslucent=x,jr(e,_,x));let j=e._ellipsoidHorizonSurfaceMaterial.isTranslucent();(t||C||e._ellipsoidHorizonSurfaceIsTranslucent!==j||E)&&!e.environmentConstraint&&(e._ellipsoidHorizonSurfaceIsTranslucent=j,w.setEllipsoidHorizonSurfacesRenderStates3D(e,_,j));let A=e._domeSurfaceMaterial.isTranslucent();(t||C||e._domeSurfaceIsTranslucent!==A)&&(e._domeSurfaceIsTranslucent=A,w.setDomeSurfacesRenderStates3D(e,_,A));let P=e.debugShowProxyGeometry?u.PrimitiveType.LINES:e._frontFaceColorCommand.primitiveType,Q=t||S||a||l||m||E||V||f||O||C,K=(t||S||a||l||d||E||C)&&!e.environmentConstraint,ie=t||S||a||l||r||E||V||f||O||C,se=Q||K||ie||I||g||c;if(Q){let b;!e.showEnvironmentOcclusion||!e.environmentConstraint?b=e._lateralSurfaceMaterial:b=e._environmentOcclusionLateralMaterial;let k=e._frontFaceColorCommand,Y=e._backFaceColorCommand,H=new u.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Pn]}),U=new u.ShaderSource({defines:[e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",e.environmentConstraint?"ENVIRONMENT_CONSTRAINT":"",e.showEnvironmentOcclusion?"SHOW_ENVIRONMENT_OCCLUSION":"",e.showEnvironmentIntersection?"SHOW_ENVIRONMENT_INTERSECTION":"",u.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],sources:[G,le,b.shaderSource,Tn]});k.shaderProgram=u.ShaderProgram.replaceCache({context:_,shaderProgram:k.shaderProgram,vertexShaderSource:H,fragmentShaderSource:U,attributeLocations:w.attributeLocations3D}),k.uniformMap=(0,u.combine)(e._uniforms,b._uniforms),Y.shaderProgram=k.shaderProgram,Y.uniformMap=(0,u.combine)(e._uniforms,b._uniforms),Y.uniformMap.u_normalDirection=function(){return-1},(e.environmentConstraint||e.showEnvironmentIntersection)&&(k.uniformMap=(0,u.combine)(k.uniformMap,e._shadowMapUniforms),Y.uniformMap=(0,u.combine)(Y.uniformMap,e._shadowMapUniforms)),e.showEnvironmentIntersection&&(k.uniformMap.u_environmentIntersectionWidth=Y.uniformMap.u_environmentIntersectionWidth=function(){return e.environmentIntersectionWidth},k.uniformMap.u_environmentIntersectionColor=Y.uniformMap.u_environmentIntersectionColor=function(){return e.environmentIntersectionColor})}yi=u.Cartesian3.subtract(e._ellipsoid.transformPositionToScaledSpace(i.camera.positionWC,yi),e._q,yi);let ge=u.Cartesian3.dot(yi,e._q)/u.Cartesian3.magnitude(yi)<-Math.sqrt(e._qMagnitudeSquaredMinusOne),ne=u.Cartesian3.magnitudeSquared(u.Cartesian3.subtract(i.camera.positionWC,e._p,yi))<e.radius*e.radius;if(K){let b=new u.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),k=[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",u.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],Y=e._ellipsoidHorizonSurfaceColorCommands.length;for(let H=0;H<Y;++H){let U=e._ellipsoidHorizonSurfaceColorCommands[H],he=e._ellipsoidHorizonSurfaceColorCommandsSource[H];U.uniformMap=(0,u.combine)(e._ellipsoidHorizonSurfaceMaterial._uniforms,U.uniformMap),U.primitiveType=P;let ee=new u.ShaderSource({defines:k,sources:[G,le,Ee,he,e._ellipsoidHorizonSurfaceMaterial.shaderSource,xe,zn,li]});e._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[H]=u.ShaderProgram.replaceCache({context:_,shaderProgram:e._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[H],vertexShaderSource:b,fragmentShaderSource:ee,attributeLocations:w.attributeLocations3D});let Be=new u.ShaderSource({defines:k,sources:[G,le,Ee,he,e._ellipsoidHorizonSurfaceMaterial.shaderSource,xe,zn,ci]});e._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[H]=u.ShaderProgram.replaceCache({context:_,shaderProgram:e._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[H],vertexShaderSource:b,fragmentShaderSource:Be,attributeLocations:w.attributeLocations3D})}}if(!e.environmentConstraint){let b=e._ellipsoidHorizonSurfaceColorCommands.length;for(let k=0;k<b;++k){let Y=e._ellipsoidHorizonSurfaceColorCommands[k];Y.shaderProgram=ge?e._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[k]:e._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[k]}}let N=e._domeColorCommand;if(ie){let b;!e.showEnvironmentOcclusion||!e.environmentConstraint?b=e._domeSurfaceMaterial:b=e._environmentOcclusionDomeMaterial;let k=e._sensorGlsl;N.uniformMap=(0,u.combine)(b._uniforms,N.uniformMap),N.primitiveType=P,(e.environmentConstraint||e.showEnvironmentIntersection)&&(N.uniformMap=(0,u.combine)(N.uniformMap,e._shadowMapUniforms)),e.showEnvironmentIntersection&&(N.uniformMap.u_environmentIntersectionWidth=function(){return e.environmentIntersectionWidth},N.uniformMap.u_environmentIntersectionColor=function(){return e.environmentIntersectionColor});let Y=new u.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Re]}),H=[e.debugShowProxyGeometry?"ONLY_WIRE_FRAME":"",_.fragmentDepth?"WRITE_DEPTH":"",e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",e.environmentConstraint?"ENVIRONMENT_CONSTRAINT":"",e.showEnvironmentOcclusion?"SHOW_ENVIRONMENT_OCCLUSION":"",e.showEnvironmentIntersection?"SHOW_ENVIRONMENT_INTERSECTION":"",u.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],U=new u.ShaderSource({defines:H,sources:[G,le,Ee,k,b.shaderSource,Hn,di]});e._domeColorCommandInsideShaderProgram=u.ShaderProgram.replaceCache({context:_,shaderProgram:e._domeColorCommandInsideShaderProgram,vertexShaderSource:Y,fragmentShaderSource:U,attributeLocations:w.attributeLocations3D});let he=new u.ShaderSource({defines:H,sources:[G,le,Ee,k,b.shaderSource,Hn,ui]});e._domeColorCommandOutsideShaderProgram=u.ShaderProgram.replaceCache({context:_,shaderProgram:e._domeColorCommandOutsideShaderProgram,vertexShaderSource:Y,fragmentShaderSource:he,attributeLocations:w.attributeLocations3D})}N.shaderProgram=ne?e._domeColorCommandInsideShaderProgram:e._domeColorCommandOutsideShaderProgram;let Ne=i.commandList,de=i.passes;if(wt(_)&&(e.showEllipsoidSurfaces||e.showViewshed)&&(se&&w.updateSurface(e,_),(de.render||de.pick)&&w.addSurfaceCommand(e,i)),de.render){let b=e.debugShowBoundingVolume;if(e.showLateralSurfaces&&(e._frontFaceColorCommand.debugShowBoundingVolume=b,e._backFaceColorCommand.debugShowBoundingVolume=b,Ne.push(e._backFaceColorCommand,e._frontFaceColorCommand)),e.showEllipsoidHorizonSurfaces&&!e.environmentConstraint){let k=e._ellipsoidHorizonSurfaceColorCommandList.length;for(let Y=0;Y<k;++Y){let H=e._ellipsoidHorizonSurfaceColorCommandList[Y];H.debugShowBoundingVolume=b,Ne.push(H)}}if(e.showDomeSurfaces){let k=e._domeColorCommandToAdd;(0,u.defined)(k)&&(k.debugShowBoundingVolume=b,Ne.push(k))}}if(de.pick){let b=e._pickCommand;if(m||l||!(0,u.defined)(b.shaderProgram)){b.uniformMap=(0,u.combine)((0,u.combine)(e._uniforms,e._lateralSurfaceMaterial._uniforms),e._pickUniforms);let k=new u.ShaderSource({defines:["DISABLE_GL_POSITION_LOG_DEPTH"],sources:[G,Pn]}),Y=new u.ShaderSource({defines:[e.showIntersection?"SHOW_INTERSECTION":"",e.showThroughEllipsoid?"SHOW_THROUGH_ELLIPSOID":"",u.SensorVolumePortionToDisplay.toString(e.portionToDisplay)],sources:[G,le,e._lateralSurfaceMaterial.shaderSource,Tn],pickColorQualifier:"uniform"});b.shaderProgram=u.ShaderProgram.replaceCache({context:_,shaderProgram:b.shaderProgram,vertexShaderSource:k,fragmentShaderSource:Y,attributeLocations:w.attributeLocations3D})}e.showLateralSurfaces&&Ne.push(b)}e.debugShowCrossingPoints&&(h.modelMatrix=e.modelMatrix,h.update(i))}ni.prototype.update=function(e){if(!this.show)return;if(this.radius<0)throw new u.DeveloperError("this.radius must be greater than or equal to zero.");if(!(0,u.defined)(this.lateralSurfaceMaterial))throw new u.DeveloperError("this.lateralSurfaceMaterial must be defined.");let i=e.context,t=this._id!==this.id;this._id=this.id,e.passes.pick&&(!(0,u.defined)(this._pickId)||t)&&(this._pickId=this._pickId&&this._pickId.destroy(),this._pickId=i.createPickId({primitive:this._pickPrimitive,id:this.id}));let s=this._lateralSurfaceMaterial!==this.lateralSurfaceMaterial;s&&(this._lateralSurfaceMaterial=this.lateralSurfaceMaterial,this._lateralSurfaceMaterial.update(i));let a=(0,u.defined)(this.ellipsoidHorizonSurfaceMaterial)?this.ellipsoidHorizonSurfaceMaterial:this.lateralSurfaceMaterial,l=(0,u.defined)(this.domeSurfaceMaterial)?this.domeSurfaceMaterial:this.lateralSurfaceMaterial,m=(0,u.defined)(this.ellipsoidSurfaceMaterial)?this.ellipsoidSurfaceMaterial:this.lateralSurfaceMaterial,d=this._ellipsoidHorizonSurfaceMaterial!==a;d&&(this._ellipsoidHorizonSurfaceMaterial=a,this._ellipsoidHorizonSurfaceMaterial.update(i));let r=this._domeSurfaceMaterial!==l;r&&(this._domeSurfaceMaterial=l,this._domeSurfaceMaterial.update(i));let f=this._ellipsoidSurfaceMaterial!==m;f&&(this._ellipsoidSurfaceMaterial=m,this._ellipsoidSurfaceMaterial.update(i));let c=this._environmentOcclusionMaterial!==this.environmentOcclusionMaterial;c&&(this._environmentOcclusionMaterial=this.environmentOcclusionMaterial,this._environmentOcclusionMaterial.update(i));let h=this._showEnvironmentOcclusion!==this.showEnvironmentOcclusion;this.showEnvironmentOcclusion&&this.environmentConstraint&&((s||c||h)&&(this._environmentOcclusionLateralMaterial=this._environmentOcclusionLateralMaterial&&this._environmentOcclusionLateralMaterial.destroy(),this._environmentOcclusionLateralMaterial=w.createEnvironmentOcclusionMaterial(this._lateralSurfaceMaterial,this._environmentOcclusionMaterial),this._environmentOcclusionLateralMaterial.update(i)),(r||c||h)&&(this._environmentOcclusionDomeMaterial=this._environmentOcclusionDomeMaterial&&this._environmentOcclusionDomeMaterial.destroy(),this._environmentOcclusionDomeMaterial=w.createEnvironmentOcclusionMaterial(this._domeSurfaceMaterial,this._environmentOcclusionMaterial),this._environmentOcclusionDomeMaterial.update(i)),this._environmentOcclusionLateralMaterial.materials.domeMaterial.uniforms=this._lateralSurfaceMaterial.uniforms,this._environmentOcclusionLateralMaterial.materials.occludedMaterial.uniforms=this._environmentOcclusionMaterial.uniforms,this._environmentOcclusionDomeMaterial.materials.domeMaterial.uniforms=this._domeSurfaceMaterial.uniforms,this._environmentOcclusionDomeMaterial.materials.occludedMaterial.uniforms=this._environmentOcclusionMaterial.uniforms);let _=this.modelMatrix,C=!u.Matrix4.equals(_,this._modelMatrix);if(C){this._modelMatrix=u.Matrix4.clone(_,this._modelMatrix),this._inverseModelRotation=u.Matrix3.inverse(u.Matrix4.getMatrix3(_,this._inverseModelRotation),this._inverseModelRotation),this._p=u.Matrix4.getTranslation(_,this._p),this._q=this._ellipsoid.transformPositionToScaledSpace(this._p,this._q),this._qMagnitudeSquared=u.Cartesian3.magnitudeSquared(this._q),this._qMagnitudeSquaredMinusOne=this._qMagnitudeSquared-1,u.Cartesian3.normalize(this._q,this._unitQ),u.Cartesian3.multiplyByScalar(this._unitQ,-1,this._inverseUnitQ);let O=1/this._qMagnitudeSquared;this._cosineAndSineOfHalfAperture.y=Math.sqrt(O);let I=1-O;this._cosineAndSineOfHalfAperture.x=Math.sqrt(I)}let g=e.mode,S=this._mode!==g;this._mode=g;let E=this._showIntersection!==this.showIntersection;this._showIntersection=this.showIntersection;let V=this._definitionChanged;if(V){this._definitionChanged=!1;let O=this._sphericalPolygon,I=this._useUniformsForNormals;this._sensorGlsl=Bi.implicitSurfaceFunction(O,I),this._sensorUniforms=I?Bi.uniforms(O):{}}(V||!(0,u.defined)(this._lateralPlanarCommandsVertexArray))&&Zr(this,i),g===u.SceneMode.SCENE3D?Jr(this,e,V,C,S,E,s,d,r,c,f):(g===u.SceneMode.SCENE2D||g===u.SceneMode.COLUMBUS_VIEW)&&((!(0,u.defined)(this._drawCommands2D)||this._drawCommands2D.length===0)&&w.initialize2D(this,i,this._ellipsoidSurfaceMaterial.isTranslucent()),$r(this,e,V,C,S,E,f))};function wt(e){return e.depthTexture}ni.ellipsoidSurfaceIn3DSupported=function(e){return wt(e.context)};ni.viewshedSupported=function(e){return wt(e.context)};ni.prototype.isDestroyed=function(){return!1};ni.prototype.destroy=function(){w.destroyShaderPrograms2D(this),this._lateralPlanarCommandsVertexArray=this._lateralPlanarCommandsVertexArray&&this._lateralPlanarCommandsVertexArray.destroy(),w.destroyShaderProgram(this._frontFaceColorCommand),this._ellipsoidHorizonSurfaceCommandsVertexArray=this._ellipsoidHorizonSurfaceCommandsVertexArray&&this._ellipsoidHorizonSurfaceCommandsVertexArray.destroy();let e=this._ellipsoidHorizonSurfaceColorCommands.length;for(let i=0;i<e;++i)this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i]=w.destroyShader(this._ellipsoidHorizonSurfaceColorCommandsInsideShaderProgram[i]),this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i]=w.destroyShader(this._ellipsoidHorizonSurfaceColorCommandsOutsideShaderProgram[i]),this._ellipsoidHorizonSurfaceColorCommands[i].shaderProgram=void 0;return this._domeColorCommandInsideShaderProgram=w.destroyShader(this._domeColorCommandInsideShaderProgram),this._domeColorCommandOutsideShaderProgram=w.destroyShader(this._domeColorCommandOutsideShaderProgram),this._domeColorCommand.shaderProgram=void 0,this._domeCommandsVertexArray=this._domeCommandsVertexArray&&this._domeCommandsVertexArray.destroy(),this._surfaceCommandShaderProgram=w.destroyShader(this._surfaceCommandShaderProgram),this._surfaceCommandPickShaderProgram=w.destroyShader(this._surfaceCommandPickShaderProgram),this._surfaceCommandViewshedShaderProgram=w.destroyShader(this._surfaceCommandViewshedShaderProgram),this._surfaceCommandVertexArray=this._surfaceCommandVertexArray&&this._surfaceCommandVertexArray.destroy(),w.destroyShaderProgram(this._pickCommand),this._pickId=this._pickId&&this._pickId.destroy(),this._shadowMap=this._shadowMap&&this._shadowMap.destroy(),(0,u.destroyObject)(this)};var sn=ni;var Xr=!0,ea=M.Color.WHITE,na=1,ia=!1,oa=Number.POSITIVE_INFINITY,ta=M.SensorVolumePortionToDisplay.COMPLETE,ra=!0,aa=!0,sa=!0,la=!0,ca=!1,da=!1,ua=!1,ma=M.Color.WHITE,fa=5,ha=!1,pa=M.Color.LIME.withAlpha(.5),_a=M.Color.RED.withAlpha(.5),Ca=2048,Sa=M.ClassificationType.BOTH;function Vi(e,i,t,s){let a=i[e];(0,M.defined)(a)||(i[e]=a=new M.Spherical),a.clock=t,a.cone=s,a.magnitude=1}function ga(e,i,t,s,a){let l=e._sphericalPolygon,m=l.vertices,d=s===0?180:90,r=M.Math.TWO_PI/d,f,c=0;if(i===0&&t===M.Math.TWO_PI){a===M.Math.PI_OVER_TWO&&(d=8,r=M.Math.TWO_PI/d),f=0;let h=l._convexHull;for(c=0;c<d;++c)h.push(c),Vi(c,m,f,a),f+=r}else{for(f=i;f<t;f+=r)Vi(c++,m,f,a);if(Vi(c++,m,t,a),s===0)Vi(c++,m,t,0);else{for(f=t;f>i;f-=r)Vi(c++,m,f,s);Vi(c++,m,i,s)}}m.length=c,e.directions=m,l._referenceAxis=new M.Cartesian3,l._referenceAxis=M.Cartesian3.clone(M.Cartesian3.UNIT_Z,l._referenceAxis),l._referenceDistance=Math.cos(a)}function ii(e,i){if(!(0,M.defined)(e))throw new M.DeveloperError("scene is required.");if(!(0,M.defined)(i))throw new M.DeveloperError("entityCollection is required.");i.collectionChanged.addEventListener(ii.prototype._onCollectionChanged,this),this._scene=e,this._hasFragmentDepth=e._context.fragmentDepth,this._primitives=e.primitives,this._entityCollection=i,this._hash={},this._entitiesToVisualize=new M.AssociativeArray,this._modelMatrixScratch=new M.Matrix4,this._onCollectionChanged(i,i.values,[],[])}ii.prototype.update=function(e){if(!(0,M.defined)(e))throw new M.DeveloperError("time is required.");let i=this._entitiesToVisualize.values,t=this._hash,s=this._primitives;for(let a=0,l=i.length;a<l;a++){let m=i[a],d=m._conicSensor,r=t[m.id],f=m.isShowing&&m.isAvailable(e)&&M.Property.getValueOrDefault(d._show,e,!0),c;if(f&&(c=m.computeModelMatrix(e,this._modelMatrixScratch),f=(0,M.defined)(c)),!f){(0,M.defined)(r)&&(r.primitive.show=!1);continue}let h=(0,M.defined)(r)?r.primitive:void 0;(0,M.defined)(h)||(h=this._hasFragmentDepth?new go:new sn,h.id=m,s.add(h),r={primitive:h,minimumClockAngle:void 0,maximumClockAngle:void 0,innerHalfAngle:void 0,outerHalfAngle:void 0},t[m.id]=r);let _=M.Property.getValueOrDefault(d._minimumClockAngle,e,0),C=M.Property.getValueOrDefault(d._maximumClockAngle,e,M.Math.TWO_PI),g=M.Property.getValueOrDefault(d._innerHalfAngle,e,0),S=M.Property.getValueOrDefault(d._outerHalfAngle,e,Math.PI);this._hasFragmentDepth?(h.minimumClockAngle=_,h.maximumClockAngle=C,h.innerHalfAngle=g,h.outerHalfAngle=S):(r.minimumClockAngle!==_||r.maximumClockAngle!==C||r.innerHalfAngle!==g||r.outerHalfAngle!==S)&&(ga(h,_,C,g,S),r.minimumClockAngle=_,r.maximumClockAngle=C,r.innerHalfAngle=g,r.outerHalfAngle=S),h.show=!0,h.radius=M.Property.getValueOrDefault(d._radius,e,oa),h.showLateralSurfaces=M.Property.getValueOrDefault(d._showLateralSurfaces,e,la),h.lateralSurfaceMaterial=M.MaterialProperty.getValue(e,d._lateralSurfaceMaterial,h.lateralSurfaceMaterial),h.showEllipsoidHorizonSurfaces=M.Property.getValueOrDefault(d._showEllipsoidHorizonSurfaces,e,aa),h.ellipsoidHorizonSurfaceMaterial=M.MaterialProperty.getValue(e,d._ellipsoidHorizonSurfaceMaterial,h.ellipsoidHorizonSurfaceMaterial),h.showDomeSurfaces=M.Property.getValueOrDefault(d._showDomeSurfaces,e,ra),h.domeSurfaceMaterial=M.MaterialProperty.getValue(e,d._domeSurfaceMaterial,h.domeSurfaceMaterial),h.showEllipsoidSurfaces=M.Property.getValueOrDefault(d._showEllipsoidSurfaces,e,sa),h.ellipsoidSurfaceMaterial=M.MaterialProperty.getValue(e,d._ellipsoidSurfaceMaterial,h.ellipsoidSurfaceMaterial),h.showIntersection=M.Property.getValueOrDefault(d._showIntersection,e,Xr),h.intersectionColor=M.Property.getValueOrClonedDefault(d._intersectionColor,e,ea,h.intersectionColor),h.intersectionWidth=M.Property.getValueOrDefault(d._intersectionWidth,e,na),h.showThroughEllipsoid=M.Property.getValueOrDefault(d._showThroughEllipsoid,e,ia),h.portionToDisplay=M.Property.getValueOrDefault(d._portionToDisplay,e,ta),h.environmentConstraint=M.Property.getValueOrDefault(d._environmentConstraint,e,ca),h.showEnvironmentOcclusion=M.Property.getValueOrDefault(d._showEnvironmentOcclusion,e,da),h.environmentOcclusionMaterial=M.MaterialProperty.getValue(e,d._environmentOcclusionMaterial,h.environmentOcclusionMaterial),h.showEnvironmentIntersection=M.Property.getValueOrDefault(d._showEnvironmentIntersection,e,ua),h.environmentIntersectionColor=M.Property.getValueOrDefault(d._environmentIntersectionColor,e,ma),h.environmentIntersectionWidth=M.Property.getValueOrDefault(d._environmentIntersectionWidth,e,fa),h.showViewshed=M.Property.getValueOrDefault(d._showViewshed,e,ha),h.viewshedVisibleColor=M.Property.getValueOrDefault(d._viewshedVisibleColor,e,pa),h.viewshedOccludedColor=M.Property.getValueOrDefault(d._viewshedOccludedColor,e,_a),h.viewshedResolution=M.Property.getValueOrDefault(d._viewshedResolution,e,Ca),h.classificationType=M.Property.getValueOrDefault(d._classificationType,e,Sa),h.modelMatrix=M.Matrix4.clone(c,h.modelMatrix)}return!0};ii.prototype.isDestroyed=function(){return!1};ii.prototype.destroy=function(){let e=this._entitiesToVisualize.values,i=this._hash,t=this._primitives;for(let s=e.length-1;s>-1;s--)Et(e[s],i,t);return(0,M.destroyObject)(this)};var Ut=new M.Cartesian4;ii.prototype.getBoundingSphere=function(e,i){if(!(0,M.defined)(e))throw new M.DeveloperError("entity is required.");if(!(0,M.defined)(i))throw new M.DeveloperError("result is required.");let t=this._hash[e.id];if(!(0,M.defined)(t))return M.BoundingSphereState.FAILED;let s=t.primitive;return(0,M.defined)(s)?(M.Matrix4.getColumn(s.modelMatrix,3,Ut),M.Cartesian3.fromCartesian4(Ut,i.center),i.radius=isFinite(s.radius)?s.radius:1e3,M.BoundingSphereState.DONE):M.BoundingSphereState.FAILED};ii.prototype._onCollectionChanged=function(e,i,t,s){let a,l,m=this._entitiesToVisualize,d=this._hash,r=this._primitives;for(a=i.length-1;a>-1;a--)l=i[a],(0,M.defined)(l._conicSensor)&&(0,M.defined)(l._position)&&m.set(l.id,l);for(a=s.length-1;a>-1;a--)l=s[a],(0,M.defined)(l._conicSensor)&&(0,M.defined)(l._position)?m.set(l.id,l):(Et(l,d,r),m.remove(l.id));for(a=t.length-1;a>-1;a--)l=t[a],Et(l,d,r),m.remove(l.id)};function Et(e,i,t){let s=e.id,a=i[s];(0,M.defined)(a)&&(t.removeAndDestroy(a.primitive),delete i[s])}var Po=ii;var Z=Ie(we(),1);function Qi(e){this._directions=void 0,this._directionsSubscription=void 0,this._lateralSurfaceMaterial=void 0,this._lateralSurfaceMaterialSubscription=void 0,this._showLateralSurfaces=void 0,this._showLateralSurfacesSubscription=void 0,this._ellipsoidHorizonSurfaceMaterial=void 0,this._ellipsoidHorizonSurfaceMaterialSubscription=void 0,this._showEllipsoidHorizonSurfaces=void 0,this._showEllipsoidHorizonSurfacesSubscription=void 0,this._domeSurfaceMaterial=void 0,this._domeSurfaceMaterialSubscription=void 0,this._showDomeSurfaces=void 0,this._showDomeSurfacesSubscription=void 0,this._ellipsoidSurfaceMaterial=void 0,this._ellipsoidSurfaceMaterialSubscription=void 0,this._showEllipsoidSurfaces=void 0,this._showEllipsoidSurfacesSubscription=void 0,this._portionToDisplay=void 0,this._portionToDisplaySubscription=void 0,this._intersectionColor=void 0,this._intersectionColorSubscription=void 0,this._intersectionWidth=void 0,this._intersectionWidthSubscription=void 0,this._showIntersection=void 0,this._showIntersectionSubscription=void 0,this._showThroughEllipsoid=void 0,this._showThroughEllipsoidSubscription=void 0,this._radius=void 0,this._radiusSubscription=void 0,this._show=void 0,this._showSubscription=void 0,this._environmentConstraint=void 0,this._environmentConstraintSubscription=void 0,this._showEnvironmentOcclusion=void 0,this._showEnvironmentOcclusionSubscription=void 0,this._environmentOcclusionMaterial=void 0,this._environmentOcclusionMaterialSubscription=void 0,this._showEnvironmentIntersection=void 0,this._showEnvironmentIntersectionSubscription=void 0,this._environmentIntersectionColor=void 0,this._environmentIntersectionColorSubscription=void 0,this._environmentIntersectionWidth=void 0,this._environmentIntersectionWidthSubscription=void 0,this._showViewshed=void 0,this._showViewshedSubscription=void 0,this._viewshedVisibleColor=void 0,this._viewshedVisibleColorSubscription=void 0,this._viewshedOccludedColor=void 0,this._viewshedOccludedColorSubscription=void 0,this._viewshedResolution=void 0,this._viewshedResolutionSubscription=void 0,this._classificationType=void 0,this._classificationTypeSubscription=void 0,this._definitionChanged=new Z.Event,this.merge(e??Z.Frozen.EMPTY_OBJECT)}Object.defineProperties(Qi.prototype,{definitionChanged:{get:function(){return this._definitionChanged}},directions:(0,Z.createPropertyDescriptor)("directions"),lateralSurfaceMaterial:(0,Z.createMaterialPropertyDescriptor)("lateralSurfaceMaterial"),showLateralSurfaces:(0,Z.createPropertyDescriptor)("showLateralSurfaces"),ellipsoidHorizonSurfaceMaterial:(0,Z.createMaterialPropertyDescriptor)("ellipsoidHorizonSurfaceMaterial"),showEllipsoidHorizonSurfaces:(0,Z.createPropertyDescriptor)("showEllipsoidHorizonSurfaces"),domeSurfaceMaterial:(0,Z.createMaterialPropertyDescriptor)("domeSurfaceMaterial"),showDomeSurfaces:(0,Z.createPropertyDescriptor)("showDomeSurfaces"),ellipsoidSurfaceMaterial:(0,Z.createMaterialPropertyDescriptor)("ellipsoidSurfaceMaterial"),showEllipsoidSurfaces:(0,Z.createPropertyDescriptor)("showEllipsoidSurfaces"),portionToDisplay:(0,Z.createPropertyDescriptor)("portionToDisplay"),intersectionColor:(0,Z.createPropertyDescriptor)("intersectionColor"),intersectionWidth:(0,Z.createPropertyDescriptor)("intersectionWidth"),showIntersection:(0,Z.createPropertyDescriptor)("showIntersection"),showThroughEllipsoid:(0,Z.createPropertyDescriptor)("showThroughEllipsoid"),radius:(0,Z.createPropertyDescriptor)("radius"),show:(0,Z.createPropertyDescriptor)("show"),environmentConstraint:(0,Z.createPropertyDescriptor)("environmentConstraint"),showEnvironmentOcclusion:(0,Z.createPropertyDescriptor)("showEnvironmentOcclusion"),environmentOcclusionMaterial:(0,Z.createMaterialPropertyDescriptor)("environmentOcclusionMaterial"),showEnvironmentIntersection:(0,Z.createPropertyDescriptor)("showEnvironmentIntersection"),environmentIntersectionColor:(0,Z.createPropertyDescriptor)("environmentIntersectionColor"),environmentIntersectionWidth:(0,Z.createPropertyDescriptor)("environmentIntersectionWidth"),showViewshed:(0,Z.createPropertyDescriptor)("showViewshed"),viewshedVisibleColor:(0,Z.createPropertyDescriptor)("viewshedVisibleColor"),viewshedOccludedColor:(0,Z.createPropertyDescriptor)("viewshedOccludedColor"),viewshedResolution:(0,Z.createPropertyDescriptor)("viewshedResolution"),classificationType:(0,Z.createPropertyDescriptor)("classificationType")});Qi.prototype.clone=function(e){return(0,Z.defined)(e)||(e=new Qi),e.directions=this.directions,e.radius=this.radius,e.show=this.show,e.showIntersection=this.showIntersection,e.intersectionColor=this.intersectionColor,e.intersectionWidth=this.intersectionWidth,e.showThroughEllipsoid=this.showThroughEllipsoid,e.lateralSurfaceMaterial=this.lateralSurfaceMaterial,e.showLateralSurfaces=this.showLateralSurfaces,e.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial,e.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces,e.domeSurfaceMaterial=this.domeSurfaceMaterial,e.showDomeSurfaces=this.showDomeSurfaces,e.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial,e.showEllipsoidSurfaces=this.showEllipsoidSurfaces,e.portionToDisplay=this.portionToDisplay,e.environmentConstraint=this.environmentConstraint,e.showEnvironmentOcclusion=this.showEnvironmentOcclusion,e.environmentOcclusionMaterial=this.environmentOcclusionMaterial,e.showEnvironmentIntersection=this.showEnvironmentIntersection,e.environmentIntersectionColor=this.environmentIntersectionColor,e.environmentIntersectionWidth=this.environmentIntersectionWidth,e.showViewshed=this.showViewshed,e.viewshedVisibleColor=this.viewshedVisibleColor,e.viewshedOccludedColor=this.viewshedOccludedColor,e.viewshedResolution=this.viewshedResolution,e.classificationType=this.classificationType,e};Qi.prototype.merge=function(e){if(!(0,Z.defined)(e))throw new Z.DeveloperError("source is required.");this.directions=this.directions??e.directions,this.radius=this.radius??e.radius,this.show=this.show??e.show,this.showIntersection=this.showIntersection??e.showIntersection,this.intersectionColor=this.intersectionColor??e.intersectionColor,this.intersectionWidth=this.intersectionWidth??e.intersectionWidth,this.showThroughEllipsoid=this.showThroughEllipsoid??e.showThroughEllipsoid,this.lateralSurfaceMaterial=this.lateralSurfaceMaterial??e.lateralSurfaceMaterial,this.showLateralSurfaces=this.showLateralSurfaces??e.showLateralSurfaces,this.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial??e.ellipsoidHorizonSurfaceMaterial,this.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces??e.showEllipsoidHorizonSurfaces,this.domeSurfaceMaterial=this.domeSurfaceMaterial??e.domeSurfaceMaterial,this.showDomeSurfaces=this.showDomeSurfaces??e.showDomeSurfaces,this.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial??e.ellipsoidSurfaceMaterial,this.showEllipsoidSurfaces=this.showEllipsoidSurfaces??e.showEllipsoidSurfaces,this.portionToDisplay=this.portionToDisplay??e.portionToDisplay,this.environmentConstraint=this.environmentConstraint??e.environmentConstraint,this.showEnvironmentOcclusion=this.showEnvironmentOcclusion??e.showEnvironmentOcclusion,this.environmentOcclusionMaterial=this.environmentOcclusionMaterial??e.environmentOcclusionMaterial,this.showEnvironmentIntersection=this.showEnvironmentIntersection??e.showEnvironmentIntersection,this.environmentIntersectionColor=this.environmentIntersectionColor??e.environmentIntersectionColor,this.environmentIntersectionWidth=this.environmentIntersectionWidth??e.environmentIntersectionWidth,this.showViewshed=this.showViewshed??e.showViewshed,this.viewshedVisibleColor=this.viewshedVisibleColor??e.viewshedVisibleColor,this.viewshedOccludedColor=this.viewshedOccludedColor??e.viewshedOccludedColor,this.viewshedResolution=this.viewshedResolution??e.viewshedResolution,this.classificationType=this.classificationType??e.classificationType};var zi=Qi;var z=Ie(we(),1);var wa=!0,Ea=z.Color.WHITE,Oa=1,Ia=!1,va=Number.POSITIVE_INFINITY,Ma=z.SensorVolumePortionToDisplay.COMPLETE,ya=!0,Va=!0,za=!0,Ta=!0,Pa=!1,Ha=!1,xa=!1,Da=z.Color.WHITE,Aa=5,ba=!1,Na=z.Color.LIME.withAlpha(.5),Ra=z.Color.RED.withAlpha(.5),ka=2048,Wa=z.ClassificationType.BOTH;function oi(e,i){if(!(0,z.defined)(e))throw new z.DeveloperError("scene is required.");if(!(0,z.defined)(i))throw new z.DeveloperError("entityCollection is required.");i.collectionChanged.addEventListener(oi.prototype._onCollectionChanged,this),this._scene=e,this._primitives=e.primitives,this._entityCollection=i,this._hash={},this._entitiesToVisualize=new z.AssociativeArray,this._modelMatrixScratch=new z.Matrix4,this._onCollectionChanged(i,i.values,[],[])}oi.prototype.update=function(e){if(!(0,z.defined)(e))throw new z.DeveloperError("time is required.");let i=this._entitiesToVisualize.values,t=this._hash,s=this._primitives;for(let a=0,l=i.length;a<l;a++){let m=i[a],d=m._customPatternSensor,r,f=t[m.id],c=m.isShowing&&m.isAvailable(e)&&z.Property.getValueOrDefault(d._show,e,!0),h;if(c&&(h=m.computeModelMatrix(e,this._modelMatrixScratch),r=z.Property.getValueOrUndefined(d._directions,e),c=(0,z.defined)(h)&&(0,z.defined)(r)),!c){(0,z.defined)(f)&&(f.show=!1);continue}(0,z.defined)(f)?z.Property.isConstant(d._directions)||(f.directions=r):(f=new sn,f.id=m,s.add(f),f.directions=r,t[m.id]=f),f.show=!0,f.radius=z.Property.getValueOrDefault(d._radius,e,va),f.showLateralSurfaces=z.Property.getValueOrDefault(d._showLateralSurfaces,e,Ta),f.lateralSurfaceMaterial=z.MaterialProperty.getValue(e,d._lateralSurfaceMaterial,f.lateralSurfaceMaterial),f.showEllipsoidHorizonSurfaces=z.Property.getValueOrDefault(d._showEllipsoidHorizonSurfaces,e,Va),f.ellipsoidHorizonSurfaceMaterial=z.MaterialProperty.getValue(e,d._ellipsoidHorizonSurfaceMaterial,f.ellipsoidHorizonSurfaceMaterial),f.showDomeSurfaces=z.Property.getValueOrDefault(d._showDomeSurfaces,e,ya),f.domeSurfaceMaterial=z.MaterialProperty.getValue(e,d._domeSurfaceMaterial,f.domeSurfaceMaterial),f.showEllipsoidSurfaces=z.Property.getValueOrDefault(d._showEllipsoidSurfaces,e,za),f.ellipsoidSurfaceMaterial=z.MaterialProperty.getValue(e,d._ellipsoidSurfaceMaterial,f.ellipsoidSurfaceMaterial),f.showIntersection=z.Property.getValueOrDefault(d._showIntersection,e,wa),f.intersectionColor=z.Property.getValueOrClonedDefault(d._intersectionColor,e,Ea,f.intersectionColor),f.intersectionWidth=z.Property.getValueOrDefault(d._intersectionWidth,e,Oa),f.showThroughEllipsoid=z.Property.getValueOrDefault(d._showThroughEllipsoid,e,Ia),f.portionToDisplay=z.Property.getValueOrDefault(d._portionToDisplay,e,Ma),f.environmentConstraint=z.Property.getValueOrDefault(d._environmentConstraint,e,Pa),f.showEnvironmentOcclusion=z.Property.getValueOrDefault(d._showEnvironmentOcclusion,e,Ha),f.environmentOcclusionMaterial=z.MaterialProperty.getValue(e,d._environmentOcclusionMaterial,f.environmentOcclusionMaterial),f.showEnvironmentIntersection=z.Property.getValueOrDefault(d._showEnvironmentIntersection,e,xa),f.environmentIntersectionColor=z.Property.getValueOrDefault(d._environmentIntersectionColor,e,Da),f.environmentIntersectionWidth=z.Property.getValueOrDefault(d._environmentIntersectionWidth,e,Aa),f.showViewshed=z.Property.getValueOrDefault(d._showViewshed,e,ba),f.viewshedVisibleColor=z.Property.getValueOrDefault(d._viewshedVisibleColor,e,Na),f.viewshedOccludedColor=z.Property.getValueOrDefault(d._viewshedOccludedColor,e,Ra),f.viewshedResolution=z.Property.getValueOrDefault(d._viewshedResolution,e,ka),f.classificationType=z.Property.getValueOrDefault(d._classificationType,e,Wa),f.modelMatrix=z.Matrix4.clone(h,f.modelMatrix)}return!0};oi.prototype.isDestroyed=function(){return!1};oi.prototype.destroy=function(){let e=this._entitiesToVisualize.values,i=this._hash,t=this._primitives;for(let s=e.length-1;s>-1;s--)Ot(e[s],i,t);return(0,z.destroyObject)(this)};var Gt=new z.Cartesian4;oi.prototype.getBoundingSphere=function(e,i){if(!(0,z.defined)(e))throw new z.DeveloperError("entity is required.");if(!(0,z.defined)(i))throw new z.DeveloperError("result is required.");let t=this._hash[e.id];return(0,z.defined)(t)?(z.Matrix4.getColumn(t.modelMatrix,3,Gt),z.Cartesian3.fromCartesian4(Gt,i.center),i.radius=isFinite(t.radius)?t.radius:1e3,z.BoundingSphereState.DONE):z.BoundingSphereState.FAILED};oi.prototype._onCollectionChanged=function(e,i,t,s){let a,l,m=this._entitiesToVisualize,d=this._hash,r=this._primitives;for(a=i.length-1;a>-1;a--)l=i[a],(0,z.defined)(l._customPatternSensor)&&(0,z.defined)(l._position)&&(0,z.defined)(l._orientation)&&m.set(l.id,l);for(a=s.length-1;a>-1;a--)l=s[a],(0,z.defined)(l._customPatternSensor)&&(0,z.defined)(l._position)&&(0,z.defined)(l._orientation)?m.set(l.id,l):(Ot(l,d,r),m.remove(l.id));for(a=t.length-1;a>-1;a--)l=t[a],Ot(l,d,r),m.remove(l.id)};function Ot(e,i,t){let s=e.id,a=i[s];(0,z.defined)(a)&&(t.removeAndDestroy(a),delete i[s])}var Ho=oi;var q=Ie(we(),1);function Yi(e){this._xHalfAngle=void 0,this._xHalfAngleSubscription=void 0,this._yHalfAngle=void 0,this._yHalfAngleSubscription=void 0,this._lateralSurfaceMaterial=void 0,this._lateralSurfaceMaterialSubscription=void 0,this._showLateralSurfaces=void 0,this._showLateralSurfacesSubscription=void 0,this._ellipsoidHorizonSurfaceMaterial=void 0,this._ellipsoidHorizonSurfaceMaterialSubscription=void 0,this._showEllipsoidHorizonSurfaces=void 0,this._showEllipsoidHorizonSurfacesSubscription=void 0,this._domeSurfaceMaterial=void 0,this._domeSurfaceMaterialSubscription=void 0,this._showDomeSurfaces=void 0,this._showDomeSurfacesSubscription=void 0,this._ellipsoidSurfaceMaterial=void 0,this._ellipsoidSurfaceMaterialSubscription=void 0,this._showEllipsoidSurfaces=void 0,this._showEllipsoidSurfacesSubscription=void 0,this._portionToDisplay=void 0,this._portionToDisplaySubscription=void 0,this._intersectionColor=void 0,this._intersectionColorSubscription=void 0,this._intersectionWidth=void 0,this._intersectionWidthSubscription=void 0,this._showIntersection=void 0,this._showIntersectionSubscription=void 0,this._showThroughEllipsoid=void 0,this._showThroughEllipsoidSubscription=void 0,this._radius=void 0,this._radiusSubscription=void 0,this._show=void 0,this._showSubscription=void 0,this._environmentConstraint=void 0,this._environmentConstraintSubscription=void 0,this._showEnvironmentOcclusion=void 0,this._showEnvironmentOcclusionSubscription=void 0,this._environmentOcclusionMaterial=void 0,this._environmentOcclusionMaterialSubscription=void 0,this._showEnvironmentIntersection=void 0,this._showEnvironmentIntersectionSubscription=void 0,this._environmentIntersectionColor=void 0,this._environmentIntersectionColorSubscription=void 0,this._environmentIntersectionWidth=void 0,this._environmentIntersectionWidthSubscription=void 0,this._showViewshed=void 0,this._showViewshedSubscription=void 0,this._viewshedVisibleColor=void 0,this._viewshedVisibleColorSubscription=void 0,this._viewshedOccludedColor=void 0,this._viewshedOccludedColorSubscription=void 0,this._viewshedResolution=void 0,this._viewshedResolutionSubscription=void 0,this._classificationType=void 0,this._classificationTypeSubscription=void 0,this._definitionChanged=new q.Event,this.merge(e??q.Frozen.EMPTY_OBJECT)}Object.defineProperties(Yi.prototype,{definitionChanged:{get:function(){return this._definitionChanged}},xHalfAngle:(0,q.createPropertyDescriptor)("xHalfAngle"),yHalfAngle:(0,q.createPropertyDescriptor)("yHalfAngle"),lateralSurfaceMaterial:(0,q.createMaterialPropertyDescriptor)("lateralSurfaceMaterial"),showLateralSurfaces:(0,q.createPropertyDescriptor)("showLateralSurfaces"),ellipsoidHorizonSurfaceMaterial:(0,q.createMaterialPropertyDescriptor)("ellipsoidHorizonSurfaceMaterial"),showEllipsoidHorizonSurfaces:(0,q.createPropertyDescriptor)("showEllipsoidHorizonSurfaces"),domeSurfaceMaterial:(0,q.createMaterialPropertyDescriptor)("domeSurfaceMaterial"),showDomeSurfaces:(0,q.createPropertyDescriptor)("showDomeSurfaces"),ellipsoidSurfaceMaterial:(0,q.createMaterialPropertyDescriptor)("ellipsoidSurfaceMaterial"),showEllipsoidSurfaces:(0,q.createPropertyDescriptor)("showEllipsoidSurfaces"),portionToDisplay:(0,q.createPropertyDescriptor)("portionToDisplay"),intersectionColor:(0,q.createPropertyDescriptor)("intersectionColor"),intersectionWidth:(0,q.createPropertyDescriptor)("intersectionWidth"),showIntersection:(0,q.createPropertyDescriptor)("showIntersection"),showThroughEllipsoid:(0,q.createPropertyDescriptor)("showThroughEllipsoid"),radius:(0,q.createPropertyDescriptor)("radius"),show:(0,q.createPropertyDescriptor)("show"),environmentConstraint:(0,q.createPropertyDescriptor)("environmentConstraint"),showEnvironmentOcclusion:(0,q.createPropertyDescriptor)("showEnvironmentOcclusion"),environmentOcclusionMaterial:(0,q.createMaterialPropertyDescriptor)("environmentOcclusionMaterial"),showEnvironmentIntersection:(0,q.createPropertyDescriptor)("showEnvironmentIntersection"),environmentIntersectionColor:(0,q.createPropertyDescriptor)("environmentIntersectionColor"),environmentIntersectionWidth:(0,q.createPropertyDescriptor)("environmentIntersectionWidth"),showViewshed:(0,q.createPropertyDescriptor)("showViewshed"),viewshedVisibleColor:(0,q.createPropertyDescriptor)("viewshedVisibleColor"),viewshedOccludedColor:(0,q.createPropertyDescriptor)("viewshedOccludedColor"),viewshedResolution:(0,q.createPropertyDescriptor)("viewshedResolution"),classificationType:(0,q.createPropertyDescriptor)("classificationType")});Yi.prototype.clone=function(e){return(0,q.defined)(e)||(e=new Yi),e.xHalfAngle=this.xHalfAngle,e.yHalfAngle=this.yHalfAngle,e.radius=this.radius,e.show=this.show,e.showIntersection=this.showIntersection,e.intersectionColor=this.intersectionColor,e.intersectionWidth=this.intersectionWidth,e.showThroughEllipsoid=this.showThroughEllipsoid,e.lateralSurfaceMaterial=this.lateralSurfaceMaterial,e.showLateralSurfaces=this.showLateralSurfaces,e.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial,e.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces,e.domeSurfaceMaterial=this.domeSurfaceMaterial,e.showDomeSurfaces=this.showDomeSurfaces,e.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial,e.showEllipsoidSurfaces=this.showEllipsoidSurfaces,e.portionToDisplay=this.portionToDisplay,e.environmentConstraint=this.environmentConstraint,e.showEnvironmentOcclusion=this.showEnvironmentOcclusion,e.environmentOcclusionMaterial=this.environmentOcclusionMaterial,e.showEnvironmentIntersection=this.showEnvironmentIntersection,e.environmentIntersectionColor=this.environmentIntersectionColor,e.environmentIntersectionWidth=this.environmentIntersectionWidth,e.showViewshed=this.showViewshed,e.viewshedVisibleColor=this.viewshedVisibleColor,e.viewshedOccludedColor=this.viewshedOccludedColor,e.viewshedResolution=this.viewshedResolution,e.classificationType=this.classificationType,e};Yi.prototype.merge=function(e){if(!(0,q.defined)(e))throw new q.DeveloperError("source is required.");this.xHalfAngle=this.xHalfAngle??e.xHalfAngle,this.yHalfAngle=this.yHalfAngle??e.yHalfAngle,this.radius=this.radius??e.radius,this.show=this.show??e.show,this.showIntersection=this.showIntersection??e.showIntersection,this.intersectionColor=this.intersectionColor??e.intersectionColor,this.intersectionWidth=this.intersectionWidth??e.intersectionWidth,this.showThroughEllipsoid=this.showThroughEllipsoid??e.showThroughEllipsoid,this.lateralSurfaceMaterial=this.lateralSurfaceMaterial??e.lateralSurfaceMaterial,this.showLateralSurfaces=this.showLateralSurfaces??e.showLateralSurfaces,this.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial??e.ellipsoidHorizonSurfaceMaterial,this.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces??e.showEllipsoidHorizonSurfaces,this.domeSurfaceMaterial=this.domeSurfaceMaterial??e.domeSurfaceMaterial,this.showDomeSurfaces=this.showDomeSurfaces??e.showDomeSurfaces,this.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial??e.ellipsoidSurfaceMaterial,this.showEllipsoidSurfaces=this.showEllipsoidSurfaces??e.showEllipsoidSurfaces,this.portionToDisplay=this.portionToDisplay??e.portionToDisplay,this.environmentConstraint=this.environmentConstraint??e.environmentConstraint,this.showEnvironmentOcclusion=this.showEnvironmentOcclusion??e.showEnvironmentOcclusion,this.environmentOcclusionMaterial=this.environmentOcclusionMaterial??e.environmentOcclusionMaterial,this.showEnvironmentIntersection=this.showEnvironmentIntersection??e.showEnvironmentIntersection,this.environmentIntersectionColor=this.environmentIntersectionColor??e.environmentIntersectionColor,this.environmentIntersectionWidth=this.environmentIntersectionWidth??e.environmentIntersectionWidth,this.showViewshed=this.showViewshed??e.showViewshed,this.viewshedVisibleColor=this.viewshedVisibleColor??e.viewshedVisibleColor,this.viewshedOccludedColor=this.viewshedOccludedColor??e.viewshedOccludedColor,this.viewshedResolution=this.viewshedResolution??e.viewshedResolution,this.classificationType=this.classificationType??e.classificationType};var Ti=Yi;var T=Ie(we(),1);var L=Ie(we(),1);function ti(e){e=e??L.Frozen.EMPTY_OBJECT,this.show=e.show??!0,this.portionToDisplay=e.portionToDisplay??L.SensorVolumePortionToDisplay.COMPLETE,this.modelMatrix=L.Matrix4.clone(e.modelMatrix??L.Matrix4.IDENTITY),this.radius=e.radius??Number.POSITIVE_INFINITY,this.xHalfAngle=e.xHalfAngle??L.Math.PI_OVER_TWO,this._xHalfAngle=void 0,this.yHalfAngle=e.yHalfAngle??L.Math.PI_OVER_TWO,this._yHalfAngle=void 0,this.lateralSurfaceMaterial=(0,L.defined)(e.lateralSurfaceMaterial)?e.lateralSurfaceMaterial:L.Material.fromType(L.Material.ColorType),this.showLateralSurfaces=e.showLateralSurfaces??!0,this.ellipsoidHorizonSurfaceMaterial=(0,L.defined)(e.ellipsoidHorizonSurfaceMaterial)?e.ellipsoidHorizonSurfaceMaterial:void 0,this.showEllipsoidHorizonSurfaces=e.showEllipsoidHorizonSurfaces??!0,this.ellipsoidSurfaceMaterial=(0,L.defined)(e.ellipsoidSurfaceMaterial)?e.ellipsoidSurfaceMaterial:void 0,this._ellipsoidSurfaceMaterial=void 0,this._ellipsoidSurfaceIsTranslucent=void 0,this.showEllipsoidSurfaces=e.showEllipsoidSurfaces??!0,this.domeSurfaceMaterial=(0,L.defined)(e.domeSurfaceMaterial)?e.domeSurfaceMaterial:void 0,this.showDomeSurfaces=e.showDomeSurfaces??!0,this.showIntersection=e.showIntersection??!0,this.intersectionColor=L.Color.clone(e.intersectionColor??L.Color.WHITE),this.intersectionWidth=e.intersectionWidth??5,this.showThroughEllipsoid=e.showThroughEllipsoid??!1,this.environmentConstraint=e.environmentConstraint??!1,this.showEnvironmentOcclusion=e.showEnvironmentOcclusion??!1,this.environmentOcclusionMaterial=(0,L.defined)(e.environmentOcclusionMaterial)?e.environmentOcclusionMaterial:L.Material.fromType(L.Material.ColorType),this.showEnvironmentIntersection=e.showEnvironmentIntersection??!1,this.environmentIntersectionColor=L.Color.clone(e.environmentIntersectionColor??L.Color.WHITE),this.environmentIntersectionWidth=e.environmentIntersectionWidth??5,this.showViewshed=e.showViewshed??!1,this.viewshedVisibleColor=(0,L.defined)(e.viewshedVisibleColor)?L.Color.clone(e.viewshedVisibleColor):L.Color.LIME.withAlpha(.5),this.viewshedOccludedColor=(0,L.defined)(e.viewshedOccludedColor)?L.Color.clone(e.viewshedOccludedColor):L.Color.RED.withAlpha(.5),this.viewshedResolution=e.viewshedResolution??2048,this.classificationType=e.classificationType??L.ClassificationType.BOTH,this.id=e.id,this.debugShowCrossingPoints=e.debugShowCrossingPoints??!1,this.debugShowProxyGeometry=e.debugShowProxyGeometry??!1,this.debugShowBoundingVolume=e.debugShowBoundingVolume??!1,this.debugShowShadowMap=e.debugShowShadowMap??!1;let i=(0,L.clone)(e);i._pickPrimitive=e._pickPrimitive??this,this._customSensor=new sn(i)}Object.defineProperties(ti.prototype,{ellipsoid:{get:function(){return this._customSensor.ellipsoid}}});ti.prototype.update=function(e){if(this.xHalfAngle>L.Math.PI_OVER_TWO||this.yHalfAngle>L.Math.PI_OVER_TWO)throw new L.DeveloperError("this.xHalfAngle and this.yHalfAngle must each be less than or equal to 90 degrees.");let i=this._customSensor;if(i.show=this.show,i.showIntersection=this.showIntersection,i.showThroughEllipsoid=this.showThroughEllipsoid,i.portionToDisplay=this.portionToDisplay,i.modelMatrix=this.modelMatrix,i.radius=this.radius,i.lateralSurfaceMaterial=this.lateralSurfaceMaterial,i.showLateralSurfaces=this.showLateralSurfaces,i.ellipsoidHorizonSurfaceMaterial=this.ellipsoidHorizonSurfaceMaterial,i.showEllipsoidHorizonSurfaces=this.showEllipsoidHorizonSurfaces,i.ellipsoidSurfaceMaterial=this.ellipsoidSurfaceMaterial,i.showEllipsoidSurfaces=this.showEllipsoidSurfaces,i.domeSurfaceMaterial=this.domeSurfaceMaterial,i.showDomeSurfaces=this.showDomeSurfaces,i.intersectionColor=this.intersectionColor,i.intersectionWidth=this.intersectionWidth,i.environmentConstraint=this.environmentConstraint,i.environmentOcclusionMaterial=this.environmentOcclusionMaterial,i.showEnvironmentOcclusion=this.showEnvironmentOcclusion,i.showEnvironmentIntersection=this.showEnvironmentIntersection,i.environmentIntersectionColor=this.environmentIntersectionColor,i.environmentIntersectionWidth=this.environmentIntersectionWidth,i.showViewshed=this.showViewshed,i.viewshedVisibleColor=this.viewshedVisibleColor,i.viewshedOccludedColor=this.viewshedOccludedColor,i.viewshedResolution=this.viewshedResolution,i.classificationType=this.classificationType,i.id=this.id,i.debugShowCrossingPoints=this.debugShowCrossingPoints,i.debugShowProxyGeometry=this.debugShowProxyGeometry,i.debugShowBoundingVolume=this.debugShowBoundingVolume,i.debugShowShadowMap=this.debugShowShadowMap,i._useUniformsForNormals=!0,this._xHalfAngle!==this.xHalfAngle||this._yHalfAngle!==this.yHalfAngle){this._xHalfAngle=this.xHalfAngle,this._yHalfAngle=this.yHalfAngle;let t=Math.tan(Math.min(this.xHalfAngle,L.Math.toRadians(89))),s=Math.tan(Math.min(this.yHalfAngle,L.Math.toRadians(89))),a=Math.atan(s/t),l=Math.atan(Math.sqrt(t*t+s*s));i.directions=[{clock:a,cone:l},{clock:L.Math.toRadians(180)-a,cone:l},{clock:L.Math.toRadians(180)+a,cone:l},{clock:-a,cone:l}]}i.update(e)};ti.ellipsoidSurfaceIn3DSupported=sn.ellipsoidSurfaceIn3DSupported;ti.viewshedSupported=sn.ellipsoidSurfaceIn3DSupported;ti.prototype.isDestroyed=function(){return!1};ti.prototype.destroy=function(){return this._customSensor=this._customSensor&&this._customSensor.destroy(),(0,L.destroyObject)(this)};var xo=ti;var La=!0,Fa=T.Color.WHITE,Ba=1,qa=!1,Ua=Number.POSITIVE_INFINITY,Ga=T.SensorVolumePortionToDisplay.COMPLETE,Za=!0,ja=!0,Qa=!0,Ya=!0,$a=!1,Ka=!1,Ja=!1,Xa=T.Color.WHITE,es=5,ns=!1,is=T.Color.LIME.withAlpha(.5),os=T.Color.RED.withAlpha(.5),ts=2048,rs=T.ClassificationType.BOTH;function ri(e,i){if(!(0,T.defined)(e))throw new T.DeveloperError("scene is required.");if(!(0,T.defined)(i))throw new T.DeveloperError("entityCollection is required.");i.collectionChanged.addEventListener(ri.prototype._onCollectionChanged,this),this._scene=e,this._primitives=e.primitives,this._entityCollection=i,this._hash={},this._entitiesToVisualize=new T.AssociativeArray,this._modelMatrixScratch=new T.Matrix4,this._onCollectionChanged(i,i.values,[],[])}ri.prototype.update=function(e){if(!(0,T.defined)(e))throw new T.DeveloperError("time is required.");let i=this._entitiesToVisualize.values,t=this._hash,s=this._primitives;for(let a=0,l=i.length;a<l;a++){let m=i[a],d=m._rectangularSensor,r=t[m.id],f=m.isShowing&&m.isAvailable(e)&&T.Property.getValueOrDefault(d._show,e,!0),c;if(f&&(c=m.computeModelMatrix(e,this._modelMatrixScratch),f=(0,T.defined)(c)),!f){(0,T.defined)(r)&&(r.show=!1);continue}(0,T.defined)(r)||(r=new xo,r.id=m,s.add(r),t[m.id]=r),r.show=!0,r.xHalfAngle=T.Property.getValueOrDefault(d._xHalfAngle,e,T.Math.PI_OVER_TWO),r.yHalfAngle=T.Property.getValueOrDefault(d._yHalfAngle,e,T.Math.PI_OVER_TWO),r.radius=T.Property.getValueOrDefault(d._radius,e,Ua),r.showLateralSurfaces=T.Property.getValueOrDefault(d._showLateralSurfaces,e,Ya),r.lateralSurfaceMaterial=T.MaterialProperty.getValue(e,d._lateralSurfaceMaterial,r.lateralSurfaceMaterial),r.showEllipsoidHorizonSurfaces=T.Property.getValueOrDefault(d._showEllipsoidHorizonSurfaces,e,ja),r.ellipsoidHorizonSurfaceMaterial=T.MaterialProperty.getValue(e,d._ellipsoidHorizonSurfaceMaterial,r.ellipsoidHorizonSurfaceMaterial),r.showDomeSurfaces=T.Property.getValueOrDefault(d._showDomeSurfaces,e,Za),r.domeSurfaceMaterial=T.MaterialProperty.getValue(e,d._domeSurfaceMaterial,r.domeSurfaceMaterial),r.showEllipsoidSurfaces=T.Property.getValueOrDefault(d._showEllipsoidSurfaces,e,Qa),r.ellipsoidSurfaceMaterial=T.MaterialProperty.getValue(e,d._ellipsoidSurfaceMaterial,r.ellipsoidSurfaceMaterial),r.showIntersection=T.Property.getValueOrDefault(d._showIntersection,e,La),r.intersectionColor=T.Property.getValueOrClonedDefault(d._intersectionColor,e,Fa,r.intersectionColor),r.intersectionWidth=T.Property.getValueOrDefault(d._intersectionWidth,e,Ba),r.showThroughEllipsoid=T.Property.getValueOrDefault(d._showThroughEllipsoid,e,qa),r.portionToDisplay=T.Property.getValueOrDefault(d._portionToDisplay,e,Ga),r.environmentConstraint=T.Property.getValueOrDefault(d._environmentConstraint,e,$a),r.showEnvironmentOcclusion=T.Property.getValueOrDefault(d._showEnvironmentOcclusion,e,Ka),r.environmentOcclusionMaterial=T.MaterialProperty.getValue(e,d._environmentOcclusionMaterial,r.environmentOcclusionMaterial),r.showEnvironmentIntersection=T.Property.getValueOrDefault(d._showEnvironmentIntersection,e,Ja),r.environmentIntersectionColor=T.Property.getValueOrDefault(d._environmentIntersectionColor,e,Xa),r.environmentIntersectionWidth=T.Property.getValueOrDefault(d._environmentIntersectionWidth,e,es),r.showViewshed=T.Property.getValueOrDefault(d._showViewshed,e,ns),r.viewshedVisibleColor=T.Property.getValueOrDefault(d._viewshedVisibleColor,e,is),r.viewshedOccludedColor=T.Property.getValueOrDefault(d._viewshedOccludedColor,e,os),r.viewshedResolution=T.Property.getValueOrDefault(d._viewshedResolution,e,ts),r.classificationType=T.Property.getValueOrDefault(d._classificationType,e,rs),r.modelMatrix=T.Matrix4.clone(c,r.modelMatrix)}return!0};ri.prototype.isDestroyed=function(){return!1};ri.prototype.destroy=function(){let e=this._entitiesToVisualize.values,i=this._hash,t=this._primitives;for(let s=e.length-1;s>-1;s--)It(e[s],i,t);return(0,T.destroyObject)(this)};var Zt=new T.Cartesian4;ri.prototype.getBoundingSphere=function(e,i){if(!(0,T.defined)(e))throw new T.DeveloperError("entity is required.");if(!(0,T.defined)(i))throw new T.DeveloperError("result is required.");let t=this._hash[e.id];return(0,T.defined)(t)?(T.Matrix4.getColumn(t.modelMatrix,3,Zt),T.Cartesian3.fromCartesian4(Zt,i.center),i.radius=isFinite(t.radius)?t.radius:1e3,T.BoundingSphereState.DONE):T.BoundingSphereState.FAILED};ri.prototype._onCollectionChanged=function(e,i,t,s){let a,l,m=this._entitiesToVisualize,d=this._hash,r=this._primitives;for(a=i.length-1;a>-1;a--)l=i[a],(0,T.defined)(l._rectangularSensor)&&(0,T.defined)(l._position)&&m.set(l.id,l);for(a=s.length-1;a>-1;a--)l=s[a],(0,T.defined)(l._rectangularSensor)&&(0,T.defined)(l._position)?m.set(l.id,l):(It(l,d,r),m.remove(l.id));for(a=t.length-1;a>-1;a--)l=t[a],It(l,d,r),m.remove(l.id)};function It(e,i,t){let s=e.id,a=i[s];(0,T.defined)(a)&&(t.removeAndDestroy(a),delete i[s])}var Do=ri;var X=Ie(we(),1);function Mn(e,i,t,s,a){X.CzmlDataSource.processPacketData(Boolean,e,"show",i.show,t,s,a),X.CzmlDataSource.processPacketData(Number,e,"radius",i.radius,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showIntersection",i.showIntersection,t,s,a),X.CzmlDataSource.processPacketData(X.Color,e,"intersectionColor",i.intersectionColor,t,s,a),X.CzmlDataSource.processPacketData(Number,e,"intersectionWidth",i.intersectionWidth,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showThroughEllipsoid",i.showThroughEllipsoid,t,s,a),X.CzmlDataSource.processMaterialPacketData(e,"lateralSurfaceMaterial",i.lateralSurfaceMaterial,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showLateralSurfaces",i.showLateralSurfaces,t,s,a),X.CzmlDataSource.processMaterialPacketData(e,"ellipsoidSurfaceMaterial",i.ellipsoidSurfaceMaterial,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showEllipsoidSurfaces",i.showEllipsoidSurfaces,t,s,a),X.CzmlDataSource.processMaterialPacketData(e,"ellipsoidHorizonSurfaceMaterial",i.ellipsoidHorizonSurfaceMaterial,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showEllipsoidHorizonSurfaces",i.showEllipsoidHorizonSurfaces,t,s,a),X.CzmlDataSource.processMaterialPacketData(e,"domeSurfaceMaterial",i.domeSurfaceMaterial,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showDomeSurfaces",i.showDomeSurfaces,t,s,a),X.CzmlDataSource.processPacketData(X.SensorVolumePortionToDisplay,e,"portionToDisplay",i.portionToDisplay,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"environmentConstraint",i.environmentConstraint,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showEnvironmentOcclusion",i.showEnvironmentOcclusion,t,s,a),X.CzmlDataSource.processMaterialPacketData(e,"environmentOcclusionMaterial",i.environmentOcclusionMaterial,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showEnvironmentIntersection",i.showEnvironmentIntersection,t,s,a),X.CzmlDataSource.processPacketData(X.Color,e,"environmentIntersectionColor",i.environmentIntersectionColor,t,s,a),X.CzmlDataSource.processPacketData(Number,e,"environmentIntersectionWidth",i.environmentIntersectionWidth,t,s,a),X.CzmlDataSource.processPacketData(Boolean,e,"showViewshed",i.showViewshed,t,s,a),X.CzmlDataSource.processPacketData(X.Color,e,"viewshedVisibleColor",i.viewshedVisibleColor,t,s,a),X.CzmlDataSource.processPacketData(X.Color,e,"viewshedOccludedColor",i.viewshedOccludedColor,t,s,a),X.CzmlDataSource.processPacketData(Number,e,"viewshedResolution",i.viewshedResolution,t,s,a)}var nn=Ie(we(),1);var jt={iso8601:void 0};function $i(e,i,t,s){let a=i.agi_conicSensor;if(!(0,nn.defined)(a))return;let l,m=a.interval;(0,nn.defined)(m)&&(jt.iso8601=m,l=nn.TimeInterval.fromIso8601(jt));let d=e.conicSensor;(0,nn.defined)(d)||(e.conicSensor=d=new si),Mn(d,a,l,s,t),nn.CzmlDataSource.processPacketData(Number,d,"innerHalfAngle",a.innerHalfAngle,l,s,t),nn.CzmlDataSource.processPacketData(Number,d,"outerHalfAngle",a.outerHalfAngle,l,s,t),nn.CzmlDataSource.processPacketData(Number,d,"minimumClockAngle",a.minimumClockAngle,l,s,t),nn.CzmlDataSource.processPacketData(Number,d,"maximumClockAngle",a.maximumClockAngle,l,s,t)}var fe=Ie(we(),1);var Qt={iso8601:void 0};function as(e){let i=e.length,t=new Array(i/2);for(let s=0;s<i;s+=2){let a=s/2;t[a]=new fe.Spherical(e[s],e[s+1])}return t}function ss(e){let i=e.length,t=new Array(i/3);for(let s=0;s<i;s+=3){let a=s/3;t[a]=new fe.Spherical(e[s],e[s+1],e[s+2])}return t}function Yt(e,i,t,s){(0,fe.defined)(t.unitSpherical)?t.array=as(t.unitSpherical):(0,fe.defined)(t.spherical)?t.array=ss(t.spherical):(0,fe.defined)(t.unitCartesian)?t.array=fe.Cartesian3.unpackArray(t.unitCartesian).map(function(a){let l=fe.Spherical.fromCartesian3(a);return fe.Spherical.normalize(l,l)}):(0,fe.defined)(t.cartesian)&&(t.array=fe.Cartesian3.unpackArray(t.cartesian).map(function(a){return fe.Spherical.fromCartesian3(a)})),(0,fe.defined)(t.array)&&fe.CzmlDataSource.processPacketData(Array,e,i,t,void 0,void 0,s)}function ls(e,i,t,s){if((0,fe.defined)(t))if(Array.isArray(t))for(let a=0,l=t.length;a<l;a++)Yt(e,i,t[a],s);else Yt(e,i,t,s)}function Ki(e,i,t,s){let a=i.agi_customPatternSensor;if(!(0,fe.defined)(a))return;let l,m=a.interval;(0,fe.defined)(m)&&(Qt.iso8601=m,l=fe.TimeInterval.fromIso8601(Qt));let d=e.customPatternSensor;(0,fe.defined)(d)||(e.customPatternSensor=d=new zi),Mn(d,a,l,s,t),ls(d,"directions",a.directions,t)}var yn=Ie(we(),1);var $t={iso8601:void 0};function Ji(e,i,t,s){let a=i.agi_rectangularSensor;if(!(0,yn.defined)(a))return;let l,m=a.interval;(0,yn.defined)(m)&&($t.iso8601=m,l=yn.TimeInterval.fromIso8601($t));let d=e.rectangularSensor;(0,yn.defined)(d)||(e.rectangularSensor=d=new Ti),Mn(d,a,l,s,t),yn.CzmlDataSource.processPacketData(Number,d,"xHalfAngle",a.xHalfAngle,l,s,t),yn.CzmlDataSource.processPacketData(Number,d,"yHalfAngle",a.yHalfAngle,l,s,t)}var Ce=Ie(we(),1);function Ao(){if(Ce.DataSourceDisplay&&Ce.CzmlDataSource&&Ce.Entity&&Ce.Scene)Ce.DataSourceDisplay.registerVisualizer(Po),Ce.DataSourceDisplay.registerVisualizer(Ho),Ce.DataSourceDisplay.registerVisualizer(Do),Ce.CzmlDataSource.registerUpdater(Ji),Ce.CzmlDataSource.registerUpdater($i),Ce.CzmlDataSource.registerUpdater(Ki),Ce.Entity.registerEntityType("conicSensor",si),Ce.Entity.registerEntityType("customPatternSensor",zi),Ce.Entity.registerEntityType("rectangularSensor",Ti),Ce.Scene.defaultLogDepthBuffer=!1;else throw new Ce.DeveloperError("attempted to initialize sensors code before CesiumJS core")}Ao();globalThis.ION_SDK_VERSION="1.128";return ar(cs);})();
//# sourceMappingURL=IonSdkSensors.js.map
