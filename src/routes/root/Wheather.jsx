import React from 'react';
import { Container, Col, Row } from 'reactstrap';
import Location from 'react-icons/lib/md/location-on';
import Delete from 'react-icons/lib/ti/delete';
import cs from './component.pcss';

class Wheather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: null,
      selectedOption: '',
      cities: [],
      options: [],
    };
  }

  componentWillMount() {
    let initialOptions = [
      { value: 'Add country', id: 0 },
      { value: 'Yerevan', id: 1 },
      { value: 'Moscow', id: 2 },
      { value: 'San Francisco', id: 3 },
      { value: 'Paris', id: 4 },
    ];
    let initialCities = [];

    if (Object.hasOwnProperty.call(localStorage, 'cities')) {
      initialCities = localStorage.getItem('cities').split(',');
      const finalOptions = [];

      for (let i = 0; i < initialOptions.length; i++) {
        const option = initialOptions[i];
        const index = initialCities.indexOf(option.value);

        if (index === -1) {
          finalOptions.push(option);
        }
      }

      initialOptions = finalOptions;
    }

    this.setState({
      cities: initialCities,
      options: initialOptions,
    });
  }

  handleChange(event) {
    const { cities } = this.state;
    const newCities = Array.concat([], cities, event.target.value);

    const index = event.target.selectedIndex;
    const arrayOption = this.state.options;
    arrayOption.splice(index, 1);

    this.setState({
      options: arrayOption,
      selectedOption: 'Add country',
      cities: newCities,
    });
    localStorage.setItem('cities', newCities);
    this.Change(event.target.value);
  }
  remove(item, e) {
    e.stopPropagation();

    const { cities, options } = this.state;
    const index = cities.indexOf(item);
    cities.splice(index, 1);

    const newOptions = Array.concat([], options, {
      value: item,
      id: Date.now(),
    });

    this.setState({
      cities,
      options: newOptions,
      data: null,
    });

    if (cities.length) {
      localStorage.setItem('cities', cities);
    } else {
      localStorage.removeItem('cities');
    }
  }
  Change(city) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bdb69b5685832284db539510d237124e`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        },
      );
  }

  renderContent() {
    const { data } = this.state;
    const tempMin = (data.main.temp_min - 273.15);
    const tempMax = (data.main.temp_max - 273.15);

    return (
      <div>
        <div>{data.name}</div>
        <div className={cs.left}>Min
          <div>{tempMin}</div>
        </div>
        <div className={cs.right}>Max
          <div>{tempMax}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={5} md={4} className={cs.left_hend}>
            <form onSubmit={this.handleSubmit}>
              <select value={this.state.selectedOption} onChange={this.handleChange.bind(this)}>
                {
                  this.state.options.map(option => {
                    return (<option
                      key={option.id}
                      value={option.value}
                    >{option.value}</option>);
                  })
                }
              </select>
            </form>
            <div>
              <ul className={cs.ul}>
                {
                  this.state.cities.map((item) => {
                    return (<li
                      key={item.toString()}
                      onClick={this.Change.bind(this, item)}
                      role="presentation"
                    >
                      <Location />
                      {item}
                      <Delete
                        className={cs.delete}
                        onClick={this.remove.bind(this, item)}
                      />
                    </li>);
                  })
                }
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={7} md={8}>
            <div className={cs.right_hend}>
              { this.state.data === null ?
                <div>Select City from Dropdown menu</div> : this.renderContent() }
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Wheather;
