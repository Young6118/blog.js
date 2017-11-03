import React from 'react'

import './slider.css'

class Slider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      items: [
        {src:'/1.jpg', str:'today'},
        {src:'/2.svg', str:'你好中国'},
        {src:'/3.svg', str:'today'},
      ],
      index: 0,
      next: 1,
    }
  }

  render() {
    return (
      <div className="slider">
        <Imgs img={this.state.items[this.state.index]} />
        <Imgs img={this.state.items[this.state.index]} />
      </div>
    )
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 2000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick() {
    this.setState((prevState) => {
      return {
        index: (prevState.items.length + prevState.index - 2) % prevState.items.length,
        next: (prevState.items.length + prevState.next - 2) % prevState.items.length,
      }
    })
  }

}

class Imgs extends React.Component {
  render() {
    return (
        <div className="slider-item">
          <img className="slider-img"  src={this.props.img.src} alt="轮播图" />
          <p>{this.props.img.str}</p>
        </div>
    )
  }
}

export default Slider
