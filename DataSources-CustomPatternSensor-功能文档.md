# DataSources-CustomPatternSensor 功能文档

## 概述
`CustomPatternSensorGraphics.js` 和 `CustomPatternSensorVisualizer.js` 是3DTiles位置编辑器项目中自定义模式传感器可视化系统的核心组件。该系统提供了完全自定义的传感器模式定义和可视化渲染功能，支持任意复杂的传感器体积形状、环境交互、视域分析等高级特性。

## 文件结构
```
Source/DataSources/
├── CustomPatternSensorGraphics.js      # 自定义模式传感器图形定义类
└── CustomPatternSensorVisualizer.js     # 自定义模式传感器可视化器类
```

## 核心功能模块

### 1. CustomPatternSensorGraphics.js - 自定义模式传感器图形定义
**功能**: 定义自定义模式传感器的所有图形属性和行为

#### 1.1 主要特性
- **完全自定义**: 支持任意复杂的传感器模式定义
- **时间动态**: 支持时间动态属性变化
- **方向控制**: 通过球面坐标数组精确控制传感器形状
- **多表面材质**: 支持多种表面材质定义
- **环境交互**: 支持环境遮挡和相交检测
- **视域分析**: 内置视域分析功能

#### 1.2 构造函数参数
```javascript
CustomPatternSensorGraphics(options)
```

**核心参数**:
- `show`: 传感器可见性（默认true）
- `portionToDisplay`: 显示部分（默认COMPLETE）
- `modelMatrix`: 4x4变换矩阵（默认单位矩阵）
- `radius`: 传感器半径（默认无穷大）
- `directions`: 球面坐标方向数组，定义传感器体积

#### 1.3 方向定义系统
```javascript
directions: Property|Spherical[]  // 球面坐标方向数组
```
- **球面坐标**: 使用clock和cone角度定义方向
- **灵活形状**: 支持任意复杂的传感器形状
- **动态更新**: 支持时间动态的方向变化
- **精确控制**: 每个方向点都可以独立定义

#### 1.4 表面材质系统

##### 侧面表面
```javascript
lateralSurfaceMaterial: MaterialProperty|Color  // 侧面材质
showLateralSurfaces: Property|Boolean           // 显示侧面
```

##### 椭球地平表面
```javascript
ellipsoidHorizonSurfaceMaterial: MaterialProperty|Color  // 地平表面材质
showEllipsoidHorizonSurfaces: Property|Boolean          // 显示地平表面
```

##### 圆顶表面
```javascript
domeSurfaceMaterial: MaterialProperty|Color  // 圆顶材质
showDomeSurfaces: Property|Boolean           // 显示圆顶
```

##### 椭球表面
```javascript
ellipsoidSurfaceMaterial: MaterialProperty|Color  // 椭球表面材质
showEllipsoidSurfaces: Property|Boolean           // 显示椭球表面
```

#### 1.5 相交线系统
```javascript
showIntersection: Property|Boolean        // 显示相交线
intersectionColor: Property|Color         // 相交线颜色
intersectionWidth: Property|Number        // 相交线宽度
showThroughEllipsoid: Property|Boolean    // 穿透椭球显示
```

#### 1.6 环境约束系统
```javascript
environmentConstraint: Property|Boolean                    // 环境约束
showEnvironmentOcclusion: Property|Boolean                // 显示环境遮挡
environmentOcclusionMaterial: MaterialProperty|Color       // 遮挡材质
showEnvironmentIntersection: Property|Boolean               // 显示环境相交
environmentIntersectionColor: Property|Color               // 环境相交颜色
environmentIntersectionWidth: Property|Number              // 环境相交宽度
```

#### 1.7 视域分析系统
```javascript
showViewshed: Property|Boolean           // 显示视域
viewshedVisibleColor: Property|Color     // 可见区域颜色
viewshedOccludedColor: Property|Color    // 遮挡区域颜色
viewshedResolution: Property|Number      // 视域分辨率
classificationType: Property|ClassificationType  // 分类类型
```

#### 1.8 核心方法

##### 属性管理
```javascript
// 方向属性描述符
directions: createPropertyDescriptor("directions")

// 材质属性描述符
lateralSurfaceMaterial: createMaterialPropertyDescriptor("lateralSurfaceMaterial")
ellipsoidHorizonSurfaceMaterial: createMaterialPropertyDescriptor("ellipsoidHorizonSurfaceMaterial")
domeSurfaceMaterial: createMaterialPropertyDescriptor("domeSurfaceMaterial")
ellipsoidSurfaceMaterial: createMaterialPropertyDescriptor("ellipsoidSurfaceMaterial")
environmentOcclusionMaterial: createMaterialPropertyDescriptor("environmentOcclusionMaterial")
```

##### 对象操作
```javascript
clone(result)     // 克隆传感器图形
merge(source)     // 合并属性
```

### 2. CustomPatternSensorVisualizer.js - 自定义模式传感器可视化器
**功能**: 将实体自定义模式传感器转换为可视化图元

#### 2.1 主要特性
- **实体映射**: 将Entity映射到CustomPatternSensor
- **方向验证**: 确保方向数据有效性
- **动态更新**: 实时更新传感器属性和位置
- **边界计算**: 计算传感器边界球
- **性能优化**: 高效的图元管理

#### 2.2 构造函数
```javascript
CustomPatternSensorVisualizer(scene, entityCollection)
```
**参数**:
- `scene`: Cesium场景对象
- `entityCollection`: 实体集合

#### 2.3 核心算法

##### 更新机制
```javascript
CustomPatternSensorVisualizer.prototype.update = function (time) {
  // 遍历所有实体
  for (let i = 0, len = entities.length; i < len; i++) {
    const entity = entities[i];
    const customPatternSensorGraphics = entity._customPatternSensor;
    
    // 检查可见性
    let show = entity.isShowing && 
               entity.isAvailable(time) && 
               Property.getValueOrDefault(customPatternSensorGraphics._show, time, true);
    
    // 获取方向数据
    let directions;
    if (show) {
      modelMatrix = entity.computeModelMatrix(time, this._modelMatrixScratch);
      directions = Property.getValueOrUndefined(customPatternSensorGraphics._directions, time);
      show = defined(modelMatrix) && defined(directions);
    }
    
    // 创建或更新图元
    if (show) {
      if (!defined(primitive)) {
        primitive = new CustomPatternSensor();
        primitive.id = entity;
        primitives.add(primitive);
        primitive.directions = directions;
        hash[entity.id] = primitive;
      } else if (!Property.isConstant(customPatternSensorGraphics._directions)) {
        primitive.directions = directions;
      }
      
      // 更新所有属性
      primitive.show = true;
      primitive.radius = Property.getValueOrDefault(customPatternSensorGraphics._radius, time, defaultRadius);
      // ... 其他属性更新
    }
  }
}
```

##### 方向数据验证
```javascript
// 确保方向数据存在且有效
directions = Property.getValueOrUndefined(customPatternSensorGraphics._directions, time);
show = defined(modelMatrix) && defined(directions);
```

##### 动态方向更新
```javascript
// 仅在方向数据非常量时更新
if (!Property.isConstant(customPatternSensorGraphics._directions)) {
  primitive.directions = directions;
}
```

#### 2.4 性能优化策略

##### 图元缓存
```javascript
// 使用哈希表缓存图元
this._hash = {};
let primitive = hash[entity.id];

// 仅在需要时创建新图元
if (!defined(primitive)) {
  primitive = new CustomPatternSensor();
  primitive.id = entity;
  primitives.add(primitive);
  hash[entity.id] = primitive;
}
```

##### 属性更新优化
```javascript
// 仅在方向数据变化时更新几何体
if (!Property.isConstant(customPatternSensorGraphics._directions)) {
  primitive.directions = directions;
}
```

#### 2.5 边界球计算
```javascript
CustomPatternSensorVisualizer.prototype.getBoundingSphere = function (entity, result) {
  const sensor = this._hash[entity.id];
  if (!defined(sensor)) {
    return BoundingSphereState.FAILED;
  }
  
  // 获取传感器位置
  Matrix4.getColumn(sensor.modelMatrix, 3, scratchCartesian4);
  Cartesian3.fromCartesian4(scratchCartesian4, result.center);
  
  // 设置半径
  result.radius = isFinite(sensor.radius) ? sensor.radius : 1000.0;
  
  return BoundingSphereState.DONE;
};
```

#### 2.6 实体集合管理
```javascript
CustomPatternSensorVisualizer.prototype._onCollectionChanged = function (entityCollection, added, removed, changed) {
  // 处理新增实体
  for (i = added.length - 1; i > -1; i--) {
    entity = added[i];
    if (defined(entity._customPatternSensor) && 
        defined(entity._position) && 
        defined(entity._orientation)) {
      entities.set(entity.id, entity);
    }
  }
  
  // 处理变更实体
  for (i = changed.length - 1; i > -1; i--) {
    entity = changed[i];
    if (defined(entity._customPatternSensor) && 
        defined(entity._position) && 
        defined(entity._orientation)) {
      entities.set(entity.id, entity);
    } else {
      removePrimitive(entity, hash, primitives);
      entities.remove(entity.id);
    }
  }
  
  // 处理移除实体
  for (i = removed.length - 1; i > -1; i--) {
    entity = removed[i];
    removePrimitive(entity, hash, primitives);
    entities.remove(entity.id);
  }
};
```

## 技术特性

### 1. 几何计算
- **球面坐标**: 基于球面坐标系的精确几何计算
- **自定义形状**: 支持任意复杂的传感器形状定义
- **动态几何**: 支持时间动态的几何变化
- **相交检测**: 与椭球和环境的精确相交计算

### 2. 渲染系统
- **多表面渲染**: 支持多种表面的独立渲染
- **材质系统**: 灵活的表面材质定义
- **深度测试**: 支持深度测试和遮挡
- **透明度**: 支持半透明渲染效果

### 3. 性能优化
- **图元缓存**: 高效的图元创建和管理
- **属性缓存**: 避免重复计算和更新
- **几何体复用**: 智能的几何体管理
- **内存管理**: 及时释放不需要的资源

### 4. 环境交互
- **地形遮挡**: 与地形和模型的遮挡计算
- **相交线**: 环境相交线的可视化
- **视域分析**: 内置的视域分析功能
- **分类渲染**: 支持地形和3D瓦片的分类渲染

## 使用场景

### 1. 复杂雷达系统
- 多波束雷达阵列
- 相控阵雷达系统
- 雷达波束扫描模式
- 复杂天线模式

### 2. 通信系统
- 多天线系统
- 波束成形技术
- 智能天线阵列
- 通信覆盖优化

### 3. 监控系统
- 多摄像头协调
- 复杂监控模式
- 智能监控算法
- 覆盖区域分析

### 4. 科学应用
- 激光雷达扫描
- 声纳阵列系统
- 光学仪器配置
- 传感器网络优化

## 配置选项

### 1. 基本几何配置
```javascript
const customPatternSensor = new CustomPatternSensorGraphics({
  show: true,
  radius: 1000.0,
  directions: [
    { clock: 0, cone: Math.PI / 4 },
    { clock: Math.PI / 2, cone: Math.PI / 4 },
    { clock: Math.PI, cone: Math.PI / 4 },
    { clock: 3 * Math.PI / 2, cone: Math.PI / 4 }
  ]
});
```

### 2. 复杂模式配置
```javascript
// 创建复杂的传感器模式
const complexDirections = [];
for (let i = 0; i < 360; i += 10) {
  const clock = (i * Math.PI) / 180;
  const cone = Math.PI / 6 + Math.sin(clock * 4) * Math.PI / 12;
  complexDirections.push({ clock, cone });
}

customPatternSensor.directions = complexDirections;
```

### 3. 表面材质配置
```javascript
customPatternSensor.lateralSurfaceMaterial = Color.BLUE.withAlpha(0.3);
customPatternSensor.showLateralSurfaces = true;
customPatternSensor.domeSurfaceMaterial = Color.RED.withAlpha(0.5);
customPatternSensor.showDomeSurfaces = true;
```

### 4. 环境交互配置
```javascript
customPatternSensor.environmentConstraint = true;
customPatternSensor.showEnvironmentOcclusion = true;
customPatternSensor.environmentOcclusionMaterial = Color.YELLOW.withAlpha(0.4);
customPatternSensor.showEnvironmentIntersection = true;
```

### 5. 视域分析配置
```javascript
customPatternSensor.showViewshed = true;
customPatternSensor.viewshedVisibleColor = Color.LIME.withAlpha(0.5);
customPatternSensor.viewshedOccludedColor = Color.RED.withAlpha(0.5);
customPatternSensor.viewshedResolution = 2048;
```

## 性能优化

### 1. 渲染优化
- **LOD支持**: 根据距离调整细节级别
- **视锥剔除**: 剔除视锥外的传感器
- **批处理**: 批量渲染多个传感器
- **GPU加速**: 利用GPU计算能力

### 2. 内存优化
- **对象池**: 重用传感器对象
- **压缩存储**: 压缩几何数据
- **延迟加载**: 按需加载传感器
- **垃圾回收**: 及时释放内存

### 3. 计算优化
- **缓存机制**: 缓存计算结果
- **增量更新**: 仅更新变化部分
- **并行计算**: 支持多线程计算
- **算法优化**: 优化几何计算算法

## 扩展功能

### 1. 自定义传感器
- 支持完全自定义的传感器类型
- 可扩展的传感器接口
- 插件式传感器系统
- 动态传感器模式

### 2. 高级分析
- 传感器网络分析
- 覆盖优化算法
- 干扰分析工具
- 性能评估系统

### 3. 交互功能
- 传感器编辑工具
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
- `CustomPatternSensor`: 自定义模式传感器图元
- `Spherical`: 球面坐标
- `Matrix4`: 变换矩阵
- `Cartesian3`: 3D向量

### 3. 渲染系统
- `PrimitiveCollection`: 图元集合
- `AssociativeArray`: 关联数组
- `BoundingSphereState`: 边界球状态
- `ClassificationType`: 分类类型

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

`CustomPatternSensorGraphics.js` 和 `CustomPatternSensorVisualizer.js` 提供了完全自定义的传感器可视化解决方案，包括灵活的形状定义、高效的渲染系统、强大的环境交互功能和先进的视域分析能力。通过支持任意复杂的传感器模式，该系统能够满足各种复杂的应用需求，为雷达、通信、监控等应用领域提供了强大的技术支撑。该系统具有良好的扩展性和维护性，是3DTiles位置编辑器项目中的重要组成部分。
