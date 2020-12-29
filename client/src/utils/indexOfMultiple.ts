/**
 * given a string and an array of search strings
 * return the index of the first valid search string
 * @param  string        string to search in
 * @param  searchStrings array of search strings
 * @return               the index of the first valid search string, else -1 if none of them are in the string
 */
export default function indexOfMultiple(string:string, searchStrings: string[]) {
  for(let i=0; i<searchStrings.length; ++i) {
    const index = string.indexOf(searchStrings[i])
    if(index !== -1) {
      return index
    }
  }

  return -1
}
