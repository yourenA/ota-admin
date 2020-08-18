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
    this.fetchOptionChannel(this.props.collector_id)
  }
  fetchOptionChannel=(collector_id)=>{
    const that=this;
    request(`/collectors/${collector_id}/appendable_indexes`, {
      params:{
        type:'sensor'
      },
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        // const optionChannel=differenceBy(response.data.data.channels,that.props.channels,'number')
        // console.log('optionChannel',optionChannel)
        that.setState({
          optionChannel:response.data.data
        })
      }
    });
  }
  changeNumber=(number)=>{
    const findSensor=find(this.state.optionChannel,(o)=>{
      return o.index===number
    })
    console.log('findSensor',findSensor)
    this.setState({
      sensors:findSensor.optional_models
    },function () {
      this.props.form.setFieldsValue({model_id:''})
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
              label='通道序号'
              {...formItemLayout}
            >
              {getFieldDecorator('index', {
                initialValue:this.props.editRecord ? this.props.editRecord.index : '',
              })(
                <Select onChange={this.changeNumber}   disabled={this.props.editRecord?true:false}>
                  { this.state.optionChannel.map(item => <Option key={item.index} value={item.index}>{item.index}</Option>) }
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
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator(`remark`, {
                initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
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
