import React, {Fragment} from 'react';
import {Button, Row, Col, Divider,Modal } from 'antd';
import { connect } from 'dva';
import Result from '@/components/Result';
import styles from './style.less';
import {converDevicesInfo} from '@/utils/utils';
@connect(({ devices, loading }) => ({
  devices,
}))
class Step3 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }
  onFinish=()=>{
    const {dispatch} = this.props;
    const that=this;
    const {stepData} = this.props;
    dispatch({
      type: stepData.id?'devices/edit':'devices/add',
      payload: {...stepData},
      callback: ()=> {
        that.setState({
          visible: true,
        })
      }
    });
  }
  handleDone = () => {
    const that=this;
    this.setState({
      visible: false,
    }, function () {
      that.props.hideContent()
    });
  };
  render() {
    const {stepData:data} = this.props;
    // const data=converDevicesInfo(stepData)
    // const onFinish = () => {
    //   router.push('/form/step-form/info');
    // };
    const onPrev = () => {
      this.props.setStep(2)
    };
    const information = (
      <div className={styles.information}>
        { this.props.hideAction===true && <Row>
          <Col xs={12} sm={3} className={styles.label}>
            用户名：
          </Col>
          <Col xs={12} sm={5}  style={{wordWrap:'break-word'}}>
            {data.username}
          </Col>
          <Col xs={12} sm={3} className={styles.label}>
            密钥：
          </Col>
          <Col xs={12} sm={10}>
            {data.password}
          </Col>
        </Row>}
        <Divider >设备信息</Divider>
        <Row>
          <Col xs={12} sm={3} className={styles.label}>
            设备编号：
          </Col>
          <Col xs={12} sm={4}>
            {data.number}
          </Col>
            <Col xs={12} sm={4} className={styles.label}>
            设备别名：
          </Col>
          <Col xs={12} sm={4}>
            {data.alias}
          </Col>
          <Col xs={12} sm={3} className={styles.label}>
            设备备注：
          </Col>
          <Col xs={12} sm={4}>
            {data.remark}
          </Col>
        </Row>
        <Divider>传感器信息</Divider>
        {
          data.sensors.map((item,index)=>{
            return <Fragment key={index}>
              <Row>
                <Col xs={12} sm={3} className={styles.label}>
                  传感器编号：
                </Col>
                <Col xs={12} sm={4}>
                  {item.number}
                </Col>
                <Col xs={12} sm={4} className={styles.label}>
                  传感器别名：
                </Col>
                <Col xs={12} sm={4}>
                  {item.alias}
                </Col>
                <Col xs={12} sm={3} className={styles.label}>
                  数据类型：
                </Col>
                <Col xs={12} sm={4}>
                  {item.data_type==='1'?'整型':'浮点型'}
                </Col>
                <Col xs={12} sm={3} className={styles.label}>
                  备注：
                </Col>
                <Col xs={12} sm={4}>
                  {item.remark}
                </Col>
              </Row>
            </Fragment>
          })
        }
        <Divider >主题信息</Divider>
        {
          data.topics.map((item,index)=>{
            return <Fragment key={index}>
              <Row>
                <Col xs={12} sm={3} className={styles.label}>
                  主题名称：
                </Col>
                <Col xs={12} sm={4} style={{wordWrap:'break-word'}}>
                  {item.name}
                </Col>
                <Col xs={12} sm={4} className={styles.label}>
                  是否允许发布：
                </Col>
                <Col xs={12} sm={4}>
                  {item.allow_publish==='1'?'是':'否'}
                </Col>
                <Col xs={12} sm={3} className={styles.label}>
                  是否允许订阅：
                </Col>
                <Col xs={12} sm={4}>
                  {item.allow_subscribe==='1'?'是':'否'}
                </Col>
              </Row>
            </Fragment>
          })
        }
      </div>
    );
    const actions = (
      <div style={{margin:'16px auto',textAlign:'center'}}>

        <Button onClick={()=>{this.props.hideContent()}}>取消</Button>
        <Button style={{marginLeft:'16px'}} onClick={onPrev}>上一步</Button>
        <Button type="primary" onClick={this.onFinish} style={{marginLeft:'16px'}}>
          提交
        </Button>
      </div>
    );
    const modalFooter = {footer: null, onCancel: this.handleDone}
    return (
      <div className={styles.result}>
        {information}
        { this.props.hideAction!==true && actions}
        <Modal
          title={ null }
          width={640}
          bodyStyle={{padding: '72px 0'}}
          destroyOnClose
          visible={this.state.visible}
          {...modalFooter}
        >
          <Result
            type="success"
            title={`${data.id ? '修改' : '添加'}设备成功`}
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        </Modal>
      </div>
    );
  }
}

export default Step3;
