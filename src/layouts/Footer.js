import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import {formatMessage, FormattedMessage} from 'umi/locale';

const { Footer } = Layout;
const FooterView = (props) => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      logo={props.logo}
      copyright={
        <Fragment>
           Copyright <Icon type="copyright" /> <FormattedMessage
          id="app.company"
          defaultMessage="LORA设备管理系统"
        />
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
