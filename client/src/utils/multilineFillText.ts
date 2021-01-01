/**
 * this function dynamically fills text on canvas on multiple lines
 * since canvas does not have a built-in function to do this
 * NOTE this function will use the "width" param as an argument to the fillText "maxWidth" optional param
 * @param  ctx    canvas context
 * @param  text   text to fill
 * @param  x      desired bounding box x (top left corner)
 * @param  y      desired bounding box y (top left corner)
 * @param  width  desired bounding box width
 * @param  height desired bounding box height
 */
export default function multilineFillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
):void {
  ctx.save() //save the current context state so we don't mess anything after this function call


  //calculations
  const split = text.match(/\S+/g) //split by any white space

  const lines:string[] = [] //eventually each element will be one line of text to fill
  //track current line data
  let currentLine:string = ""
  let currentLineWidth:number = 0
  if(split) {
    let currentStrIndex = 0
    while(split[currentStrIndex]) {
      const str = split[currentStrIndex]
      const currentStr = currentLine==="" ? str : " "+str
      const strWidth = ctx.measureText(currentStr).width

      //if the current line plus this str is short enough for one line
      if(currentLineWidth + strWidth <= width) {
        currentLine += currentStr //add the string to the line
        currentLineWidth += strWidth //update the line width
        ++currentStrIndex //move to the next str
      }
      else { //else we need to make a new line
        if(currentLine) { //if there is a previous current line
          lines.push(currentLine) //push this line
        }
        else { //else this str will be one a line by itself
          lines.push(str) //push this str
          ++currentStrIndex //move to the next str
        }

        //clear the current line trackers
        currentLine = ""
        currentLineWidth = 0
      }
    }

    if(currentLine) lines.push(currentLine)
  }



  //start drawing
  ctx.textBaseline = "middle"

  const heightInterval = height / (lines.length+1) //calculate how much vertical space each line can take up
  const textX = (() => { //determine the x position of the text based on the text alignment
    if(ctx.textAlign === "center") return x + width/2
    else if(ctx.textAlign === "right") return x + width
    return x
  })() //self involking function

  //fill each line
  lines.forEach((line,i) => {
    ctx.fillText(
      line,
      textX,
      y + (i+1)*heightInterval,
      width,
    )
  })


  ctx.restore() //restore the original context state
}
