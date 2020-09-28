import React, {Component} from 'react';
import router from 'umi/router';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import { PageHeader, Tabs, Breadcrumb, Radio, notification } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {formatMessage, FormattedMessage} from 'umi/locale';
import request from '@/utils/request';
const TabPane = Tabs.TabPane;
@connect()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.rtu_id = this.props.history.location.query.rtu_id
    this.serial_number = this.props.history.location.query.serial_number
    const pathname = this.props.history.location.pathname.split('/')
    console.log('pathname', pathname)
    this.state = {
      activeKey: pathname[pathname.length - 1],
      number: '',
      showValve: false,
      showError: false,
      showElectricValve: false,
      name:''
    }
  }

  componentDidMount() {
    // request(`/products/${this.id}`, {
    //   method: 'GET',
    // }).then((response)=> {
    //   console.log(response);
    //   if(response.status===200){
    //     this.setState({
    //       name:response.data.data.name
    //     })
    //   }
    // })
  }

  handleTabChange = (e) => {
    const {dispatch} = this.props;
    this.setState({
      activeKey: e.target.value
    })
    dispatch(routerRedux.replace(`/products/info/${e.target.value}?id=${this.id}`));
  }
  componentWillReceiveProps = (nextProps)=> {
    const nextPathname = nextProps.history.location.pathname.split('/')
    const nextLastPathname = nextPathname[nextPathname.length - 1];
    console.log('nextPathname', nextLastPathname)
    this.setState({
      activeKey: nextLastPathname
    })

  }

  render() {

    return (
      <div>
        <div className="page-header">
          <PageHeader

            title={  <Breadcrumb    separator=">">
              <Breadcrumb.Item style={{cursor: 'pointer'}}
                               onClick={() => this.props.history.goBack()}>
                RTU基板列表
              </Breadcrumb.Item>
              <Breadcrumb.Item>{`${this.serial_number}`} 升级日志</Breadcrumb.Item>
            </Breadcrumb>}
          />
        </div>
        {/* <Tabs activeKey={this.state.activeKey} onChange={this.handleTabChange}  style={{ margin: '0 -24px ' ,background:'#fff',paddingLeft:'24px'}} >
         <TabPane tab="设备实时数据" key="real_time"></TabPane>
         <TabPane tab="设备配置" key="parameters"></TabPane>
         {
         this.state.showValve&& <TabPane tab="阀门控制" key="valves"></TabPane>
         }
         {
         this.state.showElectricValve&& <TabPane tab="电控阀门控制" key="electric_valves"></TabPane>
         }
         <TabPane tab="历史数据" key="history"></TabPane>
         <TabPane tab="设备视图" key="views"></TabPane>
         {
         this.state.showError&&  <TabPane tab="故障监测" key="real_time_error"></TabPane>
         }
         {
         this.state.showError&&  <TabPane tab="故障查询" key="error"></TabPane>
         }

         </Tabs>*/}
        <div className="info-page-container">
         {/* <div className="page-router-tab">
            <Radio.Group  value={this.state.activeKey} onChange={this.handleTabChange} buttonStyle="solid" size="large">
              <Radio.Button value="devices">
                设备
              </Radio.Button>
              <Radio.Button value="setting">
                命令
              </Radio.Button>
            </Radio.Group>
          </div>*/}
          {this.props.children}

        </div>
      </div>
    );
  }
}

export default SearchList;
