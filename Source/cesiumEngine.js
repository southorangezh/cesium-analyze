import CesiumModule from "../ThirdParty/cesium/Cesium.js";

const Cesium = typeof window !== "undefined" && window.Cesium
  ? window.Cesium
  : CesiumModule;

if (!Cesium) {
  throw new Error("Cesium library failed to load from ThirdParty/cesium/Cesium.js");
}

if (typeof window !== "undefined" && !window.Cesium) {
  window.Cesium = Cesium;
}

const FrozenNamespace = Cesium.Frozen ?? { EMPTY_OBJECT: Object.freeze({}) };

export const ArcType = Cesium.ArcType;
export const BoundingSphere = Cesium.BoundingSphere;
export const Cartesian2 = Cesium.Cartesian2;
export const Cartesian3 = Cesium.Cartesian3;
export const Check = Cesium.Check;
export const Color = Cesium.Color;
export const ColorGeometryInstanceAttribute = Cesium.ColorGeometryInstanceAttribute;
export const defined = Cesium.defined;
export const destroyObject = Cesium.destroyObject;
export const DeveloperError = Cesium.DeveloperError;
export const Frozen = FrozenNamespace;
export const GeometryInstance = Cesium.GeometryInstance;
export const HeadingPitchRoll = Cesium.HeadingPitchRoll;
export const IntersectionTests = Cesium.IntersectionTests;
export const Math = Cesium.Math;
export const Matrix3 = Cesium.Matrix3;
export const Matrix4 = Cesium.Matrix4;
export const Material = Cesium.Material;
export const Plane = Cesium.Plane;
export const PointPrimitiveCollection = Cesium.PointPrimitiveCollection;
export const PolylineGeometry = Cesium.PolylineGeometry;
export const PolylineMaterialAppearance = Cesium.PolylineMaterialAppearance;
export const PolylineColorAppearance = Cesium.PolylineColorAppearance;
export const Primitive = Cesium.Primitive;
export const Quaternion = Cesium.Quaternion;
export const Ray = Cesium.Ray;
export const ScreenSpaceEventHandler = Cesium.ScreenSpaceEventHandler;
export const ScreenSpaceEventType = Cesium.ScreenSpaceEventType;
export const SceneTransforms = Cesium.SceneTransforms;
export const Transforms = Cesium.Transforms;
export const getElement = Cesium.getElement;
export const Viewer = Cesium.Viewer;
export const Ion = Cesium.Ion;
export const IonResource = Cesium.IonResource;
export const Cesium3DTileset = Cesium.Cesium3DTileset;

export default Object.assign({ Frozen: FrozenNamespace }, Cesium);
