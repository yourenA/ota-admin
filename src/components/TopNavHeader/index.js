import React, { PureComponent } from 'react';
import Link from 'umi/link';
import RightContent from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import styles from './index.less';
import {formatMessage, FormattedMessage} from 'umi/locale';

export default class TopNavHeader extends PureComponent {
  state = {
    maxWidth: undefined,
  };

  static getDerivedStateFromProps(props) {
    return {
      maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
    };
  }

  render() {
    const company_name=sessionStorage.getItem('company_name');
    const { theme, contentWidth, logo } = this.props;
    const { maxWidth } = this.state;
    return (
      <div className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}>
        <div
          ref={ref => {
            this.maim = ref;
          }}
          className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
        >
          <div className={styles.left}>
            <div  className={`${styles.logo} animated bounceInLeft`}  key="logo" id="logo">
              <Link to="/">
                <img src={logo} alt="logo" />
                <div className={styles.project}>
                  <h1>广州辂轺</h1>
                  <h2>OTA远传升级平台</h2>
                </div>

              </Link>
            </div>
            <div
              className={styles.menu}
            >
              <BaseMenu {...this.props} style={{ border: 'none', height: 64 }} />
            </div>
          </div>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}
