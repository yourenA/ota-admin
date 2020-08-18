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
  Tooltip
} from 'antd';
/* eslint react/no-multi-comp:0 */
@connect(({device_real_time_errors, system_configs, loading}) => ({
  device_real_time_errors, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
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
    document.documentElement.scrollTop=0
    const that = this;
    window.ws.onmessage = function(ev) {
      var payload = JSON.parse(ev.data);
      if(payload.status_code===200){
        if(payload.data.event==='new_device_event'&&payload.data.device_id===that.props.history.location.query.id){
          console.log('刷新请求')
          that.handleSearch()
        }
      }

    }
  }


  handleSearch = () => {
    const that = this;
    request(`/devices/${this.props.history.location.query.id}`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        this.setState({
          data: response.data.data
        })
        that.state.EUICleave.setRawValue(response.data.data.dev_eui);
        if (this.state.hideKey) {
          this.state.keyCleave.setRawValue("********************************");
        } else {
          this.state.keyCleave.setRawValue(response.data.data.application_key);
        }
      }
    })
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
      this.handleSearch()
    })
  }

  render() {
    const {
      device_real_time_errors: {data, loading, meta},
    } = this.props;
    const columns = [{
      title: '时间',
      dataIndex: 'timestamp',
      render: (text)=> {
        return moment(text).format('MM-DD HH:mm:ss')
      }
    }]
    return (
      <div className="info-page-container">
        <Card type="inner" title={
          <div>
            <Icon type="database"   />
            <FormattedMessage
              id="menu.applications.info.overview"
              defaultMessage="概述"
            />
          </div>

        } bordered={false}>
          <Row gutter={16}>
            <Col xs={8} md={6} >
              <h3 style={{textAlign: 'right'}}>
                <FormattedMessage
                  id="menu.applications.name"
                  defaultMessage="名称"
                /> :
              </h3>
            </Col>
            <Col  xs={15} md={12} >
              <h3 >{this.state.data.name}</h3>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col  xs={8} md={6} >
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
            <Col  xs={8} md={6} >
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
            <Col  xs={8} md={6} >
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
            <Icon type="monitor"   />
            <FormattedMessage
              id="menu.applications.eui"
              defaultMessage="概述"
            />
          </div>

        } bordered={false}>
          <Row type="flex" align="middle">
            <Col xs={22} sm={22} md={6}>
              <Cleave id="EUICleave" className="ant-input  ant-input-disabled  custom-disabled"
                      onInit={this.onEUICleaveInit}
                      options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
              />
            </Col>
            <Col xs={2} sm={2} md={10}>
              <Tooltip title={formatMessage({id: 'app.copy'})}>
                <Icon type="copy" className="copy-icon-key" onClick={()=> {
                  if (copy(this.state.data.dev_eui)) {
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

        </Card>
        <Card type="inner" style={{marginTop: '24px'}} title={
          <div>
            <Icon type="key" />
            <FormattedMessage
              id="menu.applications.key"
              defaultMessage="key"
            />
          </div>

        } bordered={false}>
          <Row type="flex" align="middle">
            <Col xs={20} sm={22} md={10}>
              <Cleave className="ant-input ant-input-disabled  custom-disabled"
                      onInit={this.onKeyCleaveInit}
                      options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
              />
            </Col>
            <Col xs={4} sm={2} md={10}>
              <Tooltip title={formatMessage({id: this.state.hideKey ? "app.show" : "app.hide"})}>
                <Icon type={this.state.hideKey ? "eye" : "eye-invisible"} className="copy-icon-key" onClick={()=> {
                  this.setState({hideKey: !this.state.hideKey}, function () {
                    if (this.state.hideKey) {
                      this.state.keyCleave.setRawValue("********************************");
                    } else {
                      this.state.keyCleave.setRawValue(this.state.data.application_key);
                    }
                  })
                }}/>
              </Tooltip>
              <Tooltip title={formatMessage({id: 'app.copy'})}>
                <Icon type="copy" className="copy-icon-key" onClick={()=> {
                  if (copy(this.state.data.application_key)) {
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

        </Card>
      </div>
    );
  }
}

export default TableList;
