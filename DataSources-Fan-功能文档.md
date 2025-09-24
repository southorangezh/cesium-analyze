# DataSources-Fan 功能文档

## 概述
`FanGeometryUpdater.js` 和 `FanGraphics.js` 是3DTiles位置编辑器项目中扇形几何体可视化系统的核心组件。该系统提供了完整的扇形几何体定义、更新和渲染功能，支持静态和动态几何体更新、填充和轮廓渲染、材质系统等特性。

## 文件结构
```
Source/DataSources/
├── FanGeometryUpdater.js      # 扇形几何体更新器类
└── FanGraphics.js             # 扇形图形定义类
```

## 核心功能模块

### 1. FanGraphics.js - 扇形图形定义
**功能**: 定义扇形几何体的所有图形属性和行为

#### 1.1 主要特性
- **时间动态**: 支持时间动态属性变化
- **灵活半径**: 支持固定半径或每方向独立半径
- **材质系统**: 支持多种材质类型
- **轮廓渲染**: 支持填充和轮廓两种渲染模式
- **阴影支持**: 支持阴影投射和接收
- **距离显示**: 支持距离显示条件

#### 1.2 构造函数参数
```javascript
FanGraphics(options)
```

**核心参数**:
- `show`: 扇形可见性（默认true）
- `directions`: 球面坐标方向数组，定义扇形边界
- `radius`: 扇形半径（可选）
- `perDirectionRadius`: 是否使用每方向独立半径（默认false）
- `fill`: 是否填充扇形（默认true）
- `material`: 填充材质（默认白色）
- `outline`: 是否显示轮廓（默认false）
- `outlineColor`: 轮廓颜色（默认黑色）
- `outlineWidth`: 轮廓宽度（默认1.0）
- `numberOfRings`: 轮廓环数量
- `shadows`: 阴影模式（默认禁用）
- `distanceDisplayCondition`: 距离显示条件

#### 1.3 几何属性系统

##### 基本几何属性
```javascript
show: Property|Boolean                    // 可见性
radius: Property|Number                   // 半径
perDirectionRadius: Property|Boolean      // 每方向半径
directions: Property|Spherical[]           // 方向数组
```

##### 材质属性
```javascript
material: MaterialProperty|Color          // 填充材质
fill: Property|Boolean                    // 是否填充
```

##### 轮廓属性
```javascript
outline: Property|Boolean                // 是否显示轮廓
outlineColor: Property|Color              // 轮廓颜色
outlineWidth: Property|Number             // 轮廓宽度
numberOfRings: Property|Number            // 轮廓环数量
```

##### 渲染属性
```javascript
shadows: Property|ShadowMode              // 阴影模式
distanceDisplayCondition: Property|DistanceDisplayCondition  // 距离显示条件
```

#### 1.4 核心方法

##### 属性管理
```javascript
// 属性描述符创建
show: createPropertyDescriptor("show")
radius: createPropertyDescriptor("radius")
perDirectionRadius: createPropertyDescriptor("perDirectionRadius")
directions: createPropertyDescriptor("directions")

// 材质属性描述符
material: createMaterialPropertyDescriptor("material")
```

##### 对象操作
```javascript
clone(result)     // 克隆扇形图形
merge(source)     // 合并属性
```

### 2. FanGeometryUpdater.js - 扇形几何体更新器
**功能**: 管理扇形几何体的创建、更新和渲染

#### 2.1 主要特性
- **几何更新**: 继承自GeometryUpdater，提供几何体更新功能
- **静态/动态**: 支持静态和动态几何体更新
- **填充/轮廓**: 支持填充和轮廓两种几何体类型
- **材质适配**: 根据材质类型选择合适的顶点格式
- **性能优化**: 高效的几何体创建和更新机制

#### 2.2 构造函数
```javascript
FanGeometryUpdater(entity, scene)
```
**参数**:
- `entity`: 包含几何体的实体对象
- `scene`: 渲染场景

#### 2.3 核心算法

##### 几何体选项定义
```javascript
function FanGeometryOptions(entity) {
  this.id = entity;
  this.vertexFormat = undefined;
  this.directions = undefined;
  this.radius = undefined;
  this.perDirectionRadius = undefined;
  this.numberOfRings = undefined;
}
```

##### 填充几何体创建
```javascript
FanGeometryUpdater.prototype.createFillGeometryInstance = function (time) {
  const entity = this._entity;
  const isAvailable = entity.isAvailable(time);
  
  // 创建显示属性
  const show = new ShowGeometryInstanceAttribute(
    isAvailable &&
      entity.isShowing &&
      this._showProperty.getValue(time) &&
      this._fillProperty.getValue(time)
  );
  
  // 创建距离显示条件属性
  const distanceDisplayCondition = this._distanceDisplayConditionProperty.getValue(time);
  const distanceDisplayConditionAttribute = 
    DistanceDisplayConditionGeometryInstanceAttribute.fromDistanceDisplayCondition(distanceDisplayCondition);
  
  // 处理颜色材质
  let attributes;
  if (this._materialProperty instanceof ColorMaterialProperty) {
    let currentColor;
    if (defined(this._materialProperty.color) && 
        (this._materialProperty.color.isConstant || isAvailable)) {
      currentColor = this._materialProperty.color.getValue(time, scratchColor);
    }
    if (!defined(currentColor)) {
      currentColor = Color.WHITE;
    }
    const color = ColorGeometryInstanceAttribute.fromColor(currentColor);
    attributes = {
      show: show,
      distanceDisplayCondition: distanceDisplayConditionAttribute,
      color: color
    };
  } else {
    attributes = {
      show: show,
      distanceDisplayCondition: distanceDisplayConditionAttribute
    };
  }
  
  return new GeometryInstance({
    id: entity,
    geometry: new FanGeometry(this._options),
    modelMatrix: entity.computeModelMatrix(time),
    attributes: attributes
  });
};
```

##### 轮廓几何体创建
```javascript
FanGeometryUpdater.prototype.createOutlineGeometryInstance = function (time) {
  const entity = this._entity;
  const isAvailable = entity.isAvailable(time);
  
  // 获取轮廓颜色
  const outlineColor = Property.getValueOrDefault(
    this._outlineColorProperty,
    time,
    Color.BLACK,
    scratchColor
  );
  
  // 创建距离显示条件属性
  const distanceDisplayCondition = this._distanceDisplayConditionProperty.getValue(time);
  
  return new GeometryInstance({
    id: entity,
    geometry: new FanOutlineGeometry(this._options),
    modelMatrix: entity.computeModelMatrix(time),
    attributes: {
      show: new ShowGeometryInstanceAttribute(
        isAvailable &&
          this._showProperty.getValue(time) &&
          this._showOutlineProperty.getValue(time)
      ),
      color: ColorGeometryInstanceAttribute.fromColor(outlineColor),
      distanceDisplayCondition: 
        DistanceDisplayConditionGeometryInstanceAttribute.fromDistanceDisplayCondition(distanceDisplayCondition)
    }
  });
};
```

#### 2.4 动态更新机制

##### 动态几何体更新器
```javascript
function DynamicFanGeometryUpdater(geometryUpdater, primitives, groundPrimitives) {
  DynamicGeometryUpdater.call(this, geometryUpdater, primitives, groundPrimitives);
}
```

##### 动态选项设置
```javascript
DynamicFanGeometryUpdater.prototype._setOptions = function (entity, fan, time) {
  const radius = fan.radius;
  const perDirectionRadius = fan.perDirectionRadius;
  const numberOfRings = fan.numberOfRings ?? defaultNumberOfRings;
  
  const options = this._options;
  options.directions = fan.directions.getValue(time, options.directions);
  options.radius = defined(radius) ? radius.getValue(time) : undefined;
  options.perDirectionRadius = defined(perDirectionRadius) 
    ? perDirectionRadius.getValue(time) 
    : undefined;
  options.numberOfRings = numberOfRings.getValue(time);
};
```

#### 2.5 静态选项设置
```javascript
FanGeometryUpdater.prototype._setStaticOptions = function (entity, fan) {
  const isColorMaterial = this._materialProperty instanceof ColorMaterialProperty;
  const numberOfRings = fan.numberOfRings ?? defaultNumberOfRings;
  
  const options = this._options;
  options.vertexFormat = isColorMaterial
    ? PerInstanceColorAppearance.VERTEX_FORMAT
    : MaterialAppearance.VERTEX_FORMAT;
  options.directions = fan.directions.getValue(Iso8601.MINIMUM_VALUE, options.directions);
  options.radius = defined(fan.radius) 
    ? fan.radius.getValue(Iso8601.MINIMUM_VALUE) 
    : undefined;
  options.perDirectionRadius = defined(fan.perDirectionRadius)
    ? fan.perDirectionRadius.getValue(Iso8601.MINIMUM_VALUE)
    : undefined;
  options.numberOfRings = numberOfRings.getValue(Iso8601.MINIMUM_VALUE);
};
```

#### 2.6 状态检测方法

##### 隐藏状态检测
```javascript
FanGeometryUpdater.prototype._isHidden = function (entity, fan) {
  return (
    !defined(entity.position) ||
    (!defined(fan.perDirectionRadius) && !defined(fan.radius)) ||
    GeometryUpdater.prototype._isHidden.call(this, entity, fan)
  );
};
```

##### 动态状态检测
```javascript
FanGeometryUpdater.prototype._isDynamic = function (entity, fan) {
  return (
    !Property.isConstant(entity.position) ||
    !Property.isConstant(entity.orientation) ||
    !Property.isConstant(fan.perDirectionRadius) ||
    !Property.isConstant(fan.radius) ||
    !Property.isConstant(fan.directions) ||
    !Property.isConstant(fan.outlineWidth) ||
    !Property.isConstant(fan.numberOfRings)
  );
};
```

## 技术特性

### 1. 几何计算
- **球面坐标**: 基于球面坐标系的几何计算
- **扇形生成**: 高效的扇形几何体生成算法
- **轮廓渲染**: 支持多环轮廓线渲染
- **动态更新**: 支持时间动态的几何体更新

### 2. 渲染系统
- **双模式渲染**: 支持填充和轮廓两种渲染模式
- **材质系统**: 支持多种材质类型
- **顶点格式**: 根据材质类型自动选择顶点格式
- **阴影支持**: 支持阴影投射和接收

### 3. 性能优化
- **静态/动态分离**: 根据属性变化选择静态或动态更新
- **几何体复用**: 高效的几何体创建和管理
- **属性缓存**: 避免重复计算和更新
- **内存管理**: 及时释放不需要的资源

### 4. 属性系统
- **时间动态**: 支持时间动态的属性变化
- **属性验证**: 完善的属性验证机制
- **默认值处理**: 智能的默认值处理
- **类型安全**: 强类型的属性定义

## 使用场景

### 1. 扇形可视化
- 雷达扫描范围显示
- 扇形区域标识
- 角度范围可视化
- 方向性数据展示

### 2. 几何分析
- 扇形面积计算
- 角度测量工具
- 几何体相交检测
- 空间关系分析

### 3. 科学可视化
- 天体物理模拟
- 地球科学应用
- 工程分析工具
- 数据可视化

### 4. 交互应用
- 扇形选择工具
- 区域标记系统
- 用户界面元素
- 游戏开发应用

## 配置选项

### 1. 基本几何配置
```javascript
const fanGraphics = new FanGraphics({
  show: true,
  radius: 100.0,
  perDirectionRadius: false,
  directions: [
    { clock: 0, cone: Math.PI / 4 },
    { clock: Math.PI / 2, cone: Math.PI / 4 },
    { clock: Math.PI, cone: Math.PI / 4 },
    { clock: 3 * Math.PI / 2, cone: Math.PI / 4 }
  ]
});
```

### 2. 材质配置
```javascript
fanGraphics.material = Color.BLUE.withAlpha(0.5);
fanGraphics.fill = true;
fanGraphics.outline = true;
fanGraphics.outlineColor = Color.BLACK;
fanGraphics.outlineWidth = 2.0;
```

### 3. 轮廓配置
```javascript
fanGraphics.numberOfRings = 6;
fanGraphics.outlineColor = Color.RED;
fanGraphics.outlineWidth = 1.5;
```

### 4. 渲染配置
```javascript
fanGraphics.shadows = ShadowMode.ENABLED;
fanGraphics.distanceDisplayCondition = new DistanceDisplayCondition(0.0, 10000.0);
```

## 性能优化

### 1. 渲染优化
- **LOD支持**: 根据距离调整细节级别
- **视锥剔除**: 剔除视锥外的几何体
- **批处理**: 批量渲染多个几何体
- **GPU加速**: 利用GPU计算能力

### 2. 内存优化
- **对象池**: 重用几何体对象
- **压缩存储**: 压缩几何数据
- **延迟加载**: 按需加载几何体
- **垃圾回收**: 及时释放内存

### 3. 计算优化
- **缓存机制**: 缓存计算结果
- **增量更新**: 仅更新变化部分
- **并行计算**: 支持多线程计算
- **算法优化**: 优化几何计算算法

## 扩展功能

### 1. 自定义几何体
- 支持自定义扇形形状
- 可扩展的几何体接口
- 插件式几何体系统

### 2. 高级分析
- 扇形面积计算
- 几何体相交检测
- 空间关系分析
- 性能评估系统

### 3. 交互功能
- 几何体编辑工具
- 实时参数调整
- 用户交互反馈
- 动画效果支持

## 依赖关系

### 1. Cesium Engine
- `Property`: 属性系统
- `MaterialProperty`: 材质属性
- `Entity`: 实体系统
- `Scene`: 场景管理

### 2. 几何系统
- `FanGeometry`: 扇形几何体
- `FanOutlineGeometry`: 扇形轮廓几何体
- `GeometryInstance`: 几何实例
- `GeometryUpdater`: 几何更新器基类

### 3. 渲染系统
- `PrimitiveCollection`: 图元集合
- `MaterialAppearance`: 材质外观
- `PerInstanceColorAppearance`: 每实例颜色外观
- `ShadowMode`: 阴影模式

## 维护说明

### 1. 版本兼容性
- 确保与Cesium版本兼容
- 定期更新依赖库
- 测试新版本兼容性
- 维护API稳定性

### 2. 性能监控
- 监控渲染性能
- 检查内存使用
- 优化计算效率
- 分析瓶颈问题

### 3. 错误处理
- 完善的错误检查机制
- 优雅的错误恢复
- 详细的错误日志
- 用户友好的错误提示

## 总结

`FanGeometryUpdater.js` 和 `FanGraphics.js` 提供了完整的扇形几何体可视化解决方案，包括灵活的几何定义、高效的渲染系统、强大的属性管理和先进的性能优化。通过支持静态和动态几何体更新、填充和轮廓渲染、多种材质类型等特性，该系统能够满足各种复杂的应用需求，为扇形可视化、几何分析、科学可视化等应用领域提供了强大的技术支撑。该系统具有良好的扩展性和维护性，是3DTiles位置编辑器项目中的重要组成部分。
