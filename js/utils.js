import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffleColor(array) {
  if (!Array.isArray(array) || array.length <= 2) return array

  for (let i = array.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  if (!count) return

  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]

  return shuffleColor(fullColorList)
}

export function showReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.classList.add('show')
}

export function hideReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.classList.remove('show')
}

export function setTimerText(text) {
  const timerText = getTimerElement()
  if (timerText) timerText.textContent = text
}

export function createCountdown({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()

    let currentSecond = seconds

    intervalId = setInterval(() => {
      onChange?.(currentSecond)

      currentSecond--

      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}
