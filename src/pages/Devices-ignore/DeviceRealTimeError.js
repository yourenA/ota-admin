import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Form,
  Select,
  Button,
  Icon,
  Table,
  Alert
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './Index.less';
import request from '@/utils/request';
import find from 'lodash/find'
const FormItem = Form.Item;
const {Option} = Select;
/* eslint react/no-multi-comp:0 */
@connect(({device_real_time_errors,system_configs, loading}) => ({
  device_real_time_errors,system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      page: 1,
      per_page: 30,
      number: '',
      name: '',
      status: '1',
      parameter_id: '',
      errorParameters: [],
      refresh_second: 0,
      display_rows:0
    };
  }


  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'system_configs/fetch',
      callback: ()=> {
        const {system_configs}=that.props
        const refresh_second = find(system_configs.data, function (o) {
          return o.key === 'real_time_error_data_refresh_time'
        })
        const display_rows=find(system_configs.data,function (o) {
          return o.key==="real_time_error_data_display_rows"
        })
        console.log('display_rows',display_rows)
        if (refresh_second) {
          that.setState({
            refresh_second: Number(refresh_second.value),
            display_rows:display_rows.value
          }, function () {
            that.handleSearch()
          })
        }
      }
    });
  }


  handleSearch = () => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_real_time_errors/fetch',
      payload: {
        device_id: this.props.history.location.query.id,
      },
      callback: function () {
        if (that.timer) {
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer = setTimeout(function () {
          that.handleSearch();
        }, that.state.refresh_second * 1000)
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

  renderForm() {
  }

  render() {
    const {
      device_real_time_errors: {data, loading, meta},
    } = this.props;
    const columns = [{
      title: '时间',
      dataIndex: 'timestamp',
      render: (text)=> {
        return moment(text).format('MM-DD HH:mm:ss')
      }
    }]
    const renderHeader = (data.data?data.data.errors:[]).map((item, index)=> {
      columns.push({
        title: item.name,
        dataIndex: `column-${index}`,
        className: 'text-center',
        render: (text, record)=> {
          if (text === 1) {
            return <Icon type="check" style={{color: "#52c41a"}}/>
          }
          if (text === -1) {
            return ''
          }
          return text
        }
      })
    })

    let parseData = []
    if (data.data) {
      for (let i = 0; i < data.data.data.length; i++) {
        let row = {}
        for (let key in data.data.data[i].data) {
          row[`column-${key}`] = data.data.data[i].data[key].value
        }
        parseData.push({
          ...row,
          timestamp: data.data.data[i].timestamp
        })
      }
    }
    return (
      <div>
        <div className="info-page-container">

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
            <Alert   style={{marginBottom: '12px'}} message={`数据每隔${this.state.refresh_second}秒刷新一次; 显示最新${this.state.display_rows}条数据`} type="info"  />
            <Table
              className={'error-table'}
              style={{backgroundColor: '#fff'}}
              loading={loading}
              rowKey={'timestamp'}
              dataSource={parseData}
              columns={columns}
              bordered={true}
              size="small"
              pagination={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TableList;
