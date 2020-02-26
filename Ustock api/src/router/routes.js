
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/.', component: () => import('pages/Dashboard/Index.vue') },
      { path: '', component: () => import('pages/Dashboard1/Index.vue') },
      { path: '/category', component: () => import('pages/Menu/Categoria/Index.vue') },
      { path: '/clients', component: () => import('pages/Menu/Clientes/Index.vue') },
      { path: '/proser', component: () => import('pages/Menu/Inventario/Index.vue') },
      { path: '/tasks', component: () => import('pages/Menu/Tarefa/Index.vue') },
      { path: '/buy', component: () => import('pages/Menu/Vender/Index.vue') },
      { path: '/operations', component: () => import('pages/Menu/Operation/Index.vue') },
      { path: '/providers', component: () => import('pages/Menu/Provider/Index.vue') },
      { path: '/locations', component: () => import('pages/Menu/Location/Index.vue') },
      { path: '/admin', component: () => import('pages/Menu/Admin/Index.vue') },
      { path: '/me', component: () => import('pages/Menu/Me/Index.vue') },
      { path: '/output', component: () => import('pages/Menu/Output/Index.vue') },
      { path: '/entrada', component: () => import('pages/Menu/ListIn/Index.vue') },
      { path: '/saida', component: () => import('pages/Menu/ListOu/Index.vue') },
      { path: '/material', component: () => import('pages/Menu/Material/Index.vue') },
      { path: '/historic', component: () => import('pages/Menu/Historico/Index.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login/Login.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
