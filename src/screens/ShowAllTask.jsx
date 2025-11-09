//ShowAllTask.jsx
import React from 'react'
import Footer from './../components/Footer.jsx'
import taskimg from './../assets/task.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './../libs/supabaseClient.js'
 
export default function ShowAllTask() {
  const [tasks, setTasks] = useState([])
 
  //จะทำงานตอนที่เพจถูกเปิดขึ้นมา (rendered)
  useEffect(()=>{
    //ดึงข้อมูลงานทั้งหมดจาก Supabase
    try{
      //สร้างฟังก์ชันสำหรับดึงข้อมูล
      const fetchTasks = async () => {
        //ดึงข้อมูลจาก supabase (Postgres Database)
        const { data, error } = await supabase
                                      .from('task_tb')          //ระบุชื่อตาราง
                                      .select("*")              //ระบุว่าจะดึงข้อมูลคอลัมน์อะไรบ้าง
                                      .order('created_at', { ascending: false }) //เรียงลำดับข้อมูลจากใหม่ไปเก่า
        //ตรวจสอบว่ามี error หรือไม่
        if(error){
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลงาน กรุณาลองใหม่อีกครั้ง!!!")
          throw error
        }else{
          //นำข้อมูลที่ดึงมา data ไปเก็บไว้ที่ state tasks ที่สร้างไว้
          setTasks(data)
        }
      }
 
      //เรียกใช้ฟังก์ชันดึงข้อมูลให้ทำงาน
      fetchTasks()
    }catch(error){
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลงาน กรุณาลองใหม่อีกครั้ง!!!")
      console.log("Error fetching tasks:", error)
    }
  },[])
 
  //สร้างฟังกช์นลบข้อมูลออกจาก task_tb และลบรูปออกจาก task_bk(ถ้ามี)
  const handleDeleteClick = async (id, imageUrl) => {
      //ถามยืนยันการลบข้อมูลก่อน
      if( confirm('ต้องการลบข้อมูลใช่หรือไม่?') == true){
          //ลบรูปออกจาก task_bk(ถ้ามี)
          if(imageUrl != ''){
              //ตัดเอาเฉพาะชื่อรูปจาก imageUrl
              const imageName = imageUrl.split('/').pop()
              //ได้ชื่อรูปมาแล้วก็ ไปลบออกจาก task_bk
              await supabase.storage.from('task_bk').remove([imageName])
          }
 
          //ลบข้อมูลออกจาก task_tb
          const { error } = await supabase.from('task_tb').delete().eq('id', id)
 
          if(error){
              alert("เกิดข้อผิดพลาดในการลบข้อมูลงาน กรุณาลองใหม่อีกครั้ง!!!")
              return
          }else{
              alert("ลบข้อมูลงานเรียบร้อยแล้ว")
              //ลบข้อมูลออกจาก state
              setTasks(tasks.filter(task => task.id !== id))
             //หรือใช้ window.location.reload()
          }
      }
  }
 
  return (
    <div>
      <div className="w-8/12 border-gray-300 shadow-md rounded p-5
                      mx-auto mt-20 flex flex-col items-center">
 
        <img src={taskimg} alt="Task" className="w-30 mb-4" />  
 
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Task Application
          <br />
          -- ข้อมูลงานทั้งหมด --
        </h1>      
 
        {/* ส่วนของปุ่มเปิดไปหน้า /addtask  */}
        <div className="w-full flex justify-end mt-4 mb-7">
          <Link to="/addtask" className="bg-blue-500 hover:bg-blue-600
                                           cursor-pointer p-3 text-white rounded">
            เพิ่มงานใหม่
          </Link>
        </div>
 
        {/* ส่วนของการแสดงข้อมูลงานทั้งหมดจาก Supabase */}
        <div className="w-full">
          <table className="w-full border border-gray-700 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border border-gray-700">รูป</th>
                <th className="p-2 border border-gray-700">ชื่องาน</th>
                <th className="p-2 border border-gray-700">รายละเอียดงาน</th>
                <th className="p-2 border border-gray-700">สถานะงาน</th>
                <th className="p-2 border border-gray-700">วันที่สร้างงาน</th>
                <th className="p-2 border border-gray-700">วันที่อัพเดทงาน</th>
                <th className="p-2 border border-gray-700">จัดการ</th>                
              </tr>
            </thead>
            <tbody>
              {
                tasks.map((task)=>(
                  <tr key={task.id}>
                    <td className="p-2 border border-gray-700">
                      {/* Ternary operator ____ ? ____ : _____ */}
                      {
                        task.image_url === null || task.image_url === ''
                        ? <img  className='w-20 mx-auto'
                              src={taskimg} alt="รูปงาน" />
                        : <img  className='w-20 mx-auto'
                              src={task.image_url} alt="รูปงาน" />
                      }
                    </td>
                    <td className="p-2 border border-gray-700">{task.title}</td>
                    <td className="p-2 border border-gray-700">{task.detail}</td>
                    <td className="p-2 border border-gray-700 text-center">
                      {
                        task.is_completed == true
                        ? <span className='text-green-500'>✅งานเสร็จแล้ว</span>  
                        : <span className='text-red-500'>❌งานยังไม่เสร็จ</span>
                      }
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      { new Date( task.created_at ).toLocaleDateString('th-TH',{
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) }
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      { new Date( task.updated_at ).toLocaleDateString('th-TH',{
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) }
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <Link to={'/updatetask/'+task.id} className='text-green-400 mr-2'>แก้ไข</Link>
                      <button onClick={()=>handleDeleteClick(task.id, task.image_url)}
                              className='text-red-400 ml-2 cursor-pointer'>
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
 
      <Footer />
    </div>
  )
}
 