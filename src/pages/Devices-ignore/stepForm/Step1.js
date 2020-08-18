import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider,Radio } from 'antd';
import router from 'umi/router';
import styles from './style.less';
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, stepData } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          this.props.setStepData({...this.props.stepData,...values},1)
          // this.props.setStep(1)
        }
      });
    };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="设备编号">
            {getFieldDecorator('number', {
              initialValue: stepData?stepData.number:'',
              rules: [{ required: true, message: '请输入设备编号' }],
            })(
              <Input disabled={stepData.id?true:false}/>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="设备名称">
            {getFieldDecorator('name', {
              initialValue: stepData?stepData.name:'',
              rules: [{ required: true, message: '请输入设备编号' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="协议">
            {getFieldDecorator('protocol', {
              initialValue: stepData?stepData.protocol:'MQTT',
              rules: [{ required: true, message: '请选择协议' }],
            })(
              <Radio.Group>
                <Radio value="MQTT">MQTT</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              initialValue: stepData?stepData.remark:'',
            })(
              <TextArea rows={4} />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <div style={{margin:'16px auto',textAlign:'center'}}>

              <Button onClick={()=>{this.props.hideContent()}}>取消</Button>
              <Button type="primary" style={{marginLeft:'16px'}} onClick={onValidateForm}>
                下一步
              </Button>
            </div>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
       {/* <div className={styles.desc}>
          <h3>说明</h3>
          <h4>设备编号 必须介于 6 - 30 个字符之间</h4>
        </div>*/}
      </Fragment>
    );
  }
}

export default Step1;
