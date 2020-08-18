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
import styles from './TableList.less';
import differenceBy from 'lodash/differenceBy'
import AddChannel from './AddOrEditChannel'
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;
const TextArea = Input.TextArea
@connect(({device_types, loading}) => ({
  device_types,
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
    const that = this;
    this.fetchCurrent();

  }

  fetchCurrent = ()=> {
    const that = this;
    request(`/devices/${this.props.history.location.query.id}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {

      if (response.status === 200) {
        const editChannels = that.state.editChannels;
        for (let i = 0; i < response.data.data.channels.length; i++) {
          if (response.data.data.channels[i].is_editable === 1) {
            editChannels[response.data.data.channels[i].number] = {};
            editChannels[response.data.data.channels[i].number].name = response.data.data.channels[i].name
            editChannels[response.data.data.channels[i].number].alias = response.data.data.channels[i].alias
            editChannels[response.data.data.channels[i].number].sensor_id = response.data.data.channels[i].installed_sensor ? response.data.data.channels[i].installed_sensor.id : ''
          }
        }
        console.log('editChannels', editChannels)
        that.setState({
          editChannels: editChannels,
          channels: response.data.data.channels,
          device_type_id: response.data.data.device_type_id
        }, function () {
        })
      }
    })
  }
  handleAdd = ()=> {
    const formValues = this.addChannel.props.form.getFieldsValue();
    console.log('formValues', formValues)
    if (!formValues.number) {
      message.error('请选择通道编号')
      return false;
    }
    if (!formValues.name) {
      message.error('请输入通道名称')
      return false;
    }
    if (!formValues.sensor_id) {
      message.error('请选择接入传感器')
      return false;
    }
    const channel = {
      number: formValues.number,
      name: formValues.name,
      alias: formValues.alias,
      sensor_id: formValues.sensor_id,
    };
    console.log('channel', channel)
    const that = this;
    this.props.dispatch({
      type: 'devices/edit',
      payload: {
        channels: [channel],
        id: this.props.history.location.query.id
      },
      callback: function () {
        if (that.state.editRecord.number) {
          message.success('修改通道成功')
        } else {
          message.success('添加通道成功')
        }
        that.setState({
          addModal: false,
          editModal: false,
          editRecord: {}
        });
        that.fetchCurrent()
      }
    });
  }
  handleRemove = (record)=> {
    const that = this;
    this.props.dispatch({
      type: 'devices/edit',
      payload: {
        channels: [{
          number: record.number,
          sensor_id: ''
        }],
        id: this.props.history.location.query.id
      },
      callback: function () {
        message.success('删除通道成功')
        that.fetchCurrent()
      }
    });
  }

  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '通道',
        dataIndex: 'display_name',
      },

      {
        title: '单位',
        dataIndex: 'data_unit',
      },

      {
        title: '传感器',
        dataIndex: 'installed_sensor',
        render: (text, record) => {
          return text ? `${text.model}/${text.name}` : ''
        }
      },
      {
        title: '备注',
        dataIndex: 'alias',
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.is_physical === 1) {
            return <Fragment>
              <Popconfirm title={'确定要删除吗?'}
                          onConfirm={()=>this.handleRemove(record)}>
                <a >删除</a>
              </Popconfirm>

            </Fragment>
          } else {
            return ''
          }
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
      },
      {
        title: '单位',
        dataIndex: 'data_unit',
      },
      {
        title: '备注',
        dataIndex: 'alias',
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
      },
      {
        title: '备注',
        dataIndex: 'alias',
      },
    ];
    return (
      <div>
        <div className="info-page-container">
          <Collapse activeKey={['1']}>
            <Panel showArrow={false}
                   header={<div><Icon type="box-plot"/> 传感器 <Button style={{float: 'right'}} type='primary' size="small"
                                                                    onClick={()=> {
                                                                      this.setState({
                                                                        addModal: true
                                                                      })
                                                                    }}>添加</Button></div>} key="1"
            >
              <Table
                size='small'
                rowKey={'number'}
                dataSource={this.state.channels.filter(o=>o.type === 1)}
                columns={columns}
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 发电机信息 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'number'}
                dataSource={this.state.channels.filter(o=>o.type === 3)}
                columns={columns2}
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div><Icon type="box-plot"/> 阀门 </div>} key="1"
            >
              <Table
                size='small'
                rowKey={'number'}
                dataSource={this.state.channels.filter(o=>o.type === 2)}
                columns={columns3}
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
            device_type_id={this.state.device_type_id}
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
            device_type_id={this.state.device_type_id}
            wrappedComponentRef={(inst) => this.addChannel = inst}/>

        </Modal>

      </div>
    );
  }
}

export default SearchList
