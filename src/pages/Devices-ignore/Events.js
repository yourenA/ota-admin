import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {formatMessage, FormattedMessage} from 'umi/locale';
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
  Table, Tag,notification,DatePicker
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './TableList.less';
import AddOrEditDevice from './AddOrEditDevice2'
import find from 'lodash/find'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactJson from 'react-json-view'
const FormItem = Form.Item;
const {Description} = DescriptionList;
const {Option} = Select;

/* eslint react/no-multi-comp:0 */
@connect(({events, loading, system_configs}) => ({
  events, system_configs
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
    dev_eui: '',
    name: '',
    editRecord: {},
    current: 0,
    refresh_second: 1,
    stepData: {},
    mqttInfo: {},
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    events: []
  };


  componentDidMount() {
    let params = {}
    params = {

      page: 1,
      per_page: 30,
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      events: []

    }
    const that = this;
    that.handleSearch(params)
    window.ws.onmessage = function(ev) {
      var payload = JSON.parse(ev.data);
      if(payload.status_code===200){
        if(payload.data.event==='new_device_event'&&payload.data.device_id===that.props.history.location.query.id &&  moment().format('YYYY-MM-DD')===that.state.date){
            console.log('刷新请求device event')
            that.handleSearch({
              page: that.state.page,
              per_page: that.state.per_page,
              events:that.state.events,
              start_date: that.state.start_date,
              end_date: that.state.end_date,
            })
        }
      }

    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
    if (this.timer) {
      console.log(this.timer)
    }
    clearTimeout(this.timer)
    const {dispatch} = this.props;
    dispatch({
      type: 'events/loadedPage',
      payload: true,
    });
  }

  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'events/fetch',
      payload: {
        id: this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        }, function () {
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
      per_page: 30,
      events: [],
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    })
  }
  disabledEndDate = endValue => {
    const { start_date } = this.state;
    if (!endValue || !start_date) {
      return false;
    }
    return (endValue.valueOf() <= moment(start_date).valueOf())||(moment(endValue).format('MM')!==moment(start_date).format('MM')) ||(endValue.valueOf() > moment().valueOf());
  };
  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 8}}>
          <Col md={4} sm={24}>
            <FormItem label={<FormattedMessage
              id="app.event"
            />}>
              {getFieldDecorator('events')(
                <Select >
                  <Option value=""><FormattedMessage
                    id="app.all"
                  /></Option>
                  <Option value="rx">rx</Option>
                  <Option value="join">join</Option>
                  <Option value="ack">ack</Option>
                  <Option value="error">error</Option>
                  <Option value="tx">tx</Option>
                  <Option value="status">status</Option>
                  <Option value="location">location</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label={
              <FormattedMessage
                id="form.date.placeholder.start"
              />
            }>
              {getFieldDecorator('start_date', {initialValue: moment()})(<DatePicker allowClear={false}
                                                                                     onChange={(value)=>{
                                                                                       this.setState({
                                                                                         start_date:moment(value).format('YYYY-MM-DD')
                                                                                       })
                                                                                     }}
                                                                                     format="YYYY-MM-DD"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label={
              <FormattedMessage
                id="form.date.placeholder.end"
              />
            }>
              {getFieldDecorator('end_date', {initialValue: moment()})(<DatePicker
                disabledDate={this.disabledEndDate}
                allowClear={false}
                format="YYYY-MM-DD"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search" type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;
                  if(moment(fieldsValue.end_date).format('MM')!==moment(fieldsValue.start_date).format('MM')){
                    console.log('月份不相同')
                    message.error('月份不相同,查询失败,请选择相同年月')
                    return;
                  }
                  let events=[];
                  if(fieldsValue.events){
                    events=[fieldsValue.events]
                  }
                  const values = {
                    events
                  };
                  console.log('values', values)
                  this.handleSearch({
                    ...values,
                    start_date: fieldsValue.start_date.format('YYYY-MM-DD'),
                    end_date: fieldsValue.end_date.format('YYYY-MM-DD'),
                    page: 1,
                    per_page: this.state.per_page,
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


  renderForm() {
    return this.renderSimpleForm()
  }
  handleCopy=()=>{
    notification.success({
         message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'app.copy'})}),
    });
  }
  render() {
    const {
      events: {data, loading, meta, pageLoaded},
    } = this.props;
    const {dispatch} = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">关闭</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: <FormattedMessage
          id="app.created_at"
        />,
        width:'40%',
        dataIndex: 'created_at',
        key:'created_at'
      },
      {
        title: <FormattedMessage
          id="app.event"
        />,
        dataIndex: 'event',
        key:'event',
        render: (text, record)=> {
          return <Tag color="blue">
            {text}
          </Tag>
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
        this.handleSearch({page, per_page: pageSize, name: this.state.name, start_date: this.state.start_date, end_date: this.state.end_date,events:this.state.events})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, name: this.state.name,  start_date: this.state.start_date, end_date: this.state.end_date,events:this.state.events})
      },
    };
    const renderTable = <CardContent>
      <div className={styles.tableList} style={{padding: '12px'}}>
        <div className={styles.tableListForm}>{this.renderForm()}</div>

        <Table
          style={{backgroundColor: '#fff'}}
          loading={loading}
          rowKey={(record)=> {
            return record.id
          }}
          dataSource={data}
          columns={columns}
          bordered={true}
          size="small"
          expandedRowRender={record => <div>
            <ReactJson displayDataTypes={false} src={JSON.parse(record.content)} theme="monokai" collapsed={1}  enableClipboard={this.handleCopy} name={false}/>
          </div>}
          pagination={paginationProps}
        />
      </div>
    </CardContent>
    return (
      <div>
        <div className="info-page-container">

          <Card >
            {renderTable}
          </Card>
        </div>
      </div>
    );
  }
}

export default TableList;
