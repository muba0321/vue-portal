<template>
  <el-card class="vm-card" shadow="hover">
    <div class="vm-card-header">
      <div class="vm-name">
        <el-tag :type="statusType" size="small" class="status-tag">
          <i :class="statusIcon"></i>
          {{ statusText }}
        </el-tag>
        <span class="name-text">{{ vm.name }}</span>
      </div>
      <div class="vm-actions">
        <el-button type="text" size="small" @click="$emit('edit', vm)">
          <i class="el-icon-edit"></i>
        </el-button>
        <el-button type="text" size="small" @click="$emit('delete', vm)">
          <i class="el-icon-delete"></i>
        </el-button>
      </div>
    </div>
    
    <div class="vm-card-body">
      <div class="vm-info-row">
        <span class="info-label"><i class="el-icon-connection"></i> IP:</span>
        <span class="info-value">{{ vm.primary_ip || '-' }}</span>
      </div>
      <div class="vm-info-row">
        <span class="info-label"><i class="el-icon-cpu"></i> CPU:</span>
        <span class="info-value">{{ vm.vcpus || 0 }} 核</span>
      </div>
      <div class="vm-info-row">
        <span class="info-label"><i class="el-icon-monitor"></i> 内存:</span>
        <span class="info-value">{{ vm.memory || 0 }} GB</span>
      </div>
      <div class="vm-info-row">
        <span class="info-label"><i class="el-icon-coin"></i> 磁盘:</span>
        <span class="info-value">{{ vm.disk || 0 }} GB</span>
      </div>
      <div class="vm-info-row" v-if="vm.owner">
        <span class="info-label"><i class="el-icon-user"></i> 负责人:</span>
        <span class="info-value">{{ vm.owner }}</span>
      </div>
    </div>
    
    <div class="vm-card-footer" v-if="vm.tags && vm.tags.length">
      <el-tag
        v-for="tag in vm.tags"
        :key="tag"
        size="mini"
        type="info"
        class="tag-item"
      >
        {{ tag }}
      </el-tag>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'VmCard',
  props: {
    vm: {
      type: Object,
      required: true
    }
  },
  
  computed: {
    statusType() {
      const statusMap = {
        active: 'success',
        stopped: 'info',
        offline: 'danger'
      }
      return statusMap[this.vm.status] || 'info'
    },
    
    statusText() {
      const textMap = {
        active: '运行中',
        stopped: '已停止',
        offline: '离线'
      }
      return textMap[this.vm.status] || this.vm.status
    },
    
    statusIcon() {
      const iconMap = {
        active: 'el-icon-circle-check',
        stopped: 'el-icon-circle-close',
        offline: 'el-icon-warning-outline'
      }
      return iconMap[this.vm.status] || 'el-icon-info'
    }
  }
}
</script>

<style scoped>
.vm-card {
  margin-bottom: 16px;
  transition: transform 0.3s;
}

.vm-card:hover {
  transform: translateY(-2px);
}

.vm-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.vm-name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.name-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.vm-actions {
  display: flex;
  gap: 4px;
}

.vm-card-body {
  margin-bottom: 12px;
}

.vm-info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.info-label {
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

.vm-card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.tag-item {
  margin-right: 0;
}

@media screen and (max-width: 768px) {
  .vm-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .vm-actions {
    align-self: flex-end;
  }
}
</style>
