export default async function shareApi(blob:Blob) {
  try {
    // @ts-ignore
    const result = await navigator.share({ files: [blob] })
    console.log("Share Successful")
    return true
  }
  catch(err) {
    console.error(err)
  }

  return false
}
