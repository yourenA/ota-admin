import React, {Component} from 'react';
import styles from './valves.less';
import {connect} from 'dva';
import {
  Alert,
  Badge,
  InputNumber,
  Select,
  Card,
  Button,
  Radio ,
  message,
  Collapse,
  Switch,
  Form,
  Icon,
  Tabs,
  Row,
  Col
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import findIndex from 'lodash/findIndex';
import request from '@/utils/request';
const Panel = Collapse.Panel;
import find from 'lodash/find'
const {Description} = DescriptionList;
const {TabPane} = Tabs;
const Option = Select.Option;
@connect(({valves, double_ball_valves, loading, system_configs}) => ({
  valves, system_configs, double_ball_valves
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name = this.props.history.location.query.name
    this.timer = null;
    this.state = {
      editRecord: {},
      mode: '1',
      valves: [],
      over_rate: 120,
      over_recover_rate: 100,
      under_recover_rate: 100,
      under_rate: 80,
      channels: [],
      channel: '',
      refresh_second: 0,
      activeKey: '',
      currentValve: {},
      radioValue:''
    };
  }

  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'double_ball_valves/fetch',
      payload: {
        device_id: that.props.history.location.query.id
      },
      callback: ()=> {
        const {
          double_ball_valves
        } = this.props;
        if (double_ball_valves.data.double_ball_valve.length > 0) {
          this.setState({
            activeKey: double_ball_valves.data.double_ball_valve[0].id
          }, function () {
            // this.getValveStatus(double_ball_valves.data[0].id)
            dispatch({
              type: 'system_configs/fetch',
              callback: ()=> {
                const {system_configs}=that.props
                const refresh_second = find(system_configs.data, function (o) {
                  return o.key === 'double_ball_valve_info_refresh_time'
                })
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
    request(`/devices/${that.props.history.location.query.id}/double_ball_valves/${id}/status`, {
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
  handleEdit = (id)=> {
    const that = this;
    let sendData = {}
    if (this.state.mode === '1') {
      sendData.over = Number(this.state.over)
      sendData.over_recover = Number(this.state.over_recover)
      sendData.under = Number(this.state.under)
      sendData.under_recover = Number(this.state.under_recover)
      sendData.sensor_id = this.state.channel
    } else if (this.state.mode === '0') {
      if(this.state.radioValue==='a'){
        sendData.increment_valve_status=1;
        sendData.decrement_valve_status=-1;
      }else if(this.state.radioValue==='b'){
        sendData.increment_valve_status=-1;
        sendData.decrement_valve_status=1;
      }else if(this.state.radioValue==='c'){
        sendData.increment_valve_status=-1;
        sendData.decrement_valve_status=-1;
      }else{
        message.error('请选择一个模式')
      }
      // sendData.increment_valve_status = (this.state[this.state.activeKey] && this.state[this.state.activeKey].increment_valve_status) ? 1 : -1
      // sendData.decrement_valve_status = (this.state[this.state.activeKey] && this.state[this.state.activeKey].decrement_valve_status) ? 1 : -1
    }
    console.log('sendData', sendData)
    // return false
    this.props.dispatch({
      type: 'valves/edit',
      payload: {
        mode: Number(that.state.mode),
        ...sendData,
        device_id: that.props.history.location.query.id,
        valve_id: id
      },
      callback: function () {
        message.success('修改策略成功')
      }
    });
  }
  handleChangeMode = (value)=> {
    this.setState({
      mode: value,
      // [this.state.activeKey]:{}
    })
  }
  changeAuto = (mode, e)=> {
    this.setState({
      [mode]: e
    })
    // console.log(e)
  }
  handleChangeValve = (id, valves, e)=> {
    let preValue = this.state[id] || {};
    preValue[valves] = e
    this.setState({
      [id]: preValue
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
  getValveStatus = (id)=> {
    const that = this
    request(`/devices/${that.props.history.location.query.id}/double_ball_valves/${id}/status`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.setState({
          currentValve: response.data.data
        })
      }
    })
  }

  render() {
    const {
      valves: {data, loading, meta}, double_ball_valves
    } = this.props;
    return (
      <div>
        <div className="info-page-container">
          <Alert style={{marginBottom: '12px'}} message={`数据每隔${this.state.refresh_second}秒刷新一次`} type="info"/>
          <Tabs  tabPosition={'left'} onChange={this.onChangeTabs} style={{backgroundColor: '#fff'}} activeKey={this.state.activeKey}>
            {
              (double_ball_valves.data.double_ball_valve||[]).map((item, index)=> {
                let increment_valve_current_status = '';
                let decrement_valve_current_status = '';
                if (this.state.currentValve. increment_valve_status) {
                  switch (this.state.currentValve. increment_valve_status) {
                    case -1:
                      increment_valve_current_status = '关';
                      break;
                    case 1:
                      increment_valve_current_status = '开';
                      break;
                    case -2:
                      increment_valve_current_status = '未知';
                      break;
                    default :
                      increment_valve_current_status = '';
                      break;
                  }
                }
                if (this.state.currentValve.decrement_valve_status) {
                  switch (this.state.currentValve.decrement_valve_status) {
                    case -1:
                      decrement_valve_current_status = '关';
                      break;
                    case 1:
                      decrement_valve_current_status = '开';
                      break;
                    case -2:
                      decrement_valve_current_status = '未知';
                      break;
                    default :
                      decrement_valve_current_status = '';
                      break;
                  }
                }
                return <TabPane tab={item.name} key={item.id} style={{padding: '16px 16px'}}>
                  <Collapse activeKey={['1']}>
                    <Panel showArrow={false} header={<div><Icon type="box-plot"/> 当前策略</div>} key="1"
                    >
                      <div style={{marginBottom: '6px'}}>
                        <DescriptionList size="small" col="4">
                          <Description term="是否已使用"><h3>{this.state.currentValve.is_enabled === 1 ? '是' : '否'}</h3>
                          </Description>
                          <Description term="模式">
                            <h3>{this.state.currentValve.is_enabled === 1 ? this.state.currentValve.mode === 0 ? '手动模式' : '恒压控制' : '未知'}</h3>
                          </Description>
                        </DescriptionList>
                      </div>
                      {
                        this.state.currentValve.mode === 1 &&
                        <div style={{marginBottom: '10px'}}>
                          <DescriptionList size="small" col="4">
                            <Description term="当前传感器">  {this.state.currentValve.sensor.name}</Description>
                          </DescriptionList>
                          <DescriptionList size="small" col="4">
                            <Description term="over"> {this.state.currentValve.over} Mpa</Description>
                            <Description term="overRecover"> {this.state.currentValve.over_recover} Mpa</Description>
                            <Description term="underRecover"> {this.state.currentValve.under_recover} Mpa</Description>
                            <Description term="under"> {this.state.currentValve.under} Mpa</Description>
                          </DescriptionList>
                        </div>
                      }
                      {
                        this.state.currentValve.mode === 0 &&
                        <div style={{marginBottom: '10px'}}>
                          <DescriptionList size="small" col="4">
                            <Description term="增压球阀状态">  {increment_valve_current_status}</Description>
                          </DescriptionList>
                          <DescriptionList size="small" col="4">
                            <Description term="减压球阀状态">  {decrement_valve_current_status}</Description>
                          </DescriptionList>
                        </div>
                      }

                      <div style={{marginBottom: '10px'}}>
                        <DescriptionList size="small" col="1">
                          <Description
                            term="恒压控制可选传感器">  {this.state.currentValve.optional_sensors && this.state.currentValve.optional_sensors.reduce((pre, item)=> {
                            pre.push(item.name);
                            return pre
                          }, []).join(' | ')}</Description>
                        </DescriptionList>
                      </div>
                    </Panel>

                  </Collapse>
                  <Collapse activeKey={['2']} className={styles.valve_panel} style={{marginTop: '15'}}>
                    <Panel showArrow={false} header={<div><Icon type="sliders"/> 修改策略</div>} key="2"
                    >
                      <div style={{marginBottom: '10px'}}>
                        <Form layout={'inline'}>
                          <Form.Item
                            label="模式"
                          >
                            <Select value={this.state.mode.toString()} style={{width: 120}}
                                    onChange={this.handleChangeMode}>
                              <Option value="0">手动模式</Option>
                              <Option value="1">恒压控制</Option>
                            </Select>
                          </Form.Item>
                          {
                            this.state.mode === '1' && <Form.Item
                              label="传感器"
                            >
                              <Select value={this.state.channel} style={{width: 150}}
                                      onChange={(e)=> {
                                        this.setState({
                                          channel: e
                                        })
                                      }
                                      }>
                                {this.state.currentValve.optional_sensors && this.state.currentValve.optional_sensors.map((item, index)=> {
                                  return <Option key={index} value={item.id}>{item.name}</Option>
                                })}
                              </Select>
                            </Form.Item>
                          }
                        </Form>

                      </div>
                      {
                        this.state.mode === '1' &&
                        <div style={{marginBottom: '10px'}}>
                          <Form layout={'inline'}>
                            <Form.Item
                              label="over"
                            >
                              <InputNumber onChange={(e)=> {
                                this.changeAuto('over', e)
                              }} value={this.state.over} defaultValue={data.over}/> Mpa
                            </Form.Item>
                            <Form.Item
                              label="overRecover"
                            >
                              <InputNumber onChange={(e)=> {
                                this.changeAuto('over_recover', e)
                              }} value={this.state.over_recover} defaultValue={data.over_recover}/> Mpa
                            </Form.Item>
                            <Form.Item
                              label="underRecover"
                            >
                              <InputNumber onChange={(e)=> {
                                this.changeAuto("under_recover", e)
                              }} value={this.state.under_recover} defaultValue={data.under_recover}/> Mpa
                            </Form.Item>
                            <Form.Item
                              label="under"
                            >
                              <InputNumber onChange={(e)=> {
                                this.changeAuto('under', e)
                              }} value={this.state.under} defaultValue={data.under}/> Mpa
                            </Form.Item>

                          </Form>
                          <Alert message="over必须大于overRecover，underRecover必须大于 under"
                                 type="info" style={{marginBottom: '10px',marginTop: '10px'}}/>
                          <h3>自动填充数据:</h3>
                          <div style={{marginBottom: '8px'}}>
                            自动数值 : <InputNumber onChange={(e)=> {
                            this.setState({
                              autoData: e
                            })
                          }}/>
                            <Button type='primary' style={{marginLeft: '10px'}} onClick={()=> {
                              this.setState({
                                over: (this.state.autoData * (this.state.over_rate / 100)).toFixed(2),
                                over_recover: (this.state.autoData * (this.state.over_recover_rate / 100)).toFixed(2),
                                under_recover: (this.state.autoData * (this.state.under_recover_rate / 100)).toFixed(2),
                                under: (this.state.autoData * (this.state.under_rate / 100)).toFixed(2),
                              })
                            }}>计算</Button>
                          </div>

                          <Form layout={'inline'}>
                            <Form.Item
                              label="over(%)"
                            >
                              <InputNumber
                                onChange={(e)=> {
                                  this.changeAuto('over_rate', e)
                                }} value={this.state.over_rate}/>
                            </Form.Item>
                            <Form.Item
                              label="overRecover(%)"
                            >
                              <InputNumber
                                onChange={(e)=> {
                                  this.changeAuto('over_recover_rate', e)
                                }} value={this.state.over_recover_rate}/>
                            </Form.Item>
                            <Form.Item
                              label="underRecover(%)"
                            >
                              <InputNumber
                                onChange={(e)=> {
                                  this.changeAuto("under_recover_rate", e)
                                }} value={this.state.under_recover_rate}/>
                            </Form.Item>
                            <Form.Item
                              label="under(%)"
                            >
                              <InputNumber
                                onChange={(e)=> {
                                  this.changeAuto('under_rate', e)
                                }} value={this.state.under_rate}/>
                            </Form.Item>

                          </Form>

                          {/*      <DescriptionList  size="small" col="4" >
                           <Description term="over">
                           <InputNumber  onChange={(e)=>{
                           this.changeAuto('over',e)
                           }} value={this.state.over} defaultValue={data.over}/> Mpa
                           </Description>
                           <Description term="overRecover">  <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                           this.changeAuto('over_recover',e)
                           }}  defaultValue={data.over_recover}/> Mpa</Description>
                           <Description term="under">  <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                           this.changeAuto('under',e)
                           }}  defaultValue={data.under}/> Mpa</Description>
                           <Description term="underRecover"> <InputNumber  style={{width:'60px'}} onChange={(e)=>{
                           this.changeAuto("under_recover",e)
                           }}   defaultValue={data.under_recover}/> Mpa</Description>
                           </DescriptionList>*/}
                        </div>
                      }
                      {
                        this.state.mode === '0' &&
                        <div >
                          <Radio.Group value={this.state.radioValue} onChange={(e)=>{
                            this.setState({
                              radioValue: e.target.value,
                            });
                          }} buttonStyle="solid">
                            <Radio.Button value="a">增压</Radio.Button>
                            <Radio.Button value="b">减压</Radio.Button>
                            <Radio.Button value="c">停止</Radio.Button>
                          </Radio.Group>
                         {/* <Row gutter={16}>
                            <Col span={6}>
                              <Card className={styles.valve_card} size="small" title={'增压球阀'}>
                                <h4>目标状态 :<Switch className="valve-switch"
                                                  checked={this.state[item.id] && this.state[item.id].increment_valve_status}
                                                  checkedChildren="开" unCheckedChildren="关"
                                                  onChange={(checked)=>this.handleChangeValve(item.id, 'increment_valve_status', checked)}/>
                                </h4>
                              </Card>
                            </Col>
                            <Col span={6}>
                              <Card className={styles.valve_card} size="small" title={'减压球阀'}>
                                <h4>目标状态 :<Switch className="valve-switch"
                                                  checked={this.state[item.id] && this.state[item.id].decrement_valve_status}
                                                  checkedChildren="开" unCheckedChildren="关"
                                                  onChange={(checked)=>this.handleChangeValve(item.id, 'decrement_valve_status', checked)}/>
                                </h4>
                              </Card>
                            </Col>
                          </Row>*/}


                        </div>
                      }
                      <div style={{overflow: 'hidden'}}>
                        <Button type="primary" style={{float: 'right'}} onClick={()=> {
                          this.handleEdit(item.id)
                        }}>修改策略</Button>

                      </div>
                    </Panel>

                  </Collapse>
                </TabPane>
              })
            }
          </Tabs>
        </div>
      </div>
    );
  }
}

export default SearchList;
