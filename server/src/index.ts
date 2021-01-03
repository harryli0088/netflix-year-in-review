require('dotenv').config()
const TMDB_API_KEY = process.env.TMDB_API_KEY
import axios from 'axios'
import cheerio from 'cheerio'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import rateLimit from "express-rate-limit"

const app = express()
app.use(bodyParser.json({limit: '50mb'}))
app.use(cors())
const port = process.env.PORT || 5000

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5 // limit each IP to 5 requests per windowMs
})
app.use(limiter)

app.get('/', (req:express.Request, res:express.Response) => {
  res.status(200).send("nyir2020 API")
})

// app.get('/title/:id', (req:express.Request, res:express.Response) => {
//   const url = getNetflixUrl(req)
//   axios.get(url).then(response => {
//     try {
//       const $ = cheerio.load(response.data)
//
//       const scripts:cheerio.Cheerio = $('script[type="application/ld+json"]')
//       if(scripts.length === 0) {
//         throw new Error("No scripts found")
//       }
//       else {
//         if(scripts.length > 1) {
//           console.warn("There were multiple scripts that matched the query for", url)
//         }
//
//         const s = scripts[0] as cheerio.TagElement
//         res.send(s.children[0].data)
//       }
//     }
//     catch(err) {
//       res.status(500).send(err.message)
//     }
//   }).catch((err) => {
//     res.status(500).send(err.message)
//   })
// })
//
// app.get('/topNodeIdFromTitle/:title', async (req:express.Request, res:express.Response) => {
//   console.log(req.params.title)
//   try {
//     const netflixUrl = await getTopNodeIdFromGoogleUsingTitle(req.params.title || "")
//
//     res.status(200).send(netflixUrl)
//   }
//   catch(err) {
//     console.error(err)
//     res.status(500).send(err.message)
//   }
// })

// app.get('/tmdbSearchTv/:title', async (req:express.Request, res:express.Response) => {
//   console.log('tmdbSearchTv',req.params.title)
//   axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(req.params.title)}`).then(tmdbResponse => {
//     res.status(tmdbResponse.status).send(tmdbResponse.data)
//   }).catch((err) => {
//     res.status(500).send(err.message)
//   })
// })
//
// app.get('/tmdbTvDetails/:titleId', async (req:express.Request, res:express.Response) => {
//   console.log('tmdbTvDetails',req.params.titleId)
//   axios.get(`https://api.themoviedb.org/3/tv/${req.params.titleId}?api_key=${TMDB_API_KEY}`).then(tmdbResponse => {
//     res.status(tmdbResponse.status).send(tmdbResponse.data)
//   }).catch((err) => {
//     res.status(500).send(err.message)
//   })
// })



type TmdbDataType = {
  backdrop_path: string,
  episode_run_time: number[],
  genres: {id:number, name: string}[],
  id: number,
  original_language: string,
  poster_path: string,
  runtime: number,
}

const EMPTY_TMDB_DATA:TmdbDataType = {
  backdrop_path: "",
  episode_run_time: [],
  genres: [],
  id: -1,
  original_language: "",
  poster_path: "",
  runtime: 0,
}

app.post('/postBatchTvDetails', async (req:express.Request, res:express.Response) => {
  const titles:string[] = req.body
  console.log(titles)

  const data = await postBatchTmdbData("tv", titles)

  res.status(200).send(data)
})

app.post('/postBatchMovieDetails', async (req:express.Request, res:express.Response) => {
  const titles:string[] = req.body
  console.log(titles)

  const data = await postBatchTmdbData("movie", titles)

  res.status(200).send(data)
})

async function postBatchTmdbData(
  type: "tv" | "movie",
  titles: string[],
) {
  const isTv = type === "tv"

  const data:{[title:string]: TmdbDataType} = {}
  await Promise.all(
    titles.map(t => new Promise(
      async (resolve, reject) => {
        const titleData:TmdbDataType = {...EMPTY_TMDB_DATA}
        data[t] = titleData

        try {
          const searchData = await axios.get(
            `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(t)}`
          ).then(response => response.data)

          const result = (searchData.results && searchData.results[0]) //ASSUME the first result is what we're looking for
          if(result) {
            titleData.backdrop_path = result.backdrop_path || ""
            titleData.id = !isNaN(result.id) ? result.id : -1
            titleData.original_language = result.original_language || ""
            titleData.poster_path = result.poster_path || ""

            const details = await axios.get(
              `https://api.themoviedb.org/3/${type}/${titleData.id}?api_key=${TMDB_API_KEY}`
            ).then(response => response.data)
            if(details) {
              titleData.episode_run_time = details.episode_run_time || []
              titleData.genres = details.genres || []
              titleData.runtime = details.runtime || 0
            }
            else {
              throw new Error(`There were no ${type.toUpperCase()} details for title: ${t}, id: ${titleData.id}`)
            }
            console.log(`Successfully got data for title: ${t}`)
            resolve(t)
          }
          else {
            throw new Error(`There were no results from TMDB for ${type.toUpperCase()} search: ${t}`)
          }
        }
        catch(err) {
          reject(err)
        }
      }).catch(console.error)
    )
  )

  console.log("data", data)
  return data
}




// app.get("/tmdbImg/:path", async (req:express.Request, res:express.Response) => {
//   const path:string = req.params.path
//   const url = 'https://image.tmdb.org/t/p/original/' + path
//   console.log("Requesting image", url)
//   axios({ method: 'get', responseType: 'stream', url }).then(
//     response => response.data.pipe(res)
//   ).catch(err => res.status(500).send(err.message))
// })


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function getNetflixUrl(req:express.Request):string {
  return "https://www.netflix.com" + req.path
}


function getGoogleUrl(searchString:string):string {
  return `https://www.google.com/search?q=${encodeURIComponent(searchString)}`
}

async function getTopNodeIdFromGoogleUsingTitle(title:string) {
  const url = getGoogleUrl(title) //build a google search url using the title

  const response = await axios.get(url) //request search data from google

  const $ = cheerio.load(response.data)

  const anchors = $("a") //get the anchors in the document

  const NETFLIX_URL = "https://www.netflix.com/title/"
  for(let i=0; i<anchors.length; ++i) { //loop through all the anchors
    const a = anchors[i] as cheerio.TagElement

    const href = a.attribs.href //get the href attribute of this anchor
    const netflixStartIndex = href.indexOf(NETFLIX_URL) //determine if the netflix url appears in the href
    if(netflixStartIndex >= 0) { //if the netflix url appears in the href
      //determine if there is an ampersand in the href
      const indexOfAmpersand = href.indexOf("&")
      const endIndex = indexOfAmpersand===-1 ? href.length : indexOfAmpersand //our end index should be the ampersand if it is there, else the end of the href

      return href.slice(netflixStartIndex + NETFLIX_URL.length, endIndex) //return only the top node id part of the href
    }
  }

  return "" //we did not find any netflix urls in the results
}

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
