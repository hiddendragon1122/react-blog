import React from 'react'
import Bar from '../../compoents/Bar'


export default function Home() {
 return (
  <div>
    <Bar 
      title='加密貨幣市值' 
      xData={['BTC','ETH','USDT','ADA','AVAX','MATIC']}
      yData={['4457.98','2038.49','662.31','173.57','66.94','45.44']}
      style={{width:'500px', height:'400px'}}
      />
    <Bar 
      title='加密貨幣市值2' 
      xData={['ADA','AVAX','MATIC']}
      yData={['173.57','66.94','45.44']}
      style={{width:'400px', height:'300px'}}
      />
  </div>
 )
}
