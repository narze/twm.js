const trollingEnabled = true
const throttleThreshold = 30
const debounceThreshold = 2000
const MAX_WEIGHT = 150
const MIN_WEIGHT = 20
const GAP = 12
const GAP_DOUBLED = GAP * 2
const TOP_OFFSET = 28
let lastMousePoint = null
let modalWeight = 20

Key.on('space', [ 'control', 'option', 'command' ], () => Phoenix.reload())

// TODO:
// 3. Toggle Trolling mode
function getMenubarOffset(screen = Screen.main()) {
  const visibleFrame = screen.visibleFrame()
  const fullFrame = screen.frame()

  return fullFrame.height - visibleFrame.height
}

Key.on('h', [ 'option', 'shift' ], () => resizeWindowHalf('left'));
// Colemak i = Qwerty l
Key.on('i', [ 'option', 'shift' ], () => resizeWindowHalf('right'));
Key.on('l', [ 'option', 'shift' ], () => resizeWindowHalf('right'));

// Third
Key.on('1', ['control', 'shift'], () => resizeWindowThird('left'))
Key.on('2', ['control', 'shift'], () => resizeWindowThird('center'))
Key.on('3', ['control', 'shift'], () => resizeWindowThird('right'))

// Two thirds
Key.on('4', ['control', 'shift'], () => resizeWindowTwoThird('left'))
Key.on('5', ['control', 'shift'], () => resizeWindowTwoThird('right'))

// Focus left / right
Key.on('h', ['option'], () => focusWindow('west'))
Key.on('l', ['option'], () => focusWindow('east'))
Key.on('i', ['option'], () => focusWindow('east'))

function resizeWindowHalf(position) {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getMenubarOffset(screen)

  const x = position === 'left' ? GAP : screenFrame.width / 2 + GAP / 2

  window.setFrame({
    x,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 2 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
}

function resizeWindowThird(position) {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getMenubarOffset(screen)

  let x, width;

  switch (position) {
    case 'left':
      x = 0 + GAP
      width = screenFrame.width / 3 - GAP * 1.5
      break
    case 'center':
      x = screenFrame.width / 3 + GAP / 2
      width = screenFrame.width / 3 - GAP
      break
    case 'right':
      x = screenFrame.width / 3 * 2 + GAP / 2
      width = screenFrame.width / 3 - GAP * 1.5
      break
  }

  window.setFrame({
    x,
    y: topOffset + 0 + GAP,
    width,
    height: screenFrame.height - GAP_DOUBLED,
  })
}

function resizeWindowTwoThird(position) {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getMenubarOffset(screen)

  let x

  switch (position) {
    case 'left':
      x = 0 + GAP
      break
    case 'right':
      x = screenFrame.width / 3 + GAP / 2
      break
  }

  window.setFrame({
    x,
    y: topOffset + 0 + GAP,
    width: screenFrame.width * 2 / 3 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
}

function focusWindow(direction) {
  const currentWindow = Window.focused()
  const spaceHash = Space.active().hash()
  let focusedWindow = null

  if (!currentWindow) { return }

  const success = currentWindow.neighbours(direction).some(window => {
    if (window.hash() == currentWindow) {
      return false
    }

    if (window.spaces()[0].hash() == spaceHash) {
      focusedWindow = window
      return window.focus()
    }

    Phoenix.log('space unmatched')
    return false
  })

  if (success) {
    const point = focusedWindow.topLeft()
    point.x += focusedWindow.frame().width / 2
    point.y += focusedWindow.frame().height / 2

    const modal = Modal.build({
      text: '👉',
      weight: 40,
      duration: 0.1,
      origin: (m) => {
        return {
          x: point.x - ( m.width / 2 ),
          y: Screen.main().frame().height - (point.y + ( m.height / 2 ))
        };
      },
    })

    modal.show()
  }
}

const throttle = _.throttle(function (callback) {
  Phoenix.log("Throttled")
  callback()
}, throttleThreshold, { leading: true, trailing: false })

const debounce = _.debounce(function (callback) {
  Phoenix.log("Throttled")
  callback()
}, debounceThreshold, { leading: false, trailing: true })

Event.on("mouseDidMove", (point) => {
  Phoenix.log(point.x, point.y)
  throttle(() => {
    showModal(point)
  })

  debounce(() => {
    if (modalWeight >= MAX_WEIGHT / 2) {
      Modal.build({
        text: "GOOD.",
        duration: 1.0,
        weight: 200,
        appearance: 'transparent',
        origin: (m) => {
          return {
            x: Screen.main().frame().width / 2 - ( m.width / 2 ),
            y: Screen.main().frame().height - (Screen.main().frame().height / 2 + ( m.height / 2 ))
          };
        },
      }).show()
    }

    modalWeight = MIN_WEIGHT
  })

  moveActiveWindow(lastMousePoint, point)

  lastMousePoint = point
})

function showModal(point) {
  // const origin = { x: 200, y: 400 }
  modalWeight = _.min([modalWeight * 1.05, MAX_WEIGHT])

  if (modalWeight < MAX_WEIGHT * 0.2) return

  Phoenix.log(modalWeight)

  const modal = Modal.build({
    text: modalWeight <= MAX_WEIGHT / 2 ? 'Mouse move detected 🐁' : "STOP YOUR\nMOUSE! 🐁",
    weight: modalWeight,
    duration: 0.2,
    origin: (m) => {
      return {
        x: point.x - ( m.width / 2 ),
        y: Screen.main().frame().height - (point.y + ( m.height / 2 ))
      };
    },
  })

  modal.show()
}

function moveActiveWindow(lastPoint, currentPoint) {
  if (!trollingEnabled) return
  if (modalWeight < MAX_WEIGHT / 2) return
  if (!lastPoint) return

  // let window = Window.at(currentPoint) || Window.focused()
  const window = Window.focused()

  if (window) {
    window.setTopLeft({
      x: window.frame().x + (lastPoint.x - currentPoint.x) * (2 + Math.random() * 2),
      y: window.frame().y + (lastPoint.y - currentPoint.y) * (2 + Math.random() * 2),
    })
  }
}
