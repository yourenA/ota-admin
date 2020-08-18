import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import img from './../../images/chayuan.jpg';
import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create()
class BasicList extends PureComponent {
  state = {
    visible: false,
    done: false,
    data: [
      {
        name: `1 号茶园`,
        cvr: Math.ceil(Math.random() * 9) / 10,
        lng: '113.030557',
        lat: '23.83164',
        desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
        videoImage: img,
        video: '/video.mp4',
        createdAt: '2018-10-15',
        owner: 'amwares',
      },
      {
        name: `2 号茶园`,
        cvr: Math.ceil(Math.random() * 9) / 10,
        lng: '113.116795',
        lat: '23.865484',
        desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
        videoImage: img,
        video: '/video2.mp4',
        createdAt: '2018-10-15',
        owner: 'amwares',
      },
      {
        name: `3 号茶园`,
        cvr: Math.ceil(Math.random() * 9) / 10,
        lng: '113.128293',
        lat: '23.897734',
        desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
        videoImage: img,
        video: '/video3.mp4',
        createdAt: '2018-10-15',
        owner: 'amwares',
      },
      {
        name: `4 号茶园`,
        cvr: Math.ceil(Math.random() * 9) / 10,
        lng: '113.147265',
        lat: '24.031934',
        desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
        videoImage: img,
        video: '/video2.mp4',
        createdAt: '2018-10-15',
        owner: 'admin',
      },
      {
        name: `5 号茶园`,
        cvr: Math.ceil(Math.random() * 9) / 10,
        lng: '112.984564',
        lat: '24.052527',
        desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
        videoImage: img,
        video: '/video.mp4',
        createdAt: '2018-10-15',
        owner: 'amwares',
      },
      {
        name: `6 号茶园`,
        cvr: Math.ceil(Math.random() * 9) / 10,
        lng: '112.984564',
        lat: '24.052527',
        desc: '这是茶园的相关描述信息，这是茶园的相关描述信息，这是茶园的相关描述信息',
        videoImage: img,
        video: '/video3.mp4',
        createdAt: '2018-10-15',
        owner: 'admin',
      },
    ],
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
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
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  render() {
    const {
      list: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {}, data } = this.state;

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">上传率小于60%</RadioButton>
          <RadioButton value="waiting">上传率大于60%</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { owner, createdAt, cvr, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>创建者</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={cvr * 100} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="操作成功信息提示"
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
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="茶园名称" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入茶园名称' }],
              initialValue: current.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="创建时间" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: '请选择创建时间' }],
              initialValue: current.createdAt ? moment(current.createdAt) : null,
            })(
              <DatePicker
                showTime
                placeholder="请选择"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem label="创建者" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: '请选择创建者' }],
              initialValue: current.owner,
            })(
              <Select placeholder="请选择">
                <SelectOption value="付晓晓">amwares</SelectOption>
                <SelectOption value="周毛毛">admin</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="描述">
            {getFieldDecorator('subDescription', {
              rules: [{ message: '请输入至少五个字符的描述！', min: 5 }],
              initialValue: current.desc,
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="茶园总个数" value="6" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="茶园总面积" value="1582公顷" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="茶园传感器平均上传率" value="65.6%" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="茶园列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
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
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.videoImage} shape="square" size="large" />}
                    title={<a href="javascript:;">{item.name}</a>}
                    description={item.desc}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `茶园${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
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
