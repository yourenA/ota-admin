import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { PageHeader,Tabs,Breadcrumb } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const TabPane = Tabs.TabPane;
@connect()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    this.id=this.props.history.location.query.id
    const pathname=this.props.history.location.pathname.split('/')
    console.log('pathname',pathname)
    this.state={
      activeKey:pathname[pathname.length-1]
    }
  }
  handleTabChange = (key) => {
    const { dispatch } = this.props;
    this.setState({
      activeKey:key
    })
    switch (key) {
      case 'parameters':
        dispatch(routerRedux.replace(`/collectors/collectors_list/info/parameters?id=${this.id}&&name=${this.name}`));
        break;
      case 'config':
        dispatch(routerRedux.replace(`/collectors/collectors_list/info/config?id=${this.id}&&name=${this.name}`));
        break;
      case 'information':
        dispatch(routerRedux.replace(`/collectors/collectors_list/info/information?id=${this.id}&&name=${this.name}`));
        break;
      case 'mqtt_logs':
        dispatch(routerRedux.replace(`/collectors/collectors_list/info/mqtt_logs?id=${this.id}&&name=${this.name}`));
        break;
      case 'login_logs':
        dispatch(routerRedux.replace(`/collectors/collectors_list/info/login_logs?id=${this.id}&&name=${this.name}`));
        break;
      default:
        break;
    }
  }
  componentWillReceiveProps=(nextProps)=>{
    const nextPathname=nextProps.history.location.pathname.split('/')
    const  nextLastPathname=nextPathname[nextPathname.length-1];
    this.setState({
      activeKey:nextLastPathname
    })

  }
  render() {

    return (
      <div>
      <PageHeader
        style={{ margin: '-24px -24px 0' }}
        onBack={() => this.props.history.goBack()}
        title={  <Breadcrumb>
          <Breadcrumb.Item style={{cursor:'pointer'}} onClick={() => this.props.history.goBack()}>采集器列表</Breadcrumb.Item>
          <Breadcrumb.Item>{`${this.name}`}</Breadcrumb.Item>
        </Breadcrumb>}
      />
        <Tabs activeKey={this.state.activeKey} onChange={this.handleTabChange}  style={{ margin: '0 -24px ' ,background:'#fff',paddingLeft:'24px'}} >
          <TabPane tab="采集器参数" key="parameters"></TabPane>
          <TabPane tab="采集器配置" key="config"></TabPane>
          <TabPane tab="采集器信息" key="information"></TabPane>
          <TabPane tab="通讯日志" key="mqtt_logs"></TabPane>
          <TabPane tab="登录日志" key="login_logs"></TabPane>
        </Tabs>
        {this.props.children}

        </div>
    );
  }
}

export default SearchList;
