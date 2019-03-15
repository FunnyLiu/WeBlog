import React from 'react';
import ReactDom from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

// React计数器组件
class Counter extends React.Component {
  render(){
    const { value, onIncreaseClick } = this.props;
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>Increase</button>
      </div>
    );
  }
}

// 定义Action
const increaseAction = {type: 'increase'};

// 定义Reducer，用来调用各种Action
function counter(state={count: 0}, action) {
  let count = state.count;
  switch(action.type){
    case 'increase':
      return {count: count+1};
    default:
      return state;
  }
}

//创建Store
let store = createStore(counter);

// 将State映射到组件的props
function mapStateToProps(state)  {
  return {
    value: state.count
  };
}

// 将Action映射到组件的props
function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  };
}

// 进行组件隐射
let App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

//进行容器添加
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
