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
import DescriptionList from '@/components/DescriptionList';
import styles from './TableList.less';
import Button from '@material-ui/core/Button';
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

  handleAdd = (command) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'commands/add',
      payload: {
        id: this.props.history.location.query.id,
        command,
      },
      callback: function () {
        notification.success({
          message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'app.sendCommand'})}),
        });
      }
    });
  }


  handleCopy=()=>{
    notification.success({
         message: formatMessage({id: 'app.successfully'}, {type: formatMessage({id: 'app.copy'})}),
    });
  }
  render() {
    const {
      commands: {data, loading, meta, pageLoaded},
    } = this.props;
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
              <FormattedMessage
                id="menu.applications.info.commands"
              />
            </div>

          } bordered={false}>
            <Button variant="contained" style={{marginRight:'16px'}} onClick={()=>{
              this.handleAdd('close_valve')
            }}>
              <FormattedMessage
                id="app.close_valve"
              />
            </Button>
            <ThemeProvider theme={theme}>
              <Button variant="contained" color="primary" onClick={()=>{
                this.handleAdd('open_valve')
              }}>
                <FormattedMessage
                  id="app.open_valve"
                />
              </Button>
            </ThemeProvider>
            </Card>
        </div>
      </div>
    );
  }
}

export default TableList;
