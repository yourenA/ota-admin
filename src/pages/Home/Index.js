import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import moment from 'moment';
import {connect} from 'dva';
import request from '@/utils/request';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {formatMessage, FormattedMessage} from 'umi/locale';
import {Row, Col} from 'antd';
import styles from './Index.less';
import CountUp from 'react-countup';
import Context from './../../layouts/MenuContext';
import {routerRedux} from 'dva/router';
@connect(({user_manage, loading}) => ({}))
class BasicList extends PureComponent {
  state = {
    visible: false,
    done: false,
    page: 1,
    per_page: 30,
    firmwares: 0,
    products: 0,
  };

  componentDidMount() {
    console.log(this)
    const that = this;
    request(`/firmwares`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.setState({
          firmwares: response.data.meta.total
        })
      }
    })
    request(`/products`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.setState({
          products: response.data.meta.total
        })
      }
    })
  }


  render() {
    return (
      <div>
          <div className="info-page-container">
            <Card className={`animated zoomIn ${styles.image}`}>
              <CardContent>
                <p style={{margin: '30px auto', fontSize: '32px', textAlign: 'center', color: '#000000'}}>
                  OTA远传升级平台
                </p>

              </CardContent>
            </Card>
            <Row gutter={24}>
              <Col xs={12} sm={12} md={6} className={styles.homeCustomCard}>
                <div className={styles.card_box}>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-1.png" alt=""/>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-2.png" alt=""/>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-3.png" alt=""/>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-4.png" alt=""/>
                  <div className={styles.title}>固件个数<span onClick={()=> {
                    const {dispatch} = this.props;
                    dispatch(routerRedux.push(`/firmwares`));
                  }}> {
                    formatMessage({
                      id: 'app.detail',
                    })
                  }</span></div>
                  <div className={styles.content}><CountUp end={this.state.firmwares}/></div>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6} className={styles.homeCustomCard}>
                <div className={styles.card_box}>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-1.png" alt=""/>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-2.png" alt=""/>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-3.png" alt=""/>
                  <img src="http://www.17sucai.com/preview/690548/2018-04-27/map/img/bj-4.png" alt=""/>
                  <div className={styles.title}>产品个数<span onClick={()=> {
                    const {dispatch} = this.props;
                    dispatch(routerRedux.push(`/products`));
                  }}> {
                    formatMessage({
                      id: 'app.detail',
                    })
                  }</span></div>
                  <div className={styles.content}><CountUp end={this.state.products}/></div>
                </div>
              </Col>
            </Row>

          </div>

      </div>

    )
  }
}

export default BasicList;
