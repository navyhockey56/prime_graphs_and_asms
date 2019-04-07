const EMPTY_CIRCLE = 'empty_circle.png'
const EMPTY_SQUARE = 'empty_square.png'
const FILLED_CIRCLE = 'filled_in_circle.png'
const FILLED_SQUARE = 'filled_in_square.png'

class Foo {
  private views: CycleView[] = []

  constructor(private asm : Asm) {

  }
}

class CycleView {
  private position = 0
  private imageViews: ImageView[] = []
  private base: HTMLElement
  private length: number
  private isClosed: boolean = false

  constructor(
    private activators: number,
    private nonActivators: number
  ) {
    const mainDiv = document.getElementById("mainDiv")
    this.base = document.createElement('ul')
    if (!mainDiv) throw("base is null")
    mainDiv.appendChild(this.base)

    for (let i = 0; i < this.activators; i++) {
      this.imageViews.push(new ActivatorImageView(this.base, false))
    }
    for (let i = 1; i < this.nonActivators; i++) {
      this.imageViews.push(new NonActivatorImageView(this.base, false))
    }
    this.imageViews.push(new NonActivatorImageView(this.base, true))

    this.imageViews.forEach(c => c.render())
    this.length = this.activators + this.nonActivators
    this.position = this.length - 1
  }

  move() {
    if (!this.isClosed) {
      this.addImage()
    } else {
      this.imageViews[this.position].flipImage()
      this.position++
      if (this.position >= this.length) this.position = 0
      this.imageViews[this.position].flipImage()
    }
  }

  closeCycle() {
    this.isClosed = true
  }

  addImage() {
    const node = new NonActivatorImageView(this.base, true)
    this.imageViews[this.position].flipImage()
    this.imageViews.push(node)
    node.render()
    this.position++
    this.length++
  }


}

class ImageView {
  protected image: HTMLImageElement

  constructor(protected base: HTMLElement, imageSrc: string) {
    this.image = new Image(100,100)
    this.setSource(imageSrc)
  }

  setSource(imageSrc : string) {
    this.image.src = imageSrc
  }

  render() {
    const node = document.createElement('li')
    node.setAttribute('style', 'display: inline; margin: -90px 0 0 -90px;')
    this.base.appendChild(node)
    node.appendChild(this.image)
  }

  flipImage() {

  }

}

class ActivatorImageView extends ImageView {
  constructor(base: HTMLElement, private isActive: boolean) {
    super(base, isActive ? EMPTY_SQUARE : FILLED_SQUARE)
  }

  flipImage() {
    // debugger
    this.isActive = !this.isActive
    if (this.isActive){
      this.setSource(EMPTY_SQUARE)
    } else {
      this.setSource(FILLED_SQUARE)
    }
  }
}

class NonActivatorImageView extends ImageView {

  constructor(base: HTMLElement, private isActive: boolean) {
    super(base, isActive ? EMPTY_CIRCLE : FILLED_CIRCLE)
  }

  flipImage() {
    this.isActive = !this.isActive
    if (this.isActive){
      this.setSource(EMPTY_CIRCLE)
    } else {
      this.setSource(FILLED_CIRCLE)
    }
  }
}