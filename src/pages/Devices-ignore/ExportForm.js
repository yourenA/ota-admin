/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Checkbox, TreeSelect,DatePicker } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const CheckboxGroup = Checkbox.Group;
import moment from 'moment'
@connect(state => ({
  sider_regions: state.sider_regions,
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }
  renderTreeNodes=(data)=>{
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return  <TreeNode value={item.id}  title={item.name} key={item.id} />
    });
  }
  render() {
    const formItemLayoutWithLabel = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      }
    };
    const {getFieldDecorator} = this.props.form;
    const company_code = sessionStorage.getItem('company_code');

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
       <FormItem label='开始日期'
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('started_at', {
            initialValue: moment(),

          })(
            <DatePicker
              allowClear={false}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem label= '结束日期'
                  {...formItemLayoutWithLabel}>
          {getFieldDecorator('ended_at', {
            initialValue: moment(),
          })(
            <DatePicker
              allowClear={false}
              format="YYYY-MM-DD"
            />
          )}
        </FormItem>
        <FormItem  label= '传感器'
                   {...formItemLayoutWithLabel}>
          <Checkbox
            indeterminate={this.props.indeterminateExport}
            onChange={this.props.onCheckAllChangeExport}
            checked={this.props.checkAllExport}
          >
            选择全部
          </Checkbox>
          <br />
          <CheckboxGroup options={this.props.options} value={this.props.sensors_numbers_export} onChange={this.props.onChangeExport} />
        </FormItem>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
