"use client"
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from '@fullcalendar/interaction';
import viLocale from "@fullcalendar/core/locales/vi";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import useAuthStore from "@/stores/auth-store";

interface Event {
  id: string;
  title: string;
  start: string;
}

interface Reminder {
  id: number;
  content: string;
  reminder_date: string;
  repeat_type: string;
}

export default function Calendar() {
  const {token} = useAuthStore();
  const mySwal = withReactContent(Swal);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if(token){
      const fetchReminders = async () => {
        await axios.get('/baseapi/reminder', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then((res) => {
          setEvents(res.data.map((reminder: Reminder) => ({
            id: reminder.id.toString(),
            title: reminder.content,
            start: reminder.reminder_date,
          })));
        })
      }
      fetchReminders();
    }
  }, [token])

  const handleDateClick = (dateClickInfo: DateClickArg) => {
    mySwal.fire({
      title: 'Thêm sự kiện',
      html: `
      <div>
        <label class="block text-left mb-2">Tên sự kiện:</label>
        <input type="text" id="event-title" class="w-full p-2 border rounded-lg mb-4" placeholder="Nhập tên sự kiện" />
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const title = (document.getElementById('event-title') as HTMLInputElement)?.value;

        if (!title) {
          Swal.showValidationMessage('Vui lòng nhập tên sự kiện!');
        }

        return { title };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios.post('/baseapi/reminder', {
          title: result.value.title,
          date: dateClickInfo.dateStr,
          repeat: 'none',
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          mySwal.fire({
            title: 'Thêm sự kiện thành công!',
            icon: 'success',
          });
        })
      }
    });
  };

  const handleAddEvent = async () => {
    mySwal.fire({
      title: 'Thêm sự kiện',
      html: `
      <div>
        <label class="block text-left mb-2">Tên sự kiện:</label>
        <input type="text" id="event-title" class="w-full p-2 border rounded-lg mb-4" placeholder="Nhập tên sự kiện" />
      </div>
      <div>
        <label class="block text-left mb-2">Ngày nhắc nhở:</label>
        <input type="datetime-local" id="event-date" class="w-full p-2 border rounded-lg mb-4" />
      </div>
      <div>
        <label class="block text-left mb-2">Chu kỳ lặp lại:</label>
        <select id="event-repeat" class="w-full p-2 border rounded-lg">
          <option value="none">Không lặp lại</option>
          <option value="daily">Hàng ngày(vào giờ đã chọn)</option>
          <option value="monthly">Hàng tháng(vào ngày đã chọn)</option>
        </select>
      </div>`,
      showCancelButton: true,
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const title = (document.getElementById('event-title') as HTMLInputElement)?.value;
        const date = (document.getElementById('event-date') as HTMLInputElement)?.value;
        const repeat = (document.getElementById('event-repeat') as HTMLSelectElement)?.value;
  
        if (!title || !date) {
          Swal.showValidationMessage('Vui lòng nhập đầy đủ thông tin!');
        }

        // check ngày đã chọn có lớn hơn ngày hiện tại không
        const currentDate = new Date();
        const selectedDate = new Date(date);
        if (selectedDate < currentDate) {
          Swal.showValidationMessage('Ngày nhắc nhở phải lớn hơn ngày hiện tại!');
        }
  
        return { title, date, repeat };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // show swal loading
        mySwal.fire({
          title: 'Đang thêm sự kiện...',
          icon: 'info',
        });
        await axios.post('/baseapi/reminder', {
          title: result.value.title,
          date: result.value.date,
          repeat: result.value.repeat,
        },{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          mySwal.fire({
            title: 'Thêm sự kiện thành công!',
            icon: 'success',
          });
        })
      }
    });
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Lịch Nhắc Nhở
      </h1>
      <div className="flex justify-between items-center">
        <button onClick={handleAddEvent} className="bg-blue-500 text-white p-2 rounded-[10px] hover:bg-blue-600 transition-all duration-300 mb-2">Thêm sự kiện</button>
      </div>
      <div className="shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          locale={viLocale}
          dateClick={handleDateClick}
          events={events}
          eventClick={(eventClickInfo) =>
            mySwal.fire({
              title: 'Sự kiện',
              text: `Sự kiện: ${eventClickInfo.event.title}`,
              icon: 'info',
            })
          }
        />
      </div>
    </div>
  );
}
