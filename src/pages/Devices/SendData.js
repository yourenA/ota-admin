import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from "@/utils/request";
import {Card, Button, Select, Alert, Form, Steps, Modal, message, Drawer, Badge} from 'antd';
const Option = Select.Option;

const {Step} = Steps;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};
@connect(({devices, loading}) => ({
  devices,
}))
@Form.create()
class Devices extends PureComponent {
  state = {
    data: [],
    jsonStatus: 'success'
  };
  hideContent = ()=> {
  }

  componentDidMount() {
    const container = document.getElementById('jsoneditor');
    const options = {
      mode: 'code',
      modes: ['code', 'text'], // allowed modes
      onChange: this.handleChange,
      onError: function (err) {
      },
      onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      }
    };
    this.editor = new window.JSONEditor(container, options, this.state.data);
  }

  handleChange = () => {
    try {
      console.log("this.editor.get()", this.editor.get());
      this.setState({
        jsonStatus: 'success',
        data: this.editor.get()
      })
    } catch (e) {
      // HACK! This should propagate the error somehow
      // console.error(e);
      this.setState({
        jsonStatus: 'error',
      })
    }
  }
  sedData = ()=> {
    if (this.state.jsonStatus === 'error') {
      return
    }
    console.log(this.state.data)
    const {form} = this.props;
    const {validateFields} = form;
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values)
        request(`/devices/${this.props.data.id}/messages`, {
          method: 'POST',
          data: {
            ...values,
            message:JSON.stringify(this.state.data)
          }
        }).then((response)=> {
          console.log(response);
          if(response.status===200){
            message.success('发送数据成功')
          }
        })
        // this.props.setStep(3)
      }
    });
  }

  render() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Card bordered={false} style={{margin: '-16px -16px 0'}}>
        <Form layout="horizontal">
          <Form.Item {...formItemLayout} label="主题">
            {getFieldDecorator('topic', {
              initialValue: '',
              rules: [{required: true, message: '请选择主题'}],
            })(
              <Select  >
                { this.props.data.topics&&this.props.data.topics.filter((item)=>item.allow_publish == 1).map((item, key) => {
                  return (
                    <Option key={item.name} value={item.name.toString()}>{item.name}</Option>
                  )
                }) }
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="内容">
            <Alert message="请输入正确的JSON字符串" type={this.state.jsonStatus}/>
            <div
              id='jsoneditor'
              ref={(ref) => {
                this.editorRef = ref;
              }}
              style={{height: '500px', width: '100%'}}
            />
          </Form.Item>
          <Form.Item {...formItemLayout} label=" ">
            <Button type='primary' block onClick={this.sedData}>发送</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default Devices;
