import React, {Component} from 'react';
import router from 'umi/router';
import {connect} from 'dva';
import EditSystemConfig from './EditSystemConfig.js'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {PageHeader, Badge, Table, Divider, Button, Modal, message} from 'antd';
@connect(({system_configs, loading}) => ({
  system_configs,
}))
class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editRecord: {}
    };
  }

  componentDidMount() {
    this.handleSearch()
  }

  handleSearch = (cb) => {
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'system_configs/fetch',
      payload: {},
      callback: function () {
        if (cb) cb()
      }

    });
  }
  handleEdit = ()=> {
    const formValues = this.editSystemConfig.props.form.getFieldsValue();
    console.log('formValues', formValues)
    const that = this;
    this.props.dispatch({
      type: 'system_configs/edit',
      payload: {
        [that.state.editRecord.key]: formValues.value,

      },
      callback: function () {
        message.success(`修改"${that.state.editRecord.name}"成功`)
        that.setState({
          editModal: false,
        });
        that.handleSearch()
      }
    });
  }

  render() {
    const {
      system_configs: {data, loading, meta},
    } = this.props;
    const columns = [
      {
        title: '配置名称',
        dataIndex: 'name',
      },
      {
        title: '配置值',
        dataIndex: 'value',
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            {/*<a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>*/}
            <a onClick={()=> {
              this.setState({
                editModal: true,
                editRecord: record,
              })
            }}>编辑</a>
          </div>
        ),
      },
    ];
    return (
      <div>
        <div className="page-header">
          <PageHeader
            title={'系统配置'}
          />
        </div>
        <div className="info-page-container">
          <Card >
            <CardContent>
              <Table
                size='small'
                loading={loading}
                rowKey={'name'}
                dataSource={data}
                columns={columns}
                pagination={false}
              />
            </CardContent>
          </Card>
        </div>
        <Modal
          title={`编辑 "${this.state.editRecord.name}"` }
          destroyOnClose
          visible={this.state.editModal}
          centered
          onOk={this.handleEdit}
          onCancel={()=> {
            this.setState({editModal: false, editRecord: {}})
          }}
        >
          <EditSystemConfig editRecord={this.state.editRecord}
                            wrappedComponentRef={(inst) => this.editSystemConfig = inst}/>
        </Modal>
      </div>
    );
  }
}

export default SearchList;
