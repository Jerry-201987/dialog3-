<template>
  <div id="app">
    <button @click="play">播放</button>
    <video autoplay name="media" loop id="player" style>
      <source src="./assets/bg.mp4" type="video/mp4" />
    </video>
    <div id="main" style="width:90%;height:400px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
const a = 10
console.log(a)
export default {
  methods: {
    play() {
      var player = document.getElementById('player')
      if (player.paused) player.play()
      else player.pause()
    }
  },
  name: 'App',
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    // 绘制图表
    myChart.setOption({
      legend: {
        data: ['2017', '2019'],
        right: 20,
        textStyle: { color: '#fff' }
      },
      animationDuration: 10000,
      // title: {
      //   text: '贵州仁通',
      // },
      // tooltip: {},
      xAxis: {
        splitLine: {
          lineStyle: {
            color: 'green'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'green'
          }
        },
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        axisLabel: {
          color: '#00D5FF',
          fontSize: 18,
          fontWeight: 600,
          backgroundColor: {
            image: require('./assets/img/u32.png')
          },
          padding: [10, 30, 10, 30]
        }
      },
      color: [
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(86, 178, 231)'
          },
          {
            offset: 0.5,
            color: 'red'
          },
          {
            offset: 1,
            color: 'rgb(86, 178, 231)'
          },
        ]),
        'aqua'
      ],
      yAxis: {
        splitLine: {
          lineStyle: {
            color: 'green'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'green'
          }
        },
      },
      series: [
        {
          name: '2017',
          type: 'bar',
          data: [5, 220, 36, 10, 10, 20],
          label: {
            position: 'top',
            color: 'chocolate',
            fontSize: 18,
            show: true,
            formatter(data) {
              // console.log(data)
              // return data.value
              var arr = ['3000户', '36亿', '236亿', '336亿', '364亿', '362笔']
              return arr[data.dataIndex]
              // if (data.dataIndex === 0) return data.value + '户'
              // else if (data.dataIndex === 5) return data.value + '笔'
              // return data.value + '亿'
            }
          }
        },
        {
          name: '2019',
          type: 'bar',
          data: [15, 220, 336, 140, 160, 220],
          label: {
            position: 'top',
            color: 'deeppink',
            fontSize: 18,
            show: true,
            formatter(data) {
              console.log(data)
              return data.value
            }
          }
        },
      ],
    })
  },
  components: {},
}
</script>

<style lang="less">
*{
  margin: 0;
  padding: 0;
}
#player{
  width: 100vw;
  // height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
