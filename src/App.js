import React, { Component } from 'react';
import "bulma/bulma.sass";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      prizeList: [],
      displayList: [],
      uniqueList: [],
      displayUnique: false,
      year: -1,
      category: -1,
    };
  }

  componentDidMount() {
    fetch("http://api.nobelprize.org/v1/prize.json")
    .then(res => {
      if (res.status === 200) {
        res.json()
        .then(data => {
          this.setState({
            loading: false,
            prizeList: data.prizes,
            displayList: data.prizes,
          })
        })
        .catch(error => {
          this.setState({
            loading: false,
            error: true
          })
        })
      } else {
        this.setState({
          loading: false,
          error: true
        })
      }
    })
    .catch(error => {
      this.setState({
        loading: false,
        error: true
      })
    })
  }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  RenderLoading = () => {
    return (
      <div className="info">
        Loading...
      </div>
    );
  }

  RenderError = () => {
    return (
      <div style={{
        color: "red"
      }}
      className="info"
      >
        An error occured. Please refresh the page.
      </div>
    )
  }

  RenderOptions = () => {
    var yearsList = [
      {
        label: "Select Year",
        value: -1
      },
      {
        label: "All",
        value: -1
      }
    ];
    for (let i = 1900; i <= 2018; i++) {
      yearsList.push({
        label: i,
        value: i
      });
    }
    var set = new Set();
    this.state.prizeList.forEach(ele => {
      set.add(ele.category);
    })
    var categoryList = [
      {
        label: "Select Category",
        value: -1
      },
      {
        label: "All",
        value: -1
      },
      ...[...set].map(ele => ({
        label: ele,
        value: ele
      }))
    ];
    return (
      <div className="mw-60 center mb4">
        <div className="columns">
          <div className="column">
            <div className="select">
              <select
                onChange={event => this.handleChange("year", event.target.value)}
              >
                {yearsList.map(year => (
                  <option value={year.value}>{year.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="column">
            <div className="select">
              <select
                onChange={event => this.handleChange("category", event.target.value)}
              >
                {categoryList.map(ele => (
                  <option value={ele.value}>{ele.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="column">
            <button
              className="button is-primary"
              onClick={this.handleFilter}
            >
              Filter
            </button>
          </div>
          <div className="column">
            <button
              className="button is-light"
              onClick={this.handleUnique}
              title={!this.state.displayUnique ? 
                "Display those who've won Nobel prize multiple times" :
                "Display list of Nobel prize winners"
              }
            >
              {!this.state.displayUnique ? 
                "Multiple Times Lauretes" :
                "Go Back"
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  RenderTable = () => {
    return (
      <table className="table center mw-60">
        <thead>
          <tr>
            <th>Category</th>
            <th>Year</th>
            <th>Laureates</th>
          </tr>
        </thead>
        <tbody>
          {this.state.displayList.map(ele => (
            <tr>
              <td>{ele.category}</td>
              <td>{ele.year}</td>
              <td>
                {
                  ele.laureates ? ele.laureates.map((ele2, ind) => {
                    return (
                      `${ele2.firstname}${
                      ele2.lastname ? " " + ele2.lastname : ""
                      }${
                      ind != ele.laureates.length - 1 ? ", " : ""
                      }`
                    )
                  }) : null
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  handleUnique = () => {
    if (this.state.displayUnique) {
      return this.setState({
        displayUnique: false
      })
    }
    const { prizeList } = this.state;
    let uniqueList = new Set();
    for (let i = 0; i < prizeList.length; i++) {
      for (let j = 0; j < prizeList.length; j++) {
        if (i != j) {
          if (prizeList[i].laureates) {
            for (let m = 0; m < prizeList[i].laureates.length; m++) {
              if (prizeList[j].laureates) {
                for (let n = 0; n < prizeList[j].laureates.length; n++) {
                  if (prizeList[i].laureates[m].id == prizeList[j].laureates[n].id) {
                    uniqueList.add(prizeList[i].laureates[m].id);
                  }
                }
              }
            }
          }
        }
      }
    }
    this.setState({
      uniqueList: [...uniqueList],
      displayUnique: true,
      year: -1,
      category: -1
    })
  }

  handleFilter = () => {
    this.setState(prevState => ({
      displayList: prevState.prizeList.filter(ele => {
        let shouldInclude = true;
        if (this.state.year != -1) {
          shouldInclude &= ele.year == this.state.year;
        }
        if (this.state.category != -1) {
          shouldInclude &= ele.category == this.state.category;
        }
        return shouldInclude;
      })
    }))
  }

  RenderUnique = () => {
    return (
      <div>
        <table className="table center mw-60">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Year</th>
              <th>Motivation</th>
            </tr>
          </thead>
          <tbody>
            {this.state.uniqueList.map(id => {
              return this.state.displayList
                .filter(ele => {
                  let shouldInclude = false;
                  if (ele.laureates) {
                    ele.laureates.forEach(ele2 => {
                      if (ele2.id == id) {
                        shouldInclude = true;
                      }
                    })
                  }
                  return shouldInclude;
                })
                .map(ele => {
                  let person = ele.laureates.filter(person => person.id == id)[0];
                  return (
                    <tr>
                      <td>
                        {`${person.firstname}${
                          person.lastname ? " " + person.lastname : ""
                          }`}
                      </td>
                      <td>{ele.category}</td>
                      <td>{ele.year}</td>
                      <td>{person.motivation}</td>
                    </tr>
                  )
                })
            })}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div className="page">
        <div className="page-container">
          {
            this.state.loading ? (
              <this.RenderLoading />
            ) : this.state.error ? (
              <this.RenderError />
            ) : (
              <div>
                <this.RenderOptions />
                {
                  this.state.displayUnique ? (
                    <this.RenderUnique />
                  ) : (
                    <this.RenderTable />
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App;
