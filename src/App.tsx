import React from 'react';
import { RecoilRoot } from 'recoil';
import TodoApp from './TodoApp';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const App = () => {
  return (
    <RecoilRoot>
      <TodoApp />
    </RecoilRoot>
  );
};

export default App;
