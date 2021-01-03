export default function drawImage(
  ctx: CanvasRenderingContext2D,
  img: typeof Image | HTMLImageElement,
  arg1: number,
  arg2: number,
  ...args: number[]
) {
  try {
    // @ts-ignore
    ctx.drawImage(img, arg1, arg2, ...args)
  }
  catch(err) {
    console.error(img, err)
  }
}
