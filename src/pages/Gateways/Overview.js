import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {formatMessage, FormattedMessage} from 'umi/locale';
import request from '@/utils/request'
import Cleave from 'cleave.js/react';
import copy from 'copy-to-clipboard';
import {
  Row,
  Col,
  Form,
  Select,
  Button,
  Icon,
  Table,
  Alert,
  Card,
  notification,
  Tooltip,Badge
} from 'antd';
import mapJson from './custom.map.json'
/* eslint react/no-multi-comp:0 */
@connect(({device_real_time_errors, system_configs, loading}) => ({
  device_real_time_errors, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.BMap = window.BMap;
    this.marker = null;
    this.state = {
      page: 1,
      per_page: 30,
      number: '',
      name: '',
      status: '1',
      parameter_id: '',
      errorParameters: [],
      refresh_second: 0,
      display_rows: 0,
      data: {},
      EUICleave: null,
      keyCleave: null,
      hideKey: true
    };
  }


  componentDidMount() {
    document.documentElement.scrollTop=0;
    const that=this;
  }


  handleSearch = (renderMap) => {
    const that = this;
    request(`/gateways/${this.props.history.location.query.id}`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        this.setState({
          data: response.data.data
        })
        if(renderMap){
          this.renderMap(response.data.data)
        }
        that.state.keyCleave.setRawValue(response.data.data.gateway_id);
      }
    })
  }

  renderMap = (data)=> {
    const that=this;
    let map = new this.BMap.Map("location", {
      enableMapClick : false,//兴趣点不能点击
      mapType:BMAP_HYBRID_MAP//默认卫星图
    });    // 创建Map实例
    let point=new BMap.Point(data.longitude,data.latitude)
    map.centerAndZoom(point, 14);  // 初始化地图,设置中心点坐标和地图级别
    this.marker = new that.BMap.Marker(point);
    map.addOverlay(that.marker);

    map.addControl(new this.BMap.MapTypeControl({
      mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]}));

    // map.setMapStyle({styleJson:mapJson});
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.enableInertialDragging();


  }
  componentWillUnmount() {
  }

  renderForm() {
  }

  onEUICleaveInit = (cleave)=> {
    const that = this
    this.setState({EUICleave: cleave}, function () {

    })
  }
  onKeyCleaveInit = (cleave)=> {
    this.setState({keyCleave: cleave}, function () {
      this.handleSearch(true)
    })
  }

  render() {
    const renderStatus=function (text) {
      let status = '';
      let statusText = '';
      switch (text) {
        case 1:
          status = 'success';
          statusText = formatMessage({id: 'app.online'});
          break;
        case -1:
          status = 'error';
          statusText = formatMessage({id: 'app.offline'});
          break;
        case -2:
          status = 'warning';
          statusText = formatMessage({id: 'app.inactivated'});
          break;
        default:
          status = '';
          statusText ='';

      }
      return <span><Badge status={status} />{statusText}</span>
    }
    return (
      <div className="info-page-container">
        <Card type="inner" title={
          <div>
            <Icon type="database"   />
            <FormattedMessage
              id="menu.gateways.info.overview"
              defaultMessage="概述"
            />
          </div>
        } bordered={false}>
          <Row gutter={16}>
            <Col xs={8} md={6}>
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="menu.gateways.ID"
                  defaultMessage="key"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12}>
              <Row type="flex" align="middle">
                <Col xs={20} sm={22} md={14}>
                  <Cleave className="ant-input ant-input-disabled  custom-disabled"
                          onInit={this.onKeyCleaveInit}
                          options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
                  />
                </Col>
                <Col xs={4} sm={2} md={10}>
                  <Tooltip title={formatMessage({id: 'app.copy'})}>
                    <Icon type="copy" className="copy-icon-key" onClick={()=> {
                      if (copy(this.state.data.gateway_id)) {
                        notification.success({
                          message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'app.copy'})}),
                        });
                      } else {
                        console.log("复制失败")
                      }
                    }}/>
                  </Tooltip>

                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={8} md={6}>
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="menu.gateways.name"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12}>
              <h3>{this.state.data.name}</h3>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={8} md={6}>
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="menu.gateways.status"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12}>
              {
                renderStatus(this.state.data.status)
              }
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={8} md={6}>
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="menu.applications.last_seen_at"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12}>
              <h3 style={{fontWeight: '300'}}>{this.state.data.last_seen_at}</h3>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={8} md={6}>
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="app.created_at"
                  defaultMessage="创建时间"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12}>
              <h3 style={{fontWeight: '300'}}>{this.state.data.created_at}</h3>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={8} md={6}>
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="app.description"
                  defaultMessage="描述"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12}>
              <h3 style={{fontWeight: '300'}}>{this.state.data.description}</h3>
            </Col>
          </Row>
        </Card>
        <Card type="inner" style={{marginTop: '24px'}} title={
          <div>
            <Icon type="global" />
            <FormattedMessage
              id="app.location"
            />
          </div>

        } bordered={false}>
          <div style={{width:'100%',height:'450px'}} id="location">

          </div>

        </Card>
      </div>
    );
  }
}

export default TableList;
