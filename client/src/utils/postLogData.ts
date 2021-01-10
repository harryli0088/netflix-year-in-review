import { SERVER_URL } from "consts"
import { YearDataMapType } from "utils/processCsvData"
import hasExtension from "utils/hasExtension"
import processPosterOverviewData from "utils/processPosterOverviewData"
import { processPosterTopData } from "utils/processPosterTopXData"


export default function postLogData(yearDataMap:YearDataMapType) {
  const overviewData = processPosterOverviewData(yearDataMap)
  const tmpTopData = processPosterTopData(yearDataMap)
  const topData:{hasImgSrcs: boolean[], scores: number[], titles: string[]} = {
    hasImgSrcs: tmpTopData.imgSrcs.map(str => hasExtension(str, ".jpg")),
    scores: tmpTopData.scores,
    titles: tmpTopData.titles,
  }

  console.log({
    overviewData,
    topData,
  })

  fetch(`${SERVER_URL}/postLogData`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({
      overviewData,
      topData,
    })
  }).then(
    response => response.text()
  ).then(
    text => console.log(text)
  ).catch(
    err => console.error(err)
  )
}
