import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Flow from './node/Flow';
import { ReactFlowProvider } from 'reactflow';
import NodeContents from './NodeContents/NodeContents';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Top from './pages/Top';
import Page404 from './pages/Page404';
import LogInDemoUser from './pages/LogInDemoUser';
import Start from './pages/Start';
import StartLibrary from './pages/StartLibrary';

function Index () {
  return (
    <ReactFlowProvider>
      <Flow/>
    </ReactFlowProvider>
  )
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <BrowserRouter>
    <Routes>
        <Route exact path="/" element={<Top />} />
        <Route exact path="/login" element={<LogInDemoUser />} />
        <Route path="/start" element={<Start />} />
        <Route path="/library" element={<StartLibrary />} />
        <Route path="/map" element={<Index />} />
        <Route path="*" element={<Page404 />} />
    </Routes>
  </BrowserRouter>
    
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
