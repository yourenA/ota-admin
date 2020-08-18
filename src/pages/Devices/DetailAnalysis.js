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
      // initRange:[moment(new Date(), 'YYYY-MM-DD').subtract('day', 2), moment(new Date(), 'YYYY-MM-DD')],
      sensor_numbers:[],
      limit:'100'
    }
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('resize', this.resizeChart)
    this.getData({
      // start:this.state.initRange[0].valueOf(),
      // end:this.state.initRange[1].valueOf(),
      sensor_numbers:this.state.sensor_numbers,
      limit:this.state.limit,
    });

  }

  getData = (values)=> {
    console.log('values',values)
    const that = this;
    request(`/device_values/${this.props.data.id}`, {
      method: 'get',
      params: {
        // started_timestamp:values.start,
        // ended_timestamp:values.end,
        sensor_numbers:values.sensor_numbers,
        limit:Number(values.limit),
      }
    }).then((response)=> {
      that.setState({
        data: response.data.data,
        // initRange:[moment(new Date(), 'YYYY-MM-DD').subtract('day', 3), moment(new Date(), 'YYYY-MM-DD')],
      },function () {
        that.dynamic(that.state.data);
        if(that.timer){
          clearTimeout(that.timer)
        }
        that.timer=setTimeout(function () {
          that.getData({
            sensor_numbers:that.state.sensor_numbers,
            limit:that.state.limit,
          });
        },10000)
      })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    clearTimeout(this.timer)
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
        let errorIndex=[];
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
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            symbolSize: 10,
            symbol: 'circle',
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
        sensor_numbers:this.state.sensor_numbers
      });
    })
  }
  handleChange=(value,e)=>{
    console.log('value',value)
    this.setState({
      sensor_numbers:value
    },function () {
      this.getData({
        sensor_numbers:this.state.sensor_numbers,
        limit:this.state.limit,

      });
    })
  }
  handleChangeLimit=(value)=>{
    console.log('value',value)
    this.setState({
      limit:value
    },function () {
      this.getData({
        sensor_numbers:this.state.sensor_numbers,
        limit:this.state.limit,
      });
    })
  }
  render() {
    return (
          <div >
            <Button type='primary' icon="left" onClick={this.props.turnPre}>返回设备列表</Button>
            <div  style={{marginTop:'12px',marginBottom:'12px'}}>
              显示最新数据数量: <Select value={this.state.limit}   style={{ width: 120,marginRight:'12px' }}   onChange={this.handleChangeLimit}>
              <Option  value={'100'} >100 </Option>
              <Option  value={'200'} >200 </Option>
              <Option  value={'500'} >500 </Option>
            </Select>
              传感器编号: <Select value={this.state.sensor_numbers}  mode="multiple"  allowClear={true}  style={{ width: 350}}   onChange={this.handleChange}>
                {
                  this.props.data.sensors.map((item,index)=>{
                    return  <Option key={item.number} value={item.number} >{item.number} </Option>
                  })
                }
              </Select>

            </div>
            {this.state.data.length>0?
              <div>
                {this.state.data.map((item, index)=> {
                  return   <div key={index} className={ `detail-item-${index}`} style={{marginBottom:'16px',width: '100%', height: '400px'}}></div>

                })}

              </div>
              : <Empty />}
          </div>
    );
  }
}
