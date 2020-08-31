import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import {formatMessage, FormattedMessage} from 'umi/locale';
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
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
import DescriptionList from '@/components/DescriptionList';
import styles from './../Devices-ignore/TableList.less';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import  SubstrateTypes from './SubstrateTypes.js'
import  MulAddSubstrate from './MulAddSubstrate.js'
import AddOrEditSubstrate from './AddOrEditSubstrate';
const FormItem = Form.Item;
const Option = Select.Option;
const { confirm } = Modal;
/* eslint react/no-multi-comp:0 */
@connect(({gateways, loading, system_configs}) => ({
  gateways, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
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
    mqttInfo: {},
    selectedRowKeys:[],
    data:[]
  };


  componentDidMount() {
    let params = {}
    if (this.props.location.search) {
      const search = this.props.location.search.substring(1);
      const searchArr = search.split("&");
      for (let i = 0; i < searchArr.length; i++) {
        var tmp_arr = searchArr[i].split("=");

        if (tmp_arr[0] === 'page' || tmp_arr[0] === 'page') {
          params[tmp_arr[0]] = Number(tmp_arr[1])

        } else {
          params[tmp_arr[0]] = decodeURI(tmp_arr[1])
          this.props.form.setFieldsValue({[tmp_arr[0]]: decodeURI(tmp_arr[1])})
        }
      }
      // console.log('params', params)
      // this.handleSearch(params)
    } else {
      params = {
        page: 1,
        per_page: 30,
        substrate_type_id: '',
        serial_number: '',
      }
    }

    const that = this;
    that.handleSearch(params);

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

  componentWillUnmount() {
    console.log('componentWillUnmount')
    if (this.timer) {
      console.log(this.timer)
    }
    clearTimeout(this.timer)
    const {dispatch} = this.props;
    dispatch({
      type: 'gateways/loadedPage',
      payload: true,
    });
  }

  handleMenuClick = e => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'gateways/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
          selectedRowKeys:[]
        }, function () {
          setTimeout(function () {
            dispatch({
              type: 'gateways/loadedPage',
              payload: true,
            });
          },1000)

          dispatch(routerRedux.replace(`/substrates/list?page=${this.state.page}&per_page=${this.state.per_page}&serial_number=${this.state.serial_number}&substrate_type_id=${this.state.substrate_type_id}`)
          )
        });
        if (cb) cb()
      }
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      serial_number: '',
      substrate_type_id: '',
      per_page: 30
    })
  }

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 8, xl: 16}}>
          <Col md={6} sm={24}>
            <FormItem label={'基板型号'}>
              {getFieldDecorator('substrate_type_id')(
                <Select allowClear>
                  {this.state.data.map((item,index)=>{
                    return <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label={'序列号'}>
              {getFieldDecorator('serial_number')(<Input placeholder=""/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search" type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;

                  const values = {
                    ...fieldsValue,
                  };
                  this.handleSearch({
                    page: this.state.page,
                    per_page: this.state.per_page,
                    serial_number: values.serial_number ? values.serial_number : '',
                    substrate_type_id: values.substrate_type_id ? values.substrate_type_id : '',
                  })

                });
              }}>
                <FormattedMessage
                  id="form.search"
                  defaultMessage="查询"
                />
              </Button>
              <Button icon="redo" style={{marginLeft: 8}} onClick={this.handleFormReset}>
                <FormattedMessage
                  id="form.reset"
                  defaultMessage="重置"
                />
              </Button>
              <Button icon="plus" type="primary"
                      style={{marginRight:'8px',marginLeft:'8px'}} onClick={
                ()=>{
                  this.setState({
                    addModal:true
                  })
                }
              }>
              新建RTU基板
            </Button>
            <Button icon="plus" type="primary"
                    style={{marginRight:'8px'}} onClick={
              ()=>{
                this.setState({
                  mulAddModal:true
                })
              }
            }>
              批量新建RTU基板
            </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

 handleDelete = (record)=> {
    const {dispatch} = this.props;
    const that=this;
    dispatch({
      type: `gateways/remove`,
      payload: {
        id:record.id,
      },
      callback: ()=> {
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'menu.gateways.delete'},{name:this.state.gateway_id})}),
        });

        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          name: that.state.name, 
          gateway_id: that.state.gateway_id
        });
      }
    });
  }
  renderForm() {
    return this.renderSimpleForm()
  }

  handleEdit = ()=> {
    const formValues = this.EditForm.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'gateways/edit',
      payload: {
        id:this.state.editRecord.id,
        ...formValues,
      },
      callback: function () {
        message.success('修改成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  }
  handleMulAdd=()=>{
    const formValues = this.MulAddForm.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'gateways/mulAdd',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('批量新建RTU基板成功')
        that.setState({
          mulAddModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  }
  handleAdd = ()=> {
    const formValues = this.AddForm.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'gateways/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('新建RTU基板成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);

    this.setState({ selectedRowKeys });
  };
  selectMethod=(type)=>{
    const selectedRowKeys=this.state.selectedRowKeys;
    if(this.state.selectedRowKeys.length===0){
      notification.error({
        message:'请先选择基板',
      });
      return false
    }
    if(type===1){
      const {
        gateways: {data},
      } = this.props;
      let arr=[];
      let numberArr=[];
      for(let i=0;i<this.state.selectedRowKeys.length;i++){
        const findObj=find(data,(o)=>o.id===this.state.selectedRowKeys[i]);
        arr.push(findObj)
      }
      const  sortArr=sortBy(arr,['serial_number']);
      console.log('arr',arr)
      console.log('sortArr',sortArr)
      for(let i=0;i<sortArr.length;i++){
        numberArr.push(sortArr[i].serial_number)
      }
      console.log('numberArr',numberArr)
      let firstCode=arr[0].substrate_type?arr[0].substrate_type.product_code:'';
      for(let i=0;i<sortArr.length;i++){
        if(sortArr[i].substrate_type.product_code!==firstCode){
          notification.error({
            message: '请确保当前打印序列号的产品码相同',
          });
          return false
        }
      }
      window.open(`${window.location.origin}/print?productCode=${firstCode}&numbers=${numberArr}`,"","width=500")
      // window.location.href=`${window.location.origin}/print?productCode=${firstCode}&numbers=${numberArr}`
      // ipcRenderer.send('openSNModal',firstCode,numberArr);
    }else if(type===2){
      const that=this
      confirm({
        title: '确定要发送更新RTU基板命令吗?',
        onOk() {
          request(`/upgrade_substrate`, {
            method: 'POST',
            data:{
              substrate_ids:that.state.selectedRowKeys
            }
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              notification.success({
                message: formatMessage({id: 'app.successfully'}, {type:'RTU基板更新命令发送'}),
              });
              that.handleSearch({
                page: that.state.page,
                per_page: that.state.per_page,
              })
            }
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });

    }
  }
  render() {
    const {
      gateways: {data, loading, meta, pageLoaded},
    } = this.props;
    const {editRecord,selectedRowKeys}=this.state
    const {dispatch} = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '序号',
        width: 50,
        key: '_index',
        render: (text, record,index) => {
          const {
            gateways: { meta },
          } = this.props;
          return <p className={'index'}>{((meta.current_page - 1) * meta.per_page) + (index + 1)}</p>;
        },
      },
      {
        title: '序列号',
        dataIndex: 'serial_number',
      },
      {
        title: 'RTU基板型号',
        dataIndex: 'substrate_type',
        render: (text, record)=> {
          return  <Tag color="purple" >{record.substrate_type.name}</Tag>
        }
      },
      {
        title: 'RTU基板型号产品码',
        dataIndex: 'substrate_type2',
        render: (text, record)=> {
          return record.substrate_type.product_code
        }
      },
      {
        title: '当前固件版本',
        dataIndex: 'current_firmware_version',
      },
      {
        title: '升级状态',
        dataIndex: 'is_upgrading',
        render: (text, record)=> {
          return text === 1 ?<Badge status={ 'processing'}
                                   text={ '正在升级' }/>:""
        }
      },
      {
        title:'操作',
        dataIndex: 'operate',
        render:(text,record)=>{
          return <div>
            <Button onClick={()=>{
              this.setState({
                editRecord:record,
                detailModal:true
              })
            }} style={{marginRight:'5px'}} type="primary" icon='eye'
                    size="small">详情</Button>
            <Button onClick={()=>{
              this.setState({
                editRecord:record,
                editModal:true
              })
            }} style={{marginRight:'5px'}} type="primary" icon='edit'
                    size="small"><FormattedMessage
              id="app.edit"
            /></Button>
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
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => formatMessage({id: 'app.pagination'}, {total}),
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, name: this.state.name, gateway_id: this.state.gateway_id})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, name: this.state.name, gateway_id: this.state.gateway_id})
      },
    };
    const renderTable=
      <CardContent>
        <div className={styles.tableList} >
          <div className={styles.tableListForm} >{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="setting" type="danger"
                    style={{marginRight:'8px'}} onClick={
              ()=>{
                this.setState({
                  infoModal:true
                })

              }
            }>
              RTU基板类型管理
            </Button>
              已选 {this.state.selectedRowKeys.length} 个序列号
              <Button onClick={()=>{this.selectMethod(1)} } icon={'printer'} style={{marginLeft:'10px'}}>批量打印序列号</Button>
              <Button  onClick={()=>{this.selectMethod(2)} }  icon={'cloud-sync'}   type={'primary'} >批量更新RTU基板</Button>
          </div>
          <Table
            rowSelection={rowSelection}
            style={{backgroundColor: '#fff'}}
            className="custom-small-table"
            loading={loading}
            rowKey={'id'}
            dataSource={data}
            size="small"
            columns={columns}
            pagination={paginationProps}
          />
        </div>
      </CardContent>

    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={<p>
              RTU基板列表</p>}
          />
        </div>

        <div className="info-page-container">
          {
            pageLoaded?
              <Card >
                {renderTable}
              </Card>
              :
              !loading&&<Card className={'animated zoomIn'}>
                {renderTable}
              </Card>
          }

        </div>
        <Drawer
          title={`RTU基板类型管理`}
          placement="right"
          destroyOnClose
          onClose={() => {
            this.setState({
              infoModal: false,
            });
          }}

          width={800}
          visible={this.state.infoModal}
        >
          <SubstrateTypes />
        </Drawer>
        <Modal
          title={'新建RTU基板'}
          visible={this.state.addModal}
          centered
          onCancel={()=> {
            this.setState({addModal: false})
          }}
          onOk={this.handleAdd}
        >
          <AddOrEditSubstrate
            wrappedComponentRef={(inst) => this.AddForm = inst}/>

        </Modal>
        <Modal
          title={'批量新建RTU基板'}
          visible={this.state.mulAddModal}
          centered
          onCancel={()=> {
            this.setState({mulAddModal: false})
          }}
          onOk={this.handleMulAdd}
        >
          <MulAddSubstrate
            wrappedComponentRef={(inst) => this.MulAddForm = inst}/>

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
          <AddOrEditSubstrate editRecord={this.state.editRecord}
                              wrappedComponentRef={(inst) => this.EditForm = inst}/>

        </Modal>
        <Drawer
          title={`${this.state.editRecord && this.state.editRecord.serial_number} 详情`}
          placement="right"
          destroyOnClose
          onClose={() => {
            this.setState({
              detailModal: false,
              editRecord: {},
            });
          }}

          width={550}
          visible={this.state.detailModal}
        >
          <Descriptions column={2} title={<div>
            <span></span>
          </div>} bordered>
            <Descriptions.Item label="序列号"  span={2}>{editRecord.serial_number}</Descriptions.Item>
            <Descriptions.Item label="批次" span={2}>{editRecord.batch}</Descriptions.Item>
            <Descriptions.Item label="RTU基板型号" span={2}>{editRecord.substrate_type?editRecord.substrate_type.name:''}</Descriptions.Item>
            <Descriptions.Item label="RTU基板产品代码" span={2}>{editRecord.substrate_type?editRecord.substrate_type.product_code:''}</Descriptions.Item>
            <Descriptions.Item label="是否正在升级" span={2}>{editRecord.is_upgrading=== 1 ?<Badge status={ 'processing'}
                                                                                                   text={ '正在升级' }/>:""}</Descriptions.Item>
            <Descriptions.Item label="当前固件版本" span={2}>{editRecord.current_firmware_version}</Descriptions.Item>
            <Descriptions.Item label="当前固件GUID" span={2}>{editRecord.current_firmware_guid}</Descriptions.Item>
            <Descriptions.Item label="更新状态" span={2}>{editRecord.upgrade_state}</Descriptions.Item>
            <Descriptions.Item label="更新错误代码" span={2}>{editRecord.trouble_code}</Descriptions.Item>
            <Descriptions.Item label="更新的固件版本" span={2}>{editRecord.upgrade_firmware_version}</Descriptions.Item>
            <Descriptions.Item label="更新的固件GUID" span={2}>{editRecord.upgrade_firmware_guid}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>{editRecord.created_at}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{editRecord.remark}</Descriptions.Item>

          </Descriptions>
        </Drawer>
      </div>
    );
  }
}

export default TableList;
