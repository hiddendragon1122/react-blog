import { Layout, Menu, Popconfirm } from 'antd'
import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'

const { Header, Sider } = Layout


const MainLayout = () => {
  const {pathname} = useLocation()
  const {userStore,loginStore,channelStore} = useStore()
  useEffect(()=>{
    userStore.getUserInfo()
    channelStore.loadChannelList()
  },[userStore,channelStore])
  //logout confirm
  const Navigate = useNavigate()
  const onConfirm = () => {
    loginStore.logout()
    Navigate('/login')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm 
              onConfirm={onConfirm}
              title="是否確認退出" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">          
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to='/'>數據概覽</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to='/article'>內容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to='/publish'>發佈文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet/>
        </Layout>


      </Layout>
    </Layout>
  )
}

export default observer(MainLayout)