# DataSources-ProcessBasic 功能文档

## 概述
`processRectangularSensor.js` 和 `processVector.js` 是3DTiles位置编辑器项目中基础数据处理系统的核心组件。该系统提供了矩形传感器和向量几何体的CZML数据处理功能，支持基本的几何体属性处理、时间动态支持、CZML集成等基础特性。

## 文件结构
```
Source/DataSources/
├── processRectangularSensor.js    # 矩形传感器数据处理函数
└── processVector.js               # 向量数据处理函数
```

## 核心功能模块

### 1. processRectangularSensor.js - 矩形传感器数据处理
**功能**: 处理矩形传感器的CZML数据和特定属性

#### 1.1 主要特性
- **矩形几何**: 专门处理矩形传感器的几何属性
- **CZML集成**: 与CZML数据源系统深度集成
- **时间动态**: 支持时间动态的属性处理
- **属性继承**: 继承通用传感器属性处理
- **简单高效**: 轻量级的矩形传感器处理

#### 1.2 函数签名
```javascript
export default function processRectangularSensor(
  entity,           // 实体对象
  packet,           // CZML数据包
  entityCollection, // 实体集合
  sourceUri        // 数据源URI
)
```

#### 1.3 核心处理流程

##### 数据包解析
```javascript
export default function processRectangularSensor(entity, packet, entityCollection, sourceUri) {
  // 获取矩形传感器数据
  const rectangularSensorData = packet.agi_rectangularSensor;
  if (!defined(rectangularSensorData)) {
    return;
  }
  
  // 处理时间间隔
  let interval;
  const intervalString = rectangularSensorData.interval;
  if (defined(intervalString)) {
    iso8601Scratch.iso8601 = intervalString;
    interval = TimeInterval.fromIso8601(iso8601Scratch);
  }
}
```

##### 传感器对象创建
```javascript
// 获取或创建矩形传感器对象
let rectangularSensor = entity.rectangularSensor;
if (!defined(rectangularSensor)) {
  entity.rectangularSensor = rectangularSensor = new RectangularSensorGraphics();
}
```

##### 通用属性处理
```javascript
// 处理通用传感器属性
processCommonSensorProperties(
  rectangularSensor,
  rectangularSensorData,
  interval,
  sourceUri,
  entityCollection
);
```

##### 矩形特定属性处理
```javascript
// X轴半角
CzmlDataSource.processPacketData(
  Number,
  rectangularSensor,
  "xHalfAngle",
  rectangularSensorData.xHalfAngle,
  interval,
  sourceUri,
  entityCollection
);

// Y轴半角
CzmlDataSource.processPacketData(
  Number,
  rectangularSensor,
  "yHalfAngle",
  rectangularSensorData.yHalfAngle,
  interval,
  sourceUri,
  entityCollection
);
```

### 2. processVector.js - 向量数据处理
**功能**: 处理向量几何体的CZML数据和属性

#### 2.1 主要特性
- **向量几何**: 专门处理向量几何体的数据
- **方向控制**: 支持向量方向属性处理
- **长度控制**: 支持向量长度属性处理
- **颜色支持**: 支持向量颜色属性处理
- **像素控制**: 支持最小像素长度控制

#### 2.2 函数签名
```javascript
export default function processVector(
  entity,           // 实体对象
  packet,           // CZML数据包
  entityCollection, // 实体集合
  sourceUri        // 数据源URI
)
```

#### 2.3 核心处理流程

##### 数据包解析
```javascript
export default function processVector(entity, packet, entityCollection, sourceUri) {
  // 获取向量数据
  const vectorData = packet.agi_vector;
  if (!defined(vectorData)) {
    return;
  }
  
  // 处理时间间隔
  let interval;
  const intervalString = vectorData.interval;
  if (defined(intervalString)) {
    iso8601Scratch.iso8601 = intervalString;
    interval = TimeInterval.fromIso8601(iso8601Scratch);
  }
}
```

##### 向量对象创建
```javascript
// 获取或创建向量对象
let vector = entity.vector;
if (!defined(vector)) {
  entity.vector = vector = new VectorGraphics();
}
```

##### 向量属性处理
```javascript
// 颜色
CzmlDataSource.processPacketData(
  Color,
  vector,
  "color",
  vectorData.color,
  interval,
  sourceUri,
  entityCollection
);

// 可见性
CzmlDataSource.processPacketData(
  Boolean,
  vector,
  "show",
  vectorData.show,
  interval,
  sourceUri,
  entityCollection
);

// 方向
CzmlDataSource.processPacketData(
  Cartesian3,
  vector,
  "direction",
  vectorData.direction,
  interval,
  sourceUri,
  entityCollection
);

// 长度
CzmlDataSource.processPacketData(
  Number,
  vector,
  "length",
  vectorData.length,
  interval,
  sourceUri,
  entityCollection
);

// 最小像素长度
CzmlDataSource.processPacketData(
  Number,
  vector,
  "minimumLengthInPixels",
  vectorData.minimumLengthInPixels,
  interval,
  sourceUri,
  entityCollection
);
```

## 技术特性

### 1. CZML集成
- **数据包解析**: 解析CZML格式的几何体数据
- **属性映射**: 将CZML属性映射到几何体对象
- **时间支持**: 支持时间动态的属性处理
- **类型转换**: 自动的类型转换和验证

### 2. 属性处理
- **统一接口**: 提供统一的属性处理接口
- **类型安全**: 强类型的属性处理
- **默认值**: 智能的默认值处理
- **验证机制**: 完善的属性验证

### 3. 时间系统
- **时间间隔**: 支持时间间隔属性处理
- **ISO8601**: 支持ISO8601时间格式
- **动态属性**: 支持时间动态的属性变化
- **时间验证**: 时间格式验证和转换

### 4. 几何体支持
- **矩形传感器**: 支持矩形传感器的特定属性
- **向量几何**: 支持向量几何体的属性
- **基础几何**: 提供基础几何体的处理
- **扩展性**: 支持几何体类型的扩展

## 使用场景

### 1. 矩形传感器应用
- 矩形雷达扫描范围显示
- 矩形传感器覆盖区域
- 矩形传感器配置管理
- 矩形传感器数据解析

### 2. 向量几何体应用
- 方向向量可视化
- 力向量显示
- 速度向量表示
- 向量数据分析

### 3. CZML数据处理
- CZML文件中的基础几何体数据解析
- 几何体属性的批量处理
- 几何体配置的标准化
- 几何体数据的验证和转换

### 4. 基础几何体处理
- 简单几何体的数据解析
- 基础几何体属性的配置
- 基础几何体的可视化
- 基础几何体的管理

## 配置选项

### 1. 矩形传感器CZML格式
```javascript
// CZML数据包中的矩形传感器数据
{
  "agi_rectangularSensor": {
    "interval": "2023-01-01T00:00:00Z/2023-12-31T23:59:59Z",
    "show": true,
    "radius": 1000.0,
    "xHalfAngle": 0.5,
    "yHalfAngle": 0.3,
    "showIntersection": true,
    "intersectionColor": "white",
    "intersectionWidth": 2.0,
    "showThroughEllipsoid": false,
    "lateralSurfaceMaterial": "blue",
    "showLateralSurfaces": true,
    "ellipsoidSurfaceMaterial": "red",
    "showEllipsoidSurfaces": true,
    "ellipsoidHorizonSurfaceMaterial": "green",
    "showEllipsoidHorizonSurfaces": true,
    "domeSurfaceMaterial": "yellow",
    "showDomeSurfaces": true,
    "portionToDisplay": "COMPLETE",
    "environmentConstraint": false,
    "showEnvironmentOcclusion": false,
    "environmentOcclusionMaterial": "gray",
    "showEnvironmentIntersection": false,
    "environmentIntersectionColor": "white",
    "environmentIntersectionWidth": 1.0,
    "showViewshed": false,
    "viewshedVisibleColor": "lime",
    "viewshedOccludedColor": "red",
    "viewshedResolution": 2048
  }
}
```

### 2. 向量CZML格式
```javascript
// CZML数据包中的向量数据
{
  "agi_vector": {
    "interval": "2023-01-01T00:00:00Z/2023-12-31T23:59:59Z",
    "color": "red",
    "show": true,
    "direction": [1, 0, 0],
    "length": 100.0,
    "minimumLengthInPixels": 5.0
  }
}
```

### 3. 时间间隔配置
```javascript
// 时间间隔字符串格式
const intervalString = "2023-01-01T00:00:00Z/2023-12-31T23:59:59Z";

// 转换为TimeInterval对象
const interval = TimeInterval.fromIso8601({ iso8601: intervalString });
```

### 4. 属性类型配置
```javascript
// 支持的属性类型
const supportedTypes = {
  Boolean: "布尔类型",
  Number: "数值类型", 
  Color: "颜色类型",
  Cartesian3: "3D向量类型"
};
```

## 性能优化

### 1. 数据处理优化
- **批量处理**: 批量处理几何体属性
- **缓存机制**: 缓存处理结果
- **增量更新**: 仅更新变化的属性
- **并行处理**: 支持并行数据处理

### 2. 内存优化
- **对象复用**: 重用几何体对象
- **压缩存储**: 压缩几何体数据
- **延迟加载**: 按需加载几何体数据
- **垃圾回收**: 及时释放内存

### 3. 计算优化
- **类型检查**: 高效的类型检查
- **属性验证**: 快速的属性验证
- **时间处理**: 优化的时间处理
- **格式转换**: 高效的格式转换

## 扩展功能

### 1. 自定义几何体
- 支持自定义几何体类型
- 可扩展的几何体属性处理
- 插件式几何体系统
- 自定义属性验证

### 2. 高级功能
- 几何体属性的批量操作
- 几何体配置的模板系统
- 几何体属性的继承机制
- 几何体数据的版本控制

### 3. 集成功能
- 外部数据源的集成
- 几何体数据的导入导出
- 几何体配置的同步
- 几何体属性的验证

## 依赖关系

### 1. Cesium Engine
- `CzmlDataSource`: CZML数据源处理
- `TimeInterval`: 时间间隔处理
- `Cartesian3`: 3D向量
- `Color`: 颜色类型
- `defined`: 定义检查

### 2. 几何体系统
- `RectangularSensorGraphics`: 矩形传感器图形
- `VectorGraphics`: 向量图形
- `processCommonSensorProperties`: 通用传感器属性处理
- `Entity`: 实体系统
- `EntityCollection`: 实体集合

### 3. 数据处理
- `iso8601Scratch`: ISO8601时间处理
- `processPacketData`: 数据包处理
- `processMaterialPacketData`: 材质数据包处理

## 维护说明

### 1. 版本兼容性
- 确保与Cesium版本兼容
- 定期更新依赖库
- 测试新版本兼容性
- 维护API稳定性

### 2. 性能监控
- 监控数据处理性能
- 检查内存使用
- 优化处理效率
- 分析瓶颈问题

### 3. 错误处理
- 完善的错误检查机制
- 优雅的错误恢复
- 详细的错误日志
- 用户友好的错误提示

## 总结

`processRectangularSensor.js` 和 `processVector.js` 提供了完整的基础几何体数据处理解决方案，包括CZML数据包解析、基础几何体属性处理、时间动态支持、类型安全验证等功能。通过简洁高效的处理机制，该系统能够快速处理矩形传感器和向量几何体的数据，为基础几何体可视化、配置管理、数据集成等应用领域提供了可靠的技术支撑。该系统具有良好的扩展性和维护性，是3DTiles位置编辑器项目中的重要组成部分。
