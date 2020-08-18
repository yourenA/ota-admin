import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Select, Divider, Radio,Collapse} from 'antd';
import styles from './style.less';
import {converDevicesInfo} from '@/utils/utils';
const Panel = Collapse.Panel;
const {TextArea} = Input;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};
let uuid=1
@Form.create()
class Step1 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uuid=this.props.stepData.sensors?this.props.stepData.sensors.length-1:0;
    this.state = {
      sensorsArr: [],
      sensorsActiveKey:[]
    }
  }

  changeMeterPanel=(keys)=>{
    console.log('keys',keys)
    this.setState({
      sensorsActiveKey:keys
    })
  }
  addMeter=()=>{
    this.uuid++;
    this.state.sensorsArr.push(this.uuid)
    this.state.sensorsActiveKey.push(this.uuid.toString())
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.uuid);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      sensorsArr:[...this.state.sensorsArr],
      sensorsActiveKey:[...this.state.sensorsActiveKey]
    })
  }
  deleteMeter=(item)=>{
    console.log('删除的item',item)
    // const index=this.state.sensorsArr.indexOf(item);
    // console.log('index',index)
    // this.state.sensorsArr.splice(index, 1);
    // this.setState({
    //   sensorsArr:[...this.state.sensorsArr]
    // })
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== item),
    });
  }
  render() {
    const {form, dispatch, data} = this.props;
    const {getFieldDecorator, validateFields,getFieldValue} = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          console.log('values',values)
          const data=converDevicesInfo(values)
          this.props.setStepData({...this.props.stepData, sensors:data.sensorsArr},2)
          // this.props.setStep(2)
        }
      });
    };
    const onPrev = () => {
      this.props.setStep(0)
    };
    const keysArr=[]
    for(let k in this.props.stepData.sensors||[]){
      keysArr.push(parseInt(k))
    }
    getFieldDecorator('keys', {initialValue: keysArr});
    const keys = getFieldValue('keys');
    const meterForms=keys.map((item,index)=>{
      return (
        <Panel  showArrow={false}
               header={<div>传感器-{index+1}  <Button onClick={(e)=>{e.stopPropagation();this.deleteMeter(item)}}
                                                  size="small" style={{float:'right',marginRight:'10px'}} type="danger">删除</Button>  </div>}
               key={item.toString()} >
            <Form.Item {...formItemLayout} label="传感器编号">
              {getFieldDecorator(`number#${item}`, {
                initialValue: this.props.stepData.sensors ? this.props.stepData.sensors[index]?this.props.stepData.sensors[index].number:'' : '',
                rules: [{required: true, message: '请输入传感器编号'}],
              })(
                <Input />
              )}
            </Form.Item>
          <Form.Item {...formItemLayout} label="传感器名称">
            {getFieldDecorator(`name#${item}`, {
              initialValue: this.props.stepData.sensors ? this.props.stepData.sensors[index]?this.props.stepData.sensors[index].name:'' : '',
              rules: [{required: true, message: '请输入传感器名称'}],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="数据单位">
            {getFieldDecorator(`data_unit#${item}`, {
              initialValue: this.props.stepData.sensors ? this.props.stepData.sensors[index]?this.props.stepData.sensors[index].data_unit:'' : '',
              rules: [{required: true, message: '请输入数据单位'}],
            })(
              <Input />
            )}
          </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="传感器数据类型"
            >
              {getFieldDecorator(`data_type#${item}`, {
                initialValue: this.props.stepData.sensors ? this.props.stepData.sensors[index]?String(this.props.stepData.sensors[index].data_type) : '1' : '1',
              })(
                <Radio.Group>
                  <Radio value="1">整型</Radio>
                  <Radio value="2">浮点型</Radio>
                  <Radio value="3">字符型</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="是否可控"
          >
            {getFieldDecorator(`is_controllable#${item}`, {
              initialValue: this.props.stepData.sensors ? this.props.stepData.sensors[index]?String(this.props.stepData.sensors[index].is_controllable) : '1' : '1',
            })(
              <Radio.Group>
                <Radio value="1">是</Radio>
                <Radio value="-1">否</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Panel>
      )
    })
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Collapse activeKey={this.state.sensorsActiveKey} onChange={this.changeMeterPanel}>
            {meterForms}

          </Collapse>
          <Button type="primary" block onClick={this.addMeter}>添加传感器</Button>

          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
            }}
            label=""
          >
            <div style={{margin:'16px auto',textAlign:'center'}}>
            <Button onClick={()=>{this.props.hideContent()}}>取消</Button>
            <Button onClick={onPrev}  style={{marginLeft:'16px'}}>
              上一步
            </Button>
            <Button type="primary" onClick={onValidateForm}  style={{ marginLeft: 16 }}>
              下一步
            </Button>
              </div>
          </Form.Item>
        </Form>
        <Divider style={{margin: '40px 0 24px'}}/>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>传感器编号只能由字母、数字和下划线组成</h4>
        </div>
      </Fragment>
    );
  }
}

export default Step1;
