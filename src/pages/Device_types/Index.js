import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  PageHeader,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Index.less';
import AddOrEditModel from './AddOrEditModel'
const FormItem = Form.Item;
const {Description} = DescriptionList;

/* eslint react/no-multi-comp:0 */
@connect(({device_types, loading}) => ({
  device_types,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    page: 1,
    per_page: 30,
    number: '',
    name: '',
    editRecord: {},
    current: 0,
    stepData: {},
    mqttInfo: {}
  };


  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'device_types/fetch',
      payload: {
        page: 1,
        per_page: 30,
      },

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


  setStep = (step)=> {
    this.setState({
      current: step
    })
  }
  setStepData = (data, step)=> {
    // console.log('data',data)
    this.setState({
      stepData: data
    }, function () {
      console.log('setStepData', this.state.stepData)
      this.setStep(step)
    })
  }

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_types/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
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
      number: '',
      name: '',
      per_page: 30
    })
  }

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('number')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;

                  const values = {
                    ...fieldsValue,
                  };
                  this.handleSearch({
                    page: this.state.page,
                    per_page: this.state.per_page,
                    ...values,
                  })

                });
              }}>
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    return this.renderSimpleForm()
  }

  handleDelete = id => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_types/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  };
  handleEdit = ()=> {
    const formValues = this.EditModel.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'device_types/edit',
      payload: {
        device_types_id:this.state.editRecord.id,
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
  handleAdd = ()=> {
    const formValues = this.AddModel.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'device_types/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('新建成功')
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
  render() {
    const {
      device_types: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'model',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Link to={`/models/device_model/info/sensors?id=${record.id}&&name=${record.name}`}>详细信息</Link>
            <Divider type="vertical"/>
            <Link to={`/models/device_model/info/views?id=${record.id}&name=${record.name}`}>视图管理</Link>
            <Divider type="vertical"/>
            <a onClick={()=>{
              this.setState({
                editRecord:record,
                editModal:true
              })
            }}>编辑</a>
          </Fragment>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize})
      },
    };
    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={'应用列表'}
          />
        </div>
        <div className="info-page-container" >

          <div className={styles.tableList}>
        {/*   <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={
                ()=>{this.setState({
                  addModal:true
                })}
              }>
                新建应用
              </Button>
            </div>*/}
            <Table
              style={{backgroundColor:'#fff'}}
              loading={loading}
              rowKey={'id'}
              dataSource={data}
              columns={columns}
              size="large"
              pagination={paginationProps}
            />
          </div>
          <Modal
            title={'新建应用'}
            visible={this.state.addModal}
            centered
            onCancel={()=> {
              this.setState({addModal: false})
            }}
            onOk={this.handleAdd}
          >
            <AddOrEditModel
              wrappedComponentRef={(inst) => this.AddModel = inst}/>

          </Modal>
          <Modal
            title={'编辑应用'}
            visible={this.state.editModal}
            centered
            destroyOnClose
            onCancel={()=> {
              this.setState({editModal: false,editRecord:{}})
            }}
            onOk={this.handleEdit}
          >
            <AddOrEditModel
              editRecord={this.state.editRecord}
              ref={(ins)=>this.editModel=ins}
              wrappedComponentRef={(inst) => this.EditModel = inst}/>

          </Modal>
        </div>
      </div>
    );
  }
}

export default TableList;
