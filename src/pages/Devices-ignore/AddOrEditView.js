/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Transfer, } from 'antd';
import {connect} from 'dva';
import request from '@/utils/request';
import  find from 'lodash/find'
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@connect(({device_parameters,view_templates}) => ({
  device_parameters,
  view_templates
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels:[],
      collectors:[],
      parameters:[]
    };
  }
  componentDidMount() {
    const that = this;

    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'device_parameters/fetch',
    //   payload: {
    //     device_id:this.props.history.location.query.id,
    //   },
    // });

    // request(`/collectors`,{
    //   method:'GET',
    //   params:{
    //     return:'all'
    //   }
    // }).then(function (response) {
    //   if(response.status===200){
    //     that.setState({
    //       collectors:response.data.data
    //     })
    //   }
    // });
    console.log('this.props.editRecord',this.props.editRecord)
    this.changeCollector()
    if(this.props.editRecord&&this.props.editRecord.parameters.length>0){

      // this.props.form.setFieldsValue({collector:this.props.editRecord.parameters[0].collector_id})
      // this.changeCollector(this.props.editRecord.parameters[0].collector_id)
    }

  }
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.props.handleChange(nextTargetKeys);

  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.props.handleSelectChange(sourceSelectedKeys, targetSelectedKeys) ;
  }

  changeCollector=(value)=>{
    const that = this;
    request(`/devices/${this.props.history.location.query.id}/parameters`,{
      method:'GET',
      params:{
        // collector_id:value,
        types:['double_ball_valve','electric_valve','generator','sensor','water_meter']
      }
    }).then(function (response) {
      if(response.status===200){
        that.setState({
          parameters:response.data.data
        })
      }
    });

  }

  render() {
    const {
      device_parameters: {data},
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      }
    };

    const {getFieldDecorator} = this.props.form;
    const {targetKeys, selectedKeys} = this.state;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="视图名称"  required={true}>
          {getFieldDecorator(`name`, {
            initialValue: this.props.editRecord ? this.props.editRecord.name:'' ,
          })(
            <Input />
          )}
        </Form.Item>
       {/* <FormItem
          required={true}
          label='采集器'
          {...formItemLayout}
        >
          {getFieldDecorator('collector', {
            initialValue:  '',
          })(
            <Select showSearch onChange={this.changeCollector} >
              { this.state.collectors.map(item => <Option key={item.id} value={item.id}>{item.number}</Option>) }
            </Select>
          )}
        </FormItem>*/}
     {/*   <FormItem
          required={true}
          label='视图模板'
          {...formItemLayout}
        >
          {getFieldDecorator('view_template_id', {
            initialValue: this.props.editRecord?this.props.editRecord.view_template_id:'',
          })(
            <Select onChange={this.handleChangeViewTemplate} >
              { data.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>) }
            </Select>
          )}
        </FormItem>*/}
        <Form.Item {...formItemLayout} label="传感器"
                   required={true}
        >
          <Transfer
            dataSource={this.state.parameters}
            titles={['可选参数', '已选参数']}
            targetKeys={this.props.targetKeys}
            selectedKeys={this.props.selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            rowKey={record => record.id}
            render={item => {
              return `${item.name}(${item.data_unit})`
            }}
          />
        </Form.Item>
      </Form>
    </div>
    );
  }
}

const AddPoliciesFormWrap = Form.create()(AddPoliciesForm);
export default connect()(AddPoliciesFormWrap);
