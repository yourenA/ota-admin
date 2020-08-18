import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {
  PageHeader,
  Input,
  Table,
  Form,
  Card,
  Button,
  Col,
  Collapse,
  Icon,
  Select,
  message,
  Row,
  Modal,
  Badge,
  Popconfirm,
  Divider
} from 'antd';
import differenceBy from 'lodash/differenceBy'
import AddChannel from './AddOrEditChannel'
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;
const TextArea = Input.TextArea
@connect(({parameters, loading}) => ({
  parameters,
}))
@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      channels: [],
      editRecord: {},
      editChannels: {},
      optionChannel: []
    }
  }

  componentDidMount() {
    this.handleSearch();

  }
  handleSearch = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'parameters/fetch',
      payload: {
        collector_id:this.props.history.location.query.id
      },
    });
  }
  handleAdd = ()=> {
    const formValues = this.addChannel.props.form.getFieldsValue();
    console.log('formValues', formValues)
    // if (!formValues.number) {
    //   message.error('请选择通道编号')
    //   return false;
    // }
    // if (!formValues.name) {
    //   message.error('请输入通道名称')
    //   return false;
    // }
    // if (!formValues.sensor_id) {
    //   message.error('请选择接入传感器')
    //   return false;
    // }
    const channel = {
      type:'sensor',
      index: formValues.index,
      name: formValues.name,
      remark: formValues.remark,
      model_id: formValues.model_id,
    };
    console.log('channel', channel)
    const that = this;
    this.props.dispatch({
      type: 'parameters/add',
      payload: {
        collector_id: this.props.history.location.query.id,
        ...channel
      },
      callback: function () {
          message.success('添加成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch();
      }
    });
  }
  handleRemove = (record)=> {
    console.log(record)
    const that = this;
    this.props.dispatch({
      type: 'parameters/remove',
      payload: {
        collector_id: this.props.history.location.query.id,
        parameter_id:record.id
      },
      callback: function () {
        message.success('删除成功')
        that.handleSearch();
      }
    });
  }

  render() {
    const {
      parameters: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },

      {
        title: '单位',
        dataIndex: 'data_unit',
      },
      {
        title: '通道序号',
        dataIndex: 'index',
      },
      {
        title: '型号',
        dataIndex: 'model',
      },

      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => {
            return <Fragment>
              <Popconfirm title={'确定要删除吗?'}
                          onConfirm={()=>this.handleRemove(record)}>
                <a >删除</a>
              </Popconfirm>

            </Fragment>
        }
      },
    ];
    const columns2 = [
      // {
      //  title: '已存在通道编号',
      //   dataIndex: 'number',
      // },
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '单位',
        dataIndex: 'data_unit',
        width:'20%'
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    const columns3 = [
      // {
      //  title: '已存在通道编号',
      //   dataIndex: 'number',
      // },
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '单位',
        dataIndex: 'data_unit',
        width:'20%'
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    const columns4 = [
      // {
      //  title: '已存在通道编号',
      //   dataIndex: 'number',
      // },
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
    ];
    return (
      <div>
        <div className="info-page-container">
          <Collapse activeKey={['1']}>
            <Panel showArrow={false}
                   header={<div><Icon type="box-plot"/> 传感器 {/*<Button style={{float: 'right'}} type='primary' size="small"
                                                                    onClick={()=> {
                                                                      this.setState({
                                                                        addModal: true
                                                                      })
                                                                    }}>添加</Button>*/}</div>} key="1"
            >
              <h3>该采集器共有{data.sensor?data.sensor.length:'0'}个传感器</h3>
           {/*   <Table
                size='small'
                rowKey={'id'}
                dataSource={data.sensor||[]}
                columns={columns}
                pagination={false}
              />*/}
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 发电机信息 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'id'}
                dataSource={data.generator||[]}
                columns={columns2}
                pagination={false}
              />
            </Panel>

          </Collapse>

          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 阀门信息 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'id'}
                dataSource={data.double_ball_valve||[]}
                columns={columns3}
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 电控阀门信息 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'id'}
                dataSource={data.electric_valve||[]}
                columns={columns3}
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 水表信息 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'id'}
                dataSource={data.water_meter||[]}
                columns={columns2}
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 故障信息 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'id'}
                dataSource={data.error||[]}
                columns={columns4}
                pagination={false}
              />
            </Panel>

          </Collapse>
        </div>
        <Modal
          title={'添加' }
          destroyOnClose
          visible={this.state.addModal}
          centered
          onOk={this.handleAdd}
          onCancel={()=> {
            this.setState({addModal: false})
          }}
        >
          <AddChannel
            channels={this.state.channels}
            collector_id={this.props.history.location.query.id}
            wrappedComponentRef={(inst) => this.addChannel = inst}/>

        </Modal>
        <Modal
          title={'修改通道' }
          destroyOnClose
          visible={this.state.editModal}
          centered
          onOk={this.handleAdd}
          onCancel={()=> {
            this.setState({editModal: false})
          }}
        >
          <AddChannel
            editRecord={this.state.editRecord}
            channels={this.state.channels}
            collector_id={this.props.history.location.query.id}
            wrappedComponentRef={(inst) => this.addChannel = inst}/>

        </Modal>

      </div>
    );
  }
}

export default SearchList
