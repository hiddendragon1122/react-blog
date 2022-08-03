import React,{useState} from 'react'
import { Card, Form, Input, Button, Checkbox, message } from 'antd'
import logo from '../../assets/logo.png'
import './index.scss'
import { useStore } from '../../store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const {loginStore} = useStore()
    const navigate = useNavigate()
    async function onFinish(values){
        const {mobile,code} = values
        //try {
            await loginStore.getToken({
            mobile,
            code
             })        
            //redirect to /
            navigate('/',{replace:true})
            //提示用戶
            message.success('登入成功')
        // } catch (e) {
        //     message.error(e.response?.data?.message ||'登入失敗：賬戶或密碼錯誤')
        // }
    }
    function onFinishFailed(errorInfo){
        console.log(errorInfo);
    }

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登入表單 */}
        <Form validateTrigger={['onBlur', 'onChange']}
            initialValues={{                
                mobile:13911111111,
                // code:246810,
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name="mobile"
                rules={[
                    {
                        required: true,
                        message: '請輸入手機號',
                    },
                    {
                       // /^([6|9|5])\d{7}$/ && 
                        pattern:/^1[3-9]\d{9}$/,
                        message: '請輸入正確的手機號!',
                        validateTrigger:'onBlur'
                    }
                ]}
            >
                <Input size="large" placeholder="請輸入手機號" />
            </Form.Item>
            <Form.Item
                name="code"
                rules={[
                    {
                        len: 6,
                        message:'驗證碼246810',
                        validateTrigger:'onChange'    
                    },
                    {
                        required: true,
                        message: '請輸入驗證碼',
                    }                    
                ]}            
            >
                <Input size="large" placeholder="請輸入驗證碼"  maxLength={6} />
            </Form.Item>
            {/* <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Checkbox>記住我</Checkbox>
            </Form.Item> */}
            <Form.Item name="remember" valuePropName="checked">
                <Checkbox className="login-checkbox-label">
                我已閱讀並同意「用戶協議」和「私隱條款」
                </Checkbox>
            </Form.Item>

            <Form.Item>
                {/* 渲染Button组件为submit按钮  */}
                <Button type="primary" htmlType="submit" size="large" block>
                登入
                </Button>
            </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
