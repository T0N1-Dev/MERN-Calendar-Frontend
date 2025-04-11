import React, { useEffect, useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils'
import Swal from 'sweetalert2'
import './calendar.css'
import { RoundButton } from '../ui/RoundButton'
import { eventStartAddNewEvent, eventStartDelete, eventStartLoading, eventStartUpdate } from "../../actions/events";
import { useDispatch, useSelector } from 'react-redux'

export default function CalendarApp() {

  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.calendar);
  const { color } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch( eventStartLoading() );
  }, [dispatch]);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo) {

    const { start, end, allDay } = selectInfo;
    const backgroundColor = color;

    Swal.fire({
      title: "Please enter a new title for your event",
      input: "text",
      inputAttributes: {
        autocapitalize: "on"
      },
      showCancelButton: true,
      confirmButtonText: "Insert",
      showLoaderOnConfirm: true,
      preConfirm: (title) => {
        const event = { title, start, end, allDay, backgroundColor };
        console.log("Default Event", event);
        dispatch(eventStartAddNewEvent(event))
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        let title = result.value.login;
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect() // clear date selection

        if (title) {
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          })
        }
      }
    });
  }

  function handleEventClick(clickInfo) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the event '${clickInfo.event.title}'?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(eventStartDelete(clickInfo.event.id));
        clickInfo.event.remove()
        Swal.fire({
          title: "Correct!",
          icon: "success",
          draggable: true
        });
      }
    })
  }

  function handleEvents(events) {
    setCurrentEvents(events)
  }

  function handleUpdate(update){
    const { id, title, start, end, allDay, backgroundColor } = update.event;
    const eventUpdated = {id, title, start, end, allDay, backgroundColor};
    dispatch(eventStartUpdate(eventUpdated));
  }

  async function handleRoundedButtonClick() {
    const { value: formValues } = await Swal.fire({
      title: "Add new event",
      html: `
        <input id="title" class="swal2-input" placeholder="Enter event title" required>
  
        <label for="start-date" style="display:block; text-align:center; margin-top:20px;">Start</label>
        <input id="start-date" class="swal2-input" type="date" style="margin-top:0;">
        <label for="end-date" style="display:block; text-align:center; margin-top:20px;">End</label>
        <input id="end-date" class="swal2-input" type="date" style="margin-top:0;">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const titleInput = document.getElementById("title");
        const startDate = document.getElementById("start-date");
        const endDate = document.getElementById("end-date").value;

        if (!titleInput.value.trim()) {
          titleInput.style.border = "2px solid red";
          return false;
        } else if (!startDate.value) {
          startDate.style.border = "2px solid red";
          return false;
        }

        return { 
          titleInput,
          startDate,
          endDate
        };
      }
    });

    const { titleInput, startDate, endDate } = formValues || {};

    if (titleInput && startDate) {
      const title = titleInput.value;
      const start = new Date(`${startDate.value}T00:00:00`);
      const end = endDate ? new Date(`${endDate}T00:00:00`) : null;
      const newEvent = { title, start, end, allDay:true, backgroundColor: color };
      dispatch(eventStartAddNewEvent(newEvent));

      Swal.fire({
        title: "Great!",
        icon: "success",
        draggable: true
      });
    } 
  }
  
  const handleEventHover = (info) => {
      const username = info.event.extendedProps.user.username;
  
      const tooltip = document.createElement('div');
      tooltip.innerText = `By ${username}`;
      tooltip.style.position = 'absolute';
      tooltip.style.height = '25px';
      tooltip.style.backgroundColor = '#938b8d';
      tooltip.style.color = 'white';
      tooltip.style.padding = '4px 8px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '12px';
      tooltip.style.zIndex = '1000';
  
      const { left, top, height } = info.el.getBoundingClientRect();
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top + height + window.scrollY + 4}px`;
  
      document.body.appendChild(tooltip);
  
      info.el.addEventListener('mouseleave', () => {
        tooltip.remove();
      }, { once: true });
  }
  

  return (
    <div className='demo-app'>
      <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      />
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          validRange={{
            start: '2024-01-01',
            end: '2027-01-01'
          }}
          eventMouseEnter={handleEventHover}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={events}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          eventChange={handleUpdate}
          
        />
        <RoundButton onClick={handleRoundedButtonClick} />
      </div>
    </div>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }) {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be ready to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events ({currentEvents.length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function SidebarEvent({ event }) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}