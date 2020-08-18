import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {
  PageHeader,
  Collapse,
  Input,
  Icon,
  Form,
  InputNumber,
  Button,
  Col,
  Select,
  message,
  Row,
  Alert ,
  Tabs
} from 'antd';
import styles from './TableList.less';
import find from 'lodash/find'
const {TabPane} = Tabs;
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
@connect(({electric_valves, system_configs, loading}) => ({
  electric_valves, system_configs
}))
@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
      refresh_second: 0,
      currentValve: {}
    }

  }

  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'electric_valves/fetch',
      payload: {
        device_id: that.props.history.location.query.id
      },
      callback: ()=> {
        const {
          electric_valves
        } = this.props;
        if (electric_valves.data.electric_valve.length > 0) {
          this.setState({
            activeKey: electric_valves.data.electric_valve[0].id
            // activeKey: 0
          }, function () {
            // this.getValveStatus(double_ball_valves.data[0].id)
            dispatch({
              type: 'system_configs/fetch',
              callback: ()=> {
                const {system_configs}=that.props
                const refresh_second = find(system_configs.data, function (o) {
                  return o.key === 'electric_valve_info_refresh_time'
                })
                console.log('refresh_second,', refresh_second)
                if (refresh_second) {
                  that.setState({
                    refresh_second: Number(refresh_second.value),
                  }, function () {
                    that.handleSearch(that.state.activeKey)
                  })
                }
              }
            });
          })
        }
      }
    });
    // this.handleSearch()
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if (this.timer) {
      console.log(this.timer)
    }
    clearTimeout(this.timer)
  }
  handleSearch = (id) => {
    const that = this;
    request(`/devices/${that.props.history.location.query.id}/electric_valves/${id}/status`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.setState({
          currentValve: response.data.data
        })
        if (that.timer) {
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer = setTimeout(function () {
          that.handleSearch(that.state.activeKey);
        }, that.state.refresh_second * 1000)
      }
    })
  }
  handleEdit = ()=> {
    const formValues = this.props.form.getFieldsValue()
    console.log('formValues', formValues)
    const that = this;
    request(`/devices/${that.props.history.location.query.id}/electric_valves/${that.state.activeKey}/status`, {
      method: 'POST',
      data:formValues
    }).then((response)=> {
      if (response.status === 200) {
        message.success('修改成功')
        // that.setState({
        //   currentValve: response.data.data
        // })
        // if (that.timer) {
        //   console.log('clearTimeout')
        //   clearTimeout(that.timer)
        // }
        // that.timer = setTimeout(function () {
        //   that.handleSearch(that.state.activeKey);
        // }, that.state.refresh_second * 1000)
      }
    })
  }
  onChangeTabs = (key)=> {
    console.log('key', key)
    this.setState({
      activeKey: key,
      //  [key]:{}
    }, function () {
      this.handleSearch(key)
    })
  }
  render() {
    const {electric_valves}=this.props
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
      <div className="custom-card">
        <div className="info-page-container">
          <Alert style={{marginBottom: '12px'}} message={`数据每隔${this.state.refresh_second}秒刷新一次`} type="info"/>

          <Tabs  tabPosition={'left'} onChange={this.onChangeTabs} style={{backgroundColor: '#fff'}} activeKey={this.state.activeKey}>
            {
              (electric_valves.data.electric_valve||[]).map((item, index)=> {
                return <TabPane tab={item.name} key={item.id} style={{padding: '16px 16px'}}>
                  <Row gutter={16}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Collapse activeKey={['1']}>
                        <Panel showArrow={false} header={<div><Icon type="box-plot"/> 当前策略</div>} key="1"
                        >
                          <Form >
                            <Form.Item label="是否已使用" {...formItemLayout}>
                       <span>
                  {
                    this.state.currentValve.is_enabled === 1 ? '是' : '否'
                  }
                </span>
                            </Form.Item>
                            {
                              this.state.currentValve.is_enabled === 1 &&
                              <Form.Item label="模式"  {...formItemLayout}>
                       <span>
                  {
                    this.state.currentValve.mode === 0 ? '手动模式' : ''
                  }
                </span>
                              </Form.Item>
                            }

                            {
                              this.state.currentValve.mode===0&&
                              <Form.Item label="阀门位置" {...formItemLayout}>
                        <span>
                   {this.state.currentValve.position}
                </span>
                              </Form.Item>
                            }

                          </Form>

                        </Panel>
                      </Collapse>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Collapse activeKey={['1']}>
                        <Panel showArrow={false} header={<div><Icon type="box-plot"/> 当前策略</div>} key="1"
                        >
                          <Form onSubmit={this.handleSubmit}>
                            <Form.Item label="模式"  {...formItemLayout}>
                              {getFieldDecorator(`mode`, {
                                initialValue: 0
                              })(
                                <Select style={{width: '120px'}}>
                                  <Option value={0}>手动模式</Option>
                                </Select>
                              )}
                            </Form.Item>

                            <Form.Item label="阀门位置" {...formItemLayout}>
                              {getFieldDecorator(`position`,{
                                initialValue: 0
                              })(
                                <div>
                                  <InputNumber  min={0} max={100} precision={1}/> <span className="ant-form-text">有效值为0-100,1位小数</span>
                                </div>
                              )}
                            </Form.Item>
                          </Form>
                          <div style={{overflow: 'hidden'}}>
                            <Button type="primary" style={{float: 'right'}} onClick={()=> {
                              this.handleEdit()
                            }}>修改策略</Button>

                          </div>
                        </Panel>
                      </Collapse>
                    </Col>
                  </Row>
                </TabPane>
              })
            }
          </Tabs>


        </div>
      </div>

    );
  }
}

export default SearchList
