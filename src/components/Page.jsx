import React from 'react';
import Calendar from './Calendar.jsx';
import EventDetailOverlay from './EventDetailOverlay.jsx';
import {filterEventsByDay, getEventFromEvents, getDisplayDate} from '../utils';
import DATA_SET from '../utils/data';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import './Page.css';

const DayNavigator = ({dateDisplay, onPrev, onNext}) => {
  return (
    <nav className="page__nav">
      <button
        className="page__nav-button page__prev-day"
        title="Go to previous day"
        onClick={onPrev}
      />
      <h2 className="page__date">{dateDisplay}</h2>
      <button
        className="page__nav-button page__next-day"
        title="Go to next day"
        onClick={onNext}
      />
    </nav>
  );
};


class Page extends React.PureComponent {
  // state = {
  //   // unfiltered list of events
  //   events: DATA_SET,

  //   // The currently selected day represented by numerical timestamp
  //   day: Date.now(),

  //   // The currently selected event in the agenda
  //   // (mainly to trigger event detail overlay)
  //   selectedEventId: undefined
  // }



  componentDidMount() {
    console.log('paggeeee', this.props);
  }



  _handleSelectEvent(selectedEventId) {
    this.setState({selectedEventId});
  }

  _handleEventDetailOverlayClose() {
    this.setState({selectedEventId: undefined});
  }


  // fixed but later on make page handlers into 1 func, take in (prev,next) as params
  _handlePrev() {
    this.setState((prevState) => {
      return {
        day: prevState.day - (86400000) // - 1 day
      }
    })
  }

  _handleNext() {
    this.setState((prevState) => {
      return {
        day: prevState.day + (86400000) // + 1 day
      }
    })
  }

  render() {
    let {events, day, selectedEventId} = this.props;
    let filteredEvents = filterEventsByDay(events, day);
    let selectedEvent = getEventFromEvents(events, selectedEventId);
    let eventDetailOverlay;

    if (selectedEvent) {
      eventDetailOverlay = (
          <EventDetailOverlay
              event={selectedEvent}
              onClose={this._handleEventDetailOverlayClose.bind(this)}
          />
      );
    }

    return (
      <div className="page">
        <header className="page__header">
            <h1 className="page__title">Daily Agenda</h1>
        </header>
        <DayNavigator
            dateDisplay={getDisplayDate(day)}
            onPrev={this._handlePrev.bind(this)}
            onNext={this._handleNext.bind(this)}
        />
        <Calendar events={filteredEvents} onSelectEvent={this._handleSelectEvent.bind(this)} />
        {eventDetailOverlay}
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    events: state.events,
    day: state.day,
    selectedEventId: state.selectedEventId
  }
}

export default connect(mapStateToProps)(Page);

