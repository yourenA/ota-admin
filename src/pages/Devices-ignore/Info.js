import React, {Component} from 'react';
import router from 'umi/router';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {PageHeader, Tabs, Breadcrumb, Radio} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import request from '@/utils/request';
const TabPane = Tabs.TabPane;
@connect()
class SearchList extends Component {
  constructor(props) {
    super(props);
  }



  render() {

    return (
      <div>
          {this.props.children}

      </div>
    );
  }
}

export default SearchList;
