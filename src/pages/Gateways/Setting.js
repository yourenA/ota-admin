import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import request from '@/utils/request';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import {formatMessage, FormattedMessage} from 'umi/locale';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import copy from 'copy-to-clipboard';
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Dropdown,
  Menu,
  Alert,
  PageHeader,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table, Tag,notification,Card
} from 'antd';
import Button from '@material-ui/core/Button';
import Update from './Update';
/* eslint react/no-multi-comp:0 */
@connect(({commands, loading, system_configs}) => ({
  commands, system_configs
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    page: 1,
    per_page: 30,
    dev_eui: '',
    name: '',
    editRecord: {},
    current: 0,
    refresh_second: 1,
    stepData: {},
    mqttInfo: {},
    events: []
  };


  componentDidMount() {
  }

  deviceSync=()=>{
    request(`/products/${this.props.history.location.query.id}/devices`, {
      method: 'POST',
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type:'设备同步'}),
        });
      }
    })
  }
  deviceUpdate=()=>{
    const formValues = this.EditDevice.props.form.getFieldsValue();
    console.log('formValues', formValues)
    request(`/upgrade_device`, {
      method: 'POST',
      data:{
        firmware_id:formValues.firmware_id,
        product_id:this.props.history.location.query.id
      }
    }).then((response)=> {
      console.log(response);
      if(response.status===200){
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type:'设备固件更新命令发送'}),
        });
        this.setState({
          editModal:false
        })
      }
    })
  }
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: '#0d83d0',
        },
      },
    });

    return (
      <div>
        <div className="info-page-container">

          <Card type="inner" title={
            <div>
              <Icon type="cloud-upload" />
             命令
            </div>

          } bordered={false}>
            <Button variant="contained" style={{marginRight:'16px'}} onClick={()=>{
              this.deviceSync()
            }}>
              设备同步

            </Button>
            <ThemeProvider theme={theme}>
              <Button variant="contained" color="primary" onClick={()=>{
                this.setState({
                  editModal:true
                })
              }}>
                更新所有设备固件

              </Button>
            </ThemeProvider>
          </Card>
        </div>
        <Modal
          title={'更新所有设备固件'}
          visible={this.state.editModal}
          centered
          onOk={this.deviceUpdate}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <Update id={this.props.history.location.query.id}
                        wrappedComponentRef={(inst) => this.EditDevice = inst}/>

        </Modal>
      </div>
    );
  }
}

export default TableList;
