import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import styles from './UserLayout.less';
import logo from '../images/logo.png';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 广州辂轺信息科技有限公司出品
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }
  componentDidMount() {

  }
  getPageTitle = () => {
    const message = formatMessage({
      id: "app.login.login",
      defaultMessage: "登 录"
    });
    return `${message} `;
  };
  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <DocumentTitle title={this.getPageTitle()}>
          {children}
        </DocumentTitle>

    );
  }
}

export default UserLayout;
