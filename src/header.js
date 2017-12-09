import React from 'react'

import logo from './logo.svg'
import './header.css'

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <header className="header-back">
          <img src={logo} className="header-logo" alt="logo" />
        </header>
        <div className="nav-bar">
          <ul className="header-nav">
            <li className="nav-active">
              <a href="/">
                <span>首页</span>
              </a>
            </li>
            <li>
              <a href="http://production.youngchou.cn">
                <span>项目</span>
              </a>
            </li>
            <li>
              <a href="http://blog.youngchou.cn">
                <span>博客</span>
              </a>
            </li>
            <li>
              <a href="http://www.youngchou.cn/resume">
                <span>简历</span>
              </a>
            </li>
            <li>
              <a href="http://bbs.youngchou.cn">
                <span>社区</span>
              </a>
            </li>
            <li>
              <a href="http://gitlab.youngchou.cn">
                <span>gitlab</span>
              </a>
            </li>
          </ul>
          </div>
          <span className="header-search">
            <input type="text"placeholder="搜索你感兴趣的内容" />
            <button>搜</button>
          </span>
          <div className="userinfo">
            <a className="btn">登录</a>
            <a className="btn">注册</a>
            <a className="btn">创作</a>
          </div>
          <p className="header-intro">
            对生活永远怀揣热忱
            <br />
            love & enjoy life
          </p>
      </div>
    )
  }
}

export default Header
