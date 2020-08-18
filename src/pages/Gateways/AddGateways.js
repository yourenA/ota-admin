import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {
  PageHeader,
  Input,
  Table,
  Form,
  Card,
  Col,
  Select,
  message,
  Row,
  Tooltip,
  Badge,
  Breadcrumb,
  notification
} from 'antd';
import {formatMessage, FormattedMessage} from 'umi/locale';
import Button from '@material-ui/core/Button';
import Cleave from 'cleave.js/react';
import mapJson from './custom.map.json'
const TextArea = Input.TextArea;

@connect(({device_types, loading}) => ({
  device_types,
}))
@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.BMap = window.BMap;
    this.marker = null;
    this.state = {
      id: 0,
      channels: [],
      editChannels: {},
      EUICleave: null,
      EUIRawValue: '',
      KeyCleave: null,
      KeyRawValue: '',
    }
  }

  componentDidMount() {
    const that=this
      that.renderMap();

  }

  renderMap = ()=> {
    const that=this;
    let map = new this.BMap.Map("location", {
      enableMapClick : false,//兴趣点不能点击
      mapType:BMAP_HYBRID_MAP//默认卫星图
    });    // 创建Map实例
    map.centerAndZoom(new BMap.Point(113.270793,23.135308), 14);  // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(new this.BMap.CityListControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      // 切换城市之间事件
      onChangeSuccess: function (result) {
        map.clearOverlays();
        console.log(result) // city: "合肥市",code:127,level:12,title:"合肥市",uid:"bcf1583a2e18d696f9f0cbf3"
        that.marker = new that.BMap.Marker(result.point);
        that.marker.enableDragging();
        map.addOverlay(that.marker);
      }
    }));
    map.addControl(new this.BMap.MapTypeControl({
      mapTypes:[
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]}));

    // map.setMapStyle({styleJson:mapJson});
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.enableInertialDragging();
    let myCity = new this.BMap.LocalCity();
    myCity.get(function (result) {
      console.log('result',result)
      that.marker = new that.BMap.Marker(result.center);
      that.marker.enableDragging();
      map.addOverlay(that.marker);
      map.panTo(result.center);
      console.log('您的位置：'+result.center.lng+','+result.center.lat);
    });
    let size = new this.BMap.Size(10, 20);
    console.log(BMAP_ANCHOR_TOP_LEFT)

  }
  onEUIRawValueChange = (event)=> {
    this.setState({EUIRawValue: event.target.rawValue});
  }

  onEUICleaveInit = (cleave)=> {
    const that = this
    this.setState({EUICleave: cleave}, function () {
      that.state.EUICleave.setRawValue('');
    })
  }
  handleSubmit = ()=> {
    console.log(this.marker)
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          const sendDate = {
            ...values,
            latitude:this.marker?this.marker.point.lat:0,
            longitude:this.marker?this.marker.point.lng:0,
            gateway_id: this.state.EUIRawValue,
          }
          console.log('sendDate', sendDate)
          this.props.dispatch({
            type: `gateways/add`,
            payload: {
              ...sendDate,
            },
            callback: ()=> {
              notification.success({
                message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'menu.gateways.add'})}),
              });
              this.props.history.goBack()
            }
          });
        }
      }
    )
  }

  render() {
    const {device_types}=this.props
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };
    return (
      <div>
        <div className="page-header">
          <PageHeader

            title={  <Breadcrumb separator=">">
              <Breadcrumb.Item style={{cursor: 'pointer'}}
                               onClick={() => this.props.history.goBack()}>
                <FormattedMessage
                  id="menu.gateways"
                />
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <FormattedMessage
                  id="menu.gateways.add"
                />
              </Breadcrumb.Item>
            </Breadcrumb>}
          />
        </div>
        <div className="info-page-container">
          <Card type="inner" title={
            <FormattedMessage
              id="menu.gateways.add"
            />
          } bordered={false}>
            <Form onSubmit={this.handleSubmit}>

              <Form.Item hasFeedback label={
                <FormattedMessage
                  id="menu.gateways.ID"
                />
              } {...formItemLayout}
                         validateStatus={
                           this.state.EUIRawValue.length !== 16 ? 'error' : 'success'
                         }
                         help={this.state.EUIRawValue.length !== 16 ?
                           formatMessage({id: 'app.gatewayIDBytes.info'}, {
                             bytes: 8,
                             now: Math.floor(this.state.EUIRawValue.length / 2)
                           }) : ''}
              >
                {getFieldDecorator(`gateway_id`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.eui'})})
                  }],
                })(
                  <Cleave className="ant-input"
                          onChange={this.onEUIRawValueChange}
                          onInit={this.onEUICleaveInit}
                          options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
                  />
                )}
              </Form.Item>
              <Form.Item hasFeedback label={
                <FormattedMessage
                  id="menu.gateways.name"
                />
              }  {...formItemLayout}
              >
                {getFieldDecorator(`name`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.gateways.name'})})
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label={
                <FormattedMessage
                  id="app.description"
                  defaultMessage="描述"
                />
              } {...formItemLayout}>
                {getFieldDecorator(`description`, {
                  initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
                })(
                  <TextArea rows={4}/>
                )}
              </Form.Item>
              <Form.Item label={
                <FormattedMessage
                  id="app.location"
                />
              } {...formItemLayout}>
                <div className="baidu-map" id="location">

                </div>
              </Form.Item>
              <Form.Item>
                <div style={{textAlign: 'center'}}>
                  <Button variant="contained" onClick={()=> {
                    this.props.history.goBack()
                  }}>
                    <FormattedMessage
                      id="app.cancel"
                      defaultMessage="取消"
                    />
                  </Button>
                  <Button onClick={this.handleSubmit} variant="contained" color="secondary"
                          style={{marginLeft: '24px'}}>
                    <FormattedMessage
                      id="app.save"
                      defaultMessage="保存"
                    />
                  </Button>
                </div>
              </Form.Item>
            </Form>

          </Card>
        </div>

      </div>

    );
  }
}

export default SearchList
