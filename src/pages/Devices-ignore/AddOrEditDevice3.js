import React, {Component} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {
  PageHeader,
  Input,
  Table,
  Form,
  Card,
  Col,
  Select,
  message,
  Row,
  Tooltip,
  Badge,
  Breadcrumb,
  notification,InputNumber
} from 'antd';
import styles from './TableList.less';
import findIndex from 'lodash/findIndex'
import {formatMessage, FormattedMessage} from 'umi/locale';
import Button from '@material-ui/core/Button';
import Cleave from 'cleave.js/react';
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
      editChannels: {},
      EUICleave: null,
      EUIRawValue: '',
      KeyCleave: null,
      KeyRawValue: '',
    }
  }

  componentDidMount() {

  }

  onEUIRawValueChange = (event)=> {
    this.setState({EUIRawValue: event.target.rawValue});
  }

  onEUICleaveInit = (cleave)=> {
    const that = this
    this.setState({EUICleave: cleave}, function () {
      that.state.EUICleave.setRawValue('');
    })
  }
  onKeyRawValueChange = (event)=> {
    this.setState({KeyRawValue: event.target.rawValue});
  }

  onKeyCleaveInit = (cleave)=> {
    const that = this
    this.setState({KeyCleave: cleave}, function () {
      that.state.KeyCleave.setRawValue('');
    })
  }
  handleSubmit = ()=> {
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          if(Number(values.start_meter_number)> Number(values.end_meter_number)){
            console.log('开始值大于等于结束值')
            notification.error({
              message: formatMessage({id: 'menu.applications.bulk_add_error'})
            });
            return false
          }
          const sendDate = {
            ...values,
            application_key: this.state.KeyRawValue,
          }
          console.log('sendDate', sendDate)
          this.props.dispatch({
            type: `applications/bulk_add`,
            payload: {
              ...sendDate,
            },
            callback: ()=> {
              notification.success({
                message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'menu.applications.bulk_add'})}),
              });
              this.props.history.goBack()
            }
          });
        }
      }
    )
  }

  render() {
    const {device_types}=this.props
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      }
    };
    return (
      <div>
        <div className="page-header">
          <PageHeader

            title={  <Breadcrumb separator=">">
              <Breadcrumb.Item style={{cursor: 'pointer'}}
                               onClick={() => this.props.history.goBack()}>
                <FormattedMessage
                  id="menu.applications"
                  defaultMessage="设备"
                />
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <FormattedMessage
                  id="menu.applications.bulk_add"
                  defaultMessage="新建"
                />
              </Breadcrumb.Item>
            </Breadcrumb>}
          />
        </div>
        <div className="info-page-container">
          <Card type="inner" title={
            <FormattedMessage
              id="menu.applications.bulk_add"
              defaultMessage="新建"
            />
          } bordered={false}>
            <Form  onSubmit={this.handleSubmit}>

        {/*      <Form.Item  hasFeedback  label={
                <FormattedMessage
                  id="menu.applications.eui"
                  defaultMessage="EUI"

                />
              } {...formItemLayout}
                         validateStatus={
                           this.state.EUIRawValue.length !== 16 ? 'error' : 'success'
                         }
                         help={this.state.EUIRawValue.length !== 16 ?
                           formatMessage({id: 'app.EUIBytes.info'}, {bytes: 8,now:Math.floor(this.state.EUIRawValue.length/2)}) : ''}
              >
                {getFieldDecorator(`dev_eui`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.eui'})})
                  }],
                })(
                  <Cleave className="ant-input"
                          onChange={this.onEUIRawValueChange}
                          onInit={this.onEUICleaveInit}
                          options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
                  />
                )}
              </Form.Item>*/}
              <Form.Item hasFeedback  label={
                <FormattedMessage
                  id="menu.applications.prefix"
                  defaultMessage="前缀"
                />
              }  {...formItemLayout}
              >
                {getFieldDecorator(`dev_eui_prefix`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.prefix'})})
                  }],
                })(
                  <Input />
                )}
              </Form.Item>

              <Form.Item hasFeedback  label={
                <FormattedMessage
                  id="menu.applications.start_number"
                />
              }  {...formItemLayout}
              >
                {getFieldDecorator(`start_meter_number`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.start_number'})})
                  }],
                })(
                  <InputNumber style={{width:'100%'}}/>
                )}
              </Form.Item>

              <Form.Item hasFeedback  label={
                <FormattedMessage
                  id="menu.applications.end_number"
                />
              }  {...formItemLayout}
              >
                {getFieldDecorator(`end_meter_number`, {
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.end_number'})})
                  }],
                })(
                  <InputNumber style={{width:'100%'}}/>
                )}
              </Form.Item>


              <Form.Item hasFeedback  label={
                <FormattedMessage
                  id="menu.applications.key"
                  defaultMessage="Key"
                />
              } {...formItemLayout}
                         validateStatus={
                           this.state.KeyRawValue.length !== 32 ? 'error' : 'success'
                         }
                         help={this.state.KeyRawValue.length !== 32 ?
                           formatMessage({id: 'app.keyBytes.info'}, {bytes: 16,now:Math.floor(this.state.KeyRawValue.length/2)}) : ''}
              >
                {getFieldDecorator(`application_key`, {
                  initialValue: this.props.editRecord ? this.props.editRecord.number : '',
                  rules: [{
                    required: true,
                    message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.key'})})
                  }],

                })(
                  <Cleave className="ant-input"
                          onChange={this.onKeyRawValueChange}
                          onInit={this.onKeyCleaveInit}
                          options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <div style={{textAlign: 'center',marginTop:"10px"}}>
                  <Button variant="contained" onClick={()=> {
                    this.props.history.goBack()
                  }}>
                    <FormattedMessage
                      id="app.cancel"
                      defaultMessage="取消"
                    />
                  </Button>
                  <Button onClick={this.handleSubmit} variant="contained" color="secondary"
                          style={{marginLeft: '24px'}}>
                    <FormattedMessage
                      id="app.save"
                      defaultMessage="保存"
                    />
                  </Button>
                </div>
              </Form.Item>
            </Form>

          </Card>
        </div>

      </div>

    );
  }
}

export default SearchList
