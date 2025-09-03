# 布局组件

> 🏗️ 提供标准化的页面布局结构，快速构建一致的中台界面。

## 🎯 设计原则

布局组件是中台系统的骨架，好的布局设计能够：

- **统一体验** - 保持整个应用的视觉一致性
- **提升效率** - 减少重复的布局代码编写
- **响应式设计** - 适配不同屏幕尺寸和设备
- **易于维护** - 集中管理布局逻辑，便于后期调整

## 📦 布局体系

### 页面级布局

构建完整页面结构的核心布局组件。

| 组件                                         | 描述     | 适用场景                       |
| -------------------------------------------- | -------- | ------------------------------ |
| [PageContainer](../components/PageContainer) | 页面容器 | 所有业务页面的基础容器         |
| [PageHeader](../components/PageHeader)       | 页面头部 | 需要标题、面包屑、操作区的页面 |

### 功能区域布局

针对特定功能区域的专用布局组件。

| 组件                                   | 描述       | 适用场景               |
| -------------------------------------- | ---------- | ---------------------- |
| [ListPage](../components/ListPage)     | 列表页容器 | 数据列表、管理后台页面 |
| [DetailPage](../components/DetailPage) | 详情页布局 | 数据详情、表单详情页面 |

## 🚀 快速开始

### 基础页面布局

```vue
<template>
  <!-- 最简单的页面结构 -->
  <PageContainer title="用户管理">
    <template #extra>
      <el-button type="primary">
        新增用户
      </el-button>
    </template>

    <!-- 页面内容 -->
    <div class="page-content">
      <SearchForm :fields="searchFields" />
      <ProTable :columns="columns" :data="data" />
    </div>
  </PageContainer>
</template>
```

### 列表页面布局

```vue
<template>
  <!-- 专为列表页设计的布局 -->
  <ListPage :search-form="searchFields" :header-actions="actions" :columns="columns" :data="data" />
  <!-- or -->
  <ListPage>
    <template #search>
      <SearchForm :fields="searchFields" />
    </template>

    <template #actions>
      <el-button type="primary">
        批量操作
      </el-button>
      <el-button>导出数据</el-button>
    </template>

    <template #content>
      <ProTable :columns="columns" :data="data" />
    </template>
  </ListPage>
</template>
```

### 详情页面布局

```vue
<template>
  <!-- 详情页专用布局 -->
  <DetailPage :title="userInfo.name" :breadcrumb="breadcrumb">
    <template #actions>
      <el-button type="primary">
        编辑
      </el-button>
      <el-button>删除</el-button>
    </template>

    <template #content>
      <el-descriptions :data="userInfo" />
    </template>
  </DetailPage>
</template>
```

## 🎨 布局组合

### 复杂页面结构

```vue
<template>
  <PageContainer class="dashboard-page">
    <!-- 页面头部 -->
    <PageHeader
      title="数据看板"
      subtitle="实时业务数据概览"
    >
      <template #breadcrumb>
        <el-breadcrumb>
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据分析</el-breadcrumb-item>
          <el-breadcrumb-item>数据看板</el-breadcrumb-item>
        </el-breadcrumb>
      </template>

      <template #actions>
        <el-button-group>
          <el-button>今天</el-button>
          <el-button>本周</el-button>
          <el-button type="primary">
            本月
          </el-button>
        </el-button-group>
      </template>
    </PageHeader>

    <!-- 页面内容 -->
    <div class="dashboard-content">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <StatCard title="总用户数" :value="totalUsers" />
        <StatCard title="今日新增" :value="todayNewUsers" />
        <StatCard title="活跃用户" :value="activeUsers" />
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <UserTrendChart />
        <OrderAnalytics />
      </div>
    </div>
  </PageContainer>
</template>
```

## 💡 最佳实践

```vue
<!-- 根据页面类型选择合适的布局 -->

<!-- 数据列表页 -->
<ListPage ... />

<!-- 详情展示页 -->
<DetailPage :title="title" ... />

<!-- 普通业务页 -->
<PageContainer :title="title">
  <div>业务内容</div>
</PageContainer>
```

## 🔗 相关链接

- [Element Plus Layout](https://element-plus.org/zh-CN/component/layout.html) - 了解基础布局组件
- [CSS Grid MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout) - CSS Grid 布局指南
- [Flexbox MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout) - Flexbox 布局指南
