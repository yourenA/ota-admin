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
  Button,
  PageHeader,
  message,
  Table, Tag, Collapse,
  Descriptions, Avatar, Pagination, Empty, Spin, DatePicker, Tabs, Typography, Drawer,
} from 'antd';
import styles from './Index.less';
import Card from '@material-ui/core/Card';
import request from '@/utils/request';

const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({whole_data, loading, system_configs}) => ({
  whole_data, system_configs
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
    events: [],
    collapse_key: [],
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    expend: 'expend',
    expandedRowKeys: [],
    sort_field: 'timestamp',
    sort_type: 'desc',
    data:[]
  };


  componentDidMount() {
    let params = {}
    params = {
      page: 1,
      per_page: 30,
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      // start_date: '2019-09-30',
      dev_eui: '',
      sort_field: this.state.sort_field,
      sort_type: this.state.sort_type

    }
    const that = this;
    that.handleSearch(params, true)

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
    }
    clearTimeout(this.timer)
    const {dispatch} = this.props;
    dispatch({
      type: 'whole_data/loadedPage',
      payload: true,
    });
  }


  handleSearch = (values, controlExpend) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'whole_data/fetch',
      payload: {
        ...values,
        size:values.per_page,
        page:Number(values.page)-1,
        sort:"time,desc"

      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
          size:values.per_page,
          page:Number(values.page)-1
        });
        if (controlExpend) {
          if (that.state.expend === 'expend') {
            const {
              whole_data: {data},
            } = that.props;
            let key = data.reduce((pre, item)=> {
              pre.push(item.device_id + item.timestamp)
              return pre
            }, [])
            that.setState({
              collapse_key: key
            })
          } else if (that.state.expend === 'fold') {
            that.setState({
              collapse_key: []
            })
          }
        }
        if (that.timer) {
          clearTimeout(that.timer)
        }
        // if (moment().format('YYYY-MM-DD') === that.state.end_date) {
        //   that.timer = setTimeout(function () {
        //     that.handleSearch({
        //       page: that.state.page,
        //       per_page: that.state.per_page,
        //       start_date: that.state.start_date,
        //       end_date: that.state.end_date,
        //       dev_eui: that.state.dev_eui,
        //       sort_field: that.state.sort_field,
        //       sort_type: that.state.sort_type
        //     }, true);
        //   }, 200000)
        // }


      }
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      per_page: 30,
      substrate_serial_number: '',
      substrate_type_id: '',
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
          <Col md={5} sm={24}>
            <FormItem label={'序列号'}>
              {getFieldDecorator('substrate_serial_number')(<Input placeholder=""/>)}
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
          <Col md={5} sm={24}>
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
                  const values = {
                    ...fieldsValue,
                  };
                  this.handleSearch({
                    start_date: fieldsValue.start_date.format('YYYY-MM-DD'),
                    end_date: fieldsValue.end_date.format('YYYY-MM-DD'),
                    page: 1,
                    per_page: this.state.per_page,
                    substrate_serial_number: values.substrate_serial_number ? values.substrate_serial_number : '',
                    substrate_type_id: values.substrate_type_id ? values.substrate_type_id : '',
                  }, true)

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
    // return this.renderSimpleForm()
    return ''
  }

  onExpand = (expanded, record)=> {
    const expandedKey = this.state.expandedRowKeys;
    if (expandedKey.indexOf(record.device_id + record.timestamp) == -1) {
      expandedKey.push(record.device_id + record.timestamp);
    } else {
      for (let i = 0; i < expandedKey.length; i++) {
        if (expandedKey[i] === record.device_id + record.timestamp) {
          expandedKey.splice(i, 1);
        }
      }
    }
    this.setState({
      expandedRowKeys: expandedKey        //设置展开行的key值
    });
  }
  renderStatus=(text)=>{
    switch (text) {
      case 1:
        return <Tag color="green">下发成功</Tag>;
        break;
      case 2:
        return <Tag color="geekblue">下发等待</Tag>;
        break;
      case 3:
        return <Tag color="#87d068">更新成功</Tag>;
        break;
      case 4:
        return <Tag color="orange">更新失败</Tag>;
        break;
      case 5:
        return <Tag color="red">没有找到最新固件</Tag>;
        break;
      case 6:
        return <Tag color="cyan">当前已是最新版本</Tag>;
        break;
      default:
        return  ''
    }
  }
  render() {
    const {
      whole_data: {data, loading, meta, pageLoaded},
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => formatMessage({id: 'app.pagination'}, {total}),
      pageSize: meta.size,
      total: meta.totalElements,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, start_date: this.state.start_date, end_date: this.state.end_date, dev_eui: this.state.dev_eui,sort_field: this.state.sort_field,
          sort_type: this.state.sort_type})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, start_date: this.state.start_date, end_date: this.state.end_date, dev_eui: this.state.dev_eui,sort_field: this.state.sort_field,
          sort_type: this.state.sort_type})
      },
    };
    const customPanelStyle = {
      background: '#ececec',
      borderRadius: 5,
      marginBottom: 18,
      border: 0,
      overflow: 'hidden',
    };
    const columns = [
      {
        title: '序号',
        width: 50,
        key: '_index',
        render: (text, record,index) => {
          const {
            whole_data: {meta},
          } = this.props;
          return <p className={'index'}>{((meta.number ) * meta.size) + (index + 1)}</p>;
        },
      },
      {
        title: 'rtuId',
        dataIndex: 'rtuId',
        key: 'rtuId',
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '错误代码',
        dataIndex: 'lastTroubleCode',
        key: 'lastTroubleCode',
      },
      {
        title: '文件长度',
        dataIndex: 'lastFileReceiveLen',
        key: 'lastFileReceiveLen',
      },
      {
        title: '当前固件',
        dataIndex: 'currentFirmwareVersion',
        key: 'currentFirmwareVersion',
        render:(text,record)=>{
          return <div>
            <p>版 本 : {text}</p>
            <p>GUID : { record.currentFirmwareGuid}</p>
          </div>
        }
      },
      {
        title: '最新固件',
        dataIndex: 'lastFirmwareVersion',
        key: 'lastFirmwareVersion',
        render:(text,record)=>{
          return <div>
            <p>版 本 : {text}</p>
            <p>GUID : { record.lastFirmwareGuid}</p>
          </div>
        }
      },

    ];
    const renderTable2 = <div>
      <div >
        <Table
          style={{backgroundColor: '#fff'}}
          className="custom-small-table whole-data"
          loading={loading}
          bordered={true}
          size="small"
          //rowKey={(record)=>record.device_id + record.timestamp+Math.floor(Math.random()*10) }
          rowKey={(record)=>record.id }
          dataSource={data}
          columns={columns}
          pagination={false}
          //expandedRowKeys={this.state.expandedRowKeys}
        />
      </div>

    </div>

    const {editRecord}=this.state
    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={'升级日志'}
          />
        </div>
        <div className="info-page-container  data-desc ">

          <Card >
            <div className={styles.tableList} style={{padding: '12px'}}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              {renderTable2}
              {
                data.length > 0 &&
                <Pagination size="small" {...paginationProps} style={{float: 'right', margin: '16px 0 24px'}}/>
              }
            </div>
          </Card>
        </div>

        <Drawer
          title={`${this.state.editRecord.substrate && this.state.editRecord.substrate.serial_number} 详情`}
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
            <Descriptions.Item label="序列号"  span={2}>{editRecord.substrate?editRecord.substrate.serial_number:''}</Descriptions.Item>
            <Descriptions.Item label="RTU基板型号" span={2}>{editRecord.substrate?editRecord.substrate.substrate_type.name:''}</Descriptions.Item>
            <Descriptions.Item label="RTU基板产品代码" span={2}>{editRecord.substrate?editRecord.substrate.substrate_type.product_code:''}</Descriptions.Item>
            <Descriptions.Item label="状态" span={2}>{ this.renderStatus(editRecord.status)}</Descriptions.Item>
            <Descriptions.Item label="当前固件版本" span={2}>{editRecord.current_firmware_version}</Descriptions.Item>
            <Descriptions.Item label="当前固件GUID" span={2}>{editRecord.current_firmware_guid}</Descriptions.Item>
            <Descriptions.Item label="新固件版本" span={2}>{editRecord.new_firmware_version}</Descriptions.Item>
            <Descriptions.Item label="新固件GUID" span={2}>{editRecord.new_firmware_guid}</Descriptions.Item>
            <Descriptions.Item label="创建时间" span={2}>{editRecord.created_at}</Descriptions.Item>

          </Descriptions>
        </Drawer>

      </div>
    );
  }
}

export default TableList;
