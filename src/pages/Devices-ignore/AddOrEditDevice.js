import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {PageHeader, Input, Table, Form, Card, Button, Col, Select, message, Row,Tooltip,Badge} from 'antd';
import styles from './TableList.less';
import findIndex from 'lodash/findIndex'
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea
@connect(({device_types, loading}) => ({
  device_types,
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
      type: 'device_types/fetch',
      payload: {
        include: 'channels',
      },
    });
    if( this.props.history.location.query.id !== 'add'){
      this.fetchCurrent()
    }
  }
  fetchCurrent=()=>{
    const that = this;
    request(`/devices/${this.props.history.location.query.id}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        that.props.form.setFieldsValue({
          name:response.data.data.name,
          number:response.data.data.number,
          remark:response.data.data.remark,
          device_type_id:response.data.data.device_type_id,
        })
        const editChannels=that.state.editChannels;
        for(let i=0;i<response.data.data.channels.length;i++){
          if(response.data.data.channels[i].is_editable===1){
            editChannels[response.data.data.channels[i].number]={};
            editChannels[response.data.data.channels[i].number].name=response.data.data.channels[i].name
            editChannels[response.data.data.channels[i].number].alias=response.data.data.channels[i].alias
            editChannels[response.data.data.channels[i].number].sensor_id=response.data.data.channels[i].installed_sensor?response.data.data.channels[i].installed_sensor.id:''
          }
        }
        console.log('editChannels',editChannels)
        that.setState({
          editChannels:editChannels,
          channels: response.data.data.channels
        })
      }
    })
  }
  changeType = (value)=> {
    console.log(`selected ${value}`);
    const that = this
    request(`/device_types/${value}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {

        const editChannels=that.state.editChannels;
        for(let i=0;i<response.data.data.channels.length;i++){
          if(response.data.data.channels[i].is_editable===1){
            editChannels[response.data.data.channels[i].number]={};
            editChannels[response.data.data.channels[i].number].name=response.data.data.channels[i].number
            editChannels[response.data.data.channels[i].number].alias=response.data.data.channels[i].number
          }
        }
        console.log('editChannels',editChannels)
        that.setState({
          editChannels:editChannels,
          channels: response.data.data.channels
        })
      }
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
    this.props.form.validateFields((err, values) => {
      if (true) {
        const {keys, names} = values;
        console.log('Received values of form: ', values);
        // console.log('Merged values:', keys.map(key => names[key]));
        const that = this;
        const editChannels=this.state.editChannels;
        let channels=[];
        for(let key  in editChannels){
          channels.push({
            number:key,
            name:editChannels[key].name,
            alias:editChannels[key].alias,
            sensor_id:editChannels[key].sensor_id?editChannels[key].sensor_id:'',
          })
        }
        console.log('channels',channels);
        this.props.dispatch({
          type: this.props.history.location.query.id === 'add' ? 'devices/add' : 'devices/edit',
          payload: {
            id: this.props.history.location.query.id,
            channels:channels,
            ...values,
            // template_id: formValues.template_id ? formValues.template_id.key : ''
          },
          callback: function () {
            const newDevice=that.props.history.location.query.id === 'add'
            message.success(newDevice? '添加设备成功' : '修改设备成功')
            if(newDevice){
              that.props.history.goBack()
            }else{
              that.fetchCurrent()
            }
            //
          }
        });
      }
    });
  }
  handleChange=(number,key,value)=>{
    let editChannels=this.state.editChannels;
    if(editChannels[number]){
      // console.log('已经存在')
      editChannels[number][key]=value
    }else{
      editChannels[number]={}
      editChannels[number][key]=value
    }
    // console.log('editChannels',editChannels)
    this.setState({
      editChannels
    })

  }
  render() {
    const {device_types}=this.props
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 18, offset: 8},
      },

    };
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 3},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const columns = [
      {
        title: '通道编号',
        dataIndex: 'number',
      },
      {
        title: '通道名称',
        dataIndex: 'name',
        render: (text, record) => {
          if(record.is_editable===1){
            return <Input defaultValue={text?text:record.number}  onChange={(e)=>this.handleChange(record.number,'name',e.target.value)}/>
          }else{
            return text
          }
        }
      },
      {
        title: '通道别名',
        dataIndex: 'alias',
        render: (text, record) => {
          if(record.is_editable===1){
            return <Input defaultValue={text?text:record.number}    onChange={(e)=>this.handleChange(record.number,'alias',e.target.value)}/>
          }else{
            return text
          }
        }
      },
      {
        title: '是否物理通道',
        dataIndex: 'is_physical',
        render:(text,record)=>{
          return text===-1?<div><Badge status="error" />否</div>:<div><Badge status="success" />是</div>
        }
      },
      {
        title: '已接入的传感器型号/名称',
        dataIndex: 'installed_sensor',
        render: (text, record) => {
          return  text?`${text.model}/${text.name}`:''
        }
      },
      {
        title: '可选传感器',
        dataIndex: 'optional_sensors',
        render: (text, record) => {
          if(record.is_editable===1){
             return <Select style={{width:'100px'}} defaultValue={record.installed_sensor?record.installed_sensor.id:''} onChange={(value)=>this.handleChange(record.number,'sensor_id',value)}>
              {
                text.map((item,index)=>{
                  return  <Option value={item.id} key={index}>{item.model}</Option>
                })
              }
            </Select>
          }else{
            return ''
          }
        }
      },
    ];
    return (
      <div>
        <PageHeader
          style={{margin: '-24px -24px 0'}}
          onBack={() => this.props.history.goBack()}
          title={this.name}
        />
        <Card bordered={false} style={{marginTop: '24px'}}>
          <Form  onSubmit={this.handleSubmit} className={styles.addForm}>
            <Form.Item label="设备编号" {...formItemLayout}>
              {getFieldDecorator(`number`, {
                initialValue: '',
                rules: [{required: true, message: '请输入设备编号'}],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="设备名称"  {...formItemLayout}>
              {getFieldDecorator(`name`, {
                initialValue: '',
                rules: [{required: true, message: '请输入设备名称'}],
              })(
                <Input />
              )}
            </Form.Item>
            <FormItem
              required={true}
              label='设备类型'
              {...formItemLayout}
            >
              {getFieldDecorator('device_type_id', {
                initialValue: this.props.editRecord ? this.props.editRecord.device_type_id : '',
              })(
                <Select onChange={this.changeType} >
                  { device_types.data.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
                </Select>
              )}
            </FormItem>

            <Table
              size='small'
              rowKey={'number'}
              dataSource={this.state.channels}
              columns={columns}
              pagination={false}
              style={{marginBottom:'16px'}}
            />
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator(`remark`, {
                initialValue: '',
              })(
                <TextArea rows={2} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="default" style={{marginRight: '24px'}}
                      onClick={() => this.props.history.goBack()}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
        </Card>

      </div>
    );
  }
}

export default SearchList
