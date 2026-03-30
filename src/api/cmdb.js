import request from '@/utils/request'

// 获取虚拟机列表
export function fetchVMList(query) {
  return request({
    url: '/cmdb-api/vms',
    method: 'get',
    params: query
  })
}

// 获取虚拟机详情
export function fetchVMDetail(id) {
  return request({
    url: `/cmdb-api/vms/${id}`,
    method: 'get',
    params: { id }
  })
}

// 创建虚拟机
export function createVM(data) {
  return request({
    url: '/cmdb-api/vms',
    method: 'post',
    data
  })
}

// 更新虚拟机
export function updateVM(id, data) {
  return request({
    url: `/cmdb-api/vms/${id}`,
    method: 'put',
    data
  })
}

// 删除虚拟机
export function deleteVM(id) {
  return request({
    url: `/cmdb-api/vms/${id}`,
    method: 'delete'
  })
}

// 获取统计信息
export function fetchVMStats() {
  return request({
    url: '/cmdb-api/vms/stats',
    method: 'get'
  })
}

// 获取同步状态
export function fetchSyncStatus() {
  return request({
    url: '/cmdb-api/sync/status',
    method: 'get'
  })
}

// 触发同步
export function triggerSync() {
  return request({
    url: '/cmdb-api/sync/trigger',
    method: 'post'
  })
}

// 获取同步日志
export function fetchSyncLogs(query) {
  return request({
    url: '/cmdb-api/sync/logs',
    method: 'get',
    params: query
  })
}
