import Layout from "@/layout/index"

const routes = [
  {
    path: '/test1',
    component: Layout,
    children: [
      {
        path: 'test1',
        component: () => import('@/views/test1'),
        name: 'test1',
        meta: { title: 'test1', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/test2',
    component: Layout,
    children: [
      {
        path: 'test2',
        component: () => import('@/views/test2'),
        name: 'test2',
        meta: { title: 'test2', icon: 'dashboard', affix: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default routes
