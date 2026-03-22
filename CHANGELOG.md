## NEXT_VERSION

## [1.6.1](https://github.com/ADJazzzz/BLSPAM/compare/1.6.0...1.6.1) 2026-03-22

### 修复

- 当直接关闭浏览器时，不清理关闭时残留信息[(#45)](https://github.com/ADJazzzz/BLSPAM/issues/45)

## [1.6.0](https://github.com/ADJazzzz/BLSPAM/compare/1.5.0...1.6.0) 2026-03-19

### 新增

- 多房间运行提示[(#42)](https://github.com/ADJazzzz/BLSPAM/issues/42)
- 独立显示房间表情[(#43)](https://github.com/ADJazzzz/BLSPAM/issues/43)
- 独立显示所选表情[(#43)](https://github.com/ADJazzzz/BLSPAM/issues/43)

### 修复

- 在回复弹幕中+1和复制没有带上@他人[(#40)](https://github.com/ADJazzzz/BLSPAM/issues/40)
- 在直接渲染模式中复制失焦
- 在活动直播间中无法获取正确主题
- 表情独轮车页面在最后表情选择页为房间表情时，在其他直播间打开后表情选择页为空

### 调整

- 加一和复制按钮样式
- 文本输入框默认行数现在默认为`5`
- 各直播间表情独立储存
- 更新自动构建版本

### 更新

- 主要依赖项
- README文档

## [1.5.0](https://github.com/ADJazzzz/BLSPAM/compare/1.4.3...1.5.0) 2026-01-27

### 新增

- 更直接的+1和弹幕复制[(#37)](https://github.com/ADJazzzz/BLSPAM/issues/37)
- 为文字独轮车添加文本表情功能

### 调整

- 文字池独轮车现改为收藏夹，功能不变
- 独轮车的默认时间间隔改为5秒
- 整理了以前混乱的类型声明
- 解决了一些已知问题

### 更新

- 更新主要依赖项

## [1.4.3](https://github.com/ADJazzzz/BLSPAM/compare/1.4.2...1.4.3) 2025-09-03

### 新增

- 显示弹幕详情

### 调整

- 调整配置合并逻辑
- 完善更新功能

### 更新

- 更新主要依赖项

## [1.4.2](https://github.com/ADJazzzz/BLSPAM/compare/1.4.1...1.4.2) 2025-08-12

### 调整

- 现在文字独轮车最大字数限制从API获取[(#34)](https://github.com/ADJazzzz/BLSPAM/issues/34)

### 更新

- 更新主要依赖项

## [1.4.1](https://github.com/ADJazzzz/BLSPAM/compare/1.4.0...1.4.1) 2025-05-18

### 修复

- 修复非大航海弹幕但有聊天气泡框的弹幕无法+1和复制

### 更新

- 更新主要依赖项

## [1.4.0](https://github.com/ADJazzzz/BLSPAM/compare/1.3.12...1.4.0) 2025-04-28

### 新增

- 文字池内容可发送到文字独轮车[(#30)](https://github.com/ADJazzzz/BLSPAM/issues/30)

### 修复

- 修复因B站修改cookie值导致无法发出弹幕[(#31)](https://github.com/ADJazzzz/BLSPAM/issues/31)

### 更新

- 更新主要依赖项

## [1.3.12](https://github.com/ADJazzzz/BLSPAM/compare/1.3.11...1.3.12) 2025-03-01

### 调整

- 添加说明
- 现在在启动独轮车时，立即发送一次消息[(#28)](https://github.com/ADJazzzz/BLSPAM/pull/28)
- 优化发送逻辑

### 更新

- 更新主要依赖项

## [1.3.11](https://github.com/ADJazzzz/BLSPAM/compare/1.3.10...1.3.11) 2025-02-12

### 修复

- 修复版本号对比问题

## [1.3.10](https://github.com/ADJazzzz/BLSPAM/compare/1.3.9...1.3.10) 2025-02-12

### 更新

- 更新主要依赖项

### 调整

- 添加默认模块加载重试机制

## [1.3.9](https://github.com/ADJazzzz/BLSPAM/compare/1.3.8...1.3.9) 2024-09-05

### 修复

- 修复因注入过早导致控制面板错位

## [1.3.8](https://github.com/ADJazzzz/BLSPAM/compare/1.3.7...1.3.8) 2024-09-02

### 调整

- 适配B站直播新旧两种UI布局

## [1.3.7](https://github.com/ADJazzzz/BLSPAM/compare/1.3.6...1.3.7) 2024-08-22

### 调整

- 适配B站直播新UI ~~（还在旧版UI的同学请勿更新）~~

## [1.3.6](https://github.com/ADJazzzz/BLSPAM/compare/1.3.5...1.3.6) 2024-08-17

### 调整

- 调整弹幕+1和复制模块
- 增加保持独轮车功能开启的相关提醒[(#20)](https://github.com/ADJazzzz/BLSPAM/issues/20)

## [1.3.5](https://github.com/ADJazzzz/BLSPAM/compare/1.3.4...1.3.5) 2024-08-10

### 新增

- 适配深色模式（自动跟随B站官方实验室中的深色模式）

### 修复

- 修复通用表情显示问题
- 过滤无效表情

### 调整

- B站相关API调整
- 更改CDN [unpkg => jsdelivr](https://www.jsdelivr.com)

## [1.3.4](https://github.com/ADJazzzz/BLSPAM/compare/1.3.3...1.3.4) 2024-08-01

### 修复

- 修复网页字体大小被naive-ui全局样式放大[(#16)](https://github.com/ADJazzzz/BLSPAM/issues/16)

## [1.3.3](https://github.com/ADJazzzz/BLSPAM/compare/1.3.2...1.3.3) 2024-07-21

### 修复

- 修复短弹幕无法停止的问题

## [1.3.2](https://github.com/ADJazzzz/BLSPAM/compare/1.3.1...1.3.2) 2024-07-21

### 调整

- 回退更新提示

## [1.3.1](https://github.com/ADJazzzz/BLSPAM/compare/1.3.0...1.3.1) 2024-07-21

### 调整

- 调整更新提示

## [1.3.0](https://github.com/ADJazzzz/BLSPAM/compare/1.2.0...1.3.0) 2024-07-21

### 新增

- 弹幕+1[(#10)](https://github.com/ADJazzzz/BLSPAM/issues/10)
- 弹幕复制[(#11)](https://github.com/ADJazzzz/BLSPAM/issues/11)

### 调整

- 调整自动检测更新
- 相关细节调整

## [1.2.0](https://github.com/ADJazzzz/BLSPAM/compare/1.1.2...1.2.0) 2024-03-23

### 新增

- 自动检测更新

### 调整

- 调整表情大小

## [1.1.2](https://github.com/ADJazzzz/BLSPAM/compare/1.1.1...1.1.2) 2024-01-25

### 调整

- 调整入口样式

## [1.1.1](https://github.com/ADJazzzz/BLSPAM/compare/1.1.0...1.1.1) 2024-01-16

### 新增

- 保持独轮车开关状态

## [1.1.0](https://github.com/ADJazzzz/BLSPAM/compare/1.0.4...1.1.0) 2024-01-10

### 新增

- 时间限制功能[(#4)](https://github.com/ADJazzzz/BLSPAM/issues/4)
- 文字弹幕池功能[(#5)](https://github.com/ADJazzzz/BLSPAM/issues/5)

### 调整

- 输入时间调整为秒
- UI调整

## [1.0.4](https://github.com/ADJazzzz/BLSPAM/compare/1.0.3...1.0.4) 2023-12-24

### 修复

- 修复表情全选功能会选上没解锁表情

## [1.0.3](https://github.com/ADJazzzz/BLSPAM/compare/1.0.2...1.0.3) 2023-12-16

### 调整

- 修复侧边栏边框位置错误
- 添加分割线分离表情与设置

## [1.0.2](https://github.com/ADJazzzz/BLSPAM/compare/1.0.1...1.0.2) 2023-12-09

### 调整

- 持久化边栏折叠状态
- 调整Popover位置和大小

## 1.0.1 2023-12-06

### 新增

- 添加对没解锁表情的禁用判断

### 修复

- 修复短号直播间无法获取表情包
- 修复部分表情包不显示名称

## 1.0.0 2023-12-06

- 完成基础功能
