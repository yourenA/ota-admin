import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
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
  Table, Tag,Popconfirm ,notification 
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './../Devices-ignore/TableList.less';
import find from 'lodash/find'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
    mqttInfo: {}
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
        gateway_id: '',
        name: '',
      }
    }

    const that = this;
    that.handleSearch(params)

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
        }, function () {
          setTimeout(function () {
            dispatch({
              type: 'gateways/loadedPage',
              payload: true,
            });
          },1000)

          dispatch(routerRedux.replace(`/products/list?page=${this.state.page}&per_page=${this.state.per_page}`)
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
      gateway_id: '',
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
        <Row gutter={{md: 8, lg: 8, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem label={<FormattedMessage
              id="menu.gateways.ID"
            />}>
              {getFieldDecorator('gateway_id')(<Input placeholder=""/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label={
              <FormattedMessage
                id="menu.gateways.name"
              />
            }>
              {getFieldDecorator('name')(<Input placeholder=""/>)}
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
                    name: values.name ? values.name : '',
                    gateway_id: values.gateway_id ? values.gateway_id : '',
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


  render() {
    const {
      gateways: {data, loading, meta, pageLoaded},
    } = this.props;
    const {dispatch} = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text, record)=> {
          return <Tag onClick={()=> {
            dispatch(routerRedux.push(`/products/info/devices?id=${record.id}`));
          }} color="blue" style={{cursor: 'pointer'}}>{text}</Tag>
        }
      },
      {
        title:'创建时间',
        dataIndex: 'created_at',
      },
      {
        title:'备注',
        dataIndex: 'remark',
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
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
          </div>
          <Table
            style={{backgroundColor: '#fff'}}
            className="custom-small-table"
            loading={loading}
            rowKey={'id'}
            dataSource={data}
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
              产品</p>}
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
      </div>
    );
  }
}

export default TableList;
