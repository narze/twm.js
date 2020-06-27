const throttleThreshold = 30
const debounceThreshold = 2000
const MAX_WEIGHT = 150
const MIN_WEIGHT = 20
const GAP = 12
const GAP_DOUBLED = GAP * 2
const TOP_OFFSET = 28
let lastMousePoint = null
let modalWeight = 20
let currentFocusedWindow = null
let trollingEnabled = true

Key.on('space', [ 'control', 'option', 'command' ], () => Phoenix.reload())

// Toggle Trolling mode
Key.on('t', [ 'option', 'shift' ], () => toggleTrollingMode())

// Full
Key.on('f', [ 'option', 'shift' ], () => resizeWindowFull())

// Half
Key.on('h', [ 'option', 'shift' ], () => resizeWindowHalf('left'))
Key.on('l', [ 'option', 'shift' ], () => resizeWindowHalf('right'))
Key.on('i', [ 'option', 'shift' ], () => resizeWindowHalf('right')) // Colemak i = Qwerty l

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
Key.on('i', ['option'], () => focusWindow('east')) // Colemak i = Qwerty l

function resizeWindowFull() {
  const screen = Screen.main()
  const window = Window.focused()
  const screenFrame = screen.flippedVisibleFrame()
  const topOffset = getMenubarOffset(screen)

  window.setFrame({
    x: GAP,
    y: topOffset + GAP,
    width: screenFrame.width - GAP_DOUBLED,
    height: screenFrame.height - GAP_DOUBLED,
  })

  showWindowModal('🖥', window)
}

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

  showWindowModal('½', window)
}

function resizeWindowThird(position) {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getMenubarOffset(screen)

  let x, width

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

  showWindowModal('⅓', window)
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

  showWindowModal('⅔', window)
}

function focusWindow(direction) {
  const currentWindow = Window.focused() // || currentFocusedWindow
  const spaceHash = Space.active().hash()
  let focusedWindow = null

  if (!currentWindow) { return }

  const success = currentWindow.neighbours(direction).some(window => {
    if (window.hash() == currentWindow) {
      return false
    }

    if (window.spaces()[0] && window.spaces()[0].hash() == spaceHash) {
      if (!window.isVisible()) { return false }

      // currentFocusedWindow = window
      focusedWindow = window

      Phoenix.log(window.app().name(), window.isVisible())

      return window.focus()
    }

    return false
  })

  if (success) {
    showWindowModal('👀', focusedWindow)

    Mouse.move({
      x: focusedWindow.frame().x + focusedWindow.frame().width / 2,
      y: focusedWindow.frame().y + focusedWindow.frame().height / 2,
    })
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
  // Phoenix.log(point.x, point.y)

  if (!trollingEnabled) { return }

  throttle(() => {
    showCursorModal(point)
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
          }
        },
      }).show()
    }

    modalWeight = MIN_WEIGHT
  })

  moveActiveWindow(lastMousePoint, point)

  lastMousePoint = point
})

function showCursorModal(point) {
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
      }
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

function getMenubarOffset(screen = Screen.main()) {
  const visibleFrame = screen.visibleFrame()
  const fullFrame = screen.frame()

  return fullFrame.height - visibleFrame.height
}

function showWindowModal(text = '', window = Window.focused()) {
  const point = window.topLeft()
  point.x += window.frame().width / 2
  point.y += window.frame().height / 2

  const modal = Modal.build({
    text,
    weight: 40,
    duration: 1.0,
    origin: (m) => {
      return {
        x: point.x - ( m.width / 2 ),
        y: Screen.main().frame().height - (point.y + ( m.height / 2 ))
      }
    },
  })

  modal.show()
}

function showScreenModal(text = '', screen = Screen.main()) {
  Modal.build({
    text,
    duration: 1.0,
    weight: 40,
    origin: (m) => {
      return {
        x: screen.frame().width / 2 - ( m.width / 2 ),
        y: screen.frame().height - (screen.frame().height / 2 + ( m.height / 2 ))
      }
    },
  }).show()
}

function toggleTrollingMode() {
  trollingEnabled = !trollingEnabled

  if (trollingEnabled) {
    showScreenModal('Trolling mode enabled 😬')
  } else {
    showScreenModal('Trolling mode disabled 😞')
  }
}
