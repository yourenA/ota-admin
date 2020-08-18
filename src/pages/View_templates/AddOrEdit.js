import React, { Component } from 'react';
import { connect } from 'dva';
import request from '@/utils/request';
import { PageHeader,Input ,Icon ,Form,Card,Button,Select,Row,message} from 'antd';
const { Option } = Select;
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state={
      id : 0,
      optional_data_units:[]
    }
  }
  componentDidMount() {
    const that=this;
    if(this.props.history.location.query.id==='add'){
      return false
    }
    request(`/view_templates/${this.props.history.location.query.id}`,{
      method:'GET',
    }).then((response)=>{
      that.props.form.setFieldsValue({name:response.data.data.name})
      that.setState({
        id:response.data.data.optional_data_units.length,
        optional_data_units:response.data.data.optional_data_units
      })
    });
  }
  remove = (k) => {
    console.log(k)
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    console.log('keys',keys)
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.state.id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (true) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        // console.log('Merged values:', keys.map(key => names[key]));
        const that = this;
        let optional_data_units=[]
        if(!values.units){
          message.error('列不能为空')
          return false
        }
        for(let i=0;i<values.units.length;i++){
          optional_data_units.push(values.units[i])
        }
        console.log('optional_data_units',optional_data_units)
        this.props.dispatch({
          type: this.props.history.location.query.id==='add'?'view_templates/add':'view_templates/edit',
          payload: {
            id:this.props.history.location.query.id,
            name:values.name,
            optional_data_units
            // template_id: formValues.template_id ? formValues.template_id.key : ''
          },
          callback: function () {
            message.success(that.props.history.location.query.id==='add'?'添加视图模板成功':'修改视图模板成功')
            that.props.history.goBack()
          }
        });
      }
    });
  }
  render() {

    const {getFieldDecorator,getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 15, offset: 7 },
      },

    };
    const formItemLayout2 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      }
    };
    const keysArr=[]
    for(let i=0;i<this.state.id;i++){
      keysArr.push(i)
    }
    getFieldDecorator('keys', { initialValue: keysArr });
    const keys = getFieldValue('keys');
    console.log('render keys',keys)
    const formUnitsItems= keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout2 : formItemLayoutWithOutLabel)}
        label={index === 0 ? '数据单位' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`units[${k}]`, {
          initialValue: this.state.optional_data_units[k] ? this.state.optional_data_units[k] : '',
          rules: [{
            rules: [{required: true, message: '数据单位不能为空'}],
          }],
        })(
          <Select placeholder="请选择单位"  style={{ width: '60%', marginRight: 8 }}>
            <Option value="mV">mV</Option>
            <Option value="V">V</Option>
            <Option value="mA">mA</Option>
            <Option value="A">A</Option>
            <Option value="Mpa">Mpa</Option>
            <Option value="Rpm">Rpm</Option>
            <Option value="W">W</Option>
            <Option value="">无单位</Option>
          </Select>
        //  <Input placeholder="输入单位" style={{ width: '60%', marginRight: 8 }} />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
/*    const formItems = keys.map((k, index) => {
      return (
      <Row gutter={12} key={k}>
        <Col span={11} >
        <Form.Item
          {...formItemLayout}
          label={'列名称'}
          required={true}

        >
          {getFieldDecorator(`names[${k}]`, {
            initialValue: this.state.columns[k] ? this.state.columns[k].name : '',
            rules: [{required: true, message: '列名称'}],
          })(
            <Input  />
          )}
        </Form.Item>
        </Col>
        <Col span={11} >
        <Form.Item
          {...formItemLayout}
          label={'列别名'}
          required={true}
          key={k}
        >
          {getFieldDecorator(`alias[${k}]`, {
            initialValue: this.state.columns[k] ? this.state.columns[k].alias : '',
            rules: [{required: true, message: '列别名'}],
          })(
            <Input  />
          )}
        </Form.Item>
        </Col>
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Row>

    )});*/
    return (
      <div>
      <PageHeader
        style={{ margin: '-24px -24px 0' }}
        onBack={() => this.props.history.goBack()}
        title={this.name}
      />
        <Card bordered={false} style={{marginTop: '24px'}}>
          <Form onSubmit={this.handleSubmit} style={{maxWidth:'350px',margin:'0 auto'}}>
            <Form.Item {...formItemLayout2} label="视图模板名称">
              {getFieldDecorator(`name`, {
                initialValue: '' ,
                rules: [{required: true, message: '请输入视图模板名称'}],
              })(
                <Input />
              )}
            </Form.Item>
            {formUnitsItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加数据单位
              </Button>
            </Form.Item>
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="default" style={{marginRight:'24px'}} onClick={() => this.props.history.goBack()}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
        </Card>

        </div>
    );
  }
}

const SearchListForm = Form.create()(SearchList);
export default connect()(SearchListForm);
