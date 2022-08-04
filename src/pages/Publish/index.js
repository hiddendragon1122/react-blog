import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '../../store'
import { observer } from 'mobx-react-lite'
import { http } from '../../utils'


const { Option } = Select

const Publish = () => {
  const {channelStore} = useStore()
  const [imgCount, setImgCount] = useState(1)
  const radioChange = (e) => {
    const count = e.target.value
    setImgCount(count)
    //get img from ref
    if (count === 1) {
      // 單
      const firstImg = cacheImgList.current[0]
      setFileList(!firstImg ? [] : [firstImg])
    } else if (count === 3) {
      // 三
      setFileList(cacheImgList.current)
    }
  }
  const [fileList, setFileList] = useState([])
  const cacheImgList = useRef([])
  const onUploadChange = ({fileList}) => {
    //formatting first(bc 讀取的 與 上傳的 圖片 結構格式不一樣)
    const formatList = fileList.map(file=>{
      //done uploading
      if(file.response){
        return {
          url: file.response.data.url
        }
      }
      //still uploading
      return file
    })
    setFileList(formatList)
    //save in ref
    cacheImgList.current = formatList
  }
 
  //submit
  const navigate = useNavigate()
  const onFinish = async (values) => {
    const {channel_id, content, title, type} = values
    const params = {
      channel_id, content, title, type,
      cover: {
        type:type,
        images:fileList.map(item => item.url)
      }
    }
    if(id){
      await http.put(`/mp/articles/${id}?draft=false`,params)
    }else{
      await http.post('/mp/articles?draft=false',params)
    }
    
    //redirect, inform user
    navigate('/article')
    message.success(`${id ? '修改成功' : '發佈成功'}`)
  }

  //publish or edit? check if there is any id
  const [params] = useSearchParams()
  const id = params.get('id')

  //數據回填 （編輯時讀取之前的數據）
  const [form] = Form.useForm()
  useEffect(()=> {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const {cover,...formValue} = res.data
      form.setFieldsValue({...formValue,type: cover.type})
      //setFileList refill <Upload>
      const formatImgList = cover.images.map(url => ({url}))
      setFileList(formatImgList)
      //save one copy in Ref(same structure w/ fileList)
      cacheImgList.current = formatImgList
      setImgCount(cover.type)
    }
    if(id){
      loadDetail()
    }    
  },[id,form])
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首頁</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id?'編輯':'發佈'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content:''}}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="標題"
            name="title"
            rules={[{ required: true, message: '請輸入文章標題' }]}
          >
            <Input placeholder="請輸入文章標題" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="頻道"
            name="channel_id"
            rules={[{ required: true, message: '請輸入文章頻道' }]}
          >
            <Select placeholder="請輸入文章頻道" style={{ width: 400 }}>
              {channelStore.channelList.map(item => 
                <Option key={item.id} value={item.id}>{item.name}</Option> )}

            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>單圖</Radio>
                <Radio value={3}>三圖</Radio>
                <Radio value={0}>無圖</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount>1}
                maxCount={imgCount}
              >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
              </Upload>)}
          </Form.Item>
          <Form.Item
            label="內容"
            name="content" //富文本組件移交Form.Item控制，內容由onFinished收集
            rules={[{ required: true, message: '請輸入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="請輸入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
              {id?'更新':'發佈'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)