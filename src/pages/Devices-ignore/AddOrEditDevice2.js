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
  Icon,
  Upload,
  Breadcrumb,
  notification
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
      data:[],
      fileList: [],
    }
  }

  componentDidMount() {
    const that = this;
    request(`/all_substrate_types`,{
      method:'GET',
      params:{
        order_direction:'desc'
      }
    }).then((response)=>{
      if(response.status===200){
        that.setState({
          data:response.data.data
        })
      }
    });
  }
  handleSubmit = ()=> {
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          console.log('values',values)
          let formData = new FormData();
          formData.append("firmware_file", values.file.file);
          formData.append("remark", values.remark);
          formData.append("status", values.status);
          for(let i=0;i<values.applicable_substrate_types.length;i++){
            formData.append("applicable_substrate_types[]", values.applicable_substrate_types[i]);
          }
          request(`/firmwares`, {
            method: 'POST',
            data: formData
          }).then((response)=> {
            console.log(response);
            if(response.status===200){
              notification.success({
                message: formatMessage({id: 'app.successfully'}, {type:'新建固件'}),
              });
              this.props.history.goBack()
            }
          })
        }
      }
    )
  }

  render() {
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
    const props = {
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };
    return (
      <div>
        <div className="page-header">
          <PageHeader

            title={  <Breadcrumb separator=">">
              <Breadcrumb.Item style={{cursor: 'pointer'}}
                               onClick={() => this.props.history.goBack()}>
                固件列表
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                新建固件
              </Breadcrumb.Item>
            </Breadcrumb>}
          />
        </div>
        <div className="info-page-container">
          <Card type="inner" title={
            '新建固件'
          } bordered={false}>
            <Form  onSubmit={this.handleSubmit}>
              <Form.Item label={'固件文件'} {...formItemLayout}>
                <div className="dropbox">
                  {getFieldDecorator('file', {
                    rules: [{required: true, message: '固件文件不能为空'}],
                  })(
                    <Upload.Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">点击选择文件</p>
                    </Upload.Dragger>
                  )}
                </div>
              </Form.Item>
              <Form.Item label={'状态'} {...formItemLayout}>
                {getFieldDecorator(`status`, {
                  rules: [{required: true, message: '请选择状态'}],
                  initialValue: '1',
                })(
                  <Select>
                    <Option value={'1'}>启用</Option>
                    <Option value={'-1'}>停用</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={'适用的RTU基板型号'} {...formItemLayout}>
                {getFieldDecorator(`applicable_substrate_types`, {
                  rules: [{required: true, message: '请选择基板型号'}],
                })(
                  <Select  mode="multiple" >
                    {this.state.data.map((item,index)=>{
                      return <Option key={index} value={item.id}>{item.name}/{item.product_code}</Option>
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label={
                <FormattedMessage
                  id="app.description"
                  defaultMessage="描述"
                />
              } {...formItemLayout}>
                {getFieldDecorator(`remark`, {
                  initialValue: this.props.editRecord ? this.props.editRecord.remark : '',
                })(
                  <TextArea rows={4}/>
                )}
              </Form.Item>
              <Form.Item>
                <div style={{textAlign: 'center'}}>
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
