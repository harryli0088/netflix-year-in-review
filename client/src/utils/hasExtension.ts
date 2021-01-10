export default function hasExtension(str:string, extension:string) {
  return str.slice(str.length-extension.length, str.length) === extension
}
