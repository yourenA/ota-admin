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
class Step3 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.uuid=this.props.stepData.topics?this.props.stepData.topics.length-1:0;
    this.state = {

      topicsArr: [],
      topicsActiveKey:[]
    }
  }

  changeMeterPanel=(keys)=>{
    console.log('keys',keys)
    this.setState({
      topicsActiveKey:keys
    })
  }
  addMeter=()=>{
    this.uuid++;
    this.state.topicsArr.push(this.uuid)
    this.state.topicsActiveKey.push(this.uuid.toString())
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.uuid);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      topicsArr:[...this.state.topicsArr],
      topicsActiveKey:[...this.state.topicsActiveKey]
    })
  }
  deleteMeter=(item)=>{
    // console.log('删除的item',item)
    // const index=this.state.topicsArr.indexOf(item);
    // console.log('index',index)
    // this.state.topicsArr.splice(index, 1);
    // this.setState({
    //   topicsArr:[...this.state.topicsArr]
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
          this.props.setStepData({...this.props.stepData, topics:data.topicsArr},3)
          // this.props.setStep(3)
        }
      });
    };
    const onPrev = () => {
      this.props.setStep(1)
    };

    const keysArr=[]
    for(let k in this.props.stepData.topics||[]){
      keysArr.push(parseInt(k))
    }
    getFieldDecorator('keys', {initialValue: keysArr});
    const keys = getFieldValue('keys');
    const meterForms=keys.map((item,index)=>{
      return (
        <Panel  showArrow={false}
               header={<div>主题-{index+1}  <Button onClick={(e)=>{e.stopPropagation();this.deleteMeter(item)}}
                                                  size="small" style={{float:'right',marginRight:'10px'}} type="danger">删除</Button>  </div>}
               key={item.toString()} >
            <Form.Item {...formItemLayout} label="主题名称">
              {getFieldDecorator(`name&${item}`, {
                initialValue: this.props.stepData.topics ? this.props.stepData.topics[index]?this.props.stepData.topics[index].name:'' : '',
                rules: [{required: true, message: '请输入主题名称'}],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label="是否允许发布"
            >
              {getFieldDecorator(`allow_publish&${item}`, {
                initialValue: this.props.stepData.topics ? this.props.stepData.topics[index]?String(this.props.stepData.topics[index].allow_publish):'1' : '1',

              })(
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="-1">否</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="是否允许订阅"
          >
            {getFieldDecorator(`allow_subscribe&${item}`, {
              initialValue: this.props.stepData.topics ? this.props.stepData.topics[index]?String(this.props.stepData.topics[index].allow_subscribe):'1' : '1',

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
          <Collapse activeKey={this.state.topicsActiveKey} onChange={this.changeMeterPanel}>
            {meterForms}

          </Collapse>
          <Button type="primary" block onClick={this.addMeter}>添加主题信息</Button>

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
          <h4>主题名称 必须介于 6 - 40 个字符之间</h4>
        </div>
      </Fragment>
    );
  }
}

export default Step3;
