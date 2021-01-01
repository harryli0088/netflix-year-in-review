/**
 * this function dynamically fills text on canvas on multiple lines
 * since canvas does not have a built-in function to do this
 * NOTE this function will use the "width" param as an argument to the fillText "maxWidth" optional param
 * Step 1: split "text" by any white space into an array of words
 * Step 2: dynamically determine which words can be filled on which lines, like how browsers automatically wrap text in DIVs or Ps
 * Step 3: fill each line as its own text and vertically space out each line
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


  //Step 1
  const splitStrs = text.match(/\S+/g) //split by any white space

  //Step 2
  const lines:string[] = [] //eventually each element will be one line of text to fill
  let currentLine:string = "" //used to track the current line string
  let currentLineWidth:number = 0 //used to track the current line string pixel width
  if(splitStrs) { //if splitStrs is valid
    let currentStrIndex = 0 //start at the first str
    while(splitStrs[currentStrIndex]) { //while there are still strs to look at
      const str = splitStrs[currentStrIndex] //get the current str
      const appendStr = currentLine === "" ? str : " "+str //get the string that would be appeneded to the currentLine
      const appendStrWidth = ctx.measureText(appendStr).width //calculate the width of the appendStr

      //if the current line plus this appendStr is short enough for one line
      if(currentLineWidth + appendStrWidth <= width) {
        currentLine += appendStr //append the string to the line
        currentLineWidth += appendStrWidth //update the line width
        ++currentStrIndex //move to the next str
      }
      else { //else we need to make a new line
        if(currentLine) { //if there is a previous current line
          lines.push(currentLine) //push this line
        }
        else { //else this str is too long and will be on a line by itself
          lines.push(str) //push this str as its own line
          ++currentStrIndex //move to the next str
        }

        //clear the current line trackers
        currentLine = ""
        currentLineWidth = 0
      }
    }

    if(currentLine) lines.push(currentLine) //if there is a remaining currentLine, push it
  }



  //Step 3
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
