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
  Table, Tag, Collapse,
  Descriptions, Avatar, Pagination, Empty, Spin, DatePicker, Tabs, Typography
} from 'antd';
import styles from './Index.less';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {explainValStatus, transilateBinary, string2Obj, arr2obj} from '@/utils/utils';
const {Text} = Typography;
const FormItem = Form.Item;
const {TabPane} = Tabs;
const {Panel} = Collapse;
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

  handleTableSort =  (pagination, filters, sorter) => {
    let order = '';
    let columnkey = sorter.columnKey;
    if (sorter.order === 'descend') {
      order = 'desc'
    } else if (sorter.order === 'ascend') {
      order = 'asc'
    }
    console.log('order',order)
    const that = this;

      that.handleSearch({
        page: that.state.page,
        per_page: that.state.per_page,
        dev_eui: that.state.dev_eui,
        start_date: that.state.start_date,
        end_date: that.state.end_date,
        sort_field: columnkey,
        sort_type: order
      },true)


  }

  handleSearch = (values, controlExpend) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'whole_data/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
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
        if (moment().format('YYYY-MM-DD') === that.state.end_date) {
          that.timer = setTimeout(function () {
            that.handleSearch({
              page: that.state.page,
              per_page: that.state.per_page,
              start_date: that.state.start_date,
              end_date: that.state.end_date,
              dev_eui: that.state.dev_eui,
              sort_field: that.state.sort_field,
              sort_type: that.state.sort_type
            }, true);
          }, 20000)
        }


      }
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      per_page: 30,
      dev_eui: '',
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      sort_field: this.state.sort_field,
      sort_type: this.state.sort_type
    })
  }


  collapseCallback = (key)=> {
    this.setState({
      collapse_key: key
    }, function () {
      const {
        whole_data: {meta},
      } = this.props;
      if (key.length === meta.per_page) {
        this.setState({
          expend: 'expend'
        })
      } else if (key.length === 0) {
        this.setState({
          expend: 'fold'
        })
      } else {
        this.setState({
          expend: ''
        })
      }
    });

  }
  changeExpend = (e)=> {
    const value = e.target.value
    this.setState({
      expend: value
    })
    if (value === 'expend') {
      const {
        whole_data: {data},
      } = this.props;
      let key = data.reduce((pre, item)=> {
        pre.push(item.device_id + item.timestamp)
        return pre
      }, [])
      this.setState({
        collapse_key: key
      })
    } else {
      this.setState({
        collapse_key: []
      })
    }

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
          <Col md={6} sm={24}>
            <FormItem label={<FormattedMessage
              id="menu.applications.eui"
              defaultMessage="EUI"
            />}>
              {getFieldDecorator('dev_eui')(<Input placeholder=""/>)}
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
                    dev_eui: values.dev_eui ? values.dev_eui : '',
                    sort_field: this.state.sort_field,
                    sort_type: this.state.sort_type
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
    return this.renderSimpleForm()
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
  onExpandedRowsChange = (expandedRows)=> {
    console.log('expandedRows', expandedRows)
  }

  render() {
    const {
      whole_data: {data, loading, meta, pageLoaded},
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => formatMessage({id: 'app.pagination'}, {total}),
      pageSize: meta.per_page,
      total: meta.total,
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
        title: <FormattedMessage
          id="menu.applications.eui"
          defaultMessage="EUI"
        />,
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        dataIndex: 'dev_eui',
        key: 'dev_eui',
        render: (text, record)=> {
          return <Tag color="blue">{text}</Tag>
        }
      },
      {
        title: <FormattedMessage
          id="app.time"
        />,
        sorter: true,
        sortDirections: ['ascend', 'descend'],
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text, record)=> {
          return <span style={{fontWeight: '700'}}>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        }
      },
      {
        title: <FormattedMessage
          id="menu.applications.name"
          defaultMessage="名称"
        />,
        dataIndex: 'device_name',
      },

      {
        title: '正向累积体积',
        dataIndex: 'vol_acc',
        render: (text, record)=> {
          const renderItem = (record.data.vol_acc&&record.data.vol_acc.length>0) ? record.data.vol_acc[0].value : ''
          return renderItem + 'm³'
        }
      },
      {
        title: '电池电压',
        dataIndex: 'battery',
        render: (text, record)=> {
          const renderItem = (record.data.battery&&record.data.battery.length>0) ? record.data.battery[0].value : ''
          return renderItem + 'V'
        }
      },
      {
        title: <FormattedMessage
          id="app.operate"
          defaultMessage="操作"
        />,
        dataIndex: 'operate',
        render: (text, record)=> {
          return <span style={{cursor: 'pointer', color: '#E91E63'}}>查看详情</span>
        }
      },
    ];
    // for(let key in record.data){
    const renderTable = <CardContent>
      <div >
        {
          data.length === 0 &&
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        <div className={styles.collapseBox}>
          <Collapse bordered={false} activeKey={this.state.collapse_key} destroyInactivePanel={true}
                    onChange={this.collapseCallback}>
            {
              data.map((item, index)=> {
                let renderItem = []
                for (let key in item.data) {
                  if (key === 'gyrometer' || key === 'accelerometer') {
                    if (item.data[key].length > 0) {
                      renderItem.push(
                        <Descriptions.Item key={key} label={key.slice(0, 1).toUpperCase() + key.slice(1)} span={3}>
                          <Row gutter={4}>
                            {item.data[key].map((sonsor, index)=> {
                              return <span className="gutter-row" span={12} key={index}>
                          <Tag size={20}>{sonsor.sensor_index}</Tag>
                          <span className="value">X{formatMessage({id: 'app.axis'})}:{sonsor.x}&nbsp;&nbsp;
                            Y{formatMessage({id: 'app.axis'})}:{sonsor.y}&nbsp;&nbsp;
                            Z{formatMessage({id: 'app.axis'})}:{sonsor.z}</span>
                        </span>
                            })}
                          </Row>
                        </Descriptions.Item>
                      )
                    }
                  } else if (key == 'gps_location') {
                    if (item.data[key].length > 0) {
                      renderItem.push(
                        <Descriptions.Item key={key}
                                           label={key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                                           span={3}>
                          <Row gutter={4}>
                            {item.data[key].map((sonsor, index)=> {
                              return <span className="gutter-row" span={12} key={index}>
                          <Tag size={20}>{sonsor.sensor_index}</Tag>
                           <span
                             className="value">{formatMessage({id: 'app.longitude'})}:{gps_location.longitude}&nbsp;&nbsp;
                             {formatMessage({id: 'app.latitude'})}:{gps_location.latitude}&nbsp;&nbsp;
                             {formatMessage({id: 'app.altitude'})}:{gps_location.altitude}</span>
                        </span>
                            })}
                          </Row>
                        </Descriptions.Item>
                      )
                    }

                  } else if (key == 'val_status') {
                    if (item.data[key].length > 0) {
                      renderItem.push(
                        <Descriptions.Item key={key}
                                           label={key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}>
                          <Row gutter={4}>
                            {item.data[key].map((sonsor, index)=> {
                              return <span className="gutter-row" span={12} key={index}>
                          <Tag size={20}>{sonsor.sensor_index}</Tag>
                          <span className="value">{explainValStatus(sonsor.value)}</span>
                        </span>
                            })}
                          </Row>
                        </Descriptions.Item>
                      )
                    }

                  } else {
                    if (item.data[key].length > 0) {
                      renderItem.push(
                        <Descriptions.Item key={key}
                                           label={key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}>
                          <Row gutter={4}>
                            {item.data[key].map((sonsor, index)=> {
                              return <span className="gutter-row" span={12} key={index}>
                         <Avatar size={20}>{sonsor.sensor_index}</Avatar>
                          <span className="value">{sonsor.value}</span>
                        </span>
                            })}
                          </Row>
                        </Descriptions.Item>
                      )
                    }

                  }
                }
                return <Panel style={customPanelStyle} header={<div>
                  <span className={styles.header_tip_eui}>{item.dev_eui}</span>
                  <span
                    className={styles.header_tip}>{moment(item.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>}
                              key={item.device_id + item.timestamp}>
                  <Descriptions className="data-desc" bordered column={2}>
                    <Descriptions.Item
                      label={ formatMessage({id: 'menu.applications.eui'})}>{item.dev_eui}</Descriptions.Item>
                    <Descriptions.Item
                      label={ formatMessage({id: 'menu.applications.name'})}>{item.device_name}</Descriptions.Item>
                    <Descriptions.Item
                      label={ formatMessage({id: 'app.time'})}>{moment(item.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item
                      label={ formatMessage({id: 'app.timestamp'})}>{item.timestamp}</Descriptions.Item>
                    {renderItem}

                  </Descriptions>
                </Panel>

              })
            }

          </Collapse>
          {
            loading && <div className={styles.collapseLoading}>
              <div className={styles.collapseLoadingMask}></div>
              <div className={styles.collapseLoadingSpin}>
                <Spin />
              </div>
            </div>
          }

        </div>


      </div>

    </CardContent>
    const renderTable2 = <div>
      <div >
        <Table
          style={{backgroundColor: '#fff'}}
          className="custom-small-table whole-data"
          loading={loading}
          bordered={true}
          size="small"
          //rowKey={(record)=>record.device_id + record.timestamp+Math.floor(Math.random()*10) }
          rowKey={(record)=>(record.device_id + record.timestamp).toString() }
          dataSource={data}
          columns={columns}
          pagination={false}
          //expandedRowKeys={this.state.expandedRowKeys}
          expandedRowRender={record => {
            const renderItem = [];
            for (let key in record.data) {
              if (key === 'gyrometer' || key === 'accelerometer') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor.sensor_index}
                            X{formatMessage({id: 'app.axis'})}:{sonsor.x}&nbsp;&nbsp;
                            Y{formatMessage({id: 'app.axis'})}:{sonsor.y}&nbsp;&nbsp;
                            Z{formatMessage({id: 'app.axis'})}:{sonsor.z}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }
              } else if (key == 'gps_location') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag
                            color="#f50">{sonsor.sensor_index} {formatMessage({id: 'app.longitude'})}:{gps_location.longitude}&nbsp;&nbsp;
                            {formatMessage({id: 'app.latitude'})}:{gps_location.latitude}&nbsp;&nbsp;
                            {formatMessage({id: 'app.altitude'})}:{gps_location.altitude}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'val_status') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor.sensor_index} : {explainValStatus(sonsor.value)}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'vol') {
                if (record.data[key].length > 0) {
                  const columns = [
                    {title: '0', dataIndex: '0'},
                    {title: '1', dataIndex: '1'},
                    {title: '2', dataIndex: '2'},
                    {title: '3', dataIndex: '3'},
                    {title: '4', dataIndex: '4'},
                    {title: '5', dataIndex: '5'},
                    {title: '6', dataIndex: '6'},
                    {title: '7', dataIndex: '7'},
                    {title: '8', dataIndex: '8'},
                    {title: '9', dataIndex: '9'},
                    {title: '10', dataIndex: '10'},
                    {title: '11', dataIndex: '11'},
                    {title: '12', dataIndex: '12'},
                    {title: '13', dataIndex: '13'},
                    {title: '14', dataIndex: '14'},
                    {title: '15', dataIndex: '15'},
                    {title: '16', dataIndex: '16'},
                    {title: '17', dataIndex: '17'},
                    {title: '18', dataIndex: '18'},
                    {title: '19', dataIndex: '19'},
                    {title: '20', dataIndex: '20'},
                    {title: '21', dataIndex: '21'},
                    {title: '22', dataIndex: '22'},
                    {title: '23', dataIndex: '23'},
                  ]
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                        0点-23点小时体积(m³)</h3>
                      <div>
                        <Table style={{width: '910px'}} columns={columns}
                               dataSource={[arr2obj(record.data[key])]}
                               size="small" key="key" pagination={false}/>
                      </div>
                    </div>
                  )
                }

              } else if (key == 'temperature_sensor') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '温度传感器'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}℃</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'battery') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '电池电压'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}V</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'usm_fault') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '计量模块故障标志'
                              break;
                            default:
                              break;
                          }
                          const columns = [
                            {
                              title: 'B15:连续错误', dataIndex: '0', width: 100, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B14', dataIndex: '1', width: 40, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B13', dataIndex: '2', width: 40, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B12', dataIndex: '3', width: 40, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B11:配置错误', dataIndex: '4', width: 100, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B10:时钟错误', dataIndex: '5', width: 100, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B9', dataIndex: '6', width: 40, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B8:dToF超过阈值', dataIndex: '7', width: 120, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B7:正向ToF超过阈值', dataIndex: '8', width: 140, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B6:反向ToF超过阈值', dataIndex: '9', width: 140, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B5:正向ToF低于阈值', dataIndex: '10', width: 140, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B4:反向ToF低于阈值', dataIndex: '11', width: 140, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B3:正向PW1ST低于阈值', dataIndex: '12', width: 160, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B2:反向PW1ST低于阈值', dataIndex: '13', width: 160, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B1:正向超时', dataIndex: '14', width: 100, render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B0:反向超时', dataIndex: '15', render: (text, record)=> {
                              console.log('text', text)
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ' '
                              }
                              return text
                            }
                            },

                          ];
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {transilateBinary(sonsor.value)}</Tag>
                          <Table style={{maxWidth: '910px'}} columns={columns}
                                 dataSource={[string2Obj(transilateBinary(sonsor.value))]}
                                 size="small" key="key" scroll={{x: 1700}} pagination={false}/>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'val_status') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index;
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '阀控状态'
                              break;
                            default:
                              break;
                          }
                          ;
                          let sensor_value = sonsor.value
                          switch (sonsor.value) {
                            case 0:
                              sensor_value = '无阀控'
                              break;
                            case 1:
                              sensor_value = '开'
                              break;
                            case 2:
                              sensor_value = '正在开'
                              break;
                            case 3:
                              sensor_value = '正在关'
                              break;
                            case 4:
                              sensor_value = '关'
                            case 5:
                              sensor_value = '故障'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'val_fault') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '阀控故障值'
                              break;
                            default:
                              break;
                          }
                          const columns = [
                            {
                              title: 'B15', dataIndex: '0', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B14', dataIndex: '1', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B13', dataIndex: '2', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B12', dataIndex: '3', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B11', dataIndex: '4', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B10', dataIndex: '5', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B9', dataIndex: '6', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B8', dataIndex: '7', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B7', dataIndex: '8', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B6', dataIndex: '9', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B5', dataIndex: '10', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B4', dataIndex: '11', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B3', dataIndex: '12', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B2', dataIndex: '13', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B1:阀控关故障', dataIndex: '14', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B0:阀控开故障', dataIndex: '15', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },

                          ];
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {transilateBinary(sonsor.value)}</Tag>
                          <Table style={{maxWidth: '910px'}} columns={columns}
                                 dataSource={[string2Obj(transilateBinary(sonsor.value))]}
                                 size="small" key="key" scroll={{x: 1700}} pagination={false}/>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'vol_acc') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '正向累积体积'
                              break;
                            case 1:
                              sonsor_name = '反向累积体积'
                              break;
                            case 2:
                              sonsor_name = '当天0点累积体积'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}m³</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'timestamp') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}时间戳</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '出现正向过流时间'
                              break;
                            case 1:
                              sonsor_name = '出现反向过流时间'
                              break;
                            case 2:
                              sonsor_name = '出现过温时间'
                              break;
                            case 3:
                              sonsor_name = '出现空管时间'
                              break;
                            case 4:
                              sonsor_name = '出现电池欠压时间'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}s</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              }
              else if (key == 'usm_pw1st') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}首波脉冲百分比(%)</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '反向'
                              break;
                            case 1:
                              sonsor_name = '正向'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'usm_offset') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '比较器偏置值'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'start_flux') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}(m³/h)</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '启动流量'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {sonsor.value}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == 'val_cmd') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '阀控命令'
                              break;
                            default:
                              break;
                          }
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : <Badge status={sonsor.value == 0 ? 'success' : 'error'}
                                                                   text={sonsor.value == 0 ? '开' : '关'}/></Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else if (key == '90ef_status') {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          let sonsor_name = sonsor.sensor_index
                          switch (sonsor.sensor_index) {
                            case 0:
                              sonsor_name = '90EF状态标志'
                              break;
                            default:
                              break;
                          }

                          const columns = [
                            {
                              title: 'B15', dataIndex: '0', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B14', dataIndex: '1', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B13', dataIndex: '2', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B12', dataIndex: '3', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B11', dataIndex: '4', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B10', dataIndex: '5', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B9', dataIndex: '6', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B8', dataIndex: '7', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B7', dataIndex: '8', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B6', dataIndex: '9', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B5', dataIndex: '10', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B4', dataIndex: '11', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B3', dataIndex: '12', render: (text, record)=> {
                              if (text == 1) {
                                return <Icon type="check" style={{color: "#52c41a"}}/>
                              }
                              if (text == 0) {
                                return ''
                              }
                              return text
                            }
                            },
                            {
                              title: 'B2:电池状态', dataIndex: '13', render: (text, record)=> {
                              return <Badge status={text == 0 ? 'success' : 'error'} text={text == 0 ? '正常' : '异常'}/>
                            }
                            },
                            {
                              title: 'B1:阀控工作状态', dataIndex: '14', render: (text, record)=> {
                              return <Badge status={text == 0 ? 'success' : 'error'} text={text == 0 ? '正常' : '异常'}/>
                            }
                            },
                            {
                              title: 'B0:阀控开关状态', dataIndex: '15', render: (text, record)=> {
                              return <Badge status={text == 0 ? 'success' : 'error'} text={text == 0 ? '开' : '关'}/>
                            }
                            },

                          ];

                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor_name} : {transilateBinary(sonsor.value)}</Tag>
                            <Table style={{width: '910px'}} columns={columns}
                                   dataSource={[string2Obj(transilateBinary(sonsor.value))]}
                                   scroll={{x: true}} size="small" key="key" pagination={false}/>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }

              } else {
                if (record.data[key].length > 0) {
                  renderItem.push(
                    <div key={key} className={styles.expand_content}>
                      <h3
                        className={styles.expand_title}> {key.slice(0, 1).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</h3>
                      <div>
                        {record.data[key].map((sonsor, index)=> {
                          return <span className="gutter-row" span={12} key={index}>
                          <Tag color="#f50">{sonsor.sensor_index} : {sonsor.value}</Tag>
                        </span>
                        })}
                      </div>
                    </div>
                  )
                }
              }


            }

            return <div style={{padding: '5px 10px', width: '100%', overflow: 'hidden'}}>
              {renderItem}
            </div>
          }}
          expandIconAsCell={false}
          expandRowByClick={true}
          onExpand={this.onExpand}
          onChange={this.handleTableSort}
        />
      </div>

    </div>
    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={<p>
              <FormattedMessage
                id="menu.data"
              /></p>}
          />
        </div>
        <div className="info-page-container  data-desc ">

          <Card >
            <div className={styles.tableList} style={{padding: '12px'}}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <Alert message={ formatMessage({id: 'app.data_info'})} type="info" style={{marginBottom: '12px'}}/>
              <Tabs defaultActiveKey="2">
                <TabPane tab={<FormattedMessage
                  id="app.table"
                />} key="2">
                  {renderTable2}
                </TabPane>
                <TabPane tab={<FormattedMessage
                  id="app.list"
                />} key="1">
                  <div style={{marginLeft: '16px'}}>
                    <Radio.Group value={this.state.expend} buttonStyle="solid" onChange={this.changeExpend}>
                      <Radio value="expend">展开全部</Radio>
                      <Radio value="fold">折叠全部</Radio>
                    </Radio.Group>
                  </div>
                  {renderTable}
                </TabPane>

              </Tabs>
              {
                data.length > 0 &&
                <Pagination size="small" {...paginationProps} style={{float: 'right', margin: '16px 0 24px'}}/>
              }
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default TableList;
