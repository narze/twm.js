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
// 1. Moving windows (Ctrl+shift+vim movements / arrows)
// 2. Focusing windows (Ctrl+vim movements / arrows)
// 3. Toggle Trolling mode
function getScreenBarOffset(screen) {
  const visibleFrame = screen.visibleFrame()
  const fullFrame = screen.frame()

  return fullFrame.height - visibleFrame.height
}

Key.on('h', [ 'option', 'shift' ], function () {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: 0 + GAP,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 2 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
});

// Colemak i = Qwerty l
Key.on('i', [ 'option', 'shift' ], function () {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: screenFrame.width / 2 + GAP * 0.5,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 2 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
});

Key.on('l', [ 'option', 'shift' ], function () {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: screenFrame.width / 2 + GAP * 0.5,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 2 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
});

// Third

Key.on('1', ['control', 'shift'], () => {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: 0 + GAP,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 3 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
})

Key.on('2', ['control', 'shift'], () => {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: screenFrame.width / 3 + GAP / 2,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 3 - GAP,
    height: screenFrame.height - GAP_DOUBLED,
  })
})

Key.on('3', ['control', 'shift'], () => {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: screenFrame.width / 3 * 2 + GAP / 2,
    y: topOffset + 0 + GAP,
    width: screenFrame.width / 3 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
})

// Two thirds

Key.on('4', ['control', 'shift'], () => {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: 0 + GAP,
    y: topOffset + 0 + GAP,
    width: screenFrame.width * 2 / 3 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
})

Key.on('5', ['control', 'shift'], () => {
  const screen = Screen.main()
  const screenFrame = screen.flippedVisibleFrame()
  const window = Window.focused()

  const topOffset = getScreenBarOffset(screen)

  window.setFrame({
    x: screenFrame.width / 3 + GAP / 2,
    y: topOffset + 0 + GAP,
    width: screenFrame.width * 2 / 3 - GAP * 1.5,
    height: screenFrame.height - GAP_DOUBLED,
  })
})

// Focus left / right
Key.on('h', ['option'], () => {
  const currentWindow = Window.focused()
  const spaceHash = Space.active().hash()
  let focusedWindow = null

  const success = currentWindow.neighbours('west').some(window => {
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
})

Key.on('i', ['option'], () => {
  const currentWindow = Window.focused()
  const spaceHash = Space.active().hash()
  let focusedWindow = null

  const success = currentWindow.neighbours('east').some(window => {
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
})

Key.on('l', ['option'], () => {
  const currentWindow = Window.focused()
  const spaceHash = Space.active().hash()
  let focusedWindow = null

  const success = currentWindow.neighbours('east').some(window => {
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
})

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
