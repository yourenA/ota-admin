import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Row, Col, Form, Card, Select, Tabs, Table, DatePicker, Modal, Checkbox, Tooltip, Empty} from 'antd';
import {Collapse, Button} from 'antd';
import {routerRedux} from 'dva/router';
import request from '@/utils/request';
import {download} from '@/utils/utils';
import ExportData from './ExportForm'
import config from '@/config/config'
const CheckboxGroup = Checkbox.Group;


/* eslint react/no-array-index-key: 0 */

@connect(({device_history_data, sensors}) => ({
  device_history_data, sensors
}))
class CoverCardList extends PureComponent {
  constructor(props) {
    super(props);
    this.echarts = window.echarts;
    this.name = this.props.history.location.query.name
    this.id = this.props.history.location.query.id
    this.myChart = [];
    this.state = {
      showVisible: false,
      targetKeys: [],
      selectedKeys: [],
      started_at: moment(new Date(), 'YYYY-MM-DD'),
      ended_at: moment(new Date(), 'YYYY-MM-DD'),
      sensor_numbers: [],
      sensors: [],
      indeterminate: false,
      checkAll: true,
      per_page:30,
      page:1,
      sensors_numbers_export: [],
      indeterminateExport: false,
      checkAllExport: true,
    }
  }

  componentDidMount() {
    const that = this;
    this.handleSearch()
    this.handleSearchSensors();
    window.addEventListener('resize', this.resizeChart)
  }

  componentWillUnmount() {
    console.log('reset')
    const {dispatch} = this.props;
    dispatch({
      type: 'device_history_data/reset',
      payload: {}
    });

  }

  handleSearch = (param) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_history_data/fetch',
      payload: {
        device_id: that.props.history.location.query.id,
        started_at: moment(this.state.started_at).format('YYYY-MM-DD'),
        ended_at: moment(this.state.ended_at).format('YYYY-MM-DD'),
        parameter_ids: this.state.sensor_numbers,
        per_page:this.state.per_page,
        page:this.state.page
      },
      callback: function () {
        that.setState({
          ...param
        })
        const {
          device_history_data: {data, loading},
        } = that.props;
      }

    });
  }
  handleChangeDate = (value)=> {
    console.log('value', value)
    this.setState({
      started_at: value
    }, function () {
      this.handleSearch();
    })
  }
  handleChangeEndDate = (value)=> {
    console.log('value', value)
    this.setState({
      ended_at: value
    }, function () {
      this.handleSearch();
    })
  }
  onChange = (checkedList)=> {
    console.log('checkedList', checkedList)
    this.setState({
      sensor_numbers: checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.sensors.length),
      checkAll: checkedList.length === this.state.sensors.length,
    }, function () {
      this.handleSearch();
    });
  }
  onChangeExport = (checkedList)=> {
    console.log('checkedList', checkedList)
    this.setState({
      sensors_numbers_export: checkedList,
      indeterminateExport: !!checkedList.length && (checkedList.length < this.state.sensors.length),
      checkAllExport: checkedList.length === this.state.sensors.length,
    });
  }
  handleSearchSensors = (cb) => {
    const that = this;
    const {dispatch} = this.props;
    request(`/devices/${this.props.history.location.query.id}/parameters`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        let channels = []
        let sensor_numbers = []
        for (let i = 0; i < response.data.data.length; i++) {
          channels.push({label: response.data.data[i].name, value: response.data.data[i].id})
          sensor_numbers.push(response.data.data[i].id)
        }
        that.setState({
          sensors: channels,
          sensor_numbers
        })
      }
    })
  }
  resizeChart = ()=> {
    if (this.myChart.length > 0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  onCheckAllChange = (e) => {
    this.setState({
      sensor_numbers: e.target.checked ? this.state.sensors.reduce((pre, item)=> {
        pre.push(item.value);
        return pre
      }, []) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }, function () {
      this.handleSearch();
    });
  }
  onCheckAllChangeExport = (e) => {
    this.setState({
      sensors_numbers_export: e.target.checked ? this.state.sensors.reduce((pre, item)=> {
        pre.push(item.value);
        return pre
      }, []) : [],
      indeterminateExport: false,
      checkAllExport: e.target.checked,
    });
  }
  handleExport = ()=> {
    const that = this;
    const formValues = this.ExportData.props.form.getFieldsValue();
    console.log('formValues', formValues)
    this.props.dispatch({
      type: 'device_history_data/exportCSV',
      payload: {
        device_id: that.props.history.location.query.id,
        parameter_ids: that.state.sensors_numbers_export,
        started_at: moment(formValues.started_at).format('YYYY-MM-DD'),
        ended_at: moment(formValues.ended_at).format('YYYY-MM-DD'),
      },
      callback: function (download_key) {
        console.log('download', download_key)
        download(`${config.prefix}/download?download_key=${download_key}`)
      }
    });
  }

  render() {
    const {
      device_history_data: {data, loading,meta},
    } = this.props;
    const columns = [{
      title: '时间',
      dataIndex: 'timestamp',
      render: (text)=> {
        return moment(text).format('MM-DD HH:mm:ss')
      }
    }]
    const renderHeader = (data.parameters || []).map((item, index)=> {
      columns.push({
        title: item.name + '(' + item.data_unit + ')',
        dataIndex: `column-${index}`,
      })
    })
    let parseData=[]
    if (data.data) {
      for (let i = 0; i < data.data.length; i++) {
        let row={}
        for(let key in data.data[i].data){
          row[`column-${key}`]=data.data[i].data[key].value
        }
        parseData.push({
          ...row,
          timestamp: data.data[i].timestamp
        })
      }

    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal:total => `共 ${total} 项`,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.setState({page, per_page: pageSize},function () {
          this.handleSearch()
        })
      },
      onShowSizeChange: (page, pageSize)=> {
        this.setState({page, per_page: pageSize},function () {
          this.handleSearch()
        })
      },
    };
    return (
      <div>
        <div className="info-page-container">
          <div style={{marginTop: '12px', marginBottom: '12px'}}>
            <div style={{paddingBottom: '12px', marginBottom: '6px', borderBottom: '1px solid #E9E9E9'}}>
              <Button onClick={()=> {
                let sensors_numbers_export = []
                for (let i = 0; i < this.state.sensors.length; i++) {
                  sensors_numbers_export.push(this.state.sensors[i].value)
                }
                console.log('sensors_numbers_export', sensors_numbers_export)
                this.setState({
                  sensors_numbers_export: sensors_numbers_export,

                }, function () {
                  this.setState({
                    exportModal: true
                  })
                })
              }} type="primary" style={{float: 'right'}}>导出数据</Button>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                选择全部
              </Checkbox>
              <br />
              <CheckboxGroup options={this.state.sensors} value={this.state.sensor_numbers} onChange={this.onChange}/>
            </div>
            <div >
              开始日期: <DatePicker
              format="YYYY-MM-DD"
              onChange={this.handleChangeDate}
              value={this.state.started_at}
              style={{marginRight: '12px'}}
              allowClear={false}
            />
              结束日期: <DatePicker
              format="YYYY-MM-DD"
              onChange={this.handleChangeEndDate}
              value={this.state.ended_at}
              style={{marginRight: '12px'}}
              allowClear={false}
            />
            </div>

          </div>

          <div><Row gutter={12}>
            <Table
              size='small'
              loading={loading}
              rowKey={'timestamp'}
              dataSource={parseData}
              columns={columns}
              pagination={paginationProps}
            />
          </Row></div>

        </div>
        <Modal
          title={'导出历史数据' }
          visible={this.state.exportModal}
          centered
          onOk={this.handleExport}
          onCancel={()=> {
            this.setState({exportModal: false})
          }}
        >
          <ExportData
            indeterminateExport={this.state.indeterminateExport}
            onCheckAllChangeExport={this.onCheckAllChangeExport}
            checkAllExport={this.state.checkAllExport}
            sensors_numbers_export={this.state.sensors_numbers_export}
            onChangeExport={this.onChangeExport}
            options={this.state.sensors}
            wrappedComponentRef={(inst) => this.ExportData = inst}/>

        </Modal>
      </div>
    );
  }
}

export default CoverCardList;
