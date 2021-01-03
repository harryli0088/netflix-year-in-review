export default async function shareApi(blob:Blob) {
  try {
    // @ts-ignore
    await navigator.share({ files: [blob] })
    console.log("Share Successful")
    return true
  }
  catch(err) {
    console.error(err)
  }

  return false
}
