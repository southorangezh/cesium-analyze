# DataSources-RectangularSensor 功能文档

## 概述
`RectangularSensorGraphics.js` 和 `RectangularSensorVisualizer.js` 是3DTiles位置编辑器项目中矩形传感器系统的核心组件。该系统提供了完整的矩形传感器数据模型定义和可视化功能，支持矩形传感器几何属性、材质系统、环境交互、视域分析等高级特性。

## 文件结构
```
Source/DataSources/
├── RectangularSensorGraphics.js      # 矩形传感器图形属性定义
└── RectangularSensorVisualizer.js    # 矩形传感器可视化器
```

## 核心功能模块

### 1. RectangularSensorGraphics.js - 矩形传感器图形属性定义
**功能**: 定义矩形传感器的所有可配置属性和数据模型

#### 1.1 主要特性
- **矩形几何**: 专门处理矩形传感器的几何属性
- **材质系统**: 支持多种表面材质和颜色
- **环境交互**: 支持环境遮挡和相交检测
- **视域分析**: 支持视域可见性分析
- **时间动态**: 支持时间动态的属性变化
- **属性继承**: 完整的属性克隆和合并功能

#### 1.2 构造函数
```javascript
function RectangularSensorGraphics(options) {
  // 初始化所有属性
  this._xHalfAngle = undefined;
  this._yHalfAngle = undefined;
  this._radius = undefined;
  this._show = undefined;
  // ... 更多属性初始化
  
  this._definitionChanged = new Event();
  this.merge(options ?? Frozen.EMPTY_OBJECT);
}
```

#### 1.3 核心属性定义

##### 几何属性
```javascript
// X轴半角 - 从正Z轴沿X轴测量的半角（弧度）
xHalfAngle: createPropertyDescriptor("xHalfAngle"),

// Y轴半角 - 从正Z轴沿Y轴测量的半角（弧度）
yHalfAngle: createPropertyDescriptor("yHalfAngle"),

// 半径 - 从传感器原点到传感器圆顶任意点的距离
radius: createPropertyDescriptor("radius"),

// 显示部分 - 指定要显示的传感器部分
portionToDisplay: createPropertyDescriptor("portionToDisplay"),
```

##### 表面材质属性
```javascript
// 侧面材质 - 传感器侧面的外观
lateralSurfaceMaterial: createMaterialPropertyDescriptor("lateralSurfaceMaterial"),

// 椭球地平线表面材质 - 椭球地平线遮挡形成的侧面外观
ellipsoidHorizonSurfaceMaterial: createMaterialPropertyDescriptor("ellipsoidHorizonSurfaceMaterial"),

// 圆顶表面材质 - 传感器圆顶表面的外观
domeSurfaceMaterial: createMaterialPropertyDescriptor("domeSurfaceMaterial"),

// 椭球表面材质 - 传感器相交处的椭球表面外观
ellipsoidSurfaceMaterial: createMaterialPropertyDescriptor("ellipsoidSurfaceMaterial"),
```

##### 显示控制属性
```javascript
// 显示侧面 - 是否显示传感器侧面
showLateralSurfaces: createPropertyDescriptor("showLateralSurfaces"),

// 显示椭球地平线表面 - 是否显示椭球地平线表面
showEllipsoidHorizonSurfaces: createPropertyDescriptor("showEllipsoidHorizonSurfaces"),

// 显示圆顶表面 - 是否显示传感器圆顶表面
showDomeSurfaces: createPropertyDescriptor("showDomeSurfaces"),

// 显示椭球表面 - 是否显示椭球/传感器相交表面
showEllipsoidSurfaces: createPropertyDescriptor("showEllipsoidSurfaces"),
```

##### 相交属性
```javascript
// 显示相交 - 是否显示传感器与椭球相交的线条
showIntersection: createPropertyDescriptor("showIntersection"),

// 相交颜色 - 传感器与椭球相交线条的颜色
intersectionColor: createPropertyDescriptor("intersectionColor"),

// 相交宽度 - 传感器与椭球相交线条的近似像素宽度
intersectionWidth: createPropertyDescriptor("intersectionWidth"),

// 显示穿过椭球 - 是否绘制穿过椭球的传感器
showThroughEllipsoid: createPropertyDescriptor("showThroughEllipsoid"),
```

##### 环境交互属性
```javascript
// 环境约束 - 传感器是否会被环境遮挡
environmentConstraint: createPropertyDescriptor("environmentConstraint"),

// 显示环境遮挡 - 是否显示被环境遮挡的传感器部分
showEnvironmentOcclusion: createPropertyDescriptor("showEnvironmentOcclusion"),

// 环境遮挡材质 - 被环境遮挡部分的外观
environmentOcclusionMaterial: createMaterialPropertyDescriptor("environmentOcclusionMaterial"),

// 显示环境相交 - 是否显示传感器与环境相交的线条
showEnvironmentIntersection: createPropertyDescriptor("showEnvironmentIntersection"),

// 环境相交颜色 - 传感器与环境相交线条的颜色
environmentIntersectionColor: createPropertyDescriptor("environmentIntersectionColor"),

// 环境相交宽度 - 传感器与环境相交线条的宽度（米）
environmentIntersectionWidth: createPropertyDescriptor("environmentIntersectionWidth"),
```

##### 视域分析属性
```javascript
// 显示视域 - 视域的可见性
showViewshed: createPropertyDescriptor("showViewshed"),

// 视域可见颜色 - 传感器可见的场景几何体颜色
viewshedVisibleColor: createPropertyDescriptor("viewshedVisibleColor"),

// 视域遮挡颜色 - 传感器不可见的场景几何体颜色
viewshedOccludedColor: createPropertyDescriptor("viewshedOccludedColor"),

// 视域分辨率 - 视域的分辨率（像素）
viewshedResolution: createPropertyDescriptor("viewshedResolution"),

// 分类类型 - 传感器是否对地形、3D Tiles或两者进行分类
classificationType: createPropertyDescriptor("classificationType"),
```

#### 1.4 核心方法

##### 克隆方法
```javascript
RectangularSensorGraphics.prototype.clone = function (result) {
  if (!defined(result)) {
    result = new RectangularSensorGraphics();
  }
  // 复制所有属性
  result.xHalfAngle = this.xHalfAngle;
  result.yHalfAngle = this.yHalfAngle;
  result.radius = this.radius;
  result.show = this.show;
  // ... 复制所有其他属性
  return result;
};
```

##### 合并方法
```javascript
RectangularSensorGraphics.prototype.merge = function (source) {
  if (!defined(source)) {
    throw new DeveloperError("source is required.");
  }
  
  // 使用空值合并操作符合并属性
  this.xHalfAngle = this.xHalfAngle ?? source.xHalfAngle;
  this.yHalfAngle = this.yHalfAngle ?? source.yHalfAngle;
  this.radius = this.radius ?? source.radius;
  // ... 合并所有其他属性
};
```

### 2. RectangularSensorVisualizer.js - 矩形传感器可视化器
**功能**: 将矩形传感器图形属性转换为场景中的可视化对象

#### 2.1 主要特性
- **实体映射**: 将Entity的rectangularSensor属性映射到RectangularSensor
- **实时更新**: 实时更新传感器属性
- **生命周期管理**: 管理传感器的创建和销毁
- **边界球计算**: 计算传感器的边界球
- **集合管理**: 管理实体集合的变化

#### 2.2 构造函数
```javascript
function RectangularSensorVisualizer(scene, entityCollection) {
  if (!defined(scene)) {
    throw new DeveloperError("scene is required.");
  }
  if (!defined(entityCollection)) {
    throw new DeveloperError("entityCollection is required.");
  }
  
  entityCollection.collectionChanged.addEventListener(
    RectangularSensorVisualizer.prototype._onCollectionChanged,
    this
  );
  
  this._scene = scene;
  this._primitives = scene.primitives;
  this._entityCollection = entityCollection;
  this._hash = {};
  this._entitiesToVisualize = new AssociativeArray();
  this._modelMatrixScratch = new Matrix4();
  
  this._onCollectionChanged(entityCollection, entityCollection.values, [], []);
}
```

#### 2.3 核心方法

##### 更新方法
```javascript
RectangularSensorVisualizer.prototype.update = function (time) {
  if (!defined(time)) {
    throw new DeveloperError("time is required.");
  }
  
  const entities = this._entitiesToVisualize.values;
  const hash = this._hash;
  const primitives = this._primitives;
  
  for (let i = 0, len = entities.length; i < len; i++) {
    const entity = entities[i];
    const rectangularSensorGraphics = entity._rectangularSensor;
    
    let primitive = hash[entity.id];
    let show = entity.isShowing && 
               entity.isAvailable(time) && 
               Property.getValueOrDefault(rectangularSensorGraphics._show, time, true);
    
    let modelMatrix;
    if (show) {
      modelMatrix = entity.computeModelMatrix(time, this._modelMatrixScratch);
      show = defined(modelMatrix);
    }
    
    if (!show) {
      if (defined(primitive)) {
        primitive.show = false;
      }
      continue;
    }
    
    if (!defined(primitive)) {
      primitive = new RectangularSensor();
      primitive.id = entity;
      primitives.add(primitive);
      hash[entity.id] = primitive;
    }
    
    // 更新所有属性
    primitive.show = true;
    primitive.xHalfAngle = Property.getValueOrDefault(
      rectangularSensorGraphics._xHalfAngle,
      time,
      CesiumMath.PI_OVER_TWO
    );
    primitive.yHalfAngle = Property.getValueOrDefault(
      rectangularSensorGraphics._yHalfAngle,
      time,
      CesiumMath.PI_OVER_TWO
    );
    // ... 更新所有其他属性
    primitive.modelMatrix = Matrix4.clone(modelMatrix, primitive.modelMatrix);
  }
  return true;
};
```

##### 边界球计算方法
```javascript
RectangularSensorVisualizer.prototype.getBoundingSphere = function (entity, result) {
  if (!defined(entity)) {
    throw new DeveloperError("entity is required.");
  }
  if (!defined(result)) {
    throw new DeveloperError("result is required.");
  }
  
  const sensor = this._hash[entity.id];
  if (!defined(sensor)) {
    return BoundingSphereState.FAILED;
  }
  
  Matrix4.getColumn(sensor.modelMatrix, 3, scratchCartesian4);
  Cartesian3.fromCartesian4(scratchCartesian4, result.center);
  
  result.radius = isFinite(sensor.radius) ? sensor.radius : 1000.0;
  
  return BoundingSphereState.DONE;
};
```

##### 集合变化处理方法
```javascript
RectangularSensorVisualizer.prototype._onCollectionChanged = function (
  entityCollection,
  added,
  removed,
  changed
) {
  let i;
  let entity;
  const entities = this._entitiesToVisualize;
  const hash = this._hash;
  const primitives = this._primitives;
  
  // 处理添加的实体
  for (i = added.length - 1; i > -1; i--) {
    entity = added[i];
    if (defined(entity._rectangularSensor) && defined(entity._position)) {
      entities.set(entity.id, entity);
    }
  }
  
  // 处理变化的实体
  for (i = changed.length - 1; i > -1; i--) {
    entity = changed[i];
    if (defined(entity._rectangularSensor) && defined(entity._position)) {
      entities.set(entity.id, entity);
    } else {
      removePrimitive(entity, hash, primitives);
      entities.remove(entity.id);
    }
  }
  
  // 处理移除的实体
  for (i = removed.length - 1; i > -1; i--) {
    entity = removed[i];
    removePrimitive(entity, hash, primitives);
    entities.remove(entity.id);
  }
};
```

## 技术特性

### 1. 属性系统
- **属性描述符**: 使用createPropertyDescriptor创建属性
- **材质属性**: 使用createMaterialPropertyDescriptor创建材质属性
- **事件系统**: 支持definitionChanged事件
- **类型安全**: 强类型的属性定义和验证

### 2. 可视化系统
- **实体映射**: 将Entity属性映射到场景对象
- **实时更新**: 支持时间动态的属性更新
- **生命周期管理**: 自动管理对象的创建和销毁
- **性能优化**: 高效的更新和渲染机制

### 3. 几何体支持
- **矩形传感器**: 支持矩形传感器的完整几何定义
- **多表面材质**: 支持多种表面材质和颜色
- **环境交互**: 支持环境遮挡和相交检测
- **视域分析**: 支持视域可见性分析

### 4. 时间系统
- **时间动态**: 支持时间动态的属性变化
- **属性插值**: 支持属性值的时间插值
- **时间验证**: 时间格式验证和转换

## 使用场景

### 1. 矩形传感器应用
- 矩形雷达扫描范围显示
- 矩形传感器覆盖区域可视化
- 矩形传感器配置管理
- 矩形传感器数据分析

### 2. 环境交互应用
- 地形遮挡检测
- 3D模型相交分析
- 环境约束可视化
- 遮挡区域显示

### 3. 视域分析应用
- 传感器可见性分析
- 视域范围计算
- 遮挡区域识别
- 视域可视化

### 4. 材质系统应用
- 多表面材质管理
- 颜色和纹理控制
- 材质属性动态变化
- 视觉效果定制

## 配置选项

### 1. 矩形传感器配置
```javascript
// 矩形传感器配置选项
const options = {
  show: true,
  portionToDisplay: SensorVolumePortionToDisplay.COMPLETE,
  radius: Number.POSITIVE_INFINITY,
  xHalfAngle: CesiumMath.PI_OVER_TWO,
  yHalfAngle: CesiumMath.PI_OVER_TWO,
  lateralSurfaceMaterial: Color.WHITE,
  showLateralSurfaces: true,
  ellipsoidHorizonSurfaceMaterial: Color.WHITE,
  showEllipsoidHorizonSurfaces: true,
  ellipsoidSurfaceMaterial: Color.WHITE,
  showEllipsoidSurfaces: true,
  domeSurfaceMaterial: Color.WHITE,
  showDomeSurfaces: true,
  showIntersection: true,
  intersectionColor: Color.WHITE,
  intersectionWidth: 5.0,
  showThroughEllipsoid: false,
  environmentConstraint: false,
  showEnvironmentOcclusion: false,
  environmentOcclusionMaterial: Color.WHITE,
  showEnvironmentIntersection: false,
  environmentIntersectionColor: Color.WHITE,
  environmentIntersectionWidth: 5.0,
  showViewshed: false,
  viewshedVisibleColor: Color.LIME,
  viewshedOccludedColor: Color.RED,
  viewshedResolution: 2048,
  classificationType: ClassificationType.BOTH
};
```

### 2. 可视化器配置
```javascript
// 创建矩形传感器可视化器
const visualizer = new RectangularSensorVisualizer(scene, entityCollection);

// 更新可视化器
visualizer.update(time);

// 计算边界球
const boundingSphere = new BoundingSphere();
const state = visualizer.getBoundingSphere(entity, boundingSphere);

// 销毁可视化器
visualizer.destroy();
```

### 3. 实体配置
```javascript
// 创建带有矩形传感器的实体
const entity = new Entity({
  id: "rectangular-sensor-entity",
  position: Cartesian3.fromDegrees(-75.59777, 40.03883),
  rectangularSensor: {
    show: true,
    xHalfAngle: 0.5,
    yHalfAngle: 0.3,
    radius: 1000.0,
    lateralSurfaceMaterial: Color.BLUE,
    showLateralSurfaces: true,
    showIntersection: true,
    intersectionColor: Color.WHITE,
    intersectionWidth: 2.0,
    showThroughEllipsoid: false,
    environmentConstraint: false,
    showEnvironmentOcclusion: false,
    showEnvironmentIntersection: false,
    showViewshed: false,
    viewshedVisibleColor: Color.LIME,
    viewshedOccludedColor: Color.RED,
    viewshedResolution: 2048,
    classificationType: ClassificationType.BOTH
  }
});
```

## 性能优化

### 1. 可视化优化
- **增量更新**: 仅更新变化的属性
- **对象复用**: 重用传感器对象
- **批量处理**: 批量处理实体更新
- **内存管理**: 及时释放不需要的对象

### 2. 渲染优化
- **LOD系统**: 根据距离调整细节级别
- **视锥剔除**: 剔除不可见的传感器
- **材质缓存**: 缓存材质对象
- **几何体优化**: 优化几何体生成

### 3. 计算优化
- **边界球缓存**: 缓存边界球计算结果
- **矩阵计算**: 优化矩阵计算
- **属性插值**: 高效的属性插值
- **时间处理**: 优化的时间处理

## 扩展功能

### 1. 自定义传感器
- 支持自定义传感器类型
- 可扩展的传感器属性
- 插件式传感器系统
- 自定义属性验证

### 2. 高级功能
- 传感器属性的批量操作
- 传感器配置的模板系统
- 传感器属性的继承机制
- 传感器数据的版本控制

### 3. 集成功能
- 外部数据源的集成
- 传感器数据的导入导出
- 传感器配置的同步
- 传感器属性的验证

## 依赖关系

### 1. Cesium Engine
- `Event`: 事件系统
- `Property`: 属性系统
- `MaterialProperty`: 材质属性
- `createPropertyDescriptor`: 属性描述符创建
- `createMaterialPropertyDescriptor`: 材质属性描述符创建
- `Frozen`: 冻结对象支持

### 2. 传感器系统
- `RectangularSensor`: 矩形传感器场景对象
- `SensorVolumePortionToDisplay`: 传感器显示部分枚举
- `ClassificationType`: 分类类型枚举
- `Entity`: 实体系统
- `EntityCollection`: 实体集合

### 3. 可视化系统
- `AssociativeArray`: 关联数组
- `Matrix4`: 4x4矩阵
- `Cartesian3`: 3D向量
- `Cartesian4`: 4D向量
- `BoundingSphereState`: 边界球状态
- `destroyObject`: 对象销毁

## 维护说明

### 1. 版本兼容性
- 确保与Cesium版本兼容
- 定期更新依赖库
- 测试新版本兼容性
- 维护API稳定性

### 2. 性能监控
- 监控传感器渲染性能
- 检查内存使用
- 优化更新效率
- 分析瓶颈问题

### 3. 错误处理
- 完善的错误检查机制
- 优雅的错误恢复
- 详细的错误日志
- 用户友好的错误提示

## 总结

`RectangularSensorGraphics.js` 和 `RectangularSensorVisualizer.js` 提供了完整的矩形传感器系统解决方案，包括数据模型定义、属性管理、可视化渲染、环境交互、视域分析等功能。通过强大的属性系统和可视化机制，该系统能够创建和管理复杂的矩形传感器，为雷达扫描、传感器覆盖、环境分析、视域计算等应用领域提供了可靠的技术支撑。该系统具有良好的扩展性和维护性，是3DTiles位置编辑器项目中的重要组成部分。
