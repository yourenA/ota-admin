/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, Switch, TreeSelect} from 'antd';
import {connect} from 'dva';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const {SHOW_PARENT} = TreeSelect;
@connect(({roles}) => ({
  roles
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustom: false
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
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

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
               名称
            </span>
            )}
          >
            {getFieldDecorator('name', {
              initialValue: this.props.editRecord ? this.props.editRecord.name : '',
              rules: [{required: true,message:'名称不能为空'}],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            extra="产品代码格式 x.x.x"
            label={(
              <span>
               产品代码
            </span>
            )}
          >
            {getFieldDecorator('product_code', {
              initialValue: this.props.editRecord ? this.props.editRecord.product_code : '',
              rules: [{required: true,message:'产品代码不能为空'}],

            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
               备注
            </span>
            )}
          >
            {getFieldDecorator('remark', {
              initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);


