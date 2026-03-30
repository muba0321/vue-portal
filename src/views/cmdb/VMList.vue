<template>
  <div class="vm-list page-container">
    <el-card shadow="never">
      <div slot="header" class="card-header">
        <span>虚拟机列表</span>
        <el-button type="primary" size="small" @click="$router.push('/')">
          返回首页
        </el-button>
      </div>
      
      <p>虚拟机列表页面 - 功能已整合到首页 Dashboard</p>
      <p class="mt-20">
        <el-button type="primary" @click="$router.push('/')">前往首页</el-button>
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'VMList'
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}
</style>
