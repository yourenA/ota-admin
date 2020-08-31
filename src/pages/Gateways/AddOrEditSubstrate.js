/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input, Radio, Select, DatePicker, TreeSelect} from 'antd';
import {connect} from 'dva';
import moment from 'moment'
const Option = Select.Option;
import request from '@/utils/request';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
@connect(({roles}) => ({
  roles
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustom: false,
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
               序列号
            </span>
            )}
          >
            {getFieldDecorator('serial_number', {
              initialValue: this.props.editRecord ? this.props.editRecord.serial_number : '',
              rules: [{required: true}],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
               RTU基板类型
            </span>
            )}
          >
            {getFieldDecorator('substrate_type_id', {
              initialValue: this.props.editRecord ? this.props.editRecord.substrate_type.id : '',
              rules: [{required: true}],
            })(
             <Select>
               {this.state.data.map((item,index)=>{
                 return <Option key={index} value={item.id}>{item.name}</Option>
               })}
             </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayoutWithLabel}
            label={(
              <span>
               批次
            </span>
            )}
          >
            {getFieldDecorator('batch', {
              initialValue: this.props.editRecord ? this.props.editRecord.batch : '',
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


