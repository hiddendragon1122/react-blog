import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import {http} from '../../utils/http'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
// import locale from 'antd/es/date-picker/locale/zh_CN'
import { ConfigProvider } from 'antd'
import zhHK from 'antd/es/locale/zh_HK';
import './index.scss'
//https://ant.design/docs/react/i18n-cn#%E5%A2%9E%E5%8A%A0%E8%AF%AD%E8%A8%80%E5%8C%85

import img404 from '../../assets/error.png'
import { useEffect, useState } from 'react'
import { useStore } from '../../store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const {channelStore} = useStore()

  //文章列表管理
  const [articleData,setArticleData] = useState({
    list:[],
    count:0
  })
  const [params,setParams] = useState({
    page: 1,
    per_page:10
  })
  useEffect(()=>{
    const loadList = async () => {
      const res = await http.get('/mp/articles',{params})
      const {results, total_count} = res.data
      setArticleData({
        list:results,
        count:total_count
      })
    }
    loadList()
  },[params])
  const onFinish = (values) => {
    const {channel_id,status,date} = values
    const _params = {}
    _params.status = status
    if(channel_id){
      _params.channel_id = channel_id
    }
    if(date){
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({
      ...params,
      ..._params
    })
  }
  //page
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  //delete
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)  
    //refresh list
    setParams({
      ...params,
      page:1
    })
  }

  //edit aka redirect to publish w/ id
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width:120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={200} height={150} alt="" />
      }
    },
    {
      title: '標題',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '狀態',
      dataIndex: 'status',
      render: data => <Tag color="green">審核通過</Tag>
    },
    {
      title: '發佈時間',
      dataIndex: 'pubdate'
    },
    {
      title: '閱讀量',
      dataIndex: 'read_count'
    },
    {
      title: '評論數',
      dataIndex: 'comment_count'
    },
    {
      title: '讚好',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={()=>goPublish(data)}
                />
            <Popconfirm
              title="確認刪除?"
              onConfirm={() => delArticle(data)}
              okText="確認"
              cancelText="取消"
            >
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}              
            />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  // const data = [
  //   {
  //       id: '8218',
  //       comment_count: 0,
  //       cover: {
  //         images:['http://geek.itheima.net/resources/images/15.jpg'],
  //       },
  //       like_count: 0,
  //       pubdate: '2022-03-11 09:00:00',
  //       read_count: 2,
  //       status: 2,
  //       title: 'wkwebview离线化加载h5资源解决方案' 
  //   }
  // ]
  return (
    //antd包裹全局 locale 顯示繁中
  <ConfigProvider locale={zhHK}>
    <div>
      {/* 篩選區域 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首頁</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>內容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: null }}>
          <Form.Item label="狀態" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待審核</Radio>
              <Radio value={2}>審核通過</Radio>
              <Radio value={3}>審核失敗</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="頻道" name="channel_id">
            <Select
              placeholder="請選擇文章頻道"
              style={{ width: 120 }}
            >
            {channelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}              
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">            
            <RangePicker></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button 
              onClick={onFinish}
              type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              篩選
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 文章列表區域 */}  
      <Card title={`根據篩選條件共有 ${articleData.count} 個結果：`}>
        <Table
          rowKey="id" 
          columns={columns} 
          dataSource={articleData.list} 
          pagination={{
            pageSize: params.per_page ,
            total: articleData.count,
            onChange:pageChange
          }}
          
        />
      </Card>
    </div>
  </ConfigProvider>
  )
}

export default observer(Article)
