import Layout from '@/layout'

const cmdbRouter = {
  path: '/cmdb',
  component: Layout,
  redirect: '/cmdb/dashboard',
  name: 'CMDB',
  meta: {
    title: 'CMDB 管理',
    icon: 'el-icon-s-data',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/cmdb/Dashboard'),
      name: 'CmdbDashboard',
      meta: {
        title: '虚拟机管理',
        icon: 'el-icon-s-operation',
        noCache: false,
        affix: false
      }
    },
    {
      path: 'logs',
      component: () => import('@/views/cmdb/Logs'),
      name: 'CmdbLogs',
      meta: {
        title: '同步日志',
        icon: 'el-icon-document',
        noCache: true,
        affix: false
      }
    }
  ]
}

export default cmdbRouter
