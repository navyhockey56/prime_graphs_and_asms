const EMPTY_CIRCLE = 'empty_circle.png'
const EMPTY_SQUARE = 'empty_square.png'
const FILLED_CIRCLE = 'filled_in_circle.png'
const FILLED_SQUARE = 'filled_in_square.png'

class Renderer {
  private base : HTMLElement

  constructor() {
    const div = document.getElementById("mainDiv")
    if (!div) throw ("Div is not defined or null.")
    this.base = div
  }

  addImage() {
    const child = new Image(20,20);
    child.src = 'empty_circle.png'
    this.base.appendChild(child)
  }

}