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
      parameters:[]
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
        if(response.data.data.valve){
          parameters=parameters.concat(response.data.data.valve)
        }
        console.log('parameters',parameters)
        that.props.form.setFieldsValue({increment_valve_id:'',decrement_valve_id:''})
        that.setState({
          parameters
        })
      }
    });
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
                  {getFieldDecorator('collector_id', {
                    initialValue:  '',
                  })(
                    <Select showSearch  >
                      { this.state.collectors.map(item => <Option key={item.id} value={item.id}>{item.number}/{item.name}</Option>) }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  required={true}
                  label='序号'
                  {...formItemLayout}
                >
                  {getFieldDecorator('index', {
                    initialValue:  '1',
                  })(
                    <Select  >
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                    </Select>
                  )}
                </FormItem>

              </Fragment>
            }


       {/*     <FormItem
              required={true}
              label='增压球阀'
              {...formItemLayout}
            >
              {getFieldDecorator('increment_valve_id', {
                initialValue: '',
              })(
                <Select  >
                  { this.state.parameters.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>
            <FormItem
              required={true}
              label='减压球阀'
              {...formItemLayout}
            >
              {getFieldDecorator('decrement_valve_id', {
                initialValue: '',
              })(
                <Select  >
                  { this.state.parameters.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>*/}
          </Form>

      </div>
    );
  }
}

export default SearchList
