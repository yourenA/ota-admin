import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {PageHeader, Input, Table, Form, Card, Button, Col, Select, message, Row,Tooltip,Badge} from 'antd';
import differenceBy from 'lodash/differenceBy'
import find from 'lodash/find'
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea
@connect(({device_types, loading}) => ({
  device_types,
}))
@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      optionChannel:[],
      sensors:[]
    }
  }

  componentDidMount() {
    this.fetchOptionChannel(this.props.device_type_id)
  }
  fetchOptionChannel=(device_types_id)=>{
    const that=this;
    request(`/device_types/${device_types_id}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        console.log('that.props.channels',that.props.channels)
        const optionChannel=differenceBy(response.data.data.channels,that.props.channels,'number')
        console.log('optionChannel',optionChannel)
        that.setState({
          optionChannel
        })
        if(that.props.editRecord){
          const findSensor=find(response.data.data.channels,(o)=>{
            return o.number===that.props.editRecord.number
          })
          that.setState({
            sensors:findSensor.optional_sensors
          })
        }
      }
    });
  }
  changeNumber=(number)=>{
    const findSensor=find(this.state.optionChannel,(o)=>{
      return o.number===number
    })
    console.log('findSensor',findSensor)
    this.setState({
      sensors:findSensor.optional_sensors
    })
  }
  render() {
    const {device_types}=this.props
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };
    return (
      <div>
          <Form  onSubmit={this.handleSubmit} >
            <Form.Item label="名称" {...formItemLayout}  required={true}>
              {getFieldDecorator(`name`, {
                initialValue: this.props.editRecord ? this.props.editRecord.name : '',
              })(
                <Input />
              )}
            </Form.Item>
            <FormItem
              required={true}
              label='通道'
              {...formItemLayout}
            >
              {getFieldDecorator('number', {
                initialValue:this.props.editRecord ? this.props.editRecord.number : '',
              })(
                <Select onChange={this.changeNumber}   disabled={this.props.editRecord?true:false}>
                  { this.state.optionChannel.map(item => <Option key={item.number} value={item.number}>{item.display_name}</Option>) }
                </Select>
              )}
            </FormItem>


            <FormItem
              required={true}
              label='型号'
              {...formItemLayout}
            >
              {getFieldDecorator('sensor_id', {
                initialValue:this.props.editRecord ? this.props.editRecord.installed_sensor.id : '',
              })(
                <Select >
                  { this.state.sensors.map(item => <Option key={item.id} value={item.id}>{item.model} | {item.name}</Option>) }
                </Select>
              )}
            </FormItem>
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator(`alias`, {
                initialValue: this.props.editRecord ? this.props.editRecord.alias : '',
              })(
                <Input />
              )}
            </Form.Item>

          </Form>

      </div>
    );
  }
}

export default SearchList
