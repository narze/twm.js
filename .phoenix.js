const trollingEnabled = true
const throttleThreshold = 30
const debounceThreshold = 2000
const MAX_WEIGHT = 150
const MIN_WEIGHT = 20
let lastMousePoint = null
let modalWeight = 20

const throttle = _.throttle(function (callback) {
  Phoenix.log("Throttled")
  callback()
}, throttleThreshold, { leading: true, trailing: false })

const debounce = _.debounce(function (callback) {
  Phoenix.log("Throttled")
  callback()
}, debounceThreshold, { leading: false, trailing: true })

Event.on("mouseDidMove", (point) => {
  // Phoenix.log(point.x, point.y)
  throttle(() => {
    showModal(point)
  })

  debounce(() => {
    if (modalWeight >= MAX_WEIGHT / 2) {
      Modal.build({ text: "GOOD.", duration: 1.0, weight: 200 }).show()
    }

    modalWeight = MIN_WEIGHT
  })

  moveActiveWindow(lastMousePoint, point)
  lastMousePoint = point
})

function showModal(point) {
  // const origin = { x: 200, y: 400 }
  modalWeight++

  const tempModal = Modal.build({
    text: "STOP YER\nMOUSE! 🐁",
    weight: modalWeight,
  })

  const modalFrame = tempModal.frame()
  Phoenix.log(modalFrame.height)

  const modal = Modal.build({
    text: tempModal.text,
    weight: tempModal.weight,
    origin() { // TODO: Fix modal location
      const p = _.clone(point)
      p.x = p.x - modalFrame.width / 2
      p.y = Screen.main().frame().height - p.y - modalFrame.height * 1.5
      return p
    },
  })

  modal.show()

  setTimeout(() => {
    modal.close()
  }, 2000)
}

function moveActiveWindow(lastPoint, currentPoint) {
  if (!lastPoint) return
  if (!trollingEnabled) return

  const window = Window.focused()

  window.setTopLeft({
    x: window.frame().x + (lastPoint.x - currentPoint.x),
    y: window.frame().y + (lastPoint.y - currentPoint.y),
  })
}

// TODO: This stills use too much resources -> Optimize!
function moveWindows(point) {
  Phoenix.log(point.x, point.y)

  const space = Space.active()
  const windows = space.windows({ visible: true })

  // TODO: Find nearest window which does not enclose the point
  const distances = windows.map((w) => {
    const f = w.frame()
    // Phoenix.log(w.app().name(), f.x, f.y, f.width, f.height)
    const centerPoint = {
      x: f.x + f.width / 2,
      y: f.y + f.height / 2,
    }

    const distance = Math.sqrt(
      Math.abs(point.x - centerPoint.x) ** 2 +
      Math.abs(point.y - centerPoint.y) ** 2
    )

    return [w, distance]
  })

  if (distances.length) {
    const sortedDistances = distances.sort((a, b) => a[1] - b[1])

    // Phoenix.log(sortedDistances.map(a => a[1]))

    const nearestWindow = sortedDistances[0][0]

    Phoenix.log(nearestWindow.app().name())

    const focusedWindow = Window.focused()

    const windowOriginX = focusedWindow.frame().x + focusedWindow.frame().width / 2
    const windowOriginY = focusedWindow.frame().y + focusedWindow.frame().height / 2

    const mouseIsOnTheRight = point.x > windowOriginX
    const mouseIsBelow = point.y > windowOriginY

    if (!trollingEnabled) return

    focusedWindow.setTopLeft({
      x: focusedWindow.frame().x + (Math.random() * 30) * (mouseIsOnTheRight ? -1 : 1),
      y: focusedWindow.frame().y + (Math.random() * 30) * (mouseIsBelow ? -1 : 1),
    })
  }
}
