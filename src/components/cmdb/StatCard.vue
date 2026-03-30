<template>
  <el-card :class="['stat-card', `stat-card--${type}`]" shadow="hover">
    <div class="stat-content">
      <div class="stat-icon">
        <i :class="icon"></i>
      </div>
      <div class="stat-info">
        <div class="stat-value">{{ value }}</div>
        <div class="stat-label">{{ label }}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
    },
    icon: {
      type: String,
      default: 'el-icon-document'
    }
  }
}
</script>

<style scoped>
.stat-card {
  border: none;
  overflow: hidden;
}

.stat-card--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card--success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card--warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card--danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-card--info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  font-size: 48px;
  opacity: 0.3;
  color: #fff;
}

.stat-info {
  text-align: right;
  color: #fff;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

@media screen and (max-width: 768px) {
  .stat-icon {
    font-size: 32px;
  }
  
  .stat-value {
    font-size: 28px;
  }
  
  .stat-label {
    font-size: 12px;
  }
}
</style>
