import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeader,Badge,Table,Divider,Card,Button,Modal ,message   } from 'antd';
import AddOrEditSensors from './EditFirmware'
@connect(({sensors, loading}) => ({
  sensors,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.name=this.props.history.location.query.name
    console.log(this.props)
    this.state = {
      editRecord:{}
    };
  }

  componentDidMount() {
    this.handleSearch()
  }
  handleSearch = ( cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'sensors/fetch',
      payload: {
        device_id:that.props.history.location.query.id
      },
      callback: function () {
        if (cb) cb()
      }

    });
  }
  handleAdd = ()=> {
    const formValues = this.addSensors.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const {dispatch} = this.props;
    const that = this;
    dispatch({
      type: 'sensors/add',
      payload: {
        device_id:that.props.history.location.query.id,
        ...formValues,
      },
      callback: function () {
        message.success('新建传感器成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleEdit = ()=> {
    const formValues = this.editSensors.props.form.getFieldsValue();
    console.log('formValues2', formValues)
    const that = this;
    this.props.dispatch({
      type: 'sensors/edit',
      payload: {
        id: that.state.editRecord.id,
        device_id:that.props.history.location.query.id,
        ...formValues,


      },
      callback: function () {
        message.success('修改传感器成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch()
      }
    });
  }
  handleDelete = id => {
    const that=this
    const {dispatch} = this.props;
    dispatch({
      type: 'sensors/remove',
      payload: {
        device_id:this.props.history.location.query.id,
        id
      },
      callback: ()=> {
        message.success('删除传感器成功')
        that.handleSearch()
      }
    });
  };
  render() {
    const {
      sensors: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '传感器编号',
        dataIndex: 'number',
      },
      {
        title: '传感器名称',
        dataIndex: 'name',
      },
      {
        title: '数据单位',
        dataIndex: 'data_unit',
      },
      {
        title: '数据类型',
        dataIndex: 'data_type',
        render: (text, record) => {
          let data_type=''
          switch (text.toString()){
            case '1':
              data_type='整型';
              break;
            case '2':
              data_type='浮点型';
              break;
            case '3':
              data_type='字符型';
              break;
            default:
              break
          }
          return data_type
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      // {
      //   title: '是否可控',
      //   dataIndex: 'is_controllable',
      //   render:(text)=>(
      //     <Badge status={text===1?'success':'error'} text={text===1?'是':'否'}/>
      //   )
      // },
    ];
    return (
      <div>
        <Card style={{marginTop:'24px'}}>
          <Table
            size='small'
            loading={loading}
            rowKey={'id'}
            dataSource={data}
            columns={columns}
            pagination={false}
          />
          <Button type='primary' block>添加通道</Button>
        </Card>
        <Modal
          title={'新建传感器' }
          visible={this.state.addModal}
          centered
          onOk={this.handleAdd}
          onCancel={()=> {
            this.setState({addModal: false})
          }}
        >
          <AddOrEditSensors
                            wrappedComponentRef={(inst) => this.addSensors = inst}/>

        </Modal>
        <Modal
          title={'编辑'+this.state.editRecord.number }
          destroyOnClose
          visible={this.state.editModal}
          centered
          onOk={this.handleEdit}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <AddOrEditSensors editRecord={this.state.editRecord}
                      wrappedComponentRef={(inst) => this.editSensors = inst}/>

        </Modal>
        </div>
    );
  }
}

export default SearchList;
