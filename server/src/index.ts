import axios from 'axios'
import cheerio from 'cheerio'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
const port = 5000

app.get('/title/:id', (req:express.Request, res:express.Response) => {
  const url = getNetflixUrl(req)
  axios.get(url).then(response => {
    try {
      const $ = cheerio.load(response.data)
      console.log($("div").css("background-image"))
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function getNetflixUrl(req:express.Request):string {
  return "https://www.netflix.com" + req.path
}
