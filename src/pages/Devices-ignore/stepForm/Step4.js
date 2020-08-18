import React, {Fragment} from 'react';
import {Button, Row, message, Divider,Modal } from 'antd';
import { connect } from 'dva';
import Result from '@/components/Result';
import styles from './style.less';
import DescriptionList from '@/components/DescriptionList';
import {converDevicesInfo} from '@/utils/utils';
const { Description } = DescriptionList;
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
      type: 'devices/add',
      payload: {...stepData},
      callback: ()=> {
        message.success('新建设备成功');
        this.props.hideContent();
        this.props.handleSearch({
          page: this.props.page,
          number:  this.props.number,
          name:  this.props.name,
          per_page: this.props.per_page,
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
    console.log('data',data)
    const onPrev = () => {
      this.props.setStep(1)
    };
    const information = (
      <div className={styles.information}>
        <Divider >设备信息</Divider>
        <div style={{marginTop:'10px'}}></div>
        <DescriptionList size="small" col="2">
          <Description term="设备编号">  {data.number}</Description>
          <Description term="设备名称"> {data.name}</Description>
          <Description term="协议"> {data.name}</Description>
          <Description term="备注"> {data.remark}</Description>
        </DescriptionList>
        <div style={{marginTop:'10px'}}></div>
        <Divider >传感器信息</Divider>
        <div style={{marginTop:'10px'}}></div>
        {
          data.sensors.map((item,index)=>{
            let data_type=''
            switch (item.data_type){
              case '1':
                data_type='整型';
                    break;
              case '2':
                data_type='浮点型';
                break;
              case '3':
                data_type='字符型';
                break;
            }
            return <div key={index} style={{margin:'10px',paddingBottom:'10px',borderBottom:'1px solid #cccc'}}>
              <DescriptionList size="small" col="2">
                <Description term="传感器编号">  {item.number}</Description>
                <Description term="传感器名称"> {item.name}</Description>
                <Description term="数据单位"> {item.data_unit}</Description>
                <Description term="数据类型">   {data_type}</Description>
                <Description term="是否可控">   {item.is_controllable==='1'?'是':'否'}</Description>
              </DescriptionList>
            </div>
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
