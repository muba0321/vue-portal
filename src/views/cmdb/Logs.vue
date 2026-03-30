<template>
  <div class="logs page-container">
    <el-card shadow="never">
      <div slot="header" class="card-header">
        <span>操作日志</span>
        <el-button type="primary" size="small" @click="$router.push('/')">
          返回首页
        </el-button>
      </div>
      
      <el-table
        :data="logs"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="created_at" label="时间" width="180">
          <template slot-scope="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="vm_name" label="虚拟机" width="150">
          <template slot-scope="scope">
            {{ scope.row.vm_name || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column prop="action" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="getActionType(scope.row.action)" size="small">
              {{ getActionText(scope.row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="operator" label="操作人" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.operator || 'system' }}
          </template>
        </el-table-column>
        
        <el-table-column label="详情" min-width="300">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <pre>{{ JSON.stringify(scope.row, null, 2) }}</pre>
              <div slot="reference" class="detail-btn">查看详情</div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { logApi } from '@/api'

export default {
  name: 'Logs',
  
  data() {
    return {
      logs: [],
      total: 0,
      page: 1,
      pageSize: 20,
      loading: false
    }
  },
  
  created() {
    this.fetchLogs()
  },
  
  methods: {
    fetchLogs() {
      this.loading = true
      logApi.getList({
        page: this.page,
        page_size: this.pageSize
      })
        .then(response => {
          const data = response.data || response
          this.logs = data.list || []
          this.total = data.total || 0
        })
        .catch(error => {
          console.error('Failed to fetch logs:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    
    handlePageChange(page) {
      this.page = page
      this.fetchLogs()
    },
    
    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      return date.toLocaleString('zh-CN')
    },
    
    getActionType(action) {
      const typeMap = {
        create: 'success',
        update: 'warning',
        delete: 'danger',
        sync: 'info'
      }
      return typeMap[action] || 'info'
    },
    
    getActionText(action) {
      const textMap = {
        create: '创建',
        update: '更新',
        delete: '删除',
        sync: '同步'
      }
      return textMap[action] || action
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-btn {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}

.pagination-container {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
