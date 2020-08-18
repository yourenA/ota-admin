import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {
  Row,
  Popconfirm,
  Form,
  message,
  Button,
  Modal,
  Table,
  Collapse,
  Col,
  Divider
} from 'antd';
import AddSensors from './AddSensors';
import AddParams from './AddParams';
import AddValve from './AddValve';
import AddDoubleValve from './AddDoubleValve';
import AddError from './AddError';
import styles from './TableList.less';
const FormItem = Form.Item;
const Panel = Collapse.Panel;
/* eslint react/no-multi-comp:0 */
@connect(({device_parameters,device_sensors,double_ball_valves,electric_valves,device_errors, loading}) => ({
  device_parameters,double_ball_valves,electric_valves,device_sensors,device_errors
}))
@Form.create()
class TableList extends PureComponent {
  state = {
  };


  componentDidMount() {
   this.handleSearch({
      });
    this.handleSearchParams()
    this.handleSearchValves()
    this.handleSearchElectricValves()
    this.handleSearchErrors()
  }


  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_sensors/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleSearchParams = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_parameters/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleSearchValves = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'double_ball_valves/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleSearchElectricValves = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'electric_valves/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleSearchErrors = (values, cb) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'device_errors/fetch',
      payload: {
        device_id:this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        if (cb) cb()
      }
    });
  }
  handleAdd = ()=> {
    const formValues = this.AddSensors.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'device_sensors/add',
      payload: {
        device_id:this.props.history.location.query.id,
        name:formValues.name,
        parameter_id:formValues.parameters,
        model_id:formValues.model_id,
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleEdit = ()=> {
    const formValues = this.EditSensors.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'device_sensors/edit',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:this.state.editRecord.id,
        name:formValues.name,
      },
      callback: function () {
        message.success('编辑成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleAddParams=()=>{
    const formValues = this.AddParams.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const {
    } = this.props;
    const that = this;
    this.props.dispatch({
      type: 'device_parameters/add',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:formValues.parameter_id,
        name:formValues.name,
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addParamsModal: false,
        });
        that.handleSearchParams()
      }
    });
  }
  handleAddValve=()=>{
    const formValues = this.AddValve.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const {
      device_parameters: {data},
    } = this.props;
    const that = this;
    this.props.dispatch({
      type: 'double_ball_valves/add',
      payload: {
        device_id:this.props.history.location.query.id,
        ...formValues
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addValveModal: false,
        });
        that.handleSearchValves()
      }
    });
  }
  handleEditValve=()=>{
    const formValues = this.EditValve.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'double_ball_valves/edit',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:this.state.editRecord.id,
        ...formValues
      },
      callback: function () {
        message.success('编辑成功')
        that.setState({
          editValveModal: false,
        });
        that.handleSearchValves()
      }
    });
  }
  handleAddElectricValve=()=>{
    const formValues = this.AddElectricValve.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'electric_valves/add',
      payload: {
        ...formValues,
        device_id:this.props.history.location.query.id,
        parameter_id:formValues.parameters,
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addElectricModal: false,
        });
        that.handleSearchElectricValves()
      }
    });
  }
  handleEditElectricValve=()=>{
    const formValues = this.EditElectricValve.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'electric_valves/edit',
      payload: {
        ...formValues,
        device_id:this.props.history.location.query.id,
        parameter_id:this.state.editRecord.id,
      },
      callback: function () {
        message.success('编辑成功')
        that.setState({
          editElectricModal: false,
        });
        that.handleSearchElectricValves()
      }
    });
  }
  handleAddError=()=>{
    const formValues = this.AddError.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'device_errors/add',
      payload: {
        ...formValues,
        device_id:this.props.history.location.query.id,
        parameter_id:formValues.parameters,
      },
      callback: function () {
        message.success('添加成功')
        that.setState({
          addErrorModal: false,
        });
        that.handleSearchErrors()
      }
    });
  }
  handleEditError=()=>{
    const formValues = this.EditError.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'device_errors/edit',
      payload: {
        ...formValues,
        device_id:this.props.history.location.query.id,
        parameter_id:this.state.editRecord.id,
      },
      callback: function () {
        message.success('编辑成功')
        that.setState({
          editErrorModal: false,
        });
        that.handleSearchErrors()
      }
    });
  }
  handleRemove=(id)=>{
    const that=this
    this.props.dispatch({
      type: 'device_sensors/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:id
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleRemoveParams=(id)=>{
    const that=this
    this.props.dispatch({
      type: 'device_parameters/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:id
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addModal: false,
        });
        that.handleSearchParams()
      }
    });
  }
  handleRemoveValve=(id)=>{
    const that=this
    this.props.dispatch({
      type: 'double_ball_valves/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:id
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addValveModal: false,
        });
        that.handleSearchValves()
      }
    });
  }
  handleRemoveElectricValve=(id)=>{
    const that=this
    this.props.dispatch({
      type: 'electric_valves/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        parameter_id:id
      },
      callback: function () {
        message.success('删除成功')
        that.setState({
          addValveModal: false,
        });
        that.handleSearchElectricValves()
      }
    });
  }
  render() {
    const {
      device_sensors: {data, loading, meta},device_parameters,double_ball_valves,electric_valves,device_errors
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '序号',
        dataIndex: 'index',
      },

      {
        title: '所属采集器编号/名称',
        dataIndex: 'collector_number',
        render: (text, record,index) => {
          return <span>{text}/{record.collector_name}</span>
        }
      },
      {
        title: '型号',
        dataIndex: 'model_name',
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <a onClick={()=>{
              this.setState({
                editModal:true,
                editRecord:record
              })
            }}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemove(record.id)}>
              <a >删除</a>
            </Popconfirm>
          </Fragment>
        }
      },

    ];
    const params_columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '单位',
        dataIndex: 'data_unit',
      },
      {
        title: '所属采集器编号/名称',
        dataIndex: 'collector_number',
        render: (text, record,index) => {
          return <span>{text}/{record.collector_name}</span>
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemoveParams(record.id)}>
              <a >删除</a>
            </Popconfirm>

          </Fragment>
        }
      },

    ];
    const double_ball_valves_columns= [
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '所属采集器编号/名称',
        dataIndex: 'collector_number',
        render: (text, record,index) => {
          return <span>{text}/{record.collector_name}</span>
        }
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <a onClick={()=>{
              this.setState({
                editValveModal:true,
                editRecord:record
              })
            }}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemoveValve(record.id)}>
              <a >删除</a>
            </Popconfirm>

          </Fragment>
        }
      },

    ];
    const electric_valves_columns= [
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '序号',
        dataIndex: 'index',
      },
      {
        title: '所属采集器编号/名称',
        dataIndex: 'collector_number',
        render: (text, record,index) => {
          return <span>{text}/{record.collector_name}</span>
        }
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <a onClick={()=>{
              this.setState({
                editElectricModal:true,
                editRecord:record
              })
            }}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemoveElectricValve(record.id)}>
              <a >删除</a>
            </Popconfirm>

          </Fragment>
        }
      },

    ];
    const error_clolumn= [
      {
        title: '名称',
        dataIndex: 'name',
        width:'20%'
      },
      {
        title: '显示故障项',
        dataIndex: 'display_errors',
        render: (text, record) => {
          return text.reduce((pre,item)=>{
            pre.push(item.name);
            return pre
          },[]).join(' | ')
        }
      },
      {
        title: '所属采集器编号/名称',
        dataIndex: 'collector_number',
        render: (text, record,index) => {
          return <span>{text}/{record.collector_name}</span>
        }
      },
      {
        title: '操作',
        render: (text, record,index) => {
          return <Fragment>
            <a onClick={()=>{
              this.setState({
                editErrorModal:true,
                editRecord:record
              })
            }}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title={'确定要删除吗?'}
                        onConfirm={()=>this.handleRemoveElectricValve(record.id)}>
              <a >删除</a>
            </Popconfirm>

          </Fragment>
        }
      },

    ];
    return (
      <div>
        <div className="info-page-container" >
          <Collapse activeKey={['1']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 传感器列表 <Button style={{float: 'right'}} type='primary' size="small"
                                                                onClick={()=> {
                                                                  this.setState({
                                                                    addModal: true
                                                                  })
                                                                }}>添加传感器</Button></div>} key="1"
            >
              <Table
                style={{backgroundColor:'#fff'}}
                loading={loading}
                rowKey={'id'}
                dataSource={data.sensor||[]}
                columns={columns}
                size="small"
                pagination={false}
              />
            </Panel>
          </Collapse>
          <Collapse activeKey={['2']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 设备参数 <Button style={{float: 'right'}} type='primary' size="small"
                                                                onClick={()=> {
                                                                  this.setState({
                                                                    addParamsModal: true
                                                                  })
                                                                }}>添加参数</Button></div>} key="2"
            >
              <Table
                style={{backgroundColor:'#fff'}}
                loading={device_parameters.loading}
                rowKey={'id'}
                dataSource={device_parameters.data.generator?device_parameters.data.generator.concat(device_parameters.data.water_meter):[]}
                columns={params_columns}
                size="small"
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Collapse activeKey={['2']}  style={{marginTop:'15px'}}>
                <Panel showArrow={false} header={<div> 阀门管理 <Button style={{float: 'right'}} type='primary' size="small"
                                                                    onClick={()=> {
                                                                      this.setState({
                                                                        addValveModal: true
                                                                      })
                                                                    }}>添加阀门</Button></div>} key="2"
                >
                  <Table
                    style={{backgroundColor:'#fff'}}
                    loading={double_ball_valves.loading}
                    rowKey={'id'}
                    dataSource={double_ball_valves.data.double_ball_valve||[]}
                    columns={double_ball_valves_columns}
                    size="small"
                    pagination={false}
                  />
                </Panel>

              </Collapse>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Collapse activeKey={['2']}  style={{marginTop:'15px'}}>
                <Panel showArrow={false} header={<div> 电控阀门管理 <Button style={{float: 'right'}} type='primary' size="small"
                                                                      onClick={()=> {
                                                                        this.setState({
                                                                          addElectricModal: true
                                                                        })
                                                                      }}>添加电控阀门</Button></div>} key="2"
                >
                  <Table
                    style={{backgroundColor:'#fff'}}
                    loading={electric_valves.loading}
                    rowKey={'id'}
                    dataSource={electric_valves.data.electric_valve||[]}
                    columns={electric_valves_columns}
                    size="small"
                    pagination={false}
                  />
                </Panel>

              </Collapse>
            </Col>
          </Row>


          <Collapse activeKey={['2']}  style={{marginTop:'15px'}}>
            <Panel showArrow={false} header={<div> 故障信息 <Button style={{float: 'right'}} type='primary' size="small"
                                                                  onClick={()=> {
                                                                    this.setState({
                                                                      addErrorModal: true
                                                                    })
                                                                  }}>添加故障信息</Button></div>} key="2"
            >
              <Table
                style={{backgroundColor:'#fff'}}
                loading={device_errors.loading}
                rowKey={'id'}
                dataSource={device_errors.data.error||[]}
                columns={error_clolumn}
                size="small"
                pagination={false}
              />
            </Panel>

          </Collapse>
          <Modal
            title={'添加传感器'}
            visible={this.state.addModal}
            centered
            onCancel={()=> {
              this.setState({addModal: false})
            }}
            onOk={this.handleAdd}
          >
            <AddSensors
              wrappedComponentRef={(inst) => this.AddSensors = inst}/>

          </Modal>
          <Modal
            title={'编辑传感器'}
            visible={this.state.editModal}
            centered
            destroyOnClose={true}
            onCancel={()=> {
              this.setState({editModal: false})
            }}
            onOk={this.handleEdit}
          >
            <AddSensors
              editRecord={this.state.editRecord}
              wrappedComponentRef={(inst) => this.EditSensors = inst}/>

          </Modal>
          <Modal
            title={'添加设备参数'}
            visible={this.state.addParamsModal}
            centered
            onCancel={()=> {
              this.setState({addParamsModal: false})
            }}
            onOk={this.handleAddParams}
          >
            <AddParams
              wrappedComponentRef={(inst) => this.AddParams = inst}/>

          </Modal>
          <Modal
            title={'添加阀门'}
            visible={this.state.addValveModal}
            centered
            onCancel={()=> {
              this.setState({addValveModal: false})
            }}
            onOk={this.handleAddValve}
          >
            <AddValve
              wrappedComponentRef={(inst) => this.AddValve = inst}/>

          </Modal>
          <Modal
            title={'编辑阀门'}
            visible={this.state.editValveModal}
            centered
            destroyOnClose={true}
            onCancel={()=> {
              this.setState({editValveModal: false})
            }}
            onOk={this.handleEditValve}
          >
            <AddValve
              editRecord={this.state.editRecord}
              wrappedComponentRef={(inst) => this.EditValve = inst}/>

          </Modal>
          <Modal
            title={'添加电控阀门'}
            visible={this.state.addElectricModal}
            centered
            onCancel={()=> {
              this.setState({addElectricModal: false})
            }}
            onOk={this.handleAddElectricValve}
          >
            <AddDoubleValve
              type={"AddElectricValve"}

              wrappedComponentRef={(inst) => this.AddElectricValve = inst}/>

          </Modal>
          <Modal
            title={'编辑电控阀门'}
            visible={this.state.editElectricModal}
            centered
            destroyOnClose={true}
            onCancel={()=> {
              this.setState({editElectricModal: false})
            }}
            onOk={this.handleEditElectricValve}
          >
            <AddDoubleValve
              type={"AddElectricValve"}
              editRecord={this.state.editRecord}
              wrappedComponentRef={(inst) => this.EditElectricValve = inst}/>

          </Modal>
          <Modal
            title={'添加故障信息'}
            visible={this.state.addErrorModal}
            centered
            onCancel={()=> {
              this.setState({addErrorModal: false})
            }}
            onOk={this.handleAddError}
          >
            <AddError
              wrappedComponentRef={(inst) => this.AddError = inst}/>

          </Modal>
          <Modal
            title={'编辑故障信息'}
            visible={this.state.editErrorModal}
            centered
            destroyOnClose={true}
            onCancel={()=> {
              this.setState({editErrorModal: false})
            }}
            onOk={this.handleEditError}
          >
            <AddError
              editRecord={this.state.editRecord}
              wrappedComponentRef={(inst) => this.EditError = inst}/>

          </Modal>
        </div>

      </div>
    );
  }
}

export default TableList;
