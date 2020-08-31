/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber, } from 'antd';
import {connect} from 'dva';
const Option = Select.Option;
import request from '@/utils/request';
const FormItem = Form.Item;
const { TextArea } = Input;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }
  componentDidMount() {
    const that = this;
    request(`/all_substrate_types`,{
      method:'GET',
      params:{
        order_direction:'desc'
      }
    }).then((response)=>{
      if(response.status===200){
        that.setState({
          data:response.data.data
        })
      }
    });
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label={'版本'} {...formItemLayout}>
          {getFieldDecorator(`version`, {
            rules: [{required: true, message: '请输入版本'}],
            initialValue: this.props.editRecord ? this.props.editRecord.version : '',
          })(
            <Input disabled/>
          )}
        </Form.Item>
        <Form.Item label={'GUID'} {...formItemLayout}>
          {getFieldDecorator(`guid`, {
            rules: [{required: true, message: '请输入GUID'}],
            initialValue: this.props.editRecord ? this.props.editRecord.guid : '',
          })(
            <Input disabled/>
          )}
        </Form.Item>
        <Form.Item label={'状态'} {...formItemLayout}>
          {getFieldDecorator(`status`, {
            rules: [{required: true, message: '请选择状态'}],
            initialValue: this.props.editRecord.status.toString(),
          })(
            <Select>
              <Option value={'1'}>启用</Option>
              <Option value={'-1'}>停用</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={'适用的RTU基板型号'} {...formItemLayout}>
          {getFieldDecorator(`applicable_substrate_types`, {
            rules: [{required: true, message: '请选择基板型号'}],
            initialValue: this.props.editRecord.applicable_substrate_types.map((item,index)=>{
              return item.id
            }),
          })(
            <Select  mode="multiple" >
              {this.state.data.map((item,index)=>{
                return <Option key={index} value={item.id}>{item.name}/{item.product_code}</Option>
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item label={'描述'} {...formItemLayout}>
          {getFieldDecorator(`remark`, {
            initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
          })(
            <TextArea rows={4}/>
          )}
        </Form.Item>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
