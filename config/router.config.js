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
        path: '/products',
        name: '产品',
        hideChildrenInMenu: true,
        component: './Gateways/TopInfo',
        routes: [
          {
            path: '/products',
            name: 'list',
            redirect: '/products/list',
          },
          {
            path: '/products/list',
            name: 'list',
            component: './Gateways/Index',
          },
          {
            path: '/products/info',
            name: 'info',
            component: './Gateways/Info',
            routes: [
              {
                path: '/products/info/devices',
                name: 'events',
                component: './Gateways/Events',
              },
              {
                path: '/products/info/setting',
                name: 'setting',
                component: './Gateways/Setting',
              },
            ],
          },
        ],
      },
      /*   {
       path: '/views',
       name: '视图管理',
       icon: 'eye',
       routes: [
       {
       path: '/views/device_views',
       name: '设备视图',
       // component: './Forms/StepForm',
       hideChildrenInMenu: true,
       routes: [
       {
       path: '/views/device_views',
       name: '设备类型',
       redirect: '/views/device_views/list',
       },
       {
       path: '/views/device_views/list',
       name: '设备列表',
       component: './Device_types/Index',
       },
       // {
       //   path: '/device/devices/sensors',
       //   name: '传感器列表',
       //   component: './Devices-ignore/Sensors',
       // },
       {
       path: '/views/device_views/info',
       component: './Device_types/DeviceTypeInfo',
       routes: [
       {
       path: '/views/device_views/info/views',
       name: '视图列表',
       component: './Device_types/Views',
       },
       ]
       },

       ],
       },
       {
       path: '/views/view_templates',
       name: '视图模板',
       // component: './Forms/StepForm',
       hideChildrenInMenu: true,
       routes: [
       {
       path: '/views/view_templates',
       name: '视图模板列表',
       redirect: '/views/view_templates/list',
       },
       {
       path: '/views/view_templates/list',
       name: '视图模板列表',
       component: './View_templates/Index',
       },
       {
       path: '/views/view_templates/add_or_edit',
       name: '视图模板',
       component: './View_templates/AddOrEdit',
       },
       ],
       },
       // {
       //   path: '/monitor/map',
       //   name: '地图信息',
       //   component: './Monitor/Monitor',
       // },
       // {
       //   path: '/monitor/workplace',
       //   name: '视频监控',
       //   component: './Monitor/Workplace',
       // },
       ],

       },*/
   /*   {
        path: '/system',
        name: '系统配置',
        component: './Home/SystemConfigs',
      },
      {
        path: '/three',
        name: '测试three',
        component: './Home/Three',
      },
      {
        path: '/users',
        name: '用户管理',
        routes: [
          {
            path: '/users/users-list',
            name: '用户列表',
            component: './UsersManage/Index',
          },
        ],
      },*/
      /* {
       path: '/dashboard',
       name: 'dashboard',
       icon: 'dashboard',
       routes: [
       {
       path: '/dashboard/analysis',
       name: 'analysis',
       component: './Dashboard/Analysis',
       },
       {
       path: '/dashboard/monitor',
       name: 'monitor',
       component: './Dashboard/Monitor',
       },
       {
       path: '/dashboard/workplace',
       name: 'workplace',
       component: './Dashboard/Workplace',
       },
       ],
       },
       // forms
       {
       path: '/form',
       icon: 'form',
       name: 'form',
       routes: [
       {
       path: '/form/basic-form',
       name: 'basicform',
       component: './Forms/BasicForm',
       },
       {
       path: '/form/step-form',
       name: 'stepform',
       component: './Forms/StepForm',
       hideChildrenInMenu: true,
       routes: [
       {
       path: '/form/step-form',
       name: 'stepform',
       redirect: '/form/step-form/info',
       },
       {
       path: '/form/step-form/info',
       name: 'info',
       component: './Forms/StepForm/Step1',
       },
       {
       path: '/form/step-form/confirm',
       name: 'confirm',
       component: './Forms/StepForm/Step2',
       },
       {
       path: '/form/step-form/result',
       name: 'result',
       component: './Forms/StepForm/Step3',
       },
       ],
       },
       {
       path: '/form/advanced-form',
       name: 'advancedform',
       authority: ['admin'],
       component: './Forms/AdvancedForm',
       },
       ],
       },*/
      // list
      /*  {
       path: '/list',
       icon: 'table',
       name: 'list',
       routes: [
       {
       path: '/list/table-list',
       name: 'searchtable',
       component: './List/TableList',
       },
       {
       path: '/list/basic-list',
       name: 'basiclist',
       component: './List/BasicList',
       },
       {
       path: '/list/card-list',
       name: 'cardlist',
       component: './List/CardList',
       },

       ],
       },
       {
       path: '/profile',
       name: 'profile',
       icon: 'profile',
       routes: [
       // profile
       {
       path: '/profile/basic',
       name: 'basic',
       component: './Profile/BasicProfile',
       },
       {
       path: '/profile/advanced',
       name: 'advanced',
       authority: ['admin'],
       component: './Profile/AdvancedProfile',
       },
       ],
       },
       {
       name: 'result',
       icon: 'check-circle-o',
       path: '/result',
       routes: [
       // result
       {
       path: '/result/success',
       name: 'success',
       component: './Result/Success',
       },
       { path: '/result/fail', name: 'fail', component: './Result/Error' },
       ],
       },
       {
       name: 'exception',
       icon: 'warning',
       path: '/exception',
       routes: [
       // exception
       {
       path: '/exception/403',
       name: 'not-permission',
       component: './Exception/403',
       },
       {
       path: '/exception/404',
       name: 'not-find',
       component: './Exception/404',
       },
       {
       path: '/exception/500',
       name: 'server-error',
       component: './Exception/500',
       },
       {
       path: '/exception/trigger',
       name: 'trigger',
       hideInMenu: true,
       component: './Exception/TriggerException',
       },
       ],
       },*/
      /* {
       name: '账号管理',
       icon: 'user',
       path: '/account',
       routes: [
       /!*  {
       path: '/account/center',
       name: 'center',
       component: './Account/Center/Center',
       routes: [
       {
       path: '/account/center',
       redirect: '/account/center/articles',
       },
       {
       path: '/account/center/articles',
       component: './Account/Center/Articles',
       },
       {
       path: '/account/center/applications',
       component: './Account/Center/Applications',
       },
       {
       path: '/account/center/projects',
       component: './Account/Center/Projects',
       },
       ],
       },*!/
       {
       path: '/account/settings',
       name: '个人中心',
       component: './Account/Settings/Info',
       routes: [
       {
       path: '/account/settings',
       redirect: '/account/settings/base',
       },
       {
       path: '/account/settings/base',
       component: './Account/Settings/BaseView',
       },
       {
       path: '/account/settings/security',
       component: './Account/Settings/SecurityView',
       },
       {
       path: '/account/settings/binding',
       component: './Account/Settings/BindingView',
       },
       {
       path: '/account/settings/notification',
       component: './Account/Settings/NotificationView',
       },
       ],
       },
       ],
       },*/
      {
        component: '404',
      },
    ],
  },
];
