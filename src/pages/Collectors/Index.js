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
  Alert,
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
import AddOrEditDevice from './AddOrEditDevice2'
import find from 'lodash/find'
const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const {Description} = DescriptionList;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

/* eslint react/no-multi-comp:0 */
@connect(({collectors, loading,system_configs}) => ({
  collectors,system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
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
    number: '',
    name: '',
    editRecord: {},
    current: 0,
    refresh_second:1,
    stepData: {},
    mqttInfo: {}
  };


  componentDidMount() {
    let params = {}
    if (this.props.location.search) {
      const search = this.props.location.search.substring(1);
      const searchArr = search.split("&");
      for (let i = 0; i < searchArr.length; i++) {
        var tmp_arr = searchArr[i].split("=");

        if (tmp_arr[0] === 'page'||tmp_arr[0] === 'page') {
          params[tmp_arr[0]]=Number(tmp_arr[1])

        }else{
          params[tmp_arr[0]]=decodeURI(tmp_arr[1])
          this.props.form.setFieldsValue({[tmp_arr[0]]:decodeURI(tmp_arr[1])})
        }
      }
      // console.log('params', params)
      // this.handleSearch(params)
    }else{
      params={
        page: 1,
        per_page: 30,
        number: '',
        name: '',
      }
    }
    const that=this;
    const {dispatch} = this.props;
    dispatch({
      type: 'system_configs/fetch',
      payload: {

      },
      callback:()=>{
        const {system_configs}=that.props
        const refresh_second=find(system_configs.data,function (o) {
          return o.key==='collector_info_refresh_time'
        })
        console.log('refresh_second',refresh_second)

        if(refresh_second){
          that.setState({
            refresh_second:Number(refresh_second.value),
          },function () {
            that.handleSearch(params)
          })
        }
      }
    });

  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
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
      type: 'collectors/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        },function () {
          dispatch(routerRedux.replace(`/collectors/collectors_list/list?name=${encodeURI(this.state.name)}&number=${encodeURI(this.state.number)}&page=${this.state.page}&per_page=${this.state.per_page}`)
          )
        });
        if (cb) cb()
        if(that.timer){
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.handleSearch({
            page: that.state.page,
            per_page: that.state.per_page,
            number: that.state.number,
            name: that.state.name,
          });
        },that.state.refresh_second*1000)
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
            <FormItem label="编号">
              {getFieldDecorator('number')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
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
                    name: values.name?values.name:'',
                    number: values.number?values.number:'',
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
      type: 'collectors/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除采集器成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          number: that.state.number,
          name: that.state.name,
        });
      }
    });
  };
  resetItem = id=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'collectors/resetPassword',
      payload: {id},
      callback: ()=> {
        message.success('重置设备密码成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
          number: this.state.number,
          name: this.state.name,
        })
      }
    });
  }
  handleEdit = ()=> {
    const formValues = this.EditDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'collectors/edit',
      payload: {
        ...formValues,
        id: this.state.editRecord.id,
      },
      callback: function () {
        message.success('修改采集器成功')
        that.setState({
          editModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          number: that.state.number,
          name: that.state.name,
        });
      }
    });
  }
  handleAdd = ()=> {
    const formValues = this.AddDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'collectors/add',
      payload: {
        ...formValues,
      },
      callback: function () {
        message.success('新建采集器成功')
        that.setState({
          addModal: false,
        });
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
          number: that.state.number,
          name: that.state.name,
        });
      }
    });
  }
  getMqttInfo = (id)=> {
    const that = this;
    request(`/collectors/${id}/mqtt_account`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        mqttInfo: response.data.data,
        mqttModal: true
      })
    });
  }

  render() {
    const {
      collectors: {data, loading, meta},
    } = this.props;
    const { dispatch } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">关闭</Menu.Item>
      </Menu>
    );
    const that = this;
    const itemMenu = (record)=> (
      <Menu onClick={(e)=> {
        if (e.key === 'delete') {
          Modal.confirm({
            title: '删除设备',
            content: `确定删除 ${record.name} 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.handleDelete(record.id),
          })
        }
        if (e.key === 'edit') {
         // dispatch(routerRedux.push(`/device/devices/add_or_edit?id=${record.id}`))
          this.setState({
            editRecord:record,
            editModal:true
          })
        }
        if (e.key === 'mqtt') {
          this.getMqttInfo(record.id)
        }
        if (e.key === 'view') {
          dispatch(routerRedux.push(`/device/devices/info/views?id=${record.id}&&name=${record.name}`));
        }
        if (e.key === 'history') {
          dispatch(routerRedux.push(`/device/devices/info/history?id=${record.id}&&name=${record.name}`));

        }
        if (e.key === 'mqtt_logs') {
          dispatch(routerRedux.push(`/collectors/collectors_list/info/mqtt_logs?id=${record.id}&&name=${record.name}`));
        }
        if (e.key === 'login_logs') {
          dispatch(routerRedux.push(`/collectors/collectors_list/info/login_logs?id=${record.id}&&name=${record.name}`));
        }
      }}>
        <Menu.Item key="mqtt_logs">
          通讯日志
        </Menu.Item>
        <Menu.Item key="login_logs">
          登录日志
        </Menu.Item>
        <Menu.Item key="edit">
          编辑
        </Menu.Item>
        <Menu.Item key="delete">
          删除
        </Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
        render(val, record, index){
          return <p className="primary_text" onClick={()=> {
            that.setState({
              editRecord: record,
            }, function () {
              setTimeout(function () {
                that.setState({
                  showModal: true,
                })
              }, 200)

            })
          }}>{val}</p>
        }
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '状态',
        dataIndex: 'is_online',
        render(val) {
          return <Badge status={val === 1 ? 'success' : 'error'} text={val === 1 ? '在线' : '离线'}/>;
        },
      },
      {
        title: '登录时间',
        dataIndex: 'logined_at',
      },
      {
        title: '类型',
        dataIndex: 'collector_type_name',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <Link to={`/collectors/collectors_list/info/parameters?id=${record.id}&&name=${record.name}`}>采集器参数</Link>
            <Divider type="vertical"/>
            <Link to={`/collectors/collectors_list/info/config?id=${record.id}&&name=${record.name}`}>采集器配置</Link>
            <Divider type="vertical"/>
            <Link to={`/collectors/collectors_list/info/information?id=${record.id}&&name=${record.name}`}>采集器信息</Link>
            <Divider type="vertical"/>

            <Dropdown overlay={itemMenu(record)}>
              <a >更多<Icon type="down"/></a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal:total => `共 ${total} 项`,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,name:this.state.name,number:this.state.number})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize,name:this.state.name,number:this.state.number})
      },
    };
    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={'采集器列表'}
          />
        </div>
        <div className="info-page-container" >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={
                ()=>{this.setState({
                  addModal:true
                })}
              }>
                新建采集器
              </Button>
            </div>
            <Alert  message={`数据每隔${this.state.refresh_second}秒刷新一次`} type="info"  />
            <Table
              style={{backgroundColor:'#fff'}}
              className="custom-small-table"
              loading={loading}
              rowKey={'id'}
              dataSource={data}
              columns={columns}
              pagination={paginationProps}
            />
          </div>
          <Modal
            title={this.state.editRecord.number + '详情'}
            destroyOnClose
            visible={this.state.showModal}
            footer={null}
            centered
            width={700}
            onCancel={()=> {
              this.setState({showModal: false, editRecord: {}})
            }}
          >
            <div style={{overflow: 'hidden'}}>
              <DescriptionList className={styles.headerList} size="small" col="2">
                <Description term="id"> {this.state.editRecord.id}</Description>
                <Description term="编号"> {this.state.editRecord.number}</Description>
                <Description term="名称"> {this.state.editRecord.name}</Description>
                <Description term="状态">
                  <Badge status={this.state.editRecord.is_online === 1 ? 'success' : 'error'}
                         text={this.state.editRecord.is_online === 1 ? '在线' : '离线'}/>
                </Description>
                <Description term="协议">{this.state.editRecord.protocol}</Description>
                <Description term="登录时间">{this.state.editRecord.logined_at}</Description>
                <Description term="创建时间">{this.state.editRecord.created_at}</Description>
                <Description term="备注">{this.state.editRecord.remark}</Description>
              </DescriptionList>
            </div>

          </Modal>
          <Modal
            title={'MQTT详情'}
            destroyOnClose
            visible={this.state.mqttModal}
            footer={null}
            centered
            width={700}
            onCancel={()=> {
              this.setState({mqttModal: false})
            }}
          >
            <div >
              <DescriptionList className={styles.headerList} size="small" col="2">
                <Description term="用户名"> {this.state.mqttInfo.username}</Description>
                <Description term="密码"> {this.state.mqttInfo.password}</Description>

              </DescriptionList>
              {
                this.state.mqttInfo.topics && this.state.mqttInfo.topics.map((item, index)=> {

                  return(
                    <div style={{marginTop:'10px'}} key={index}>
                      <DescriptionList className={styles.headerList} size="small" col="3" >
                        <Description term="主题名称"> {item.name}</Description>
                        <Description term="是否允许发布"> {item.allow_publish === 1 ? '是' : '否'}</Description>
                        <Description term="是否允许订阅"> {item.allow_subscribe === 1 ? '是' : '否'}</Description>
                      </DescriptionList>
                    </div>

                    )
                })
              }
            </div>

          </Modal>
          <Modal
            title={'新建采集器'}
            visible={this.state.addModal}
            centered
            onCancel={()=> {
              this.setState({addModal: false})
            }}
            onOk={this.handleAdd}
          >
            <AddOrEditDevice
              wrappedComponentRef={(inst) => this.AddDevice = inst}/>

          </Modal>
          <Modal
            title={'编辑' + this.state.editRecord.number }
            destroyOnClose
            visible={this.state.editModal}
            centered
            onOk={this.handleEdit}
            onCancel={()=> {
              this.setState({editModal: false, editRecord: {}})
            }}
          >
            <AddOrEditDevice editRecord={this.state.editRecord}
                             wrappedComponentRef={(inst) => this.EditDevice = inst}/>

          </Modal>
        </div>
      </div>
    );
  }
}

export default TableList;
