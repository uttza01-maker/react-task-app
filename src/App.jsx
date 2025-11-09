import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShowAllTask from './screens/ShowAllTask';
import AddTask from './screens/AddTask';
import UpdateTask from './screens/UpdateTask';
import HomeTask from './screens/HomeTask';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeTask />} />
          <Route path="/Showalltask" element={<ShowAllTask />} />
          <Route path="/Addtask" element={<AddTask />} />
          <Route path="/Updatetask" element={<UpdateTask />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}