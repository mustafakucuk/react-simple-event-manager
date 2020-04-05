import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import moment from 'moment';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

class EventItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        }
    }

    componentDidMount() {
        this.eventDate();
    }

    eventDate() {
        const eventItem = this.props.eventItem;
        setInterval(() => {
            let eventDate = eventItem.eventDate;
            const now = moment().unix();
            eventDate = moment(eventDate).unix();
            const diffTime = eventDate - now;
            const duration = moment.duration(diffTime * 1000, 'milliseconds');
            this.setState({
                days: duration.days(),
                hours: duration.hours(),
                minutes: duration.minutes(),
                seconds: duration.seconds(),
            })
        }, 1000)
    }

    render() {
        const eventItem = this.props.eventItem;
        const {days, hours, minutes, seconds} = this.state;
        return (
            <Col md={6} className='event-item'>
                <Card>
                    <Card.Header>{eventItem.eventName}
                        <span className='pull-right' onClick={this.props.eventDelete.bind(eventItem)}>Delete</span>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>{days} Days {hours} Hours {minutes} Minutes {seconds} Seconds</Card.Title>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventName: '',
            eventDate: '',
            events: []
        }
    }

    componentDidMount() {
        const localEvents = localStorage.getItem('events');
        if (localEvents) {
            this.setState({
                events: JSON.parse(localEvents)
            });
        }
    }

    componentDidUpdate() {
        const events = this.state.events;
        localStorage.setItem('events', JSON.stringify(events));
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    addEvent() {
        const {eventName, eventDate, events} = this.state;
        if (eventDate) {
            events.push({
                id: moment().unix(),
                eventName,
                eventDate
            });

            this.setState({
                events
            })
        }

    }

    eventDelete(eventItem) {
        const eventId = eventItem.id;
        const newEvents = this.state.events.filter(eventItem => {
            return eventItem.id != eventId;
        });

        this.setState({
            events: newEvents
        });
    }

    render() {
        return (
            <div className="App">
                <Container>
                    <Row>
                        <Col>
                            <Form.Group controlId="eventName">
                                <Form.Label>Event Name</Form.Label>
                                <Form.Control placeholder="Event Name" onChange={this.handleChange.bind(this)}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="eventDate">
                                <Form.Label>Event Date</Form.Label>
                                <Form.Control type="datetime-local" placeholder="Event Date"
                                              onChange={this.handleChange.bind(this)}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.addEvent.bind(this)}>
                                Add Event
                            </Button>
                        </Col>
                    </Row>
                    <Row className='event-list'>
                        {this.state.events && this.state.events.map((eventItem) => {
                            return (
                                <EventItem eventItem={eventItem} eventDelete={this.eventDelete.bind(this, eventItem)}/>
                            )
                        })}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
