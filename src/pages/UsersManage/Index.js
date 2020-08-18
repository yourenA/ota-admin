import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import moment from 'moment';
import {connect} from 'dva';
import {
  List,
  Card,
  Row,
  Radio,
  Input,
  Badge,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  message ,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import img from './../../images/chayuan.jpg';
import styles from './Index.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {Search, TextArea} = Input;

@connect(({user_manage, loading}) => ({
  user_manage,
  loading: loading.models.user_manage,
}))
@Form.create()
class BasicList extends PureComponent {
  state = {
    visible: false,
    done: false,
    page: 1,
    per_page: 30
  };

  formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 13},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_manage/fetch',
      payload: {
        page: 1,
        per_page: 30
      },
    });
  }

  showModal = () => {
    this.setState({
      current: undefined,
      visible: true,

    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    }, function () {
      this.handleSearch({
        page: this.state.page,
        per_page: this.state.per_page,
        username: this.state.username,
      })
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };
  handleSearch = (values, cb) => {
    console.log('handleSearch', values)
    const that = this;
    const {dispatch} = this.props;
    dispatch({
      type: 'user_manage/fetch',
      payload: {
        ...values,
      },
      callback: function () {
        console.log('handleSearch callback')
        that.setState({
          ...values,
        });
        if (cb) cb()
      }
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {current} = this.state;
    const id = current ? current.id : '';
    const that = this;
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('fieldsValue', fieldsValue);
      console.log('current', current);
      dispatch({
        type: current ? 'user_manage/edit' : 'user_manage/add',
        payload: {id, ...fieldsValue},
        callback: ()=> {
          that.setState({
            done: true,
          });
        }
      });
    });
  };

  deleteItem = id => {
    console.log('id',id)
    const {dispatch} = this.props;
    dispatch({
      type: 'user_manage/remove',
      payload: {id},
      callback: ()=> {
        message.success('删除用户成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
          username: this.state.username,
        })
      }
    });
  };
  resetItem = id=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'user_manage/resetPassword',
      payload: {id},
      callback: ()=> {
        message.success('重置用户密码成功')
        this.handleSearch({
          page: this.state.page,
          per_page: this.state.per_page,
          username: this.state.username,
        })
      }
    });
  }

  render() {
    const {
      user_manage: {data, loading, meta},
    } = this.props;
    const {
      form: {getFieldDecorator},
    } = this.props;
    const {visible, done, current} = this.state;

    const editAndDelete = (key, currentItem) => {
      if (key === 'reset') {
        Modal.confirm({
          title: '重置用户密码',
          content: '确定重置该用户密码吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.resetItem(currentItem.id),
        });
      } else if (key === 'delete') {
        Modal.confirm({
          title: '删除用户',
          content: '确定删除该用户吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? {footer: null, onCancel: this.handleDone}
      : {okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel};

    const Info = ({title, value, bordered}) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <Search className={styles.extraContentSearch} placeholder="请输入用户名" onSearch={(value) => {
          this.handleSearch({
            username: value, page: 1,
            per_page: this.state.per_page
          })
        }}/>
      </div>
    );
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: meta.per_page,
      total: meta.total,
      current: this.state.page,
      onChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, username: this.state.username})
      },
      onShowSizeChange: (page, pageSize)=> {
        this.handleSearch({page, per_page: pageSize, username: this.state.username})
      },
    };

    const ListContent = ({data: {mobile, real_name, email, created_at, cvr, status}}) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>真实姓名</span>
          <p>{real_name}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>手机</span>
          <p>{mobile}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>邮箱</span>
          <p>{email}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(created_at).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({key}) => editAndDelete(key, props.current)}>
            <Menu.Item key="reset">重置密码</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down"/>
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title={`${current ? '修改' : '添加'}用户成功`}
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form >
          <FormItem label="用户名" {...this.formLayout}>
            {getFieldDecorator('username', {
              rules: [{required: true, message: '请输入用户名'}],
              initialValue: current ? current.username : '',
            })(<Input placeholder="请输入" disabled={current ? true:false}/>)}
          </FormItem>
          <FormItem label="真实姓名" {...this.formLayout}>
            {getFieldDecorator('real_name', {
              initialValue: current ? current.real_name : '',
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem label="手机" {...this.formLayout}>
            {getFieldDecorator('mobile', {
              initialValue: current ? current.mobile : '',
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem label="邮箱" {...this.formLayout}>
            {getFieldDecorator('email', {
              initialValue: current ? current.email : '',
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem label="备注" {...this.formLayout}>
            {getFieldDecorator('remark', {
              initialValue: current ? current.remark : '',
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          {
            current&&
            <FormItem label="状态" {...this.formLayout}>
              {getFieldDecorator('status', {
                initialValue: current ? current.status.toString() : '1',
              })(
                <Radio.Group>
                  <Radio value="1">启用</Radio>
                  <Radio value="-1">禁用</Radio>
                </Radio.Group>
              )}
            </FormItem>
          }
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{marginTop: 24}}
            bodyStyle={{padding: '0 32px 40px 32px'}}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{width: '100%', marginBottom: 8}}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={data}
              renderItem={item => (
                <List.Item
                  actions={item.protection_level===1?[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn current={item}/>
                  ]:item.protection_level===2?null:[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      编辑
                    </a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar style={{backgroundColor: '#87d068'}} shape="square"
                                    size="large">{item.username}</Avatar>}
                    title={<span>{item.username}</span>}
                    description={<p>
                      {item.status === -1 && <span><Badge status="error" style={{marginTop: '-5px'}}/>禁用</span>}
                      {item.status === 1 && <span><Badge status="success" style={{marginTop: '-5px'}}/>启用</span>}
                    </p>}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `用户${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? {padding: '72px 0'} : {padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
