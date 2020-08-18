/**
 * Created by Administrator on 2017/3/21.
 */
import React, {Component} from 'react';
import {Form, Input,  Radio, Select,Transfer, } from 'antd';
import {connect} from 'dva';
import request from '@/utils/request';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
@connect(({sensors,view_templates}) => ({
  sensors,
  view_templates
}))
class AddPoliciesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels:[]
    };
  }
  componentDidMount() {
    const that = this;
    const {dispatch} = this.props;
    // dispatch({
    //   type: 'view_templates/fetch',
    //   payload: {
    //   },
    // });
    this.fetchCurrent()
    if( this.props.editRecord){
      // this.handleChangeViewTemplate(this.props.editRecord.view_template_id)
    }
  }
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.props.handleChange(nextTargetKeys);

  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.props.handleSelectChange(sourceSelectedKeys, targetSelectedKeys) ;
  }
  fetchCurrent = ()=> {
    const that = this;
    request(`/device_types/${this.props.history.location.query.id}`, {
      params: {
        include: 'channels',
      },
      method: 'GET',
    }).then((response)=> {

      if (response.status === 200) {
        that.setState({
          channels: response.data.data.channels.filter(o=>o.is_hidden!==1),
        }, function () {
        })
      }
    })
  }
  // handleChangeViewTemplate=(value)=>{
  //   console.log(value)
  //   const that=this;
  //   request(`/view_optional_channels`,{
  //     params:{
  //       device_type_id:that.props.history.location.query.id,
  //       view_template_id:value
  //     },
  //     method:'GET',
  //   }).then((response)=>{
  //     if(response.status===200){
  //       that.setState({
  //         channels:response.data.data
  //       })
  //     }
  //
  //   });
  // }
  render() {
    const {
      view_templates: {data},
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
            dataSource={this.state.channels}
            titles={['可选传感器', '已选传感器']}
            targetKeys={this.props.targetKeys}
            selectedKeys={this.props.selectedKeys}
            onChange={this.handleChange}
            onSelectChange={this.handleSelectChange}
            rowKey={record => record.number}
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
