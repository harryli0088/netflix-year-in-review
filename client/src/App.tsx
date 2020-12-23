import React from 'react'
import Poster from 'Components/Poster/Poster'
import './App.css'


export type TVSeriesType = {
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
  data: TVSeriesType[],
  errors: string[],
  status: string,
  titleIds: string,
}

class App extends React.Component<{},State> {
  state:State = {
    data: [],
    errors: [],
    status: "",
    titleIds: "81193309, 81243992, 81290293, 81045349, 81144925",
  }

  componentDidMount() {
    this.requestTitleData()
  }

  onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.requestTitleData()
  }

  requestTitleData = async () => {
    this.setState({
      errors: [],
      status: "loading",
    })

    const ids = this.state.titleIds.split(",").map(id => id.trim())
    const results = await Promise.all(
      ids.map(async id => {
        try {
          const data:TVSeriesType = await fetch(`http://localhost:5000/title/${id}`).then(response => response.json())
          return data
        }
        catch(err) {
          console.error(err)
          this.setState({
            errors: [err.message],
            status: "error",
          })
        }
      })
    )


    const data:TVSeriesType[] = []
    results.forEach(r => {
      if(r) {
        data.push(r)
      }
    })

    console.log(data)
    this.setState({
      data,
      status: "",
    })
  }

  renderData = () => {
    if(this.state.data.length > 0) {
      return (
        <div>
          <Poster data={this.state.data}/>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <label>Title Ids (comma separated)</label>
          <input value={this.state.titleIds} onChange={(e:React.ChangeEvent<HTMLInputElement>) => this.setState({titleIds: e.target.value})}/>
          <button type="submit">Submit</button>

          {this.state.errors.map((e,i) => <div key={i}>{e}</div>)}
        </form>

        {this.renderData()}
      </div>
    )
  }
}

export default App;
