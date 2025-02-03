import React from 'react';
import { Navbar } from '../ui/Navbar';
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import {
  Button,
  Datepicker,
  Dropdown,
  Eventcalendar,
  Input,
  Popup,
  Segmented,
  SegmentedGroup,
  setOptions,
  Snackbar,
  Switch,
  Textarea,
} from '@mobiscroll/react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal, uiCloseModal } from '../../actions/ui';
import { eventStartAddNewEvent, eventStartUpdate, eventStartDelete, eventStartLoading, eventLoaded, eventStartSetActive } from '../../actions/events';
import { RoundButton } from '../ui/RoundButton';
import _ from 'lodash';

setOptions({
  theme: 'windows',
  themeVariant: 'light'
});

export const CalendarScreen = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { modalOpen, mgError } = useSelector((state) => state.ui);
  const { uid, name, color } = useSelector((state) => state.auth);
  const [tempEvent, setTempEvent] = useState(null);
  const [undoEvent, setUndoEvent] = useState(null);
  const [isEdit, setEdit] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [start, startRef] = useState(null);
  const [end, endRef] = useState(null);
  const [popupEventTitle, setTitle] = useState('');
  const [popupEventDescription, setDescription] = useState('');
  const [popupEventAllDay, setAllDay] = useState(true);
  const [popupTravelTime, setTravelTime] = useState(0);
  const [popupEventDate, setDate] = useState([]);
  const [popupEventStatus, setStatus] = useState('busy');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch( eventStartLoading() );
    if (mgError) {
      setSnackbarOpen(false);
    }
  }, [dispatch, mgError]);

  // It's necessary to avoid a mutation of the Redux state by the EventCalendar component
  const eventCalendarData = useMemo(() => _.cloneDeep(events), [events]);

  const snackbarButton = useMemo(
    () => ({
      action: () => {
        dispatch(eventStartAddNewEvent(undoEvent));
      },
      text: 'Undo',
    }),
    [undoEvent, dispatch],
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const saveEvent = useCallback(() => {
    const newEvent = {
      id: '',
      title: popupEventTitle,
      description: popupEventDescription,
      start: popupEventDate[0],
      end: popupEventDate[1],
      allDay: popupEventAllDay,
      bufferBefore: popupTravelTime,
      status: popupEventStatus,
      color: color,
      tooltip: 'By ' + name,
      user: {uid, name}
    };
    if (isEdit) {
      newEvent.id = activeEvent.id;
      dispatch(eventStartUpdate(newEvent));
    } else {
      dispatch(eventStartAddNewEvent(newEvent));
    }
    // close the popup
    dispatch(uiCloseModal());
  }, [
    isEdit,
    popupEventAllDay,
    popupEventDate,
    popupEventDescription,
    popupEventStatus,
    popupEventTitle,
    popupTravelTime,
    uid,
    name,
    color,
    activeEvent,
    dispatch
  ]);

  const deleteEvent = useCallback(
    (event) => {
      dispatch(eventStartDelete());
      if (!mgError) {
        setUndoEvent(event);
        setSnackbarOpen(true);
      }
    },
    [dispatch, mgError],
  );

  const loadPopupForm = useCallback((event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate([event.start, event.end]);
    setAllDay(event.allDay || false);
    setTravelTime(event.bufferBefore || 0);
    setStatus(event.status || 'busy');
  }, []);

  const titleChange = useCallback((ev) => {
    setTitle(ev.target.value);
  }, []);

  const descriptionChange = useCallback((ev) => {
    setDescription(ev.target.value);
  }, []);

  const allDayChange = useCallback((ev) => {
    setAllDay(ev.target.checked);
  }, []);

  const travelTimeChange = useCallback((ev) => {
    setTravelTime(ev.target.value);
  }, []);

  const dateChange = useCallback((args) => {
    setDate(args.value);
  }, []);

  const statusChange = useCallback((ev) => {
    setStatus(ev.target.value);
  }, []);

  const onDeleteClick = useCallback(() => {
    deleteEvent(tempEvent);
    dispatch(uiCloseModal());
  }, [deleteEvent, tempEvent, dispatch]);

  const onEventClick = useCallback(
    (args) => {
      setEdit(true);
      !_.isEqual(args.event, activeEvent) && dispatch(eventStartSetActive({...args.event}));
      setTempEvent(args.event);
      // fill popup form with event data
      loadPopupForm(args.event);
      setAnchor(args.domEvent.target);
      dispatch(uiOpenModal());
    },
    [loadPopupForm, dispatch, activeEvent],
  );

  const onEventCreated = useCallback(
    (args) => {
      setEdit(false);
      setTempEvent(args.event);
      // fill popup form with event data
      loadPopupForm(args.event);
      setAnchor(args.target);
      // open the popup
      dispatch(uiOpenModal());
    },
    [loadPopupForm, dispatch],
  );

  const onEventDeleted = useCallback(
    (args) => {
      deleteEvent(args.event);
    },
    [deleteEvent],
  );

  const onEventUpdated = useCallback((args) => {
    dispatch(eventStartUpdate({...args.event}));
  }, [dispatch]);

  const handleCancelClick = useCallback(() => {
    if ( tempEvent?.id !== activeEvent?.id ) {
      dispatch(eventLoaded(events.filter(event => event.id !== tempEvent?.id)));
    }
    dispatch(uiCloseModal());
  }, [dispatch, events, tempEvent, activeEvent]);

  const controls = useMemo(() => (popupEventAllDay ? ['date'] : ['datetime']), [popupEventAllDay]);
  const datepickerResponsive = useMemo(
    () =>
      popupEventAllDay
        ? {
            medium: {
              controls: ['calendar'],
              touchUi: false,
            },
          }
        : {
            medium: {
              controls: ['calendar', 'time'],
              touchUi: false,
            },
          },
    [popupEventAllDay],
  );

  const headerText = useMemo(() => (isEdit ? 'Edit event' : 'New Event'), [isEdit]);
  const popupButtons = useMemo(() => {
    if (isEdit) {
      return [
        {
          handler: handleCancelClick,
          keyCode: 'escape',
          text: 'Cancel',
          cssClass: 'mbsc-popup-button-secondary'
        },
        {
          handler: () => {
            saveEvent();
          },
          keyCode: 'enter',
          text: 'Save',
          cssClass: 'mbsc-popup-button-primary',
        },
      ];
    } else {
      return [
        {
          handler: handleCancelClick,
          keyCode: 'escape',
          text: 'Cancel',
          cssClass: 'mbsc-popup-button-secondary'
        },
        {
          handler: () => {
            saveEvent();
          },
          keyCode: 'enter',
          text: 'Add',
          cssClass: 'mbsc-popup-button-primary',
        },
      ];
    }
  }, [isEdit, saveEvent, handleCancelClick]);

  const popupResponsive = useMemo(
    () => ({
      medium: {
        display: 'anchored',
        width: 400,
        fullScreen: false,
        touchUi: false,
      },
    }),
    [],
  );

  const onClose = useCallback(() => {
    if ( tempEvent?.id !== activeEvent?.id ) {
      dispatch(eventLoaded(events.filter(event => event.id !== tempEvent?.id)));
    }
    dispatch(uiCloseModal());
  }, [dispatch, events, tempEvent, activeEvent ]);

  const handleRoundButtonClick = useCallback(() => {
    const newEvent = {
      id: '',
      title: 'New Event',
      notes: '',
      start: new Date(),
      end: new Date(),
      allDay: true,
      bufferBefore: 0,
      status: 'busy',
      color: color,
      tooltip: `By ${name}`,
      user: { uid, name }
    };
    dispatch(eventStartSetActive({...newEvent}));
    setAnchor(null);
    setEdit(false);
    setTempEvent(newEvent);
    loadPopupForm(newEvent);
    setAnchor(null);
    dispatch(uiOpenModal());
  }, [color, uid, name, loadPopupForm, dispatch]);

  console.log(eventCalendarData);
  return (
    <>
      <Navbar />
      <Eventcalendar
        clickToCreate={true}
        // immutableData={true} // good idea to avoid eventCalendarData (a copy of events)
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        data={eventCalendarData}
        onEventClick={onEventClick}
        onEventCreated={onEventCreated}
        onEventDeleted={onEventDeleted}
        onEventUpdated={onEventUpdated}
        data-testid="event-calendar-mock"
      />
      <Popup
        display="center"
        contentPadding={false}
        headerText={headerText}
        anchor={anchor}
        buttons={popupButtons}
        isOpen={modalOpen}
        onClose={onClose}
        responsive={popupResponsive}
        touchUi={false}
      >
        <div className="mbsc-form-group">
          <Input label="Title" value={popupEventTitle} onChange={titleChange} />
          <Textarea label="Description" value={popupEventDescription} onChange={descriptionChange} />
        </div>
        <div className="mbsc-form-group">
          <Switch label="All-day" checked={popupEventAllDay} onChange={allDayChange} />
          <Input ref={startRef} label="Starts" />
          <Input ref={endRef} label="Ends" />
          {!popupEventAllDay && (
            <div id="travel-time-group">
              <Dropdown label="Travel time" value={popupTravelTime} onChange={travelTimeChange}>
                <option value="0">None</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </Dropdown>
            </div>
          )}
          <Datepicker
            select="range"
            display="anchored"
            controls={controls}
            touchUi={true}
            startInput={start}
            endInput={end}
            showRangeLabels={false}
            responsive={datepickerResponsive}
            onChange={dateChange}
            value={popupEventDate}
          />
          <SegmentedGroup onChange={statusChange}>
            <Segmented value="busy" checked={popupEventStatus === 'busy'}>
              Show as busy
            </Segmented>
            <Segmented value="free" checked={popupEventStatus === 'free'}>
              Show as free
            </Segmented>
          </SegmentedGroup>
          {isEdit ? (
            <div className="mbsc-button-group">
              <Button className="mbsc-button-block" color="danger" variant="outline" onClick={onDeleteClick} data-testid="delete-event">
                Delete event
              </Button>
            </div>
          ) : null}
        </div>
      </Popup>
      <Snackbar isOpen={isSnackbarOpen} message="Event deleted" button={snackbarButton} onClose={handleSnackbarClose} />
      <RoundButton onClick={handleRoundButtonClick}/>
    </>
  );
}