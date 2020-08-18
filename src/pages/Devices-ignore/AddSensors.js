import React, {Component,Fragment} from 'react';
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
        })
      }
    });
  }
  changeCollector=(value)=>{
    const that = this;
    const findResult=find(this.state.collectors,function (o) {
      return o.number===value
    })
    this.props.form.setFieldsValue({parameters:[]})
    request(`/collectors/${findResult.id}/parameters`,{
      method:'GET',
      params:{
        return:'all'
      }
    }).then(function (response) {
      if(response.status===200){
        let parameters=[]
        if(response.data.data.sensor){
          parameters=parameters.concat(response.data.data.sensor)
        }
        console.log('parameters',parameters)
        that.setState({
          parameters
        })
      }
    });
  }
  changeNumber=(number)=>{
    const findSensor=find(this.state.parameters,(o)=>{
      return o.id===number
    })
    console.log('findSensor',findSensor)
    this.setState({
      sensors:findSensor.optional_models
    },function () {
      this.props.form.setFieldsValue({model_id:''})
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
            {
              !this.props.editRecord&&
                <Fragment>
                  <FormItem
                    required={true}
                    label='采集器'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('collector', {
                      initialValue:  '',
                    })(
                      <Select showSearch onChange={this.changeCollector} >
                        { this.state.collectors.map(item => <Option key={item.id} value={item.number}>{item.number}/{item.name}</Option>) }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    required={true}
                    label='通道'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('parameters', {
                      initialValue: [],
                    })(
                      <Select   onChange={this.changeNumber} >
                        { this.state.parameters.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    required={true}
                    label='型号'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('model_id', {
                      initialValue:this.props.editRecord ? this.props.editRecord.installed_sensor.id : '',
                    })(
                      <Select >
                        { this.state.sensors.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                      </Select>
                    )}
                  </FormItem>
                </Fragment>
            }

          </Form>

      </div>
    );
  }
}

export default SearchList
