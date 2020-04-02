// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    name: 'feedback',
    path: 'https://github.com/alibaba/ice',
    external: true,
    newWindow: true,
    icon: 'message',
  },

  {
    name: 'help',
    path: 'https://alibaba.github.io/ice',
    external: true,
    newWindow: true,
    icon: 'bangzhu',
    // authorities: ['admin'], // 配置该属性进行权限校验，如不匹配隐藏菜单
  },
];

const asideMenuConfig = [
  // { name: '测试任务集合', path: '/TestTask', id: 'Menu_3d9my' },
  // { name: '编辑代码', path: '/code', id: 'Menu_9t1ow' },
  { name: '造数任务', path: '/datatask', id: 'Menu_1sonm' },
  // { name: '造数组合', path: '/datacomp', id: 'Menu_u9bxp' },
  // { name: '数据生成', path: '/goto', id: 'Menu_xeefk' },
  // {
  //   name: 'Dashboard',
  //   path: '/dashboard',
  //   icon: 'home2',
  //   children: [
  //     { name: 'monitor', path: '/dashboard/monitor', id: 'Menu_hsjq3' },
  //   ],
  //   id: 'Menu_4c7dq',
  // },
  // {
  //   name: 'chart',
  //   path: '/chart',
  //   icon: 'chart',
  //   children: [
  //     { name: 'basic', path: '/chart/basic', id: 'Menu_mr3cj' },
  //     { name: 'general', path: '/chart/general', id: 'Menu_yghrq' },
  //   ],
  //   id: 'Menu_mrfp8',
  // },
  // {
  //   name: '表格页',
  //   path: '/table',
  //   icon: 'cascades',
  //   children: [
  //     { name: 'basic', path: '/table/basic', id: 'Menu_6x70o' },
  //     { name: 'general', path: '/table/general', id: 'Menu_e4qd4' },
  //   ],
  //   id: 'Menu_dqrbl',
  // },
  // {
  //   name: '列表页',
  //   path: '/list',
  //   icon: 'menu',
  //   children: [
  //     { name: 'basic', path: '/list/basic', id: 'Menu_iubu0' },
  //     { name: 'general', path: '/list/general', id: 'Menu_uxy4e' },
  //   ],
  //   id: 'Menu_vc1sk',
  // },
  // {
  //   name: 'profile',
  //   path: '/profile',
  //   icon: 'content',
  //   children: [
  //     { name: 'basic', path: '/profile/basic', id: 'Menu_n27uo' },
  //     { name: 'terms', path: '/profile/general', id: 'Menu_xwlou' },
  //   ],
  //   id: 'Menu_im72k',
  // },
  // {
  //   name: 'result',
  //   path: '/result',
  //   icon: 'question',
  //   children: [
  //     { name: 'success', path: '/result/success', id: 'Menu_vy9lh' },
  //     { name: 'fail', path: '/result/fail', id: 'Menu_r7xhx' },
  //   ],
  //   id: 'Menu_r7sdw',
  // },
  // {
  //   name: 'account',
  //   path: '/account',
  //   icon: 'yonghu',
  //   children: [{ name: 'setting', path: '/account/setting', id: 'Menu_0qxox' }],
  //   id: 'Menu_b8i8n',
  // },
  // {
  //   name: 'exception',
  //   path: '/exception',
  //   icon: 'notice',
  //   children: [
  //     { name: '204', path: '/exception/204', id: 'Menu_066xu' },
  //     { name: '403', path: '/exception/403', id: 'Menu_31e6k' },
  //     { name: '404', path: '/exception/404', id: 'Menu_e6kvu' },
  //     { name: '500', path: '/exception/500', id: 'Menu_i5g0p' },
  //   ],
  //   id: 'Menu_2krw9',
  // },
];

export { headerMenuConfig, asideMenuConfig };
