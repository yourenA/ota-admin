import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment'
import {formatMessage, FormattedMessage} from 'umi/locale';
import request from '@/utils/request'
import Cleave from 'cleave.js/react';
import {routerRedux} from 'dva/router';
import {
  Row,
  Col,
  Form,
  Select,
  Icon,
  Table,
  Alert,
  Card,
  notification,
  Tooltip,
  Input,
  Modal
} from 'antd';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
const TextArea = Input.TextArea
const {confirm} = Modal;
/* eslint react/no-multi-comp:0 */
@connect(({device_real_time_errors, system_configs, loading}) => ({
  device_real_time_errors, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      page: 1,
      per_page: 30,
      number: '',
      name: '',
      status: '1',
      parameter_id: '',
      errorParameters: [],
      refresh_second: 0,
      display_rows: 0,
      data: {},
      EUICleave: null,
      keyCleave: null,
      hideKey: true,
      KeyRawValue: ''
    };
  }


  componentDidMount() {

  }


  handleSearch = () => {
    const that = this;
    request(`/devices/${this.props.history.location.query.id}`, {
      method: 'GET',
    }).then((response)=> {
      if (response.status === 200) {
        this.setState({
          data: response.data.data
        })
        this.setState({KeyRawValue: response.data.data.application_key});
        that.state.EUICleave.setRawValue(response.data.data.dev_eui);
        that.state.keyCleave.setRawValue(response.data.data.application_key);
      }
    })
  }


  componentWillUnmount() {
  }

  renderForm() {
  }

  onEUICleaveInit = (cleave)=> {
    const that = this
    this.setState({EUICleave: cleave}, function () {

    })
  }
  onKeyCleaveInit = (cleave)=> {
    this.setState({keyCleave: cleave}, function () {
      this.handleSearch()
    })
  }
  onKeyRawValueChange = (event)=> {
    this.setState({KeyRawValue: event.target.rawValue});
  }
  handleSubmit = ()=> {
    const {dispatch} = this.props;
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          const sendDate = {
            ...values,
            id: this.state.data.id,
            application_key: this.state.KeyRawValue,
          }
          console.log('sendDate', sendDate)
          dispatch({
            type: `applications/edit`,
            payload: {
              ...sendDate,
            },
            callback: ()=> {
              notification.success({
                message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'menu.applications.edit'})}),
              });
              const that = this
              setTimeout(function () {
                dispatch(routerRedux.replace(`/devices/info/overview?id=${that.state.data.id}&&dev_eui=${that.state.data.dev_eui}`));
              }, 500)
            }
          });
        }
      }
    )
  }
  handleDelete = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: `applications/remove`,
      payload: {
        id:this.state.data.id,
      },
      callback: ()=> {
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'menu.applications.delete'},{name:this.state.data.dev_eui})}),
        });
        const that = this
        this.props.history.goBack()
      }
    });
  }

  render() {
    const {dispatch} = this.props;
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
    const that=this
    const {
      device_real_time_errors: {data, loading, meta},
    } = this.props;
    const columns = [{
      title: '时间',
      dataIndex: 'timestamp',
      render: (text)=> {
        return moment(text).format('MM-DD HH:mm:ss')
      }
    }]
    return (
      <div className="info-page-container">
        <Card type="inner" title={
          <div>
            <Icon type="setting"   />
            <FormattedMessage
              id="menu.applications.info.setting"
              defaultMessage="设置"
            />
          </div>

        } bordered={false}>
          <Form onSubmit={this.handleSubmit}>

            <Form.Item label={
              <FormattedMessage
                id="menu.applications.eui"
                defaultMessage="EUI"
              />
            } {...formItemLayout}>
              {getFieldDecorator(`dev_eui`, {
                initialValue: this.props.editRecord ? this.props.editRecord.number : '',
                rules: [{
                  required: true,
                  message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.eui'})})
                }],
              })(
                <Cleave className="ant-input  ant-input-disabled"
                        onChange={this.onEUIRawValueChange}
                        onInit={this.onEUICleaveInit}
                        options={{blocks: [2, 2, 2, 2, 2, 2, 2, 2], uppercase: true}}
                />
              )}
            </Form.Item>
            <Form.Item hasFeedback label={
              <FormattedMessage
                id="menu.applications.name"
                defaultMessage="名称"
              />
            }  {...formItemLayout}>
              {getFieldDecorator(`name`, {
                initialValue: this.state.data.name,
                rules: [{
                  required: true,
                  message: formatMessage({id: 'app.is_required'}, {key: formatMessage({id: 'menu.applications.name'})})
                }],
              })(
                <Input />
              )}
            </Form.Item>


            <Form.Item hasFeedback label={
              <FormattedMessage
                id="menu.applications.key"
                defaultMessage="Key"
              />
            } {...formItemLayout}
                       validateStatus={
                         this.state.KeyRawValue.length !== 32 ? 'error' : 'success'
                       }
                       help={this.state.KeyRawValue.length !== 32 ?
                         formatMessage({id: 'app.keyBytes.info'}, {
                           bytes: 16,
                           now: Math.floor(this.state.KeyRawValue.length / 2)
                         }) : ''}
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
            <Form.Item label={
              <FormattedMessage
                id="app.description"
                defaultMessage="描述"
              />
            } {...formItemLayout}>
              {getFieldDecorator(`description`, {
                initialValue: this.state.data.description
              })(
                <TextArea rows={4}/>
              )}
            </Form.Item>
            <Form.Item>
              <div style={{textAlign: 'center'}}>
                <Button variant="contained" onClick={()=> {
                  dispatch(routerRedux.replace(`/devices/info/overview?id=${this.state.data.id}&&dev_eui=${this.state.data.dev_eui}`));
                }}>
                  <FormattedMessage
                    id="app.cancel"
                    defaultMessage="取消"
                  />
                </Button>
                <Button onClick={this.handleSubmit} variant="contained" color="secondary" style={{marginLeft: '24px'}}>
                  <FormattedMessage
                    id="app.save"
                    defaultMessage="保存"
                  />
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
        <Button variant="outlined" color="secondary" size="small" style={{marginTop: "24px"}} onClick={()=> {
          confirm({
            title: formatMessage({id: 'app.delete.info'}),
            okType: 'danger',
            centered: true,
            maskClosable: true,
            onOk() {
              console.log('OK');
              that.handleDelete()
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }}>
          {
            formatMessage({id: 'menu.applications.delete'}, {name: this.state.data.dev_eui})
          }
          <DeleteIcon />
        </Button>
      </div>
    );
  }
}

export default TableList;
