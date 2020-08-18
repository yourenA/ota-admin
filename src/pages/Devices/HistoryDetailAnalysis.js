import React, {PureComponent} from 'react';
import { Tabs,DatePicker,Button,Table,Card, Select,Empty} from 'antd';
import request from "@/utils/request";
import moment from "moment"
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

export default class LiquidPosition extends PureComponent {
  constructor(props) {
    super(props);
    this.timer=null;
    this.echarts = window.echarts;
    this.myChart = [];
    this.state = {
      data: [],
      initRange:[moment(new Date(), 'YYYY-MM-DD').subtract('day', 1), moment(new Date(), 'YYYY-MM-DD')],
      sensor_numbers:[],
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.getData({
      start:this.state.initRange[0].valueOf(),
      end:this.state.initRange[1].valueOf(),
      sensor_numbers:this.state.sensor_numbers
    });

  }

  getData = (values)=> {
    console.log('获取数据')
    const that = this;
    request(`/device_values/${this.props.data.id}`, {
      method: 'get',
      params: {
        started_timestamp:values.start,
        ended_timestamp:values.end,
        sensor_numbers:values.sensor_numbers,
      }
    }).then((response)=> {
      that.setState({
        data: response.data.data,
      },function () {
        that.dynamic(that.state.data);
        if(that.timer){
          clearTimeout(that.timer)
        }
        // that.timer=setTimeout(function () {
        //   that.getData({
        //     start:that.state.initRange[0].valueOf(),
        //     end:that.state.initRange[1].valueOf(),
        //     sensor_id:that.state.sensor_id
        //   });
        // },10000)
      })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    // clearTimeout(this.timer)
  }

  resizeChart = ()=> {
    if (this.myChart.length>0) {
      for (let i = 0; i < this.myChart.length; i++) {
        this.myChart[i].resize();
      }
    }
  }
  dynamic = (data)=> {

    if (data.length === 0) {
      return
    }

    const that = this;
    setTimeout(function () {
      for (let i = 0; i < data.length; i++) {
        that['myChart' + i] = that.echarts.init(document.querySelector(`.detail-item-${i}`));
        that.myChart.push(that['myChart' + i])
        let xData = [];
        let yData = [];
        let errorIndex=[]
        data[i].values.reverse();
        for(let j=0;j<data[i].values.length;j++){
          if(data[i].values[j].code!==0){
            errorIndex.push(j);
          }
          xData.push(moment(data[i].values[j].timestamp).format('MM-DD HH:mm:ss'))
          yData.push(data[i].values[j].value)
        }
        let option = {
          color:['#1890ff'],
          title : {
            text: "传感器: "+data[i].number,
            textStyle:{fontSize:16},
            subtext: "别名: "+data[i].alias,
            subtextStyle :{fontSize:16,color:'#666'},
            x:'left'
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {},
              dataView: {readOnly: false},
              restore: {},
            }
          },
          backgroundColor: '#eee',
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
          xAxis: {
            type: 'category',
            data: xData,
            name: '时间戳',
          },
          yAxis: {
            type: 'value',
          },
          series: [{
            data: yData,
            type: 'line',
            large: true,
            symbolSize:10,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            lineStyle:{
              normal: {
                color:'#008aff'
              }

            },
            itemStyle: {
              normal: {
                color:function (value) {
                  if(errorIndex.indexOf(value.dataIndex)>=0){
                    return '#c23531'
                  }else{
                    return '#008aff'
                  }
                },
                barBorderRadius: 0,
              }
            },
          }]
        };


        that['myChart' + i].setOption(option);

      }
    }, 300)


  }
  onChange=(value, dateString)=>{
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    this.setState({
      initRange:value
    })
  }
  onOk=(value)=>{
    console.log('onOk: ', value);
    this.setState({
      initRange:value
    },function () {
      this.getData({
        start:this.state.initRange[0].valueOf(),
        end:this.state.initRange[1].valueOf(),
        sensor_numbers:this.state.sensor_numbers
      });
    })
  }
  handleChange=(value)=>{
    console.log('value',value)
    this.setState({
      sensor_numbers:value
    },function () {
      this.getData({
        start:this.state.initRange[0].valueOf(),
        end:this.state.initRange[1].valueOf(),
        sensor_numbers:this.state.sensor_numbers
      });
    })
  }
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 50,
        className: 'table-index',
        render: (text, record, index) => {
          return (index+1)
        }
      },
      {title: '时间戳', dataIndex: 'timestamp', key: 'timestamp'},
      {title: '时间', dataIndex: 'time', key: 'time',render: (val, record, index) => {
        return moment(record.timestamp).format('YYYY-MM-DD HH:mm:ss') +"  "+record.timestamp.toString().substring(10)
      }},
      {title: '读值', dataIndex: 'value', key: 'value'},
      {title:'错误码', dataIndex: 'code', key: 'code',render:(val,record)=>{
        return `${val===0?'正常':'异常'} : ${val}`
      }},
    ];
    return (
          <div >
            <Button type='primary' icon="left" onClick={this.props.turnPre}>返回设备列表</Button>
            <div style={{marginTop:'12px',marginRight:'12px'}}>
              时间区间: <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChange}
              onOk={this.onOk}
              value={this.state.initRange}
              style={{marginTop:'12px',marginRight:'12px'}}
            />
              传感器编号: <Select value={this.state.sensor_numbers}  mode="multiple" style={{ width: 350 }}  allowClear={true}  onChange={this.handleChange}>
                {
                  this.props.data.sensors.map((item,index)=>{
                    return  <Option key={item.number} value={item.number} >{item.number} </Option>
                  })
                }
              </Select>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane tab="折线图" key="1">
                {this.state.data.length>0?
                  <div>
                    {this.state.data.map((item, index)=> {
                      return   <div key={index} className={ `detail-item-${index}`} style={{marginBottom:'16px',width: '100%', height: '400px'}}></div>

                    })}

                  </div>
                  : <Empty />}
              </TabPane>
              <TabPane tab="表格" key="2">
                {this.state.data.length > 0 ?
                  <div>
                    {this.state.data.map((item, index)=> {
                      return  <Table
                        key={index}
                        style={{marginTop:'12px'}}
                        title={() => <h3>传感器: {item.number} 别名: {item.alias}</h3>}
                        bordered
                        columns={columns}
                        dataSource={[...item.values]}
                        pagination={false}
                        size="small"
                        rowKey={record => record.timestamp}
                      />

                    })}

                  </div>
                  : <Empty />
                }

              </TabPane>
            </Tabs>

          </div>
    );
  }
}
