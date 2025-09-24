# Core 文件夹功能文档

## 概述
`Source/Core` 文件夹包含了3DTiles位置编辑器项目的核心几何计算和初始化功能模块。该模块提供了扇形几何体、球形多边形等基础几何计算功能，以及传感器和几何体的初始化系统。

## 文件夹结构
```
Source/Core/
├── FanGeometry.js           # 扇形几何体计算
├── FanOutlineGeometry.js    # 扇形轮廓几何体
├── initializeGeometry.js     # 几何体初始化系统
├── initializeSensors.js      # 传感器初始化系统
└── SphericalPolygon.js      # 球形多边形计算
```

## 核心功能模块

### 1. FanGeometry.js - 扇形几何体
**功能**: 描述围绕原点的三角形扇形几何体

#### 1.1 主要特性
- **扇形定义**: 基于球面坐标方向的扇形几何体
- **灵活半径**: 支持固定半径或每方向独立半径
- **完整顶点**: 支持位置、法向量、切线、副切线、纹理坐标
- **三角化**: 自动生成三角形索引

#### 1.2 构造函数参数
```javascript
FanGeometry(options)
```
**参数**:
- `directions`: 球面坐标方向数组，定义扇形边界
- `radius`: 扇形半径（可选）
- `perDirectionRadius`: 是否使用每方向独立半径（默认false）
- `vertexFormat`: 顶点属性格式（默认VertexFormat.DEFAULT）

#### 1.3 核心算法

##### 方向处理
```javascript
// 转换球面坐标到笛卡尔坐标
direction = Cartesian3.fromSpherical(sphericalDirections[i]);

// 移除相邻重复点
if (!Cartesian3.equals(directions[i - 1], direction)) {
  directions.push(direction);
  normalizedDirections.push(Cartesian3.normalize(direction, new Cartesian3()));
}
```

##### 顶点生成
- **位置顶点**: 原点 + 方向点对
- **法向量**: 相邻方向的叉积
- **切线**: 副切线与法向量的叉积
- **纹理坐标**: 基于方向的S坐标映射

##### 索引生成
```javascript
// 三角形扇形索引模式
indices[x++] = i;        // 原点
indices[x++] = i + 3;    // 下一个方向点
indices[x++] = i + 1;    // 当前方向点
```

#### 1.4 几何属性
- **边界球**: 基于最大半径的包围球
- **图元类型**: TRIANGLES
- **顶点格式**: 支持完整顶点属性

### 2. FanOutlineGeometry.js - 扇形轮廓
**功能**: 扇形几何体的轮廓线表示

#### 2.1 主要特性
- **轮廓环**: 支持多个同心轮廓环
- **线条渲染**: 使用LINES图元类型
- **环形分布**: 从外到内等距分布的轮廓环
- **简化表示**: 仅包含位置属性

#### 2.2 构造函数参数
```javascript
FanOutlineGeometry(options)
```
**参数**:
- `directions`: 球面坐标方向数组
- `radius`: 扇形半径（可选）
- `perDirectionRadius`: 每方向独立半径（可选）
- `numberOfRings`: 轮廓环数量（默认6）
- `vertexFormat`: 顶点属性格式

#### 2.3 核心算法

##### 轮廓环生成
```javascript
for (ring = 0; ring < numberOfRings; ring++) {
  for (i = 0; i < directionsLength; i++) {
    const ringRadius = (currentRadius / numberOfRings) * (ring + 1);
    // 生成轮廓点
  }
}
```

##### 索引生成
```javascript
// 线条索引模式
for (i = 0; i < directionsLength - 1; i++) {
  indices[x++] = i + offset;
  indices[x++] = i + 1 + offset;
}
// 闭合轮廓
indices[x++] = i + offset;
indices[x++] = 0 + offset;
```

### 3. SphericalPolygon.js - 球形多边形
**功能**: 单位球面上的多边形计算

#### 3.1 主要特性
- **凸包计算**: 自动计算球形多边形的凸包
- **边界锥**: 计算最小包围锥
- **凸性检测**: 判断多边形是否为凸多边形
- **复杂几何**: 支持带洞的复杂多边形

#### 3.2 核心算法

##### 凸包算法
```javascript
SphericalPolygon.findConvexHull(directions, sign, initialIndex, finalIndex, hull)
```
- 使用Graham扫描算法的球形版本
- 支持正负方向的凸包计算
- 自动处理洞的检测和生成

##### 边界锥计算
```javascript
computeMinimumBoundingConeFromThreePoints(p1, p2, p3, axis)
computeCircumscribingConeFromTwoPoints(p1, p2, axis)
```
- 三点确定最小包围锥
- 两点确定外接锥
- 优化算法选择最佳边界锥

#### 3.3 属性计算
- **法向量**: 相邻边的叉积
- **角平分线**: 相邻方向的平均值
- **凸性**: 基于法向量方向的一致性
- **参考轴**: 最小包围锥的轴方向

### 4. initializeGeometry.js - 几何体初始化
**功能**: 几何体相关功能的初始化系统

#### 4.1 初始化内容
```javascript
export default function initializeGeometry() {
  // 注册可视化器
  DataSourceDisplay.registerVisualizer(VectorVisualizer);
  
  // 注册CZML更新器
  CzmlDataSource.registerUpdater(processFan);
  CzmlDataSource.registerUpdater(processVector);
  
  // 注册实体类型
  Entity.registerEntityType("fan", FanGraphics);
  Entity.registerEntityType("vector", VectorGraphics);
  
  // 注册几何体更新器
  GeometryVisualizer.registerUpdater(FanGeometryUpdater);
}
```

#### 4.2 支持的功能
- **扇形图形**: FanGraphics实体类型
- **向量图形**: VectorGraphics实体类型
- **CZML支持**: 扇形和向量的CZML处理
- **可视化器**: 向量可视化器

### 5. initializeSensors.js - 传感器初始化
**功能**: 传感器相关功能的初始化系统

#### 5.1 初始化内容
```javascript
export default function initializeSensors() {
  // 注册传感器可视化器
  DataSourceDisplay.registerVisualizer(ConicSensorVisualizer);
  DataSourceDisplay.registerVisualizer(CustomPatternSensorVisualizer);
  DataSourceDisplay.registerVisualizer(RectangularSensorVisualizer);
  
  // 注册CZML更新器
  CzmlDataSource.registerUpdater(processRectangularSensor);
  CzmlDataSource.registerUpdater(processConicSensor);
  CzmlDataSource.registerUpdater(processCustomPatternSensor);
  
  // 注册实体类型
  Entity.registerEntityType("conicSensor", ConicSensorGraphics);
  Entity.registerEntityType("customPatternSensor", CustomPatternSensorGraphics);
  Entity.registerEntityType("rectangularSensor", RectangularSensorGraphics);
}
```

#### 5.2 支持的传感器
- **圆锥传感器**: ConicSensor
- **矩形传感器**: RectangularSensor
- **自定义模式传感器**: CustomPatternSensor

## 技术特性

### 1. 几何计算
- **球面坐标**: 完整的球面坐标系统支持
- **向量运算**: 高效的3D向量计算
- **几何变换**: 支持各种几何变换操作
- **边界计算**: 精确的边界球和边界锥计算

### 2. 渲染优化
- **索引优化**: 高效的三角形索引生成
- **顶点复用**: 减少重复顶点数据
- **内存管理**: 优化的内存使用模式
- **异步处理**: 支持Web Worker异步计算

### 3. 数学算法
- **凸包算法**: Graham扫描算法的球形版本
- **边界算法**: 最小包围锥计算
- **插值算法**: 平滑的几何插值
- **数值稳定**: 数值稳定的计算实现

## 使用场景

### 1. 传感器可视化
- 雷达扫描范围显示
- 激光雷达覆盖区域
- 通信天线覆盖范围
- 监控摄像头视野

### 2. 几何分析
- 球形多边形面积计算
- 几何体相交检测
- 空间关系分析
- 几何变换操作

### 3. 科学可视化
- 天体物理模拟
- 地球科学应用
- 工程分析工具
- 数据可视化

## 配置选项

### 1. 扇形几何体配置
```javascript
const fanGeometry = new FanGeometry({
  directions: sphericalDirections,    // 球面方向数组
  radius: 100.0,                     // 固定半径
  perDirectionRadius: false,          // 是否使用每方向半径
  vertexFormat: VertexFormat.DEFAULT  // 顶点格式
});
```

### 2. 轮廓几何体配置
```javascript
const outlineGeometry = new FanOutlineGeometry({
  directions: sphericalDirections,    // 球面方向数组
  radius: 100.0,                     // 半径
  numberOfRings: 6,                   // 轮廓环数量
  vertexFormat: VertexFormat.POSITION_ONLY // 仅位置属性
});
```

### 3. 球形多边形配置
```javascript
const sphericalPolygon = new SphericalPolygon(vertices);
// 自动计算凸包、边界锥等属性
```

## 性能优化

### 1. 计算优化
- **缓存机制**: 缓存计算结果
- **增量更新**: 仅更新变化的部分
- **并行计算**: 支持多线程计算
- **内存复用**: 重用临时对象

### 2. 渲染优化
- **LOD支持**: 层次细节渲染
- **视锥剔除**: 视锥外几何体剔除
- **批处理**: 批量渲染优化
- **GPU加速**: 利用GPU计算能力

### 3. 内存优化
- **对象池**: 重用几何对象
- **压缩存储**: 压缩几何数据
- **延迟加载**: 按需加载几何体
- **垃圾回收**: 及时释放内存

## 扩展功能

### 1. 自定义几何体
- 支持自定义几何体类型
- 可扩展的几何计算接口
- 插件式几何体系统

### 2. 高级算法
- 更复杂的凸包算法
- 高级边界计算
- 几何体简化算法

### 3. 交互功能
- 几何体编辑工具
- 实时几何体更新
- 用户交互反馈

## 依赖关系

### 1. Cesium Engine
- `Cartesian3`: 3D向量计算
- `Spherical`: 球面坐标
- `Geometry`: 几何体基类
- `BoundingSphere`: 边界球计算

### 2. 几何系统
- `GeometryAttribute`: 几何属性
- `GeometryAttributes`: 几何属性集合
- `PrimitiveType`: 图元类型
- `VertexFormat`: 顶点格式

### 3. 数学库
- 向量运算函数
- 矩阵变换函数
- 几何计算函数
- 数值计算函数

## 维护说明

### 1. 算法维护
- 定期检查算法正确性
- 优化计算性能
- 更新数学实现
- 测试边界情况

### 2. 性能监控
- 监控计算性能
- 检查内存使用
- 优化渲染效率
- 分析瓶颈问题

### 3. 兼容性
- 确保Cesium版本兼容
- 测试浏览器兼容性
- 验证移动设备支持
- 检查WebGL兼容性

## 总结

`Source/Core` 文件夹提供了3DTiles位置编辑器项目的核心几何计算功能，包括扇形几何体、球形多边形等基础几何计算，以及传感器和几何体的初始化系统。通过高效的算法实现和性能优化，为上层应用提供了强大的几何计算基础，支持复杂的3D可视化和分析功能。该模块是项目的重要基础设施，为传感器可视化、几何分析等高级功能提供了可靠的技术支撑。
