import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { PageHeader,Tabs } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const TabPane = Tabs.TabPane;
@connect()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.id
    console.log(this.props)
  }
  handleTabChange = (key) => {
    const { dispatch } = this.props;
    switch (key) {
      case 'docs':
        dispatch(routerRedux.replace(`/monitor/devices/info/info/?id=${this.name}`));
        break;
      case 'app':
        dispatch(routerRedux.replace(`/monitor/devices/info/history/?id=${this.name}`));
        break;
      case 'project':
        dispatch(routerRedux.replace(`/monitor/devices/info/setting/?id=${this.name}`));
        break;
      default:
        break;
    }
  }
  render() {

    const tabList = [
      {
        key: 'doc',
        tab: '实时数据',
      },
      {
        key: 'app',
        tab: '历史数据',
      },
      {
        key: 'project',
        tab: '配置',
      },
    ];
    return (
      <div>
      <PageHeader
        style={{ margin: '-24px -24px 0' }}
        onBack={() => this.props.history.goBack()}
        title={this.name}
      />
        <Tabs  onChange={this.handleTabChange}  style={{ margin: '0 -24px ' ,background:'#fff',paddingLeft:'24px'}} >
          <TabPane tab="实时数据" key="docs"></TabPane>
          <TabPane tab="历史数据" key="app"></TabPane>
          <TabPane tab="配置" key="project"></TabPane>
        </Tabs>
        {this.props.children}
        </div>
    );
  }
}

export default SearchList;
