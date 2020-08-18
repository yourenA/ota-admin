import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Row, Col, Form, Card, Select, Input, Table, Modal, Divider, PageHeader} from 'antd';
import {Collapse, Button} from 'antd';
import { DatePicker } from 'antd';
const Panel = Collapse.Panel;
import TagSelect from '@/components/TagSelect';
import AvatarList from '@/components/AvatarList';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow';

import styles from './Projects.less';
const {Option} = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({list, loading}) => ({
  list,
  loading: loading.models.list,
}))
class CoverCardList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.myChart = null;
    this.myChart2 = null;
    this.myChart3 = null;
    this.myChart4 = null;
    this.state = {
      showVisible: false,
      targetKeys: [],
      selectedKeys: [],
      data1:[{
        key:1,
        time:'2019-03-11 05:56:12',
        dianya:'45',
        dianliu:'12'
      },{
        key:2,
        time:'2019-03-11 05:57:12',
        dianya:'23',
        dianliu:'7'
      },{
        key:3,
        time:'2019-03-11 05:58:12',
        dianya:'45',
        dianliu:'34'
      },{
        key:4,
        time:'2019-03-11 05:59:12',
        dianya:'23',
        dianliu:'6'
      }],
      data2:[{
        key:11,
        time:'2019-03-11 05:56:12',
        qianya:'33',
        houya:'45'
      },{
        key:22,
        time:'2019-03-11 05:57:12',
        qianya:'23',
        houya:'65'
      },{
        key:33,
        time:'2019-03-11 05:58:12',
        qianya:'45',
        houya:'34'
      },{
        key:44,
        time:'2019-03-11 05:59:12',
        qianya:'54',
        houya:'34'
      }],
      data3:[{
        key:111,
        time:'2019-03-11 05:56:12',
        zhuansu:'223',
        gonglv:'45'
      },{
        key:222,
        time:'2019-03-11 05:57:12',
        zhuansu:'234',
        gonglv:'65'
      },{
        key:333,
        time:'2019-03-11 05:58:12',
        zhuansu:'433',
        gonglv:'34'
      },{
        key:444,
        time:'2019-03-11 05:59:12',
        zhuansu:'432',
        gonglv:'34'
      }],
      data4:[{
        key:555,
        time:'2019-03-11 05:56:12',
        liuliang:'40',
      },{
        key:666,
        time:'2019-03-11 05:57:12',
        liuliang:'48',
      },{
        key:777,
        time:'2019-03-11 05:58:12',
        liuliang:'49',
      },{
        key:888,
        time:'2019-03-11 05:59:12',
        liuliang:'45',
      }]
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
    this.renderChart(null, '.chart')
    this.renderChart2(null, '.chart2')
    this.renderChart3(null, '.chart3')
    this.renderChart4(null, '.chart4')
    // this.renderChart3(null, '.chart3')
    // this.renderChart4(null, '.chart4')
    window.addEventListener('resize', this.resizeChart)
  }

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({targetKeys: nextTargetKeys});

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  }

  resizeChart = ()=> {
    if (this.myChart) {
      this.myChart.resize();
      this.myChart2.resize();
      this.myChart3.resize();
      this.myChart4.resize();
    }
  }
  renderChart = (data, className)=> {
    let date=[];
    let data1=[];
    let data2=[]
    for(let i=0;i<this.state.data1.length;i++){
      date.push(this.state.data1[i].time)
      data1.push(this.state.data1[i].dianya)
      data2.push(this.state.data1[i].dianliu)
    }
    this.myChart = this.echarts.init(document.querySelector(className));
    let option = {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: ['电压', '电流']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: [
        {
          type: 'value',
          name: '电压(V)',
        },
        {
          type: 'value',
          name: '电流(A)',
        }
      ],
      grid: {
        top: '20%',
        left: '3%',
        right: '5%',
        bottom: '1%',
        containLabel: true
      },
      series: [
        {
          name: '电压',
          type: 'line',
          data: data1,
          smooth: true,
        },
        {
          name: '电流',
          type: 'line',
          yAxisIndex: 1,
          data: data2,
          smooth: true,
        },
      ]
    };
    const that = this;
    that.myChart.setOption(option);

  }
  renderChart2 = (data, className)=> {
    let date=[];
    let data1=[];
    let data2=[]
    for(let i=0;i<this.state.data2.length;i++){
      date.push(this.state.data2[i].time)
      data1.push(this.state.data2[i].qianya)
      data2.push(this.state.data2[i].houya)
    }
    this.myChart2 = this.echarts.init(document.querySelector('.chart2'));
    let option = {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: ['前压力', '后压力']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: [
        {
          type: 'value',
          name: '压力(MPa)',
        }
      ],
      grid: {
        top: '20%',
        left: '3%',
        right: '5%',
        bottom: '1%',
        containLabel: true
      },
      series: [
        {
          name: '前压力',
          type: 'line',
          data: data1,
          smooth: true,
        },
        {
          name: '后压力',
          type: 'line',
          data: data2,
          smooth: true,
        },
      ]
    };
    const that = this;
    that.myChart2.setOption(option);

  }
  renderChart3 = (data, className)=> {
    let date=[];
    let data1=[];
    let data2=[]
    for(let i=0;i<this.state.data3.length;i++){
      date.push(this.state.data3[i].time)
      data1.push(this.state.data3[i].zhuansu)
      data2.push(this.state.data3[i].gonglv)
    }
    this.myChart3 = this.echarts.init(document.querySelector(className));
    let option = {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: ['转速', '功率']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: [
        {
          type: 'value',
          name: '转速(RPM)',
        },
        {
          type: 'value',
          name: '功率(W)',
        }
      ],
      grid: {
        top: '20%',
        left: '3%',
        right: '5%',
        bottom: '1%',
        containLabel: true
      },
      series: [
        {
          name: '转速',
          type: 'line',
          data: data1,
          smooth: true,
        },
        {
          name: '功率',
          type: 'line',
          yAxisIndex: 1,
          data: data2,
          smooth: true,
        },
      ]
    };
    const that = this;
    that.myChart3.setOption(option);

  }
  renderChart4 = (data, className)=> {
    let date=[];
    let data1=[];
    let data2=[]
    for(let i=0;i<this.state.data4.length;i++){
      date.push(this.state.data4[i].time)
      data1.push(this.state.data4[i].liuliang)
    }
    this.myChart4 = this.echarts.init(document.querySelector(className));
    let option = {
      backgroundColor: '#eee',
      tooltip: {
        trigger: 'axis'
      },

      legend: {
        data: ['流量']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
      },
      yAxis: [
        {
          type: 'value',
          name: '流量(L/m)',
        }
      ],
      grid: {
        top: '20%',
        left: '3%',
        right: '5%',
        bottom: '1%',
        containLabel: true
      },
      series: [
        {
          name: '流量',
          type: 'line',
          data: data1,
          smooth: true,
        },
      ]
    };
    const that = this;
    that.myChart4.setOption(option);

  }
  showVisible = (showVisible)=> {
    this.setState({
      showVisible
    })
  }
  showVisible2 = (showVisible2)=> {
    this.setState({
      showVisible2
    })
  }
  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 10; i++) {
      const data = {
        key: i.toString(),
        title: `前端压力${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({mockData, targetKeys});
  }

  render() {
    const columns = [{
      title: '时间',
      dataIndex: 'time',
      key: 'name',
    }, {
      title: '电压值(V)',
      dataIndex: 'dianya',
      key: 'age',
    }, {
      title: '电流值(A)',
      dataIndex: 'dianliu',
      key: 'address',
    }];
    const columns2 = [{
      title: '时间',
      dataIndex: 'time',
      key: 'name',
    }, {
      title: '前压力(MPa)',
      dataIndex: 'qianya',
      key: 'age',
    }, {
      title: '后压力(MPa)',
      dataIndex: 'houya',
      key: 'address',
    }];
    const columns3 = [{
      title: '时间',
      dataIndex: 'time',
      key: 'name',
    }, {
      title: '功率(W)',
      dataIndex: 'gonglv',
      key: 'age',
    }, {
      title: '转速(RPM)',
      dataIndex: 'zhuansu',
      key: 'address',
    }];
    const columns4 = [{
      title: '时间',
      dataIndex: 'time',
      key: 'name',
    }, {
      title: '流量(L/m)',
      dataIndex: 'liuliang',
      key: 'age',
    }];
    const showDate = [{
      index: 1,
      name: '发电机输出电压、电流',
      age: '设备编号1',
    }, {
      index: 2,
      name: '前后端压力',
      age: '设备编号2',
    }, {
      index: 3,
      name: '发电机转速、功率',
      age: '设备编号3',
    }, {
      index: 4,
      name: '流量曲线',
      age: '设备编号4',
    },];
    const editDate = [{
      index: 'CS01',
      name: '多功能减压阀球阀1，2动作设置',
      age: '设备编号1',
    }, {
      index: 'CS02',
      name: '',
      age: '',
    }];
    const showColumns = [{
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    }, {
      title: '显示名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '设备编号',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '操作',
      dataIndex: 'oprate',
      key: 'oprate',
      render: (val, record, index) => (
        <div>
          <a href="javascript:;" onClick={()=> {
            this.setState(
              {
                editRecord: record,
                addEditVisible: true
              }
            )
          }}>修改</a>
          <Divider type="vertical"/>
          <a href="javascript:;" onClick={()=> {
          }}>删除</a>
        </div>
      ),

    }];
    const editColumns = [{
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    }, {
      title: '显示名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '设备编号',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '操作',
      dataIndex: 'oprate',
      key: 'oprate',
      render: (val, record, index) => (
        <div>
          <a href="javascript:;" onClick={()=> {
            this.setState(
              {
                editRecord: record,
                setVisible: true
              }
            )
          }}>修改</a>
          <Divider type="vertical"/>
          <a href="javascript:;" onClick={()=> {
          }}>删除</a>
        </div>
      ),

    }];
    const mockData = [{
      key: 1,
      title: `前端压力`,
    }, {
      key: 2,
      title: `后端压力`,
    }, {
      key: 3,
      title: `流量`,
    }, {
      key: 4,
      title: `发电电压`,
    }, {
      key: 5,
      title: `发电电流`,
    }, {
      key: 6,
      title: `发电效率`,
    }];

    const {targetKeys, selectedKeys, disabled} = this.state;
    return (
      <div>
        <Card bordered={false} style={{marginTop:'24px'}}>
          <Collapse activeKey={['1']}>
            <Panel showArrow={false} header={<div>设备历史数据 <DatePicker  defaultValue={moment()}/></div>} key="1"
                   >
              <div><Row gutter={12}>
                <Col span={24} style={{marginBottom: 12}}>
                  <Card
                    hoverable={true}
                    size="small"
                    headStyle={{
                      paddingLeft: '5px',
                    }}
                    bodyStyle={{
                      padding: '0',
                      minHeight: '170px'
                    }}
                    title={
                      "发电机输出电压、电流"
                    }
                  >
                    <Row type="flex">
                      <Col xs={8}>
                        <Table size="small" columns={columns} dataSource={this.state.data1} bordered={true} pagination={false}/>
                      </Col>
                      <Col xs={16}>

                        <div style={{width: '100%', height: '100%'}} className="chart"></div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={24} style={{marginBottom: 12}}>
                  <Card
                    hoverable={true}
                    size="small"
                    headStyle={{
                      paddingLeft: '5px',
                    }}
                    bodyStyle={{
                      padding: '0',
                      minHeight: '170px'
                    }}
                    title={
                      "前后端压力"
                    }
                  >
                    <Row type="flex">
                      <Col xs={8}>
                        <Table size="small" columns={columns2} dataSource={this.state.data2} bordered={true} pagination={false}/>
                      </Col>
                      <Col xs={16}>

                        <div style={{width: '100%', height: '100%'}} className="chart2"></div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col  span={24} style={{marginBottom: 12}}>
                  <Card
                    hoverable={true}
                    size="small"
                    headStyle={{
                      paddingLeft: '5px',
                    }}
                    bodyStyle={{
                      padding: '0',
                      minHeight: '170px'
                    }}
                    title={
                      "发电机转速、功率"
                    }
                  >
                    <Row type="flex">
                      <Col xs={8}>
                        <Table size="small" columns={columns3} dataSource={this.state.data3} bordered={true} pagination={false}/>
                      </Col>
                      <Col xs={16}>

                        <div style={{width: '100%', height: '100%'}} className="chart3"></div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={24} style={{marginBottom: 12}}>
                  <Card
                    hoverable={true}
                    size="small"
                    headStyle={{
                      paddingLeft: '5px',
                    }}
                    bodyStyle={{
                      padding: '0',
                      minHeight: '170px'
                    }}
                    title={
                      "流量曲线"
                    }
                  >
                    <Row type="flex">
                      <Col xs={8}>
                        <Table size="small" columns={columns4} dataSource={this.state.data4} bordered={true} pagination={false}/>
                      </Col>
                      <Col xs={16}>

                        <div style={{width: '100%', height: '100%'}} className="chart4"></div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row></div>
            </Panel>
          </Collapse>

        </Card>
        <Modal
          title="参数显示维护"
          centered
          width="700px"
          visible={this.state.showVisible}
          onOk={() => this.showVisible(false)}
          onCancel={() => this.showVisible(false)}
        >
          <Button type="primary" icon='plus' onClick={()=> {
            this.setState({
              addEditVisible: true
            })
          }}>添加</Button>
          <Table size="small" columns={showColumns} dataSource={showDate} bordered={true} pagination={false}/>
        </Modal>
        <Modal
          title={this.state.editRecord && this.state.editRecord.name}
          centered
          width="700px"
          visible={this.state.addEditVisible}
          onOk={() => this.setState({
            addEditVisible: false
          })}
          onCancel={() => this.setState({
            addEditVisible: false
          })}
        >
        </Modal>
        <Modal
          title="参数设置维护"
          centered
          width="700px"
          visible={this.state.showVisible2}
          onOk={() => this.showVisible2(false)}
          onCancel={() => this.showVisible2(false)}
        >
          <Button type="primary" icon='plus' onClick={()=> {
            this.setState({
              setVisible: true
            })
          }}>添加</Button>
          <Table size="small" columns={editColumns} dataSource={editDate} bordered={true} pagination={false}/>
        </Modal>
        <Modal
          title="参数设置"
          centered
          width="700px"
          visible={this.state.setVisible}
          onOk={() => this.setState({
            setVisible: false
          })}
          onCancel={() => this.setState({
            setVisible: false
          })}
        >
          <Row type="flex" justify="center" style={{marginBottom: '12px'}}>
            <Col span={4}>参数</Col>
            <Col span={12}>设定值</Col>
            <Col span={4}>执行机构</Col>
            <Col span={4}>执行</Col>
          </Row>
          <Row type="flex" justify="center" style={{marginBottom: '12px'}}>
            <Col span={4}>后端压力 : </Col>
            <Col span={12}>
              上偏差 &nbsp;
              <Select defaultValue="jack">
                <Option value="jack">大于</Option>
                <Option value="lucy">小于</Option>
              </Select>
              &nbsp;
              <Input style={{width: '100px'}}/>
            </Col>
            <Col span={4}>球阀1</Col>
            <Col span={4}><Button type='primary'>开</Button></Col>
          </Row>
          <Row type="flex" justify="center" style={{marginBottom: '12px'}}>
            <Col span={4}>后端压力 : </Col>
            <Col span={12}>
              下偏差 &nbsp;
              <Select defaultValue="lucy">
                <Option value="jack">大于</Option>
                <Option value="lucy">小于</Option>
              </Select>
              &nbsp;
              <Input style={{width: '100px'}}/>
            </Col>
            <Col span={4}>球阀2</Col>
            <Col span={4}><Button type='primary'>开</Button></Col>
          </Row>

        </Modal>
      </div>
    );
  }
}

export default CoverCardList;
