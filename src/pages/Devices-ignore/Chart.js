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
  Descriptions, Avatar, Pagination, Empty, Spin, DatePicker
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './TableList.less';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EchartTheme from './chalk.json'
const FormItem = Form.Item;
const {Description} = DescriptionList;
const {Option} = Select;
const {Panel} = Collapse;
/* eslint react/no-multi-comp:0 */
@connect(({datas, loading, system_configs}) => ({
  datas, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.MyEcharts = null;
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
    date: moment().format('YYYY-MM-DD'),
    collapse_key: []
  };


  componentDidMount() {
    let params = {}
    params = {
      page: 1,
      per_page: 30,
      date: moment().format('YYYY-MM-DD'),

    }
    const that = this;
    that.handleSearch(params, true)

    window.ws.onmessage = function (ev) {
      var payload = JSON.parse(ev.data);
      if (payload.status_code === 200) {
        if (payload.data.event === 'new_device_data' && payload.data.device_id === that.props.history.location.query.id && moment().format('YYYY-MM-DD') === that.state.date) {
          console.log('刷新请求device data')
          that.handleSearch({
            page: that.state.page,
            per_page: that.state.per_page,
            date: that.state.date
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
      type: 'datas/loadedPage',
      payload: true,
    });
  }

  handleSearch = (values, force) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'datas/fetch',
      payload: {
        id: this.props.history.location.query.id,
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        }, function () {
          const {
            datas: {data},
          } = that.props;
          that.dynamic(data, force)
        });
      }
    });
  }
  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    this.handleSearch({
      page: 1,
      per_page: 30,
      date: moment().format('YYYY-MM-DD'),
    }, true)
  }


  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 8}}>
          <Col md={6} sm={24}>
            <FormItem label={
              <FormattedMessage
                id="app.date"
              />
            }>
              {getFieldDecorator('date', {initialValue: moment()})(<DatePicker allowClear={false}
                                                                               format="YYYY-MM-DD"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search" type="primary" onClick={()=> {
                const {form} = this.props;
                form.validateFields((err, fieldsValue) => {
                  if (err) return;
                  this.handleSearch({
                    date: fieldsValue.date.format('YYYY-MM-DD'),
                    page: this.state.page,
                    per_page: this.state.per_page,
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

  dynamic = (data, force)=> {
    const themeObj = EchartTheme
    this.echarts.registerTheme('chalk', themeObj);
    let col = [];
    let colData = {};
    let date = [];
    if (data.length === 0) {
      this.MyEcharts && this.MyEcharts.clear();
    }
    data.length > 0 && data.map((item, index)=> {
      const parseDate = moment(item.timestamp * 1000).format('HH:mm:ss')
      date.push(parseDate)
      for (let key in item.data) {
        if (key === 'gyrometer' || key === 'accelerometer' || key === 'gps_location' || key === 'usm_fault' || key === 'val_fault' || key === 'val_status') {
        } else {

          if (item.data[key].length > 0) {
            // if(date.indexOf(parseDate)<0){
            //
            // }
            const red = item.data[key].reduce((pre, item2)=> {
              if (colData[`${key}.${item2.sensor_index}`]) {

                colData[`${key}.${item2.sensor_index}`].push(item2.value)
              } else {
                colData[`${key}.${item2.sensor_index}`] = [item2.value]
              }
              if (col.indexOf(`${key}.${item2.sensor_index}`) < 0) {
                col.push(`${key}.${item2.sensor_index}`);

              }
              return pre
            }, [])
          }
        }

      }
    })
    let series = [];
    for (let i = 0; i < col.length; i++) {
      series.push({
        name: col[i],
        data: colData[col[i]].reverse(),
        type: 'line',
      })
    }
    let option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        type: 'scroll',
        data: col,
        orient: 'horizontal', // 'vertical'
        x: 'right', // 'center' | 'left' | {number},
        y: 'top', // 'center' | 'bottom' | {number}
        backgroundColor: '#eee',
        borderColor: 'rgba(178,34,34,0.8)',
        padding: 10,    // [5, 10, 15, 20]
        itemGap: 20,
        icon: 'circle',
        textStyle: {color: 'red', fontSize: 12,},
      },
      grid: {
        left: '4%',
        right: '4%',
        containLabel: true
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          bottom: 20
        },
        {
          type: 'inside',
          realtime: true,
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        nameTextStyle: {
          color: '#fff',
          fontSize: 14
        },
      },
      yAxis: {
        type: 'value'
      },
    };
    this.MyEcharts = this.echarts.init(document.querySelector(`.chart`), 'chalk');
    option.xAxis.data = date.reverse();
    option.series = series;
    this.MyEcharts.setOption(option, force);

  }

  render() {
    const {
      datas: {data, loading, meta, pageLoaded},
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => formatMessage({id: 'app.pagination'}, {total}),
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, date: this.state.date})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, date: this.state.date})
      },
    };
    return (
      <div>
        <div className="info-page-container">

          <Card >
            {/*{renderTable}*/}
            <CardContent>
              <div className={styles.tableList} style={{padding: '12px'}}>
                <div className={styles.tableListForm}>{this.renderForm()}</div>
                <Alert message={ formatMessage({id: 'app.chart_info'})} type="info" style={{marginBottom: '12px'}}/>
                <div style={{width: '100%', height: '450px'}} className={`chart`}></div>
              </div>

            </CardContent>

          </Card>
        </div>
      </div>
    );
  }
}

export default TableList;
