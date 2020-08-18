/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import { Form, Input, Radio, Select, InputNumber, notification } from 'antd';
import {connect} from 'dva';
import request from '@/utils/request';
const FormItem = Form.Item;
const { TextArea } = Input;
const {Option} = Select
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }
  componentDidMount() {
    request(`/all_firmwares`, {
      method: 'GET',
      params:{
        order_direction:'desc'
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        this.setState({
          data:response.data.data
        })
      }
    })
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
        <Form.Item label={'选择固件'} {...formItemLayout}>
          {getFieldDecorator(`firmware_id`, {
          })(
            <Select>
              {
                this.state.data.map(function(item,index) {
                  return <Option key={index} value={item.id}>{item.version} ({item.guid})</Option>
                })
              }

            </Select>
          )}
        </Form.Item>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
