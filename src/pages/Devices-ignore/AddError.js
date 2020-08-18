import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {PageHeader, Input, Table, Form, Card, Button, Col, Select, message, Row,Tooltip,Badge} from 'antd';
import find from'lodash/find'
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea
@connect(({collector_types, loading}) => ({
  collector_types,
}))
@Form.create()
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      collectors:[],
      parameters:[],
      sensors:[]
    }
  }

  componentDidMount() {

    const that = this;
    request(`/collectors`,{
      method:'GET',
      params:{
        return:'all'
      }
    }).then(function (response) {
      if(response.status===200){
        that.setState({
          collectors:response.data.data
        },function () {
          if(this.props.editRecord){
            this.props.form.setFieldsValue({collector:this.props.editRecord.collector_number})
            this.changeCollector(this.props.editRecord.collector_number)
          }
        })
      }
    });
  }
  changeCollector=(value)=>{
    const that = this;
    const findResult=find(this.state.collectors,function (o) {
      return o.number===value
    })
    // this.props.form.setFieldsValue({parameters:[]})
    request(`/collectors/${findResult.id}/parameters`,{
      method:'GET',
      params:{
        return:'all'
      }
    }).then(function (response) {
      if(response.status===200){
        let parameters=[]
        if(response.data.data.error){
          parameters=parameters.concat(response.data.data.error)
        }
        console.log('parameters',parameters)
        that.setState({
          parameters
        },function () {
          if(that.props.editRecord){
            that.props.form.setFieldsValue({parameters:that.props.editRecord.id})
            that.changeNumber(that.props.editRecord.id)
          }
        })
      }
    });
  }
  changeNumber=(number)=>{
    const findSensor=find(this.state.parameters,(o)=>{
      return o.id===number
    })
    const that=this
    console.log('findSensor',findSensor)
    this.setState({
      sensors:findSensor.optional_display_errors
    },function () {
      if(that.props.editRecord){
        that.props.form.setFieldsValue({display_error_indexes:that.props.editRecord.display_errors.reduce((pre,item)=>{pre.push(item.index);return pre},[])})
      }
      // this.props.form.setFieldsValue({display_error_indexes:[]})
    })
  }
  render() {
    const {collector_types}=this.props
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
            <Form.Item label="名称"  {...formItemLayout}>
              {getFieldDecorator(`name`, {
                initialValue: this.props.editRecord ? this.props.editRecord.name : '',
                rules: [{required: true, message: '请输入名称'}],
              })(
                <Input />
              )}
            </Form.Item>
            <FormItem
              required={true}
              label='采集器'
              {...formItemLayout}
            >
              {getFieldDecorator('collector', {
                initialValue:  '',
              })(
                <Select  disabled={Boolean(this.props.editRecord)} showSearch onChange={this.changeCollector} >
                  { this.state.collectors.map(item => <Option key={item.id} value={item.number}>{item.number}/{item.name}</Option>) }
                </Select>
              )}
            </FormItem>
            <FormItem
              required={true}
              label='种类'
              {...formItemLayout}
            >
              {getFieldDecorator('parameters', {
                initialValue: '',
              })(
                <Select  disabled={Boolean(this.props.editRecord)} onChange={this.changeNumber} >
                  { this.state.parameters.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>
            <FormItem
              required={true}
              label='显示故障项'
              {...formItemLayout}
            >
              {getFieldDecorator('display_error_indexes', {
                initialValue:[],
              })(
                <Select mode="multiple">
                  { this.state.sensors.map(item => <Option key={item.index} value={item.index}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>
          </Form>

      </div>
    );
  }
}

export default SearchList
