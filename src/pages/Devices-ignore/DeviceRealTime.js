import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Row, Col, Form, Card, Select, Input, Table, Alert, Tabs, Checkbox, Tooltip} from 'antd';
import {Collapse, Button} from 'antd';
import {routerRedux} from 'dva/router';
import request from '@/utils/request';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;
const {Option} = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({device_real_data,system_configs,views}) => ({
  device_real_data,
  system_configs,
  views
}))
class CoverCardList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
    this.echarts = window.echarts;
    this.name = this.props.history.location.query.name
    this.id = this.props.history.location.query.id
    this.myChart=[];
    this.state = {
      showVisible: false,
      targetKeys: [],
      selectedKeys: [],
      refresh_second:0,
      display_rows:0,
      sensor_numbers:[],
      views:[],
      views_ids:[],
      indeterminate: false,
      checkAll: true,
    }
  }

  componentDidMount() {
    const that=this;
    window.addEventListener('resize', this.resizeChart);
    const {dispatch} = this.props;
    request(`/devices/${this.props.history.location.query.id}`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        dispatch({
          type: 'views/fetch',
          payload: {
            devices_id:that.props.history.location.query.id
          },
          callback:()=>{
            const {views} =this.props
            let viewOptions=[]
            let views_ids=[]
            for(let i=0;i<views.data.length;i++){
              viewOptions.push({label:views.data[i].name,value:views.data[i].id})
              views_ids.push(views.data[i].id)
            }
            that.setState({
              views:viewOptions,
              views_ids
            })
          }
        });
      }
    })

    dispatch({
      type: 'system_configs/fetch',
      payload: {

      },
      callback:()=>{
        const {system_configs}=that.props
        const refresh_second=find(system_configs.data,function (o) {
          return o.key==='real_time_data_refresh_time'
        })
        const display_rows=find(system_configs.data,function (o) {
          return o.key==='real_time_data_display_rows'
        })
        console.log('refresh_second',refresh_second)

        if(refresh_second){
          that.setState({
            refresh_second:Number(refresh_second.value),
            display_rows:Number(display_rows.value)
          },function () {
            that.handleSearch()
          })
        }
      }
    });

  }
  dynamic=(data)=>{
    console.log('dynamic data',data)
    const that=this;
    if (data.length === 0) {
      return
    }
    setTimeout(function () {

      for (let i = 0; i < data.length; i++) {
        if(data[i].parameters.length){
          let colors =['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
          that['myChart' + i] = that.echarts.init(document.querySelector(`.real_time_chart_${i}`));
          that.myChart.push(that['myChart' + i]);
          let legend=[];
          let yAxis=[];
          let dataSource=[];
          let series=[]
          let date=[]

          for(let j=0;j<data[i].parameters.length;j++){
            legend.push(`${data[i].parameters[j].name}(${data[i].parameters[j].data_unit})`);
            // yAxis.push({
            //   type: 'value',
            //   offset:j>1?30*(j-1):0,
            //   name:  data[i].parameters[j].name ,
            //   axisLine: {
            //     lineStyle: {
            //       color: colors[(j%data[i].parameters.length)]
            //     }
            //   },
            // });
            const unitExit=find(yAxis,(o)=>{return o.name===data[i].parameters[j].data_unit})
            if(!unitExit){
              yAxis.push({
                type: 'value',
                name:  data[i].parameters[j].data_unit ,
                splitLine: {
                  show: false
                }
              });
            }
            series.push({
              name: `${data[i].parameters[j].name}(${data[i].parameters[j].data_unit})`,
              type: 'line',
              data:  data[i].parameters[j].data.reduce((pre,item)=>{pre.push(item.value);return pre},[]).reverse(),
              yAxisIndex: findIndex(yAxis,(o)=>{return o.name===data[i].parameters[j].data_unit}),
              smooth: true,
            });
            dataSource.push({
              [ data[i].parameters[j].name]:data[i].parameters[j].data
            })
          }
          let parseData=that.transformData(dataSource);
          for (let i=0;i<parseData.length;i++){
            if(parseData[i] instanceof Array){
              parseData=parseData[0]
            }
          }
          // console.log('legend',legend)
          // console.log('yAxis',yAxis)
          // console.log('parseData',parseData);
          for(let k=0;k<parseData.length;k++){
            date.push( moment(parseData[k].timestamp).format('HH:mm:ss'))
          }
          // console.log('date',date)
          let option = {
            color: colors,
            tooltip: {
              trigger: 'axis',
            },

            legend: {
              data: legend
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: [...date].reverse()
            },
            yAxis: yAxis,
            grid: {
              top: '15%',
              left: '2%',
              right: '3%',
              bottom: '2%',
              containLabel: true
            },
            series: series
          };
          that['myChart' + i].setOption(option,true);
        }

      }
    }, 400)
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
    if(this.timer){
      console.log(this.timer)
    }
    clearTimeout(this.timer)
    window.removeEventListener('resize', this.resizeChart)
  }
  handleSearch = (cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'device_real_data/fetch',
      payload: {
        device_id: that.props.history.location.query.id,
        view_ids:that.state.views_ids
      },
      callback: function () {
        const {
          device_real_data: {data, loading},
        } = that.props;
        that.dynamic(data);
        if(that.timer){
          console.log('clearTimeout')
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.handleSearch();
        },that.state.refresh_second*1000)
      }

    });
  }

  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  transformData = (original)=> {
    if(original.length===0){
      return []
    }
    const mapOriginal = original
      .map(item => Object.keys(item).map(category => item[category].map(categoryData => ({
        ...categoryData,
        [category]: categoryData.value,
        [`${category}_status`]: categoryData.status,
      }))))
      .reduce((a, b) => (a.reduce((p, n) => p.concat(n),[]))
        .concat(
          (b.reduce((p, n) => p.concat(n),[]))
        )
      )
    const obj = {}
    mapOriginal.forEach(d => {
      if (!obj[d.timestamp]) {
        obj[d.timestamp] = d
      }
      Object.assign(obj[d.timestamp], d)
    })
    return Object.values(obj).map(item => {
      delete item['value']
      delete item['status']
      return item
    })
  }
  onChange=(checkedList)=>{
    this.setState({
      views_ids:checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.views.length),
      checkAll: checkedList.length === this.state.views.length,
    },function () {
      // if (this.myChart.length>0) {
      //   for (let i = 0; i < this.myChart.length; i++) {
      //     this.myChart[i].clear();
      //   }
      // }
      this.handleSearch();
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      views_ids: e.target.checked ? this.state.views.reduce((pre,item)=>{pre.push(item.value);return pre},[]) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    },function () {
      // if (this.myChart.length>0) {
      //   for (let i = 0; i < this.myChart.length; i++) {
      //     this.myChart[i].clear();
      //   }
      // }
      this.handleSearch();
    });
  }
  render() {
    const {
      device_real_data: {data, loading},
      system_configs
    } = this.props;

    const renderItem = data.map((item, index)=> {
      const columns = [{
        title: '时间',
        dataIndex: 'timestamp',
        width:`${1/(item.parameters.length+1)*100}%`,
        render:(text)=>{
        return moment(text).format('MM-DD HH:mm:ss')
      }
      }];
      const dataSource = []
      for (let i = 0; i < item.parameters.length; i++) {
        if(i===item.parameters.length-1){
          columns.push({
            title: <Tooltip title={item.parameters[i].remark + `${item.parameters[i].data_unit ? '(' + item.parameters[i].data_unit + ')' : ''}`}>
              <span>{item.parameters[i].name + `${item.parameters[i].data_unit ? '(' + item.parameters[i].data_unit + ')' : ''}`}</span>
            </Tooltip> ,
            dataIndex: item.parameters[i].name,
            render:(text,record)=>{
              return record[item.parameters[i].name+'_status']===1?text:<span style={{color:'red'}}>{text}</span>
            }
          })
        }else{
          columns.push({
            title: <Tooltip title={item.parameters[i].remark + `${item.parameters[i].data_unit ? '(' + item.parameters[i].data_unit + ')' : ''}`}>
              <span>{item.parameters[i].name + `${item.parameters[i].data_unit ? '(' + item.parameters[i].data_unit + ')' : ''}`}</span>
            </Tooltip> ,
            width:`${1/(item.parameters.length+1)*100}%`,
            dataIndex: item.parameters[i].name,
            render:(text,record)=>{
              return record[item.parameters[i].name+'_status']===1?text:<span style={{color:'red'}}>{text}</span>
            }
          })
        }

        dataSource.push({
          [item.parameters[i].name]:item.parameters[i].data
        })

      }
      let data=this.transformData(dataSource);

      for (let i=0;i<data.length;i++){
        if(data[i] instanceof Array){
          data=data[0]
        }
      }
      return <Col key={index} xxl={24} xl={24} lg={24} md={24} sm={24} xs={24} style={{marginBottom: 16}}>
        <Card
          hoverable={true}
          size="small"
          headStyle={{
            paddingLeft: '10px',
          }}
          bodyStyle={{
          }}
          title={
            <h3 style={{marginBottom:'0'}}>{item.name}</h3>
          }
        >
              <div style={{width: '100%', height: '200px'}} className={`real_time_chart_${index}`}></div>
              <Table size="small" rowKey="timestamp"   scroll={{ y: 145 }} columns={columns} dataSource={data} bordered={true} pagination={false}/>
        </Card>
      </Col>
    })
    return (
      <div>
        <div >
          <div><Row  gutter={12}>
            <Alert style={{margin:'6px'}} message={`数据每隔${this.state.refresh_second}秒刷新一次; 显示最新${this.state.display_rows}条数据`} type="info"  />
            <div  style={{margin:'6px',paddingBottom:'12px',marginBottom:'12px',borderBottom: '1px solid #E9E9E9'}}>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                选择全部
              </Checkbox>
              <br />
              <CheckboxGroup options={this.state.views} value={this.state.views_ids} onChange={this.onChange} />
            </div>
            {renderItem}
          </Row></div>

        </div>
      </div>
    );
  }
}

export default CoverCardList;
