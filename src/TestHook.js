import React, { useState, useEffect, useCallback, useReducer } from "react";

const initState = { count: 0, number: 0 };

function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <>
      Count : {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}

const TestHook = () => {
  return (
    <>
      <Counter />
    </>
  );
};

export default TestHook;
