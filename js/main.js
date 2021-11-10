import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getActiveColorList,
  getColorElementList,
  getPlayAgainButton,
  getUlElement,
  getColorBackground,
} from './selectors.js'
import {
  createCountdown,
  getRandomColorPairs,
  hideReplayButton,
  setTimerText,
  showReplayButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createCountdown({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
  setTimerText(`0${second}`.slice(-2))
}
function handleTimerFinish() {
  gameStatus = GAME_STATUS.FINISHED
  showReplayButton()
  setTimerText('Game Over! 😭')
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement) {
  const shouldBlocking = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || isClicked || shouldBlocking) return

  liElement.classList.add('active')

  selections.push(liElement)
  // Neu selections < 2 -> return
  if (selections.length < 2) return

  // check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  if (firstColor === secondColor) {
    const isWin = getActiveColorList().length === 0
    if (isWin) {
      // show replay button
      showReplayButton()
      // set timer text
      setTimerText('YOU WIN! 🏆')
      timer.clear()

      gameStatus = GAME_STATUS.FINISHED
    }

    const backgroundApp = getColorBackground()
    backgroundApp.style.backgroundColor = selections[1].dataset.color

    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING
  // check not match
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function initColors() {
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  if (!colorList) return

  const liElementList = getColorElementList()
  liElementList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]

    const overlayElement = liElement.querySelector('.overlay')
    overlayElement.style.backgroundColor = colorList[index]
  })
}

function attachEventForColorList() {
  const ulElement = getUlElement()

  ulElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return

    handleColorClick(e.target)
  })
}

function resetGame() {
  gameStatus = GAME_STATUS.PLAYING
  selections = []

  const colorElementList = getColorElementList()
  if (colorElementList) {
    for (const colorElement of colorElementList) {
      colorElement.classList.remove('active')
    }
  }
  hideReplayButton()
  setTimerText('')

  initColors()

  startTimer()
}

function attachEventForReplayButton() {
  const replayButton = getPlayAgainButton()
  if (replayButton) replayButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}

// main
;(() => {
  initColors()
  attachEventForColorList()
  attachEventForReplayButton()
  startTimer()
})()
