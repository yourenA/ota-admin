/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,InputNumber, } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const { TextArea } = Input;
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
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
        <Form.Item {...formItemLayout} label="配置名称">
          {getFieldDecorator(`name`, {
            initialValue: this.props.editRecord ? this.props.editRecord.name:'' ,
            rules: [{required: true, message: '请输入传感器编号'}],
          })(
            <Input disabled={this.props.editRecord ? true:false }/>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="配置值">
          {getFieldDecorator(`value`, {
            initialValue: this.props.editRecord ? this.props.editRecord.value:'' ,
            rules: [{required: true, message: '请输入配置值'}],
          })(
            <Input />
          )}
        </Form.Item>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
