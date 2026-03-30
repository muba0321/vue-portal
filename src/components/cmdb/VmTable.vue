<template>
  <div class="vm-table">
    <el-table
      :data="list"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      
      <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="vm-name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)" size="small">
            <i :class="getStatusIcon(scope.row.status)"></i>
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="primary_ip" label="IP 地址" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.primary_ip || '-' }}
        </template>
      </el-table-column>
      
      <el-table-column prop="vcpus" label="CPU" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.vcpus || 0 }}核
        </template>
      </el-table-column>
      
      <el-table-column prop="memory" label="内存" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.memory || 0 }}GB
        </template>
      </el-table-column>
      
      <el-table-column prop="disk" label="磁盘" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.disk || 0 }}GB
        </template>
      </el-table-column>
      
      <el-table-column prop="owner" label="负责人" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.owner || '-' }}
        </template>
      </el-table-column>
      
      <el-table-column label="标签" min-width="150">
        <template slot-scope="scope">
          <el-tag
            v-for="tag in (scope.row.tags || []).slice(0, 3)"
            :key="tag"
            size="mini"
            type="info"
            class="mr-5"
          >
            {{ tag }}
          </el-tag>
          <el-tag
            v-if="(scope.row.tags || []).length > 3"
            size="mini"
            type="info"
          >
            +{{ (scope.row.tags || []).length - 3 }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$emit('edit', scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="$emit('delete', scope.row)"
            class="text-danger"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container" v-if="total > 0">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="$emit('size-change', $event)"
        @current-change="$emit('page-change', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VmTable',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    getStatusType(status) {
      const typeMap = {
        active: 'success',
        stopped: 'info',
        offline: 'danger'
      }
      return typeMap[status] || 'info'
    },
    
    getStatusText(status) {
      const textMap = {
        active: '运行中',
        stopped: '已停止',
        offline: '离线'
      }
      return textMap[status] || status
    },
    
    getStatusIcon(status) {
      const iconMap = {
        active: 'el-icon-circle-check',
        stopped: 'el-icon-circle-close',
        offline: 'el-icon-warning-outline'
      }
      return iconMap[status] || 'el-icon-info'
    },
    
    handleSelectionChange(selection) {
      const ids = selection.map(item => item.id)
      this.$emit('selection-change', ids)
    }
  }
}
</script>

<style scoped>
.vm-table {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.vm-name {
  font-weight: 600;
  color: #409EFF;
}

.text-danger {
  color: #F56C6C;
}

.mr-5 {
  margin-right: 5px;
}

.pagination-container {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  border-top: 1px solid #ebeef5;
}

@media screen and (max-width: 768px) {
  .pagination-container {
    justify-content: center;
  }
}
</style>
