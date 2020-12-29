import axios from 'axios'
import cheerio from 'cheerio'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(bodyParser.json({limit: '50mb'}))
app.use(cors())
const port = 5000

app.get('/title/:id', (req:express.Request, res:express.Response) => {
  const url = getNetflixUrl(req)
  axios.get(url).then(response => {
    try {
      const $ = cheerio.load(response.data)

      const scripts:cheerio.Cheerio = $('script[type="application/ld+json"]')
      if(scripts.length === 0) {
        throw new Error("No scripts found")
      }
      else {
        if(scripts.length > 1) {
          console.warn("There were multiple scripts that matched the query for", url)
        }

        const s = scripts[0] as cheerio.TagElement
        res.send(s.children[0].data)
      }
    }
    catch(err) {
      res.status(500).send(err.message)
    }
  }).catch((err) => {
    res.status(500).send(err.message)
  })
})
app.get('/topNodeIdFromTitle/:title', async (req:express.Request, res:express.Response) => {
  console.log(req.params.title)
  try {
    const netflixUrl = await getTopNodeIdFromGoogleUsingTitle(req.params.title || "")

    res.status(200).send(netflixUrl)
  }
  catch(err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})


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
