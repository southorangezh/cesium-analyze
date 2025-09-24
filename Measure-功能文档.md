# Measure 功能文档

## 概述
`Measure/` 文件夹是3DTiles位置编辑器项目中测量系统的核心组件。该系统提供了完整的3D空间测量功能，包括面积测量、距离测量、角度测量等，支持多种单位制、国际化、交互式绘制、实时计算等高级特性，为3D场景中的精确测量提供了强大的工具集。

## 文件结构
```
Source/Measure/
├── AngleUnits.js              # 角度单位枚举
├── AreaMeasurement.js         # 面积测量主类
├── AreaMeasurementDrawing.js  # 面积测量绘制实现
├── AreaUnits.js               # 面积单位枚举
└── DistanceMeasurement.js     # 距离测量实现
```

## 核心功能模块

### 1. AngleUnits.js - 角度单位枚举
**功能**: 定义测量系统中支持的角度单位类型

#### 1.1 主要特性
- **多种角度单位**: 支持度数、弧度、度分秒、梯度、比率等
- **标准化定义**: 提供标准化的角度单位常量
- **类型安全**: 使用冻结对象确保类型安全
- **国际化支持**: 支持不同地区的角度表示方式

#### 1.2 单位定义
```javascript
const AngleUnits = {
  /**
   * 度数 - 最常用的角度单位
   * @type {String}
   * @constant
   */
  DEGREES: "DEGREES",

  /**
   * 弧度 - 数学计算中的标准单位
   * @type {String}
   * @constant
   */
  RADIANS: "RADIANS",

  /**
   * 度分秒 - 传统测量中的精确表示
   * @type {String}
   * @constant
   */
  DEGREES_MINUTES_SECONDS: "DEGREES_MINUTES_SECONDS",

  /**
   * 梯度 - 欧洲常用的角度单位
   * @type {String}
   * @constant
   */
  GRADE: "GRADE",

  /**
   * 比率 - 斜率表示方式
   * @type {String}
   * @constant
   */
  RATIO: "RATIO",
};

export default Object.freeze(AngleUnits);
```

### 2. AreaUnits.js - 面积单位枚举
**功能**: 定义测量系统中支持的面积单位类型

#### 2.1 主要特性
- **多种面积单位**: 支持平方米、平方厘米、平方千米、平方英尺等
- **公制单位**: 支持米制面积单位
- **英制单位**: 支持英尺、英寸、码、英里等英制单位
- **专业单位**: 支持英亩、公顷等专业测量单位

#### 2.2 单位定义
```javascript
const AreaUnits = {
  /**
   * 平方米 - 国际标准面积单位
   * @type {String}
   * @constant
   */
  SQUARE_METERS: "SQUARE_METERS",

  /**
   * 平方厘米 - 小面积测量单位
   * @type {String}
   * @constant
   */
  SQUARE_CENTIMETERS: "SQUARE_CENTIMETERS",

  /**
   * 平方千米 - 大面积测量单位
   * @type {String}
   * @constant
   */
  SQUARE_KILOMETERS: "SQUARE_KILOMETERS",

  /**
   * 平方英尺 - 英制面积单位
   * @type {String}
   * @constant
   */
  SQUARE_FEET: "SQUARE_FEET",

  /**
   * 平方英寸 - 英制小面积单位
   * @type {String}
   * @constant
   */
  SQUARE_INCHES: "SQUARE_INCHES",

  /**
   * 平方码 - 英制面积单位
   * @type {String}
   * @constant
   */
  SQUARE_YARDS: "SQUARE_YARDS",

  /**
   * 平方英里 - 英制大面积单位
   * @type {String}
   * @constant
   */
  SQUARE_MILES: "SQUARE_MILES",

  /**
   * 英亩 - 土地测量单位
   * @type {String}
   * @constant
   */
  ACRES: "ACRES",

  /**
   * 公顷 - 公制土地测量单位
   * @type {String}
   * @constant
   */
  HECTARES: "HECTARES",
};

export default Object.freeze(AreaUnits);
```

### 3. AreaMeasurement.js - 面积测量主类
**功能**: 提供面积测量的主要接口和功能

#### 3.1 主要特性
- **多边形面积测量**: 支持任意多边形的面积计算
- **交互式绘制**: 支持鼠标交互式多边形绘制
- **实时计算**: 实时计算和显示面积值
- **单位转换**: 支持多种面积单位的转换和显示
- **国际化**: 支持多语言和地区格式

#### 3.2 构造函数
```javascript
function AreaMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  this._drawing = new AreaMeasurementDrawing(options);
}
```

#### 3.3 核心属性
```javascript
Object.defineProperties(AreaMeasurement.prototype, {
  /**
   * 获取面积值（平方米）
   * @type {Number}
   * @readonly
   */
  area: {
    get: function () {
      return this._drawing.area;
    },
  },

  /**
   * 获取图标
   * @type {String}
   * @readonly
   */
  icon: {
    value: getIcon(15),
  },

  /**
   * 获取缩略图
   * @type {String}
   * @readonly
   */
  thumbnail: {
    value: getIcon(25),
  },

  /**
   * 获取类型
   * @type {String}
   * @readonly
   */
  type: {
    value: "Area",
  },

  /**
   * 获取操作说明
   * @type {String[]}
   * @readonly
   */
  instructions: {
    value: [
      "Click to start drawing a polygon",
      "Keep clicking to add more points",
      "Double click to finish drawing",
    ],
  },

  /**
   * 获取ID
   * @type {String}
   * @readonly
   */
  id: {
    value: "areaMeasurement",
  },
});
```

#### 3.4 核心方法
```javascript
/**
 * 处理点击事件
 * @param {Cartesian2} clickPosition 点击位置
 */
AreaMeasurement.prototype.handleClick = function (clickPosition) {
  this._drawing.handleClick(clickPosition);
};

/**
 * 处理鼠标移动事件
 * @param {Cartesian2} mousePosition 鼠标位置
 */
AreaMeasurement.prototype.handleMouseMove = function (mousePosition) {
  this._drawing.handleMouseMove(mousePosition);
};

/**
 * 处理双击事件
 */
AreaMeasurement.prototype.handleDoubleClick = function () {
  this._drawing.handleDoubleClick();
};

/**
 * 重置测量
 */
AreaMeasurement.prototype.reset = function () {
  this._drawing.reset();
};
```

### 4. AreaMeasurementDrawing.js - 面积测量绘制实现
**功能**: 实现面积测量的具体绘制和计算逻辑

#### 4.1 主要特性
- **多边形绘制**: 继承PolygonDrawing的多边形绘制功能
- **面积计算**: 使用三角剖分算法计算多边形面积
- **实时更新**: 实时更新面积标签和显示
- **标签管理**: 自动管理面积标签的位置和内容

#### 4.2 构造函数
```javascript
function AreaMeasurementDrawing(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Check.defined("options.scene", options.scene);
  Check.defined("options.primitives", options.primitives);
  Check.defined("options.units", options.units);
  Check.defined("options.points", options.points);
  Check.defined("options.labels", options.labels);

  options.polylineOptions = MeasurementSettings.getPolylineOptions({
    ellipsoid: options.ellipsoid,
  });
  options.pointOptions = MeasurementSettings.getPointOptions();
  options.polygonOptions = {
    color: MeasurementSettings.color.withAlpha(0.8),
  };
  PolygonDrawing.call(this, options);

  const labels = options.labels;
  this._labelCollection = labels;
  this._label = labels.add(MeasurementSettings.getLabelOptions());
  this._selectedUnits = options.units;
  this._selectedLocale = options.locale;
  this._area = 0;

  const that = this;
  this._removeEvent = this._scene.preRender.addEventListener(function () {
    that.updateLabel();
  });
}
```

#### 4.3 核心方法

##### 面积计算方法
```javascript
/**
 * 计算多边形面积
 * @param {Cartesian3[]} positions 位置数组
 * @private
 */
AreaMeasurementDrawing.prototype.updateArea = function (positions) {
  const geometry = CoplanarPolygonGeometry.createGeometry(
    CoplanarPolygonGeometry.fromPositions({
      positions: positions,
      vertexFormat: VertexFormat.POSITION_ONLY,
    }),
  );
  if (!defined(geometry)) {
    this._label.text = "";
    return;
  }

  const flatPositions = geometry.attributes.position.values;
  const indices = geometry.indices;

  let area = 0;
  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i];
    const i1 = indices[i + 1];
    const i2 = indices[i + 2];

    const p0 = Cartesian3.unpack(flatPositions, i0 * 3, p0Scratch);
    const p1 = Cartesian3.unpack(flatPositions, i1 * 3, p1Scratch);
    const p2 = Cartesian3.unpack(flatPositions, i2 * 3, p2Scratch);
    area += triangleArea(p0, p1, p2);
  }

  this._area = area;
  this._refreshLabels();
};
```

##### 三角形面积计算
```javascript
function triangleArea(p0, p1, p2) {
  const v0 = Cartesian3.subtract(p0, p1, v0Scratch);
  const v1 = Cartesian3.subtract(p2, p1, v1Scratch);
  const cross = Cartesian3.cross(v0, v1, v0);
  return Cartesian3.magnitude(cross) * 0.5;
}
```

##### 标签更新方法
```javascript
/**
 * 刷新标签文本
 * @private
 */
AreaMeasurementDrawing.prototype._refreshLabels = function () {
  const label = this._label;
  label.text = MeasureUnits.areaToString(
    this._area,
    this._selectedUnits.areaUnits,
    this._selectedLocale,
  );
};

/**
 * 更新标签位置
 * @private
 */
AreaMeasurementDrawing.prototype.updateLabel = function () {
  const positions = this._positions;
  if (positions.length < 2) {
    return;
  }
  const scene = this._scene;
  let top = positions[0];
  const pos2d = SceneTransforms.worldToWindowCoordinates(
    scene,
    top,
    cart2Scratch1,
  );
  let lastY = defined(pos2d) ? pos2d.y : Number.POSITIVE_INFINITY;
  for (let i = 1; i < positions.length; i++) {
    const nextScreenPos = SceneTransforms.worldToWindowCoordinates(
      scene,
      positions[i],
      cart2Scratch2,
    );
    if (!defined(nextScreenPos)) {
      continue;
    }
    if (nextScreenPos.y < lastY) {
      lastY = nextScreenPos.y;
      top = positions[i];
    }
  }
  this._label.position = top;
};
```

### 5. DistanceMeasurement.js - 距离测量实现
**功能**: 提供两点间距离测量的完整功能

#### 5.1 主要特性
- **两点距离测量**: 支持任意两点间的距离测量
- **分量显示**: 支持显示水平和垂直分量
- **角度计算**: 计算距离线与水平/垂直线的夹角
- **实时更新**: 实时更新距离值和标签
- **交互式绘制**: 支持鼠标交互式距离测量

#### 5.2 构造函数
```javascript
function DistanceMeasurement(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  Measurement.call(this, options);

  const that = this;
  const pointCollection = this._pointCollection;
  const labelCollection = this._labelCollection;
  const primitives = this._primitives;
  const scene = this._scene;

  const positions = [new Cartesian3(), new Cartesian3()];
  const xyPolylinePositions = [
    new Cartesian3(),
    new Cartesian3(),
    new Cartesian3(),
  ];
  const xyBoxPositions = [new Cartesian3(), new Cartesian3(), new Cartesian3()];

  const yPixelOffset = new Cartesian2(-9, 0);
  const xPixelOffset = new Cartesian2(9, 0);

  const ellipsoid = scene.frameState.mapProjection.ellipsoid;

  this._startPoint = pointCollection.add(MeasurementSettings.getPointOptions());
  this._endPoint = pointCollection.add(MeasurementSettings.getPointOptions());

  this._positions = positions;
  this._polyline = primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: ellipsoid,
        width: 3,
        show: false,
        positions: positions,
      }),
    ),
  );

  this._xyPolylinePositions = xyPolylinePositions;
  this._xyPolyline = primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: ellipsoid,
        width: 2,
        positions: xyPolylinePositions,
        materialType: Material.PolylineDashType,
      }),
    ),
  );

  this._xyBoxPositions = xyBoxPositions;
  this._xyBox = primitives.add(
    new PolylinePrimitive(
      MeasurementSettings.getPolylineOptions({
        ellipsoid: ellipsoid,
        width: 1,
        positions: xyBoxPositions,
      }),
    ),
  );

  this._label = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.TOP,
      pixelOffset: new Cartesian2(10, 10),
    }),
  );

  this._xPixelOffset = xPixelOffset;
  this._xLabel = labelCollection.add(MeasurementSettings.getLabelOptions());
  this._xAngleLabel = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.MIDDLE,
      pixelOffset: xPixelOffset,
    }),
  );

  this._yPixelOffset = yPixelOffset;
  this._yLabel = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      horizontalOrigin: HorizontalOrigin.RIGHT,
      pixelOffset: yPixelOffset,
    }),
  );
  this._yAngleLabel = labelCollection.add(
    MeasurementSettings.getLabelOptions({
      verticalOrigin: VerticalOrigin.TOP,
      pixelOffset: new Cartesian2(0, 9),
    }),
  );

  this._distance = 0;
  this._xDistance = 0;
  this._yDistance = 0;
  this._xAngle = 0;
  this._yAngle = 0;

  this._mode = Mode.BeforeDraw;
  this._showComponentLines = options.showComponentLines ?? false;

  this._removeEvent = scene.preRender.addEventListener(function () {
    that._updateLabelPosition();
  });
}
```

#### 5.3 核心属性
```javascript
Object.defineProperties(DistanceMeasurement.prototype, {
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
   * 获取水平距离分量（米）
   * @type {Number}
   * @readonly
   */
  horizontalDistance: {
    get: function () {
      return this._xDistance;
    },
  },

  /**
   * 获取垂直距离分量（米）
   * @type {Number}
   * @readonly
   */
  verticalDistance: {
    get: function () {
      return this._yDistance;
    },
  },

  /**
   * 获取与水平线的夹角（弧度）
   * @type {Number}
   * @readonly
   */
  angleFromHorizontal: {
    get: function () {
      return this._xAngle;
    },
  },

  /**
   * 获取与垂直线的夹角（弧度）
   * @type {Number}
   * @readonly
   */
  angleFromVertical: {
    get: function () {
      return this._yAngle;
    },
  },

  /**
   * 获取和设置是否显示分量线
   * @type {Boolean}
   * @default false
   */
  showComponentLines: {
    get: function () {
      return this._showComponentLines;
    },
    set: function (value) {
      this._showComponentLines = value;
      if (this._mode !== Mode.BeforeDraw) {
        this._updateComponents();
      }
    },
  },
});
```

#### 5.4 核心方法

##### 点击处理方法
```javascript
/**
 * 处理点击事件
 * @param {Cartesian2} clickPosition 点击位置
 */
DistanceMeasurement.prototype.handleClick = function (clickPosition) {
  Check.defined("clickPosition", clickPosition);

  const scene = this._scene;
  if (this._mode === Mode.AfterDraw) {
    this.reset();
  }
  const mode = this._mode;

  const positions = this._positions;
  if (mode === Mode.BeforeDraw) {
    const pos = DistanceMeasurement._getWorldPosition(
      scene,
      clickPosition,
      filterPickForMeasurement,
      positions[0],
    );
    if (!defined(pos)) {
      return;
    }
    this._polyline.show = true;
    positions[0] = pos.clone(positions[0]);
    positions[1] = pos.clone(positions[1]);
    this._startPoint.position = pos;
    this._startPoint.show = true;
    this._mode = Mode.Drawing;
    this._polyline.positions = positions;
  } else if (mode === Mode.Drawing) {
    this._endPoint.position = positions[1];
    this._endPoint.show = true;
    this._polyline.positions = positions;
    this._mode = Mode.AfterDraw;
  }
};
```

##### 鼠标移动处理方法
```javascript
/**
 * 处理鼠标移动事件
 * @param {Cartesian2} mousePosition 鼠标位置
 */
DistanceMeasurement.prototype.handleMouseMove = function (mousePosition) {
  Check.defined("mousePosition", mousePosition);

  if (this._mode !== Mode.Drawing) {
    return;
  }

  const scene = this._scene;
  const positions = this._positions;
  const pos = DistanceMeasurement._getWorldPosition(
    scene,
    mousePosition,
    filterPickForMeasurement,
    cart3Scratch1,
  );

  if (!defined(pos)) {
    return;
  }

  const pos0 = positions[0];
  const pos1 = Cartesian3.clone(pos, positions[1]);

  const vec = Cartesian3.subtract(pos1, pos0, cart3Scratch1);

  this._distance = Cartesian3.magnitude(vec);
  this._polyline.positions = positions;

  const label = this._label;
  label.position = Cartesian3.midpoint(pos0, pos1, cart3Scratch1);
  label.show = true;

  this._refreshDistanceText();
  this._updateComponents();
};
```

##### 分量更新方法
```javascript
/**
 * 更新分量显示
 * @private
 */
DistanceMeasurement.prototype._updateComponents = function () {
  const show = this._showComponentLines;
  const xLabel = this._xLabel;
  const yLabel = this._yLabel;
  const xAngleLabel = this._xAngleLabel;
  const yAngleLabel = this._yAngleLabel;
  const xyPolyline = this._xyPolyline;
  const xyBox = this._xyBox;

  // 先设置为false，以防无法计算值
  xLabel.show = false;
  yLabel.show = false;
  xAngleLabel.show = false;
  yAngleLabel.show = false;
  xyPolyline.show = false;
  xyBox.show = false;

  if (!show) {
    return;
  }

  const ellipsoid = this._scene.frameState.mapProjection.ellipsoid;

  const positions = this._positions;
  const p0 = positions[0];
  const p1 = positions[1];
  const height0 = ellipsoid.cartesianToCartographic(p0, scratchCarto).height;
  const height1 = ellipsoid.cartesianToCartographic(p1, scratchCarto).height;
  let bottomPoint;
  let topPoint;
  let topHeight;
  let bottomHeight;
  if (height0 < height1) {
    bottomPoint = p0;
    topPoint = p1;
    topHeight = height1;
    bottomHeight = height0;
  } else {
    bottomPoint = p1;
    topPoint = p0;
    topHeight = height0;
    bottomHeight = height1;
  }

  const xyPositions = this._xyPolylinePositions;
  xyPositions[0] = Cartesian3.clone(bottomPoint, xyPositions[0]);
  xyPositions[2] = Cartesian3.clone(topPoint, xyPositions[2]);
  let normal = ellipsoid.geodeticSurfaceNormal(bottomPoint, cart3Scratch1);
  normal = Cartesian3.multiplyByScalar(
    normal,
    topHeight - bottomHeight,
    normal,
  );
  const corner = Cartesian3.add(bottomPoint, normal, xyPositions[1]);

  xyPolyline.positions = xyPositions;

  if (
    Cartesian3.equalsEpsilon(corner, topPoint, CesiumMath.EPSILON10) ||
    Cartesian3.equalsEpsilon(corner, bottomPoint, CesiumMath.EPSILON10)
  ) {
    return;
  }

  yLabel.show = true;
  xLabel.show = true;
  yAngleLabel.show = true;
  xAngleLabel.show = true;
  xyPolyline.show = true;
  xyBox.show = true;

  let v1 = Cartesian3.subtract(topPoint, corner, cart3Scratch1);
  let v2 = Cartesian3.subtract(bottomPoint, corner, cart3Scratch2);
  const mag = Math.min(Cartesian3.magnitude(v1), Cartesian3.magnitude(v2));
  const scale = mag > 15.0 ? mag * 0.15 : mag * 0.25;
  v1 = Cartesian3.normalize(v1, v1);
  v2 = Cartesian3.normalize(v2, v2);
  v1 = Cartesian3.multiplyByScalar(v1, scale, v1);
  v2 = Cartesian3.multiplyByScalar(v2, scale, v2);

  const boxPos = this._xyBoxPositions;
  boxPos[0] = Cartesian3.add(corner, v1, boxPos[0]);
  boxPos[1] = Cartesian3.add(boxPos[0], v2, boxPos[1]);
  boxPos[2] = Cartesian3.add(corner, v2, boxPos[2]);
  xyBox.positions = boxPos;

  xLabel.position = Cartesian3.midpoint(corner, topPoint, cart3Scratch1);
  yLabel.position = Cartesian3.midpoint(bottomPoint, corner, cart3Scratch1);
  xAngleLabel.position = Cartesian3.clone(topPoint, cart3Scratch1);
  yAngleLabel.position = Cartesian3.clone(bottomPoint, cart3Scratch1);

  const vx = Cartesian3.subtract(corner, topPoint, cart3Scratch2);
  const vy = Cartesian3.subtract(corner, bottomPoint, cart3Scratch1);
  let v = Cartesian3.subtract(topPoint, bottomPoint, cart3Scratch3);

  const yAngle = Cartesian3.angleBetween(vy, v);
  v = Cartesian3.negate(v, v);
  const xAngle = Cartesian3.angleBetween(vx, v);

  const xDistance = Cartesian3.magnitude(vx);
  const yDistance = Cartesian3.magnitude(vy);

  this._xDistance = xDistance;
  this._yDistance = yDistance;
  this._xAngle = xAngle;
  this._yAngle = yAngle;

  this._refreshComponentsText();
};
```

## 技术特性

### 1. 测量系统
- **多种测量类型**: 支持面积、距离、角度等多种测量
- **实时计算**: 实时计算和显示测量结果
- **精确算法**: 使用高精度的几何计算算法
- **单位转换**: 支持多种单位制的转换和显示

### 2. 交互系统
- **鼠标交互**: 支持鼠标点击、移动、双击
- **实时预览**: 实时显示测量过程和结果
- **状态管理**: 完整的测量状态管理
- **事件处理**: 完善的事件处理机制

### 3. 渲染系统
- **可视化显示**: 支持测量结果的可视化显示
- **标签管理**: 自动管理测量标签的位置和内容
- **样式配置**: 支持自定义测量样式和颜色
- **性能优化**: 高效的渲染和更新机制

### 4. 国际化支持
- **多语言**: 支持多语言界面
- **地区格式**: 支持不同地区的数字格式
- **单位制**: 支持公制、英制等不同单位制
- **本地化**: 完整的本地化支持

## 使用场景

### 1. 工程测量
- 建筑测量
- 道路测量
- 桥梁测量
- 管道测量

### 2. 地理测量
- 地形测量
- 区域测量
- 边界测量
- 面积统计

### 3. 科学计算
- 物理测量
- 化学测量
- 生物测量
- 环境测量

### 4. 教育应用
- 几何教学
- 测量教学
- 实验教学
- 实践教学

## 配置选项

### 1. 面积测量配置
```javascript
const areaOptions = {
  scene: scene,
  primitives: primitives,
  labels: labels,
  points: points,
  units: {
    areaUnits: AreaUnits.SQUARE_METERS
  },
  locale: "zh-CN"
};
```

### 2. 距离测量配置
```javascript
const distanceOptions = {
  scene: scene,
  primitives: primitives,
  labels: labels,
  points: points,
  units: {
    distanceUnits: DistanceUnits.METERS,
    slopeUnits: AngleUnits.DEGREES
  },
  locale: "zh-CN",
  showComponentLines: true
};
```

### 3. 单位配置
```javascript
const units = {
  // 面积单位
  areaUnits: AreaUnits.SQUARE_METERS,
  
  // 距离单位
  distanceUnits: DistanceUnits.METERS,
  
  // 角度单位
  angleUnits: AngleUnits.DEGREES,
  
  // 斜率单位
  slopeUnits: AngleUnits.DEGREES
};
```

### 4. 样式配置
```javascript
const styleOptions = {
  // 折线样式
  polylineOptions: {
    color: Color.YELLOW,
    width: 3,
    materialType: Material.PolylineDashType
  },
  
  // 点样式
  pointOptions: {
    color: Color.RED,
    pixelSize: 8,
    outlineColor: Color.BLACK,
    outlineWidth: 2
  },
  
  // 标签样式
  labelOptions: {
    font: "12pt sans-serif",
    fillColor: Color.WHITE,
    outlineColor: Color.BLACK,
    outlineWidth: 2,
    pixelOffset: new Cartesian2(0, -20)
  }
};
```

## 性能优化

### 1. 计算优化
- **增量计算**: 仅计算变化的测量值
- **缓存机制**: 缓存计算结果
- **算法优化**: 使用高效的几何计算算法
- **内存管理**: 及时释放不需要的对象

### 2. 渲染优化
- **批量渲染**: 批量处理测量对象渲染
- **LOD系统**: 根据距离调整细节级别
- **视锥剔除**: 剔除不可见的测量对象
- **标签优化**: 优化标签的渲染和更新

### 3. 交互优化
- **事件节流**: 限制事件处理频率
- **状态缓存**: 缓存测量状态
- **内存复用**: 复用临时对象
- **异步处理**: 异步处理复杂计算

## 扩展功能

### 1. 自定义测量
- 支持自定义测量类型
- 可扩展的测量算法
- 插件式测量系统
- 自定义单位支持

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
- `CoplanarPolygonGeometry`: 共面多边形几何体
- `SceneTransforms`: 场景变换
- `HorizontalOrigin`: 水平原点
- `VerticalOrigin`: 垂直原点
- `Material`: 材质
- `destroyObject`: 对象销毁
- `defined`: 定义检查
- `Check`: 参数检查
- `Frozen`: 冻结对象

### 2. 测量系统
- `Measurement`: 测量基类
- `MeasurementSettings`: 测量设置
- `MeasureUnits`: 测量单位
- `filterPickForMeasurement`: 测量拾取过滤

### 3. 绘制系统
- `PolygonDrawing`: 多边形绘制
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

`Measure/` 文件夹提供了完整的测量系统解决方案，包括面积测量、距离测量、角度测量等功能。通过强大的测量算法、交互系统、渲染系统和国际化支持，该系统能够提供精确的3D空间测量，为工程测量、地理测量、科学计算、教育应用等应用领域提供了可靠的技术支撑。该系统具有良好的扩展性和维护性，是3DTiles位置编辑器项目中的重要组成部分。
