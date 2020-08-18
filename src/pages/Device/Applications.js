import React, { PureComponent } from 'react';
import numeral from 'numeral';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Card,
  Select,
  Icon,
  Avatar,
  List,
  Tooltip,
  Dropdown,
  Menu,
  Badge,
} from 'antd';
import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import { formatWan } from '@/utils/utils';

import styles from './Applications.less';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 6,
      },
    });
  },
})
class FilterCardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 6,
      },
    });
  }

  render() {
    const {
      list: { list },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    const CardInfo = ({ activeUser, newUser, teaGarden }) => (
      <div className={styles.cardInfo}>
        <div>
          <p>所属茶园</p>
          <p>{teaGarden}</p>
        </div>
        <div>
          <p>视频连接数</p>
          <p>{newUser}</p>
        </div>
      </div>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="javascript:;">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="javascript:;">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="javascript:;">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );
    const content = <div className={styles.pageHeaderContent} />;
    return (
      <PageHeaderWrapper title="视频摄像头管理" content={content} extraContent={extraContent}>
        <div className={styles.filterCardList}>
          <Card bordered={false}>
            <Form layout="inline">
              <StandardFormRow title="所属茶园" block style={{ paddingBottom: 11 }}>
                <FormItem>
                  {getFieldDecorator('category')(
                    <TagSelect expandable>
                      <TagSelect.Option value="cat1">茶园1</TagSelect.Option>
                      <TagSelect.Option value="cat2">茶园2</TagSelect.Option>
                      <TagSelect.Option value="cat3">茶园3</TagSelect.Option>
                      <TagSelect.Option value="cat4">茶园4</TagSelect.Option>
                      <TagSelect.Option value="cat5">茶园5</TagSelect.Option>
                      <TagSelect.Option value="cat6">茶园6</TagSelect.Option>
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
              <StandardFormRow title="其它选项" grid last>
                <Row gutter={16}>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <FormItem {...formItemLayout} label="状态">
                      {getFieldDecorator('author', {})(
                        <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                          <Option value="good">运行中</Option>
                          <Option value="normal">离线</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </StandardFormRow>
            </Form>
          </Card>
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            loading={loading}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <Tooltip title="下载当前画面">
                      <Icon type="download" />
                    </Tooltip>,
                    <Tooltip title="编辑">
                      <Icon type="edit" />
                    </Tooltip>,
                    <Dropdown overlay={itemMenu}>
                      <Icon type="ellipsis" />
                    </Dropdown>,
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar size="small" src={item.avatar} />}
                    title={
                      <div>
                        {' '}
                        <span className={styles.cardItemTitle}>{item.title}</span>{' '}
                        <Badge status={'processing'} text={'运行中'} />
                      </div>
                    }
                  />
                  <div className={styles.cardItemContent}>
                    <CardInfo
                      teaGarden={item.teaGarden}
                      activeUser={formatWan(item.activeUser)}
                      newUser={numeral(item.newUser).format('0,0')}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default FilterCardList;
