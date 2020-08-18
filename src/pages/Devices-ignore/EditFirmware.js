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
        <Form.Item label={'GUID'} {...formItemLayout}>
          {getFieldDecorator(`guid`, {
            rules: [{required: true, message: '请输入GUID'}],
            initialValue: this.props.editRecord ? this.props.editRecord.guid : '',
          })(
            <Input disabled/>
          )}
        </Form.Item>
        <Form.Item label={'版本'} {...formItemLayout}>
          {getFieldDecorator(`version`, {
            rules: [{required: true, message: '请输入版本'}],
            initialValue: this.props.editRecord ? this.props.editRecord.version : '',
          })(
            <Input disabled/>
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
