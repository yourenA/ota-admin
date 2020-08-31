import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import {formatMessage, FormattedMessage} from 'umi/locale';

import {Link} from 'dva/router';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Alert,
  PageHeader,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table, Tag, Popconfirm, notification, Drawer, Descriptions,
} from 'antd';
import request from '@/utils/request';
import AddSubstrateTypes from './addOrType'
import EditSubstrateTypes from './addOrType'
const { confirm } = Modal;

/* eslint react/no-multi-comp:0 */
@connect(({gateways, loading, system_configs}) => ({
  gateways, system_configs
}))
@Form.create()
class SubstrateTypes extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    data: [],
    formValues: {},
    stepFormValues: {},
    page: 1,
    per_page: 30,
    gateway_id: '',
    name: '',
    editRecord: {},
    current: 0,
    refresh_second: 1,
    stepData: {},
    mqttInfo: {}
  };


  componentDidMount() {
    const that = this;
    that.handleSearch()

  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }


  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    request(`/all_substrate_types`,{
      method:'GET',
      params:{
        order_direction:'desc'
      }
    }).then((response)=>{
      if(response.status===200){
        that.setState({
          data:response.data.data
        })
      }
    });
  }

 handleDelete = (record)=> {
    const {dispatch} = this.props;
   const that = this;
   request(`/substrate_types/${record.id}`,{
     method:'DELETE',
   }).then((response)=>{
     if(response.status===200){
       notification.success({
         message:'删除类型成功',
       });
       that.handleSearch()
     }
   });
  }

  handleAdd = ()=> {
    const formValues = this.AddForm.props.form.getFieldsValue();
    console.log('formValues', formValues);
    if(formValues.product_code.split('.').length!==3){
      notification.error({
        message:'产品代码格式必须为 x.x.x',
      });
      return false
    }
    const that = this;
    request(`/substrate_types`,{
      method:'POST',
      data:formValues
    }).then((response)=>{
      if(response.status===200){
        notification.success({
          message:'添加类型成功',
        });
        that.setState({
          addModal:false
        })
        that.handleSearch()
      }
    });

  }
  handleEdit = ()=> {
    const formValues = this.EditForm.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    request(`/substrate_types/${this.state.editRecord.id}`,{
      method:'PUT',
      data:formValues
    }).then((response)=>{
      if(response.status===200){
        notification.success({
          message:'修改类型成功',
        });
        that.setState({
          editModal:false
        })
        that.handleSearch()
      }
    });
  }
  selectMethod=(record)=>{
    const that=this
    confirm({
      title: '确定要发送更新RTU基板命令吗?',
      onOk() {
        request(`/upgrade_substrate`, {
          method: 'POST',
          data:{
            substrate_type_id:record.id
          }
        }).then((response)=> {
          console.log(response);
          if(response.status===200){
            notification.success({
              message: formatMessage({id: 'app.successfully'}, {type:'RTU基板更新命令发送'}),
            });
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });

  }
  render() {
    const {
      data
    } = this.state;
    const {dispatch} = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '产品代码',
        dataIndex: 'product_code',
      },
      {
        title:'创建时间',
        dataIndex: 'created_at',
      },
      {
        title:'备注',
        dataIndex: 'remark',
      },
      {
        title:'操作',
        dataIndex: 'operate',
        render:(text,record)=>{
          return <div>
            <Button onClick={()=>{
              this.setState({
                editRecord:record,
                editModal:true
              })
            }} style={{marginRight:'5px'}} type="primary" icon='edit'
                    size="small"><FormattedMessage
              id="app.edit"
            /></Button>
            <Button  size="small"  style={{marginRight:'5px'}} onClick={()=>{this.selectMethod(record)} }  icon={'cloud-sync'}   type={'primary'} >更新RTU基板</Button>
            <Popconfirm title={formatMessage({id: 'app.delete.info'})}
                        onConfirm={()=>this.handleDelete(record)}>
              <Button  type="danger" icon='delete'
                       size="small"><FormattedMessage
                id="app.delete"
                defaultMessage="名称"
              /></Button>
            </Popconfirm>
          </div>
        }
      },
    ];
    return (
      <div>
        <Button icon="plus" type="primary"
                block
                style={{marginBottom:'15px'}} onClick={
          ()=>{
            this.setState({
              addModal:true
            })

          }
        }>
          新建RTU基板类型
        </Button>
        <Table
          style={{backgroundColor: '#fff'}}
          className="custom-small-table"
          rowKey={'id'}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
        <Modal
          title={'新建RTU基板类型'}
          visible={this.state.addModal}
          centered
          onCancel={()=> {
            this.setState({addModal: false})
          }}
          onOk={this.handleAdd}
        >
          <AddSubstrateTypes
            wrappedComponentRef={(inst) => this.AddForm = inst}/>

        </Modal>
        <Modal
          title={'编辑: ' + this.state.editRecord.name }
          destroyOnClose
          visible={this.state.editModal}
          centered
          onOk={this.handleEdit}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <EditSubstrateTypes editRecord={this.state.editRecord}
                         wrappedComponentRef={(inst) => this.EditForm = inst}/>

        </Modal>
      </div>
    );
  }
}

export default SubstrateTypes;
