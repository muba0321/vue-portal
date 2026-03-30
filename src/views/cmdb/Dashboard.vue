<template>
  <div class="cmdb-dashboard">
    <!-- 顶部工具栏 -->
    <el-card class="toolbar-card" shadow="never">
      <div class="toolbar-left">
        <el-input 
          v-model="filters.search" 
          placeholder="快速搜索"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleSearch"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        
        <el-select 
          v-model="filters.cluster" 
          placeholder="集群" 
          clearable
          style="width: 180px; margin-left: 12px"
        >
          <el-option label="Infrastructure-Cluster" value="Infrastructure-Cluster" />
          <el-option label="K8s-Production" value="K8s-Production" />
          <el-option label="OpenClaw-Main" value="OpenClaw-Main" />
        </el-select>
        
        <el-select 
          v-model="filters.status" 
          placeholder="状态" 
          clearable
          style="width: 120px; margin-left: 12px"
        >
          <el-option label="在线" value="running" />
          <el-option label="离线" value="stopped" />
          <el-option label="异常" value="error" />
        </el-select>
        
        <el-select 
          v-model="filters.tenant" 
          placeholder="租户" 
          clearable
          style="width: 120px; margin-left: 12px"
        >
          <el-option label="OpenClaw" value="OpenClaw" />
        </el-select>
        
        <el-button type="primary" @click="handleSearch" style="margin-left: 12px">
          <i class="el-icon-search"></i> 查询
        </el-button>
        <el-button @click="handleReset">
          <i class="el-icon-refresh"></i> 重置
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <el-button type="success" @click="handleAdd">
          <i class="el-icon-plus"></i> 添加
        </el-button>
        <el-button type="primary" @click="handleImport">
          <i class="el-icon-upload"></i> 导入
        </el-button>
        <el-button type="warning" @click="handleExport">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
    </el-card>

    <!-- 虚拟机列表 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="result-info">
          <span class="result-label">结果</span>
          <el-tag size="small" type="success">{{ vms.length }}</el-tag>
          <el-button type="text" size="small" @click="showFilterPanel">
            <i class="el-icon-filter"></i> 筛选
          </el-button>
        </div>
        <el-dropdown @command="handleColumnSetting">
          <el-button size="small">
            <i class="el-icon-setting"></i> 列设置
          </el-button>
        </el-dropdown>
      </div>
      
      <el-table 
        :data="vms" 
        v-loading="loading"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        
        <el-table-column prop="cluster" label="集群" min-width="140">
          <template slot-scope="scope">
            <el-tag size="small" :type="getClusterType(scope.row.cluster)">
              {{ scope.row.cluster }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="external_ip" label="外部 IP" width="130" />
        
        <el-table-column prop="internal_ip" label="内部 IP" width="130" />
        
        <el-table-column prop="description" label="描述" min-width="220" show-overflow-tooltip />
        
        <el-table-column prop="vm_name" label="名称" min-width="140">
          <template slot-scope="scope">
            <el-tag size="small" effect="plain">{{ scope.row.vm_name }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="70" align="center">
          <template slot-scope="scope">
            <el-tag size="small" type="success">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="tenant" label="租户" width="100" align="center">
          <template slot-scope="scope">
            <span style="color: #67C23A">{{ scope.row.tenant }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="cpu_cores" label="VCPUS" width="70" align="center">
          <template slot-scope="scope">
            {{ scope.row.cpu_cores }}
          </template>
        </el-table-column>
        
        <el-table-column prop="memory_gb" label="内存 (MB)" width="90" align="center">
          <template slot-scope="scope">
            {{ scope.row.memory_gb * 1024 }}
          </template>
        </el-table-column>
        
        <el-table-column prop="disk_gb" label="硬盘" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.disk_gb }} MB
          </template>
        </el-table-column>
        
        <el-table-column prop="access_url" label="访问 URL" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link 
              v-if="scope.row.access_url" 
              :href="scope.row.access_url" 
              type="primary" 
              target="_blank"
              :underline="false"
            >
              {{ getDomain(scope.row.access_url) }}
            </el-link>
            <span v-else style="color: #C0C4CC">-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              type="warning" 
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.row)"
            />
            <el-button 
              size="mini" 
              type="danger" 
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 批量操作栏 -->
      <div v-if="selectedRows.length > 0" class="batch-actions">
        <el-button size="small" type="success">
          <i class="el-icon-plus"></i> 添加组件
        </el-button>
        <el-button size="small" type="warning" @click="handleBatchEdit">
          <i class="el-icon-edit"></i> 修改选中项
        </el-button>
        <el-button size="small" type="warning" @click="handleBatchRename">
          <i class="el-icon-edit-outline"></i> 重命名选中项
        </el-button>
        <el-button size="small" type="danger" @click="handleBatchDelete">
          <i class="el-icon-delete"></i> 删除选中项
        </el-button>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper, sizes"
          :total="pagination.total"
          :page-sizes="[12, 20, 50, 100]"
          :page-size="pagination.per_page"
          :current-page="pagination.page"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog 
      :title="dialogMode === 'add' ? '添加虚拟机' : '编辑虚拟机'" 
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="vmForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="集群" prop="cluster">
              <el-select v-model="form.cluster" placeholder="选择集群" style="width: 100%">
                <el-option label="OpenClaw-Main" value="OpenClaw-Main" />
                <el-option label="K8s-Production" value="K8s-Production" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="名称" prop="vm_name">
              <el-input v-model="form.vm_name" placeholder="vm-web-01" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="外部 IP" prop="external_ip">
              <el-input v-model="form.external_ip" placeholder="38.246.245.32" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="内部 IP">
              <el-input v-model="form.internal_ip" placeholder="10.0.118.4" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input v-model="form.description" type="textarea" :rows="2" placeholder="可选" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="CPU" prop="cpu_cores">
              <el-input-number v-model="form.cpu_cores" :min="1" :max="64" style="width: 100%" />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="内存 (GB)" prop="memory_gb">
              <el-input-number v-model="form.memory_gb" :min="1" :max="512" style="width: 100%" />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="磁盘 (GB)" prop="disk_gb">
              <el-input-number v-model="form.disk_gb" :min="10" :max="2000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="选择状态" style="width: 100%">
                <el-option label="在线" value="running" />
                <el-option label="离线" value="stopped" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="访问 URL">
              <el-input v-model="form.access_url" placeholder="https://..." />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchVMList, fetchVMStats, createVM, updateVM, deleteVM } from '@/api/cmdb'

export default {
  name: 'CmdbDashboard',
  data() {
    return {
      loading: false,
      submitting: false,
      vms: [],
      stats: {
        total: 0,
        running: 0,
        stopped: 0,
        error: 0
      },
      filters: {
        search: '',
        cluster: '',
        status: '',
        tenant: ''
      },
      pagination: {
        page: 1,
        per_page: 12,
        total: 0,
        pages: 0
      },
      selectedRows: [],
      dialogVisible: false,
      dialogMode: 'edit',
      form: {
        id: null,
        cluster: '',
        vm_name: '',
        external_ip: '',
        internal_ip: '',
        description: '',
        cpu_cores: 0,
        memory_gb: 0,
        disk_gb: 0,
        status: 'running',
        tenant: 'OpenClaw',
        access_url: ''
      },
      rules: {
        cluster: [
          { required: true, message: '请选择集群', trigger: 'change' }
        ],
        vm_name: [
          { required: true, message: '请输入虚拟机名称', trigger: 'blur' }
        ],
        cpu_cores: [
          { type: 'number', message: 'CPU 核心数必须为数字', trigger: 'blur' }
        ],
        memory_gb: [
          { type: 'number', message: '内存必须为数字', trigger: 'blur' }
        ],
        disk_gb: [
          { type: 'number', message: '磁盘必须为数字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadStats()
    this.loadVMs()
  },
  methods: {
    getDomain(url) {
      try {
        const urlObj = new URL(url)
        return urlObj.hostname
      } catch (e) {
        return url
      }
    },
    
    async loadStats() {
      try {
        const response = await fetchVMStats()
        if (response.success) {
          this.stats = response.data
        }
      } catch (error) {
        console.error('加载统计信息失败:', error)
      }
    },
    
    async loadVMs() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.page,
          per_page: this.pagination.per_page,
          ...this.filters
        }
        
        const response = await fetchVMList(params)
        
        if (response.success) {
          this.vms = response.data
          this.pagination = response.pagination
        }
      } catch (error) {
        this.$message.error('加载虚拟机列表失败：' + error.message)
      } finally {
        this.loading = false
      }
    },
    
    handleSearch() {
      this.pagination.page = 1
      this.loadVMs()
    },
    
    handleReset() {
      this.filters = {
        search: '',
        cluster: '',
        status: '',
        tenant: ''
      }
      this.pagination.page = 1
      this.loadVMs()
    },
    
    handlePageChange(page) {
      this.pagination.page = page
      this.loadVMs()
    },
    
    handleSizeChange(size) {
      this.pagination.per_page = size
      this.pagination.page = 1
      this.loadVMs()
    },
    
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    
    handleAdd() {
      this.dialogMode = 'add'
      this.form = {
        id: null,
        cluster: 'OpenClaw-Main',
        vm_name: '',
        external_ip: '',
        internal_ip: '',
        description: '',
        cpu_cores: 0,
        memory_gb: 0,
        disk_gb: 0,
        status: 'running',
        tenant: 'OpenClaw',
        access_url: ''
      }
      this.dialogVisible = true
    },
    
    handleEdit(row) {
      this.dialogMode = 'edit'
      this.form = { ...row }
      this.dialogVisible = true
    },
    
    handleImport() {
      this.$message.info('导入功能开发中...')
    },
    
    handleExport() {
      this.$message.info('导出功能开发中...')
    },
    
    handleBatchEdit() {
      this.$message.info(`修改选中 ${this.selectedRows.length} 项`)
    },
    
    handleBatchRename() {
      this.$message.info(`重命名选中 ${this.selectedRows.length} 项`)
    },
    
    handleBatchDelete() {
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 项吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        this.selectedRows = []
        this.loadVMs()
      }).catch(() => {})
    },
    
    showFilterPanel() {
      this.$message.info('筛选面板开发中...')
    },
    
    handleColumnSetting(command) {
      this.$message.info('列设置开发中...')
    },
    
    async handleSubmit() {
      try {
        await this.$refs.vmForm.validate()
        
        this.submitting = true
        
        if (this.dialogMode === 'add') {
          const response = await createVM(this.form)
          if (response.success) {
            this.$message.success('创建成功')
            this.dialogVisible = false
            this.loadVMs()
            this.loadStats()
          }
        } else {
          const response = await updateVM(this.form.id, this.form)
          if (response.success) {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.loadVMs()
            this.loadStats()
          }
        }
      } catch (error) {
        if (error.response) {
          this.$message.error(error.response.data.error || '操作失败')
        } else if (error.message !== 'validate fail') {
          this.$message.error('操作失败：' + error.message)
        }
      } finally {
        this.submitting = false
      }
    },
    
    handleDelete(row) {
      this.$confirm(`确定要删除虚拟机 "${row.vm_name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const response = await deleteVM(row.id)
          if (response.success) {
            this.$message.success('删除成功')
            this.loadVMs()
            this.loadStats()
          }
        } catch (error) {
          this.$message.error('删除失败：' + error.message)
        }
      }).catch(() => {})
    },
    
    getClusterType(cluster) {
      const typeMap = {
        'Infrastructure-Cluster': 'info',
        'K8s-Production': 'warning',
        'OpenClaw-Main': 'success'
      }
      return typeMap[cluster] || 'info'
    },
    
    getStatusType(status) {
      const typeMap = {
        running: 'success',
        stopped: 'info',
        error: 'danger'
      }
      return typeMap[status] || 'info'
    },
    
    getStatusText(status) {
      const textMap = {
        running: '在线',
        stopped: '离线',
        error: '异常'
      }
      return textMap[status] || status
    }
  }
}
</script>

<style scoped>
.cmdb-dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.toolbar-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.toolbar-card ::v-deep .el-card__body {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-card {
  border-radius: 4px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-label {
  color: #606266;
  font-size: 14px;
}

.batch-actions {
  margin-top: 15px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  gap: 12px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-table {
  font-size: 13px;
}

::v-deep .el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

::v-deep .el-tag--small {
  padding: 2px 8px;
}

::v-deep .el-button--success {
  background-color: #67C23A;
  border-color: #67C23A;
}

::v-deep .el-button--warning {
  background-color: #E6A23C;
  border-color: #E6A23C;
}
</style>
