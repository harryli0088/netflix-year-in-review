import React from 'react';
import './App.css';


type TVSeriesType = {
  "@context": string,
  "@type": string,
  actors: {
    "@type": string,
    name: string,
  }[],
  awards: string,
  contentRating: string,
  creator: {
    "@type": string,
    name: string,
  }[],
  dateCreated: string,
  description: string,
  director: {
    "@type": string,
    name: string,
  }[],
  genre: string,
  image: string,
  name: string,
  numberOfSeasons: number,
  startDate: string,
  url: string,
}

interface State {
  data?: TVSeriesType,
  errors: string[],
  status: string,
  titleId: string,
}

class App extends React.Component<{},State> {
  state:State = {
    errors: [],
    status: "",
    titleId: "70136120",
  }

  onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({
      errors: [],
      status: "loading",
    })

    try {
      const data:TVSeriesType = await fetch(`http://localhost:5000/title/${this.state.titleId}`).then(response => response.json())
      console.log(data)
      this.setState({
        data,
        status: "",
      })
    }
    catch(err) {
      console.error(err)
      this.setState({
        errors: [err.message],
        status: "error",
      })
    }
  }

  renderData = () => {
    if(this.state.data) {
      return (
        <div>
          <img src={this.state.data.image} alt={`${this.state.data.name}`}/>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <input value={this.state.titleId} onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.setState({titleId: e.target.value})}/>
          <button type="submit">Submit</button>

          {this.state.errors.map((e,i) => <div key={i}>{e}</div>)}
        </form>

        {this.renderData()}
      </div>
    )
  }
}

export default App;
