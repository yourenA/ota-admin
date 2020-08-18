/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form,  Input} from 'antd';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi/locale';
const FormItem = Form.Item;
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const {getFieldDecorator,} = this.props.form;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayoutWithLabel}
          label={<FormattedMessage
            id="app.login.oldPassword"
          />}
        >
          {getFieldDecorator('old_password', {
          })(
            <Input  type='password'/>
          )}
        </FormItem>
        <FormItem
          label={
            <FormattedMessage
              id="app.login.newPassword"
            />
          }
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('new_password', {
          })(
            <Input  type='password' />
          )}
        </FormItem>
        <FormItem
          label={
            <FormattedMessage
              id="app.login.repeatPassword"
            />
          }
          {...formItemLayoutWithLabel}
        >
          {getFieldDecorator('new_password_confirmation', {
          })(
            <Input type='password'/>
          )}
        </FormItem>
      </Form>
    </div>
    );
  }
}

const EditPasswordFormWrap = Form.create()(EditPassword);
export default connect()(EditPasswordFormWrap);
