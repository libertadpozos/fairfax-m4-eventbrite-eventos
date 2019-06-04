import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import api from '../../api/eb-api';

import './styles.scss';

import HomePage from '../HomePage';
import DetailEvent from '../DetailEvent';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isFetching: true,
      currentPage: 1,
    };
    this.getEvents = this.getEvents.bind(this);
    this.detailEvent = this.detailEvent.bind(this);
    this.handleMoreResultsClick = this.handleMoreResultsClick.bind(this);
  }

  componentDidMount() {
    this.getEvents(this.state.currentPage);
    console.log('didMOunt');
  }
  componentDidUpdate() {
    console.log('didUpdate');
    //this.getEvents(this.state.currentPage);
  }

  getEvents = (page) => {
    api
      .get(`events/search/?expand=venue&location.address=madrid&page=${page}`)
      .then(res =>
        this.setState(prevState => {
          return {
            events: res.data.events,
            isFetching: false,
          }
        }
        ),
      );
  };


  detailEvent(id) {
    const { events } = this.state;
    return events.find(event => event.id === id);
  }
  handleMoreResultsClick (event) {
    this.setState(prevState => {
      return {
        currentPage: prevState.currentPage + 1,
        isFetching: true,
      }
    })
    this.getEvents(this.state.currentPage);
  }

  render() {
    const { events, isFetching } = this.state;
    console.log('render');

    return (
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => <HomePage dataArr={events} loading={isFetching} />}
          />
          <Route
            path="/detail/:id"
            render={routerProps => (
              <DetailEvent
                loading={isFetching}
                match={routerProps.match}
                dataArr={this.detailEvent(routerProps.match.params.id)}
              />
            )}
          />
        </Switch>
        <button className="btn-more" onClick={this.handleMoreResultsClick }></button>
      </div>
    );
  }
}

export default App;
