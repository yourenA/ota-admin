export default [
  // user
  {
    path: '/none',
    component: '../layouts/UserLayout',
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {path: '/user', redirect: '/user/login'},
      {path: '/user/login', component: './User/Login'},
      {path: '/user/login/:id', exact: true, component: './User/Login'},
      {path: '/user/register', component: './User/Register'},
      {path: '/user/register-result', component: './User/RegisterResult'},
    ],
  },
  {
    path: '/print',
    component: './Gateways/Print',
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
      {path: '/', redirect: '/monitor'},
      {
        path: '/monitor',
        name: '主页',
        component: './Home/Index',
      },
      {
        path: '/firmwares',
        name: '固件',
        hideChildrenInMenu: true,
        component: './Devices-ignore/Info',
        routes: [
          {
            path: '/firmwares',
            name: 'list',
            redirect: '/firmwares/list',
          },
          {
            path: '/firmwares/list',
            name: 'list',
            component: './Devices-ignore/Applications',
          },
          {
            path: '/firmwares/add_firmware',
            name: 'applications.add',
            component: './Devices-ignore/AddOrEditDevice2',
          },
        ],
      },
      {
        path: '/substrates',
        name: 'RTU基板',
        hideChildrenInMenu: true,
        component: './Gateways/TopInfo',
        routes: [
          {
            path: '/substrates',
            name: 'list',
            redirect: '/substrates/list',
          },
          {
            path: '/substrates/list',
            name: 'list',
            component: './Gateways/Index',
          },
          {
            path: '/substrates/info',
            name: 'info',
            component: './Gateways/Info',
            routes: [
              {
                path: '/substrates/info/devices',
                name: 'events',
                component: './Gateways/Events',
              },
              {
                path: '/substrates/info/setting',
                name: 'setting',
                component: './Gateways/Setting',
              },
            ],
          },
        ],
      },
      {
        path: '/data',
        name: '升级日志',
        hideChildrenInMenu: true,
        component: './WholeData/TopInfo',
        routes: [
          {
            path: '/data',
            name: 'list',
            redirect: '/data/list',
          },
          {
            path: '/data/list',
            name: 'list',
            component: './WholeData/Index',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
