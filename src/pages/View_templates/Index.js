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
  DatePicker,
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
@connect(({view_templates, loading}) => ({
  view_templates,
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
      type: 'view_templates/fetch',
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


  handleModalVisible = flag => {
    this.setState({
      addModal: !!flag,
    });
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
      type: 'view_templates/fetch',
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

  getMqttInfo = (id)=> {
    const that = this;
    request(`/view_templates/${id}/mqtt_account`, {
      method: 'GET',
    }).then((response)=> {
      that.setState({
        mqttInfo: response.data.data,
        mqttModal: true
      })
    });
  }
  handleDelete = id => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'view_templates/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除视图模板成功')
        that.handleSearch({
          page: that.state.page,
          per_page: that.state.per_page,
        });
      }
    });
  };
  render() {
    const {
      view_templates: {data, loading, meta},
    } = this.props;
    const { dispatch } = this.props;
    const columns = [
      {
        title: '模板名称',
        dataIndex: 'name',
      },
      {
        title: '可选数据单位',
        dataIndex: 'optional_data_units',
        render: (text, record) => {
          return text.join(' | ')
        }
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <Link to={`/views/view_templates/add_or_edit?id=${record.id}`}>编辑</Link>
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={()=>{
              Modal.confirm({
                title: '删除设备',
                content: `确定删除 ${record.name} 吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: () => this.handleDelete(record.id),
              })
            }}>删除</a>
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
        <Card bordered={false}>

          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() =>  dispatch(routerRedux.push(`/views/view_templates/add_or_edit?id=add`))}>
                新建视图模板
              </Button>
            </div>
            <Table
              className={styles.whiteBg}
              loading={loading}
              rowKey={'id'}
              dataSource={data}
              columns={columns}
              size="large"
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
                        <Description term="是否允许发布"> {item.allow_publish === '1' ? '是' : '否'}</Description>
                        <Description term="是否允许订阅"> {item.allow_subscribe === '1' ? '是' : '否'}</Description>
                      </DescriptionList>
                    </div>

                    )
                })
              }
            </div>

          </Modal>
        </Card>
      </div>
    );
  }
}

export default TableList;
