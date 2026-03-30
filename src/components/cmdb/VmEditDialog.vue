<template>
  <el-dialog
    :title="isEdit ? '编辑虚拟机' : '创建虚拟机'"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      size="medium"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入虚拟机名称"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="运行中" value="active"></el-option>
          <el-option label="已停止" value="stopped"></el-option>
          <el-option label="离线" value="offline"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="IP 地址" prop="primary_ip">
        <el-input
          v-model="form.primary_ip"
          placeholder="请输入 IP 地址"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="CPU" prop="vcpus">
        <el-input-number
          v-model="form.vcpus"
          :min="0"
          :max="128"
          placeholder="CPU 核心数"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      
      <el-form-item label="内存" prop="memory">
        <el-input-number
          v-model="form.memory"
          :min="0"
          :max="1024"
          placeholder="内存大小 (GB)"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      
      <el-form-item label="磁盘" prop="disk">
        <el-input-number
          v-model="form.disk"
          :min="0"
          :max="10240"
          placeholder="磁盘大小 (GB)"
          style="width: 100%"
        ></el-input-number>
      </el-form-item>
      
      <el-form-item label="负责人" prop="owner">
        <el-input
          v-model="form.owner"
          placeholder="请输入负责人"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="标签">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择或输入标签"
          style="width: 100%"
        >
          <el-option
            v-for="tag in commonTags"
            :key="tag"
            :label="tag"
            :value="tag"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="备注" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
    </el-form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'VmEditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vmData: {
      type: Object,
      default: null
    }
  },
  
  data() {
    return {
      form: {
        name: '',
        status: 'active',
        primary_ip: '',
        vcpus: 0,
        memory: 0,
        disk: 0,
        owner: '',
        tags: [],
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入虚拟机名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        primary_ip: [
          {
            pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
            message: '请输入正确的 IP 地址',
            trigger: 'blur'
          }
        ],
        vcpus: [
          { type: 'number', min: 0, message: 'CPU 核心数不能小于 0', trigger: 'blur' }
        ],
        memory: [
          { type: 'number', min: 0, message: '内存不能小于 0', trigger: 'blur' }
        ],
        disk: [
          { type: 'number', min: 0, message: '磁盘不能小于 0', trigger: 'blur' }
        ]
      },
      commonTags: ['infrastructure', 'application', 'database', 'web', 'cache', 'monitoring'],
      submitting: false
    }
  },
  
  computed: {
    isEdit() {
      return !!this.vmData && !!this.vmData.id
    }
  },
  
  watch: {
    visible(val) {
      if (val) {
        this.initForm()
      }
    }
  },
  
  methods: {
    initForm() {
      if (this.isEdit && this.vmData) {
        this.form = {
          name: this.vmData.name || '',
          status: this.vmData.status || 'active',
          primary_ip: this.vmData.primary_ip || '',
          vcpus: this.vmData.vcpus || 0,
          memory: this.vmData.memory || 0,
          disk: this.vmData.disk || 0,
          owner: this.vmData.owner || '',
          tags: this.vmData.tags || [],
          description: this.vmData.description || ''
        }
      } else {
        this.resetForm()
      }
      
      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    
    resetForm() {
      this.form = {
        name: '',
        status: 'active',
        primary_ip: '',
        vcpus: 0,
        memory: 0,
        disk: 0,
        owner: '',
        tags: [],
        description: ''
      }
    },
    
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        
        this.submitting = true
        
        const data = {
          ...this.form,
          vcpus: Number(this.form.vcpus),
          memory: Number(this.form.memory),
          disk: Number(this.form.disk)
        }
        
        this.$emit('submit', data)
          .then(() => {
            this.$message.success(this.isEdit ? '更新成功' : '创建成功')
            this.handleClose()
          })
          .catch(error => {
            console.error('Submit failed:', error)
          })
          .finally(() => {
            this.submitting = false
          })
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
