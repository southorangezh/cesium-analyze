# Measure-Supplement 功能文档

## 概述
`Measure-Supplement/` 是3DTiles位置编辑器项目中测量系统的补充组件。该系统提供了距离单位定义、拾取过滤、坡度计算、高度测量、水平测量等高级功能，完善了测量系统的功能体系，为3D场景中的精确测量提供了更全面的工具支持。

## 文件结构
```
Source/Measure/
├── DistanceUnits.js              # 距离单位枚举
├── filterPickForMeasurement.js   # 测量拾取过滤
├── getSlope.js                   # 坡度计算
├── HeightMeasurement.js          # 高度测量
└── HorizontalMeasurement.js      # 水平测量
```

## 核心功能模块

### 1. DistanceUnits.js - 距离单位枚举
**功能**: 定义测量系统中支持的距离单位类型

#### 1.1 主要特性
- **多种距离单位**: 支持米、厘米、千米、英尺、英寸、码、英里等
- **公制单位**: 支持米制距离单位
- **英制单位**: 支持英尺、英寸、码、英里等英制单位
- **专业单位**: 支持美国测量英尺等专业测量单位

#### 1.2 单位定义
```javascript
const DistanceUnits = {
  /**
   * 米 - 国际标准距离单位
   * @type {String}
   * @constant
   */
  METERS: "METERS",

  /**
   * 厘米 - 小距离测量单位
   * @type {String}
   * @constant
   */
  CENTIMETERS: "CENTIMETERS",

  /**
   * 千米 - 大距离测量单位
   * @type {String}
   * @constant
   */
  KILOMETERS: "KILOMETERS",

  /**
   * 英尺 - 英制距离单位
   * @type {String}
   * @constant
   */
  FEET: "FEET",

  /**
   * 美国测量英尺 - 美国专业测量单位
   * @type {String}
   * @constant
   */
  US_SURVEY_FEET: "US_SURVEY_FEET",

  /**
   * 英寸 - 英制小距离单位
   * @type {String}
   * @constant
   */
  INCHES: "INCHES",

  /**
   * 码 - 英制距离单位
   * @type {String}
   * @constant
   */
  YARDS: "YARDS",

  /**
   * 英里 - 英制大距离单位
   * @type {String}
   * @constant
   */
  MILES: "MILES",
};

export default Object.freeze(DistanceUnits);
```

### 2. filterPickForMeasurement.js - 测量拾取过滤
**功能**: 为测量功能提供拾取对象的过滤机制

#### 2.1 主要特性
- **对象过滤**: 过滤可拾取的对象类型
- **3D Tiles支持**: 支持3D Tileset和Cesium3DTileFeature
- **模型支持**: 支持Model和ModelFeature
- **类型检查**: 严格的类型检查机制

#### 2.2 核心函数
```javascript
/**
 * 检查图元是否可拾取
 * @param {Object} primitive 图元对象
 * @returns {Boolean} 是否可拾取
 */
function isPrimitivePickable(primitive) {
  return (
    defined(primitive) &&
    (primitive instanceof Cesium3DTileset || primitive instanceof Model)
  );
}

/**
 * 为测量功能过滤拾取对象
 * @param {Object} object 拾取对象
 * @returns {Boolean} 是否通过过滤
 */
export function filterPickForMeasurement(object) {
  // 直接传递图元
  if (isPrimitivePickable(object)) {
    return true;
  }

  // 传递拾取结果
  const objectPickable =
    defined(object) &&
    (object instanceof Cesium3DTileFeature || object instanceof ModelFeature);

  if (objectPickable) {
    return true;
  }

  // 检查拾取对象的图元是否可拾取
  const primitivePickable =
    defined(object) && isPrimitivePickable(object.primitive);

  return primitivePickable;
}
```

#### 2.3 支持的对象类型
- **Cesium3DTileset**: 3D Tiles数据集
- **Cesium3DTileFeature**: 3D Tiles特征
- **Model**: 3D模型
- **ModelFeature**: 3D模型特征

### 3. getSlope.js - 坡度计算
**功能**: 计算指定点的地面坡度

#### 3.1 主要特性
- **坡度计算**: 计算指定点的地面坡度
- **多点采样**: 使用多点采样计算表面法向量
- **距离阈值**: 设置距离阈值避免远距离计算
- **精度控制**: 控制计算精度和采样范围

#### 3.2 核心函数
```javascript
/**
 * 计算指定窗口坐标点的坡度
 * @param {Scene} scene 场景对象
 * @param {Cartesian2} windowCoordinates 窗口坐标
 * @returns {Number} 坡度值（0到PI/2之间）
 */
function getSlope(scene, windowCoordinates) {
  Check.defined("scene", scene);
  Check.defined("windowCoordinates", windowCoordinates);

  const worldPosition = getSlope._getWorldPosition(
    scene,
    windowCoordinates,
    filterPickForMeasurement,
    positionScratch,
  );
  if (!defined(worldPosition)) {
    return;
  }

  const distanceCameraToPositionThreshold = 10000.0;
  const pixelOffset = 2;
  const offsetDistanceRatioThreshold = 0.05;

  const cameraPosition = scene.camera.position;
  const distanceCameraToPosition = Cartesian3.distance(
    worldPosition,
    cameraPosition,
  );

  if (distanceCameraToPosition > distanceCameraToPositionThreshold) {
    // 如果相机距离点超过10km，不计算坡度
    return;
  }

  // 获取椭球面法向量
  let normal = scene.frameState.mapProjection.ellipsoid.geodeticSurfaceNormal(
    worldPosition,
    normalScratch,
  );
  normal = Cartesian3.negate(normal, normal);

  // 采样四个方向的点
  const sampledWindowCoordinate0 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[0],
  );
  sampledWindowCoordinate0.x -= pixelOffset;
  sampledWindowCoordinate0.y -= pixelOffset;

  const sampledWindowCoordinate1 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[1],
  );
  sampledWindowCoordinate1.x -= pixelOffset;
  sampledWindowCoordinate1.y += pixelOffset;

  const sampledWindowCoordinate2 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[2],
  );
  sampledWindowCoordinate2.x += pixelOffset;
  sampledWindowCoordinate2.y += pixelOffset;

  const sampledWindowCoordinate3 = Cartesian2.clone(
    windowCoordinates,
    scratchCartesian2s[3],
  );
  sampledWindowCoordinate3.x += pixelOffset;
  sampledWindowCoordinate3.y -= pixelOffset;

  // 获取采样点的世界坐标
  const sPosition0 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate0,
    filterPickForMeasurement,
    sc0,
  );
  const sPosition1 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate1,
    filterPickForMeasurement,
    sc1,
  );
  const sPosition2 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate2,
    filterPickForMeasurement,
    sc2,
  );
  const sPosition3 = getSlope._getWorldPosition(
    scene,
    sampledWindowCoordinate3,
    filterPickForMeasurement,
    sc3,
  );

  // 计算表面法向量
  let surfaceNormal = Cartesian3.clone(Cartesian3.ZERO, surfaceNormalScratch);
  let scratchNormal = scratchCartesian3s[4];

  if (defined(v0) && defined(v1)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v0, v1, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }
  if (defined(v1) && defined(v2)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v1, v2, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }
  if (defined(v2) && defined(v3)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v2, v3, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }
  if (defined(v3) && defined(v0)) {
    scratchNormal = Cartesian3.normalize(
      Cartesian3.cross(v3, v0, scratchNormal),
      scratchNormal,
    );
    surfaceNormal = Cartesian3.add(surfaceNormal, scratchNormal, surfaceNormal);
  }

  if (surfaceNormal.equals(Cartesian3.ZERO)) {
    return;
  }

  surfaceNormal = Cartesian3.normalize(surfaceNormal, surfaceNormal);

  return CesiumMath.asinClamped(
    Math.abs(Math.sin(Cartesian3.angleBetween(surfaceNormal, normal))),
  ); // 始终在0到PI/2之间
}
```

#### 3.3 计算原理
- **多点采样**: 在目标点周围采样4个点
- **法向量计算**: 通过叉积计算表面法向量
- **角度计算**: 计算表面法向量与椭球面法向量的夹角
- **坡度值**: 返回0到PI/2之间的坡度值

### 4. HeightMeasurement.js - 高度测量
**功能**: 测量指定点到地面的高度

#### 4.1 主要特性
- **高度测量**: 测量指定点到地面的高度
- **地形贴合**: 自动贴合到地形表面
- **单点测量**: 支持单点高度测量
- **实时显示**: 实时显示高度值和测量线

#### 4.2 构造函数
```javascript
function HeightMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  const positions = [new Cartesian3(), new Cartesian3()];
  const pointCollection = this._pointCollection;

  this._startPoint = pointCollection.add(MeasurementSettings.getPointOptions());
  this._endPoint = pointCollection.add(MeasurementSettings.getPointOptions());

  this._polyline = this._primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: this._scene.frameState.mapProjection.ellipsoid,
        positions: positions,
      }),
    ),
  );

  this._label = this._labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.TOP,
      pixelOffset: new Cartesian2(10, 10),
    }),
  );

  this._positions = positions;
  this._distance = 0;
}
```

#### 4.3 核心属性
```javascript
Object.defineProperties(HeightMeasurement.prototype, {
  /**
   * 获取距离值（米）
   * @type {Number}
   * @readonly
   */
  distance: {
    get: function () {
      return this._distance;
    },
  },

  /**
   * 获取类型
   * @type {String}
   * @readonly
   */
  type: {
    value: "Height from terrain",
  },

  /**
   * 获取操作说明
   * @type {String[]}
   * @readonly
   */
  instructions: {
    value: [
      "Click on the point cloud to get a distance from that point to terrain",
    ],
  },

  /**
   * 获取ID
   * @type {String}
   * @readonly
   */
  id: {
    value: "heightMeasurement",
  },
});
```

#### 4.4 核心方法
```javascript
/**
 * 处理点击事件
 * @param {Cartesian2} clickPosition 点击位置
 */
HeightMeasurement.prototype.handleClick = function (clickPosition) {
  const scene = this._scene;
  this.reset();

  const positions = this._positions;

  const pos0 = HeightMeasurement._getWorldPosition(
    scene,
    clickPosition,
    filterPickForMeasurement,
    positions[0],
  );
  if (!defined(pos0)) {
    return;
  }

  const globe = scene.globe;
  const ellipsoid = scene.frameState.mapProjection.ellipsoid;

  const carto = ellipsoid.cartesianToCartographic(pos0, scratchCarto);
  if (defined(globe)) {
    carto.height = globe.getHeight(carto) ?? 0;
  } else {
    carto.height = 0;
  }
  const pos1 = ellipsoid.cartographicToCartesian(carto, positions[1]);

  const vec = Cartesian3.subtract(pos1, pos0, scratch);
  const distance = Cartesian3.magnitude(vec);

  const label = this._label;
  label.position = pos0;
  label.show = true;

  this._polyline.positions = positions;
  this._polyline.show = true;
  this._startPoint.position = pos0;
  this._startPoint.show = true;
  this._endPoint.position = pos1;
  this._endPoint.show = true;

  this._distance = distance;
  this._refreshLabels();
};
```

### 5. HorizontalMeasurement.js - 水平测量
**功能**: 测量两点间的水平距离

#### 5.1 主要特性
- **水平测量**: 测量两点间的水平距离
- **固定高度**: 在固定高度平面上测量
- **方向约束**: 支持Shift键约束方向
- **交互式绘制**: 支持交互式水平线绘制

#### 5.2 构造函数
```javascript
function HorizontalMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  this._drawing = new HorizontalMeasurementDrawing(options);
}
```

#### 5.3 核心属性
```javascript
Object.defineProperties(HorizontalMeasurement.prototype, {
  /**
   * 获取距离值（米）
   * @type {Number}
   * @readonly
   */
  distance: {
    get: function () {
      return this._drawing.distance;
    },
  },

  /**
   * 获取类型
   * @type {String}
   * @readonly
   */
  type: {
    value: "Horizontal distance",
  },

  /**
   * 获取操作说明
   * @type {String[]}
   * @readonly
   */
  instructions: {
    value: [
      "Click on the point cloud or the globe to set the start point",
      "Move the mouse to drag the line",
      "Press this shift key to clamp the direction of the line",
      "Click again to set the end point",
      "To make a new measurement, click to clear the previous measurement",
    ],
  },

  /**
   * 获取ID
   * @type {String}
   * @readonly
   */
  id: {
    value: "horizontalMeasurement",
  },
});
```

#### 5.4 核心方法
```javascript
/**
 * 处理点击事件
 * @param {Cartesian2} clickPosition 点击位置
 */
HorizontalMeasurement.prototype.handleClick = function (clickPosition) {
  Check.defined("clickPosition", clickPosition);
  this._drawing.handleClick(clickPosition);
};

/**
 * 处理鼠标移动事件
 * @param {Cartesian2} mousePosition 鼠标位置
 * @param {Boolean} shift Shift键状态
 */
HorizontalMeasurement.prototype.handleMouseMove = function (
  mousePosition,
  shift,
) {
  Check.defined("mousePosition", mousePosition);
  Check.defined("shift", shift);
  this._drawing.handleMouseMove(mousePosition, shift);
};

/**
 * 处理双击事件
 */
HorizontalMeasurement.prototype.handleDoubleClick = function () {
  this._drawing.handleDoubleClick();
};
```

## 技术特性

### 1. 单位系统
- **距离单位**: 支持米、厘米、千米、英尺、英寸、码、英里等
- **专业单位**: 支持美国测量英尺等专业单位
- **标准化**: 使用冻结对象确保类型安全
- **国际化**: 支持不同地区的单位表示

### 2. 拾取系统
- **对象过滤**: 过滤可拾取的对象类型
- **3D Tiles支持**: 支持3D Tileset和特征
- **模型支持**: 支持3D模型和特征
- **类型检查**: 严格的类型检查机制

### 3. 坡度计算
- **多点采样**: 使用多点采样计算表面法向量
- **距离阈值**: 设置距离阈值避免远距离计算
- **精度控制**: 控制计算精度和采样范围
- **角度计算**: 计算表面法向量与椭球面法向量的夹角

### 4. 高度测量
- **地形贴合**: 自动贴合到地形表面
- **单点测量**: 支持单点高度测量
- **实时显示**: 实时显示高度值和测量线
- **精度计算**: 精确计算点到地面的距离

### 5. 水平测量
- **固定高度**: 在固定高度平面上测量
- **方向约束**: 支持Shift键约束方向
- **交互式绘制**: 支持交互式水平线绘制
- **实时预览**: 实时显示水平距离

## 使用场景

### 1. 工程测量
- 建筑高度测量
- 道路水平测量
- 桥梁坡度测量
- 管道高度测量

### 2. 地理测量
- 地形坡度分析
- 水平距离测量
- 高度差测量
- 地形特征分析

### 3. 科学计算
- 地形坡度计算
- 高度差分析
- 水平距离测量
- 地形特征研究

### 4. 教育应用
- 地形测量教学
- 坡度计算教学
- 高度测量教学
- 实践教学

## 配置选项

### 1. 距离单位配置
```javascript
const distanceUnits = {
  // 公制单位
  METERS: "METERS",
  CENTIMETERS: "CENTIMETERS",
  KILOMETERS: "KILOMETERS",
  
  // 英制单位
  FEET: "FEET",
  US_SURVEY_FEET: "US_SURVEY_FEET",
  INCHES: "INCHES",
  YARDS: "YARDS",
  MILES: "MILES"
};
```

### 2. 拾取过滤配置
```javascript
const pickFilter = {
  // 支持的对象类型
  supportedTypes: [
    "Cesium3DTileset",
    "Cesium3DTileFeature",
    "Model",
    "ModelFeature"
  ],
  
  // 过滤规则
  filterRules: {
    primitive: "isPrimitivePickable",
    feature: "isFeaturePickable",
    result: "isResultPickable"
  }
};
```

### 3. 坡度计算配置
```javascript
const slopeConfig = {
  // 距离阈值
  distanceThreshold: 10000.0,
  
  // 像素偏移
  pixelOffset: 2,
  
  // 距离比例阈值
  offsetDistanceRatioThreshold: 0.05,
  
  // 采样点数量
  samplePoints: 4
};
```

### 4. 高度测量配置
```javascript
const heightOptions = {
  scene: scene,
  primitives: primitives,
  labels: labels,
  points: points,
  units: {
    distanceUnits: DistanceUnits.METERS
  },
  locale: "zh-CN"
};
```

### 5. 水平测量配置
```javascript
const horizontalOptions = {
  scene: scene,
  primitives: primitives,
  labels: labels,
  points: points,
  units: {
    distanceUnits: DistanceUnits.METERS
  },
  locale: "zh-CN"
};
```

## 性能优化

### 1. 计算优化
- **距离阈值**: 设置距离阈值避免远距离计算
- **采样优化**: 优化采样点数量和位置
- **缓存机制**: 缓存计算结果
- **内存管理**: 及时释放不需要的对象

### 2. 拾取优化
- **类型检查**: 高效的类型检查
- **对象过滤**: 快速的对象过滤
- **内存复用**: 复用临时对象
- **异步处理**: 异步处理复杂计算

### 3. 渲染优化
- **批量渲染**: 批量处理测量对象渲染
- **LOD系统**: 根据距离调整细节级别
- **视锥剔除**: 剔除不可见的测量对象
- **标签优化**: 优化标签的渲染和更新

## 扩展功能

### 1. 自定义单位
- 支持自定义距离单位
- 可扩展的单位转换
- 插件式单位系统
- 自定义单位显示

### 2. 高级功能
- 测量结果的批量操作
- 测量配置的模板系统
- 测量数据的导入导出
- 测量结果的统计分析

### 3. 集成功能
- 外部数据源的集成
- 测量数据的同步
- 测量结果的验证
- 测量工具的扩展

## 依赖关系

### 1. Cesium Engine
- `Cartesian2`: 2D向量
- `Cartesian3`: 3D向量
- `Cartographic`: 地理坐标
- `Cesium3DTileset`: 3D Tiles数据集
- `Cesium3DTileFeature`: 3D Tiles特征
- `Model`: 3D模型
- `ModelFeature`: 3D模型特征
- `HorizontalOrigin`: 水平原点
- `VerticalOrigin`: 垂直原点
- `destroyObject`: 对象销毁
- `defined`: 定义检查
- `Check`: 参数检查
- `Frozen`: 冻结对象

### 2. 测量系统
- `Measurement`: 测量基类
- `MeasurementSettings`: 测量设置
- `MeasureUnits`: 测量单位
- `HorizontalMeasurementDrawing`: 水平测量绘制

### 3. 绘制系统
- `PolylinePrimitive`: 折线图元
- `getWorldPosition`: 获取世界坐标

## 维护说明

### 1. 版本兼容性
- 确保与Cesium版本兼容
- 定期更新依赖库
- 测试新版本兼容性
- 维护API稳定性

### 2. 性能监控
- 监控测量计算性能
- 检查内存使用
- 优化渲染效率
- 分析瓶颈问题

### 3. 错误处理
- 完善的错误检查机制
- 优雅的错误恢复
- 详细的错误日志
- 用户友好的错误提示

## 总结

`Measure-Supplement/` 提供了测量系统的补充功能，包括距离单位定义、拾取过滤、坡度计算、高度测量、水平测量等。通过强大的单位系统、拾取系统、计算算法和测量功能，该系统完善了测量系统的功能体系，为工程测量、地理测量、科学计算、教育应用等应用领域提供了更全面的技术支撑。该系统具有良好的扩展性和维护性，是3DTiles位置编辑器项目中的重要组成部分。
