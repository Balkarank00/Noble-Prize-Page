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
      year: null,
      category: null,
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
    console.log(name, " ", value);
    this.setState({
      [name]: value
    })
  }

  RenderLoading = () => {
    return (
      <div>
        Loading
      </div>
    );
  }

  RenderError = () => {
    return (
      <div style={{
        color: "red"
      }}>
        An error Occured
      </div>
    )
  }

  RenderOptions = () => {
    var yearsList = ["Select Year"];
    for (let i = 1900; i <= 2018; i++) {
      yearsList.push(i);
    }
    // var set = new Set();
    // this.state.prizeList.forEach(ele => {
    //   set.add(ele.category);
    // })
    var categoryList = [
      "Select Category",
      ...["chemistry", "economics", "literature", "peace", "physics", "medicine"]
    ];
    return (
      <div className="flex align-center justify-center mb4">
        <div className="select">
          <select 
            onChange={event => this.handleChange("year", event.target.value)} 
          >
            {yearsList.map(year => (
              <option>{year}</option>
            ))}
          </select>
        </div>
        <div className="select">
          <select 
            onChange={event => this.handleChange("category", event.target.value)} 
          >
            {categoryList.map(cat => (
              <option>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <button 
            className="button is-primary"
            onClick={this.handleFilter}
          >
            Filter  
          </button>
        </div>
        <div>
          <button 
            className="button is-light"
            onClick={this.handleReset}
          >
            Reset  
          </button>
        </div>
      </div>
    );
  }

  RenderTable = () => {
    return (
      <table className="table center">
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
                {ele.laureates ? ele.laureates.map(ele2 => (
                  `${ele2.firstname}${ele2.lastname ? " " + ele2.lastname : ""}, `
                )) : "No Laureates"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  handleReset = () => {
    this.setState({
      displayList: this.state.prizeList
    })
  }

  handleFilter = () => {
    if (this.state.year === null && this.state.category !== null) {
      //filter category
      console.log("pola");
      this.setState(prevState => ({
        displayList: prevState.prizeList.filter(ele => {
          // console.log("lolo ", ele.category, " ", this.state.category)
          return ele.category == this.state.category
          }
        )
      }))
    } else if (this.state.category === null && this.state.year !== null) {
      // filter year
      console.log("cola");
      this.setState(prevState => ({
        displayList: prevState.prizeList.filter(ele => 
          ele.year == this.state.year
        )
      }))
    } else if (this.state.category != null && this.state.year != null) {
      // filter everything
      console.log("lola");
      this.setState(prevState => ({
        displayList: prevState.prizeList.filter(ele => 
          ele.year == this.state.year &&
          ele.category == this.state.category
        )
      }))
    }
  }

  render() {
    if (this.state.loading) {
      return <this.RenderLoading />
    } else if (this.state.error) {
      return <this.RenderError />
    }
    console.log(this.state.prizeList);
    return (
      <div className="page">
        <div className="page-container">
          <this.RenderOptions />
          <this.RenderTable />
        </div>
      </div>
    )
  }
}

export default App;
