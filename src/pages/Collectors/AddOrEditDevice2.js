import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {PageHeader, Input, Table, Form, Card, Button, Col, Select, message, Row,Tooltip,Badge} from 'antd';
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
      channels: [],
      editChannels:{}
    }
  }

  componentDidMount() {

    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'collector_types/fetch',
      payload: {
      },
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
            <Form.Item label="编号" {...formItemLayout}>
              {getFieldDecorator(`number`, {
                initialValue:this.props.editRecord ? this.props.editRecord.number : '',
                rules: [{required: true, message: '请输入编号'}],
              })(
                <Input disabled={this.props.editRecord?true:false}/>

              )}
            </Form.Item>
            <Form.Item label="名称"  {...formItemLayout}>
              {getFieldDecorator(`name`, {
                initialValue: this.props.editRecord ? this.props.editRecord.name : '',
                rules: [{required: true, message: '请输入名称'}],
              })(
                <Input />
              )}
            </Form.Item>
            <FormItem
              required={true}
              label='类型'
              {...formItemLayout}
            >
              {getFieldDecorator('collector_type_id', {
                initialValue: this.props.editRecord ? this.props.editRecord.collector_type_id : '',
              })(
                <Select onChange={this.changeType}  disabled={this.props.editRecord?true:false}>
                  { collector_types.data.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>

            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator(`remark`, {
                initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
              })(
                <TextArea rows={2} />
              )}
            </Form.Item>
          </Form>

      </div>
    );
  }
}

export default SearchList
