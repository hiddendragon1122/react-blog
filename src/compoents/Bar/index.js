import * as echarts from 'echarts'
import React, { useEffect, useRef } from 'react'

function Bar({title,xData,yData,style}){
    const domRef = useRef()
    const chartInit = ()=>{
      //init echarts
      const myChart = echarts.init(domRef.current)
      //繪製圖表
      myChart.setOption({
        title: {
          text: title
        },
        tooltip:{},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name:'市值',
            type:'bar',
            data: yData
          }
        ]
      })
    }
    useEffect(()=>{
      chartInit()
    },[])
    return (
      <div>
        <div ref={domRef} style={style}></div>
      </div>
    )
}

export default Bar