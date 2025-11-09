import React from 'react'
import Footer from './../components/Footer.jsx'
import taskimg from './../assets/task.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from './../libs/supabaseClient.js'
 
export default function AddTask() {
  //สร้าง state เพื่อไปผูกกับข้อมูลบน Component ที่ต้องจัดการ
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
 
  //สร้างฟังก์ชันจัดการการเลือกรูป
  const handleImageSelect = (e) =>{
    const file = e.target.files[0]
 
    if(file){
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }    
  }
 
  //สร้างฟังก์ชันจัดการการส่งข้อมูลไปบันทึกที่ task_tb และอัปโหลดรูปไปที่ task_bk
  const handleSaveClick = async (e) =>{
    e.preventDefault()
 
    //Validate UI
    if(title.trim() === '' || detail.trim() === ''){
      alert('กรุณากรอกข้อมูลให้ครบถ้วน!!!')
      return;
    }
 
    //ตัวแปรเก็บที่อยู่รูปที่อัปโหลดไปที่ task_bk
    let imageUrl = ''
 
    //อัปโหลดรูป กรณีเลือกรูป ไปที่ task_bk
    if(imageFile){
      //เปลี่ยนชื่อไฟล์ของรูปเพื่อไม่ให้ซ้า
      let newImageFile = `${Date.now()}_${imageFile.name}`
 
      //อัปโหลดไปยัง storage ที่ supabase
      const { data, error } = await supabase.storage
                                .from('task_bk')
                                .upload(newImageFile, imageFile)
     
      if(error){
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง!!!")
        return;
      }else{
        //ไปเอาที่อยู่ของรูปที่ storage ที่ supabase มากำหนดให้กับตัวแปร imageUrl
        const { data } = supabase.storage
                                .from('task_bk')
                                .getPublicUrl(newImageFile)
 
        imageUrl = data.publicUrl
      }
    }
 
    //ส่งข้อมูลไปบันทึกที่ task_tb
    const {data, error} = await supabase
                            .from('task_tb')
                            .insert({
                              title: title,   detail: detail,
                              is_completed: isComplete,   image_url: imageUrl
                            })
   
    if(error){
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง!!!')
      return
    }else{
      alert('บันทึกข้อมูลเรียบร้อยแล้ว!!!')
      //redirect กลับไปที่หน้า /showalltask
      window.location.href = '/showalltask'
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
            -- เพิ่มข้อมูลงาน --
          </h1>  
 
          <form onSubmit={handleSaveClick} className='w-full mt-10'>
            <div>
              <label>ชื่องาน</label>
              <input  value={title} onChange={(e)=>{ setTitle( e.target.value ) }}
                      placeholder='ป้อนชื่องานที่ต้องทำ'
                      type="text" className='w-full border border-gray-400 p-2 rounded'/>
            </div>
 
            <div className='mt-5'>
              <label>รายละเอียดงาน</label>
              <input  value={detail} onChange={(e)=>{ setDetail( e.target.value ) }}
                      placeholder='ป้อนรายละเอียดงานที่ต้องทำ'
                      type="text" className='w-full border border-gray-400 p-2 rounded'/>
            </div>
 
            <div className='mt-8'>
              <label>เลือกรูปงาน</label>
              <input type="file" onChange={handleImageSelect}
                      id="imageSelect" className='hidden' accept="image/*" />
              <label htmlFor="imageSelect"
                     className='w-full bg-blue-500  hover:bg-blue-700
                              text-white p-2 rounded cursor-pointer ml-5 '>
                เลือกรูปงาน
              </label>
              <div className='mt-5'>
                {
                  imagePreview &&
                  <img src={imagePreview} alt="Preview" className="w-30 mt-2" />
                }
              </div>
 
            </div>  
 
            <div className='mt-5'>
              <label>สถานะงาน</label>
              <select value={isComplete == false ? '0' : '1'}
                      onChange={(e)=>{setIsComplete(e.target.value == '1' ? true : false)}}
                      className='w-full p-2 border border-gray-400 rounded'>
                <option value="1">✅ เสร็จแล้ว</option>
                <option value="0">❌ยังไม่เสร็จ</option>
              </select>
            </div>
 
            <div className='mt-8'>
              <button type='submit' className='w-full bg-blue-500 hover:bg-blue-700 p-2
                               text-white rounded cursor-pointer'>
                บันทึกเพิ่มงานใหม่
              </button>
            </div>
 
            <div className='mt-8 text-center'>
              <Link to="/showalltask" className='text-blue-500 hover:text-blue-700' >
                กลับไปหน้าแสดงงานทั้งหมด
              </Link>
            </div>
          </form>  
      </div>
 
      <Footer />
    </div>
  )
}
 
 