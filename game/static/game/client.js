document.addEventListener("DOMContentLoaded", () => {
  const width = 10
  const gameContainer = document.querySelector(".gameContainer")
  const controlsContainer = document.getElementById("controlsContainer")
  const grid = document.querySelector(".grid")
  const score = document.getElementById("score")
  const gameOver = document.getElementById("gameOver")
  const playPauseBtn = document.getElementById("playPauseBtn")
  const rotateSound = document.getElementById("rotateSound")
  const landSound = document.getElementById("landSound")
  const scoreSound = document.getElementById("scoreSound")
  const tetroColors = [
    "orange",              // i shape
    "red",                 // j shape
    "rgb(31, 209, 221)",   // l shape
    "blue",                // 0 shape
    "purple",              // s shape
    "green",               // t shape
    "yellow"               // z shape
  ]
  let winngingScore = 1000
  let gamelevel = winngingScore / 10
  
  // hide / show sidebar nav, handle sound
  const sidebar = document.getElementById("sidebar") 
  const closeSidebar = document.getElementById("closeSidebar")
  const openSidebar = document.getElementById("openSidebar")
  const mute = document.getElementById("mute")
  let soundOn = true

  closeSidebar.addEventListener("click", handleSidebar)
  openSidebar.addEventListener("click", handleSidebar)
  mute.addEventListener("click", handleSound)

  function handleSidebar() {
    if (sidebar.style.display == "none") {
      sidebar.style.display = "block"
    } else {
      sidebar.style.display = "none"
    }
  }

  function handleSound() {
    if (soundOn) {
      soundOn = false
      mute.innerText = "Turn Sound On"
    } else {
      soundOn = true
      mute.innerText = "Turn Sound Off"
    }
  }

  // instructions modal
  const instrutcions = document.getElementById("instructions")
  const closeInstructions = document.getElementById("closeInstructions")
  const showInstructions = document.getElementById("showInstructions")

  closeInstructions.addEventListener("click", handleInstructions)
  showInstructions.addEventListener("click", handleInstructions)

  function handleInstructions(e) {
    if (instrutcions.style.display == "none") {
      instrutcions.style.display = "block"
      handleSidebar()
    } else {
      instrutcions.style.display = "none"
    }
  }

  // prevent screen zoom on mobile if user misses control buttons
  gameContainer.addEventListener("click", pvDefault)
  controlsContainer.addEventListener("click", pvDefault)

  function pvDefault(e) {
    e.preventDefault()
    return
  }

  // intro animations
  const userNav = document.getElementById("userNav")
  const hLetters = document.querySelectorAll(".hLetter")
  let delay = 0

  hLetters.forEach( (x, i) => {
    x.style.color = tetroColors[i]
    x.style.animationDelay = `${delay}s`
    x.classList.add("animate__animated", "animate__fadeIn")
    delay += .3
  })

  hLetters[hLetters.length - 1].addEventListener("animationend", moveToTop)

  function moveToTop() {
    delay = 2000
    const fontSizeEnd = getComputedStyle(document.body).getPropertyValue("--hLetterFontSizeEnd")
    const display = getComputedStyle(document.body).getPropertyValue("--controlsDisplay")

    // shrink font-size and move to top of screen
    setTimeout(function () {
      hLetters.forEach( x => {
        x.classList.remove("animate__animated", "animate__fadeIn")
        x.style.fontSize = fontSizeEnd
        x.style.marginTop = "1rem"
      }, delay)
    })

    // fade in game, controls, nav
    hLetters[hLetters.length - 1].removeEventListener("animationend", moveToTop)
    gameContainer.classList.add("animate__animated", "animate__fadeInUp")
    gameContainer.style.display = "flex"

    setTimeout(function () {
      userNav.classList.add("animate__animated", "animate__fadeIn")
      userNav.style.display = "block"
      controlsContainer.classList.add("animate__animated", "animate__fadeIn")
      controlsContainer.style.display = display
      openSidebar.classList.add("animate__animated", "animate__fadeIn")
      openSidebar.style.display = "block"
    }, 500)
  }

  // add 200 squares to grid plus 10 for hidden bottom row to stop tetros
  for (let i = 0; i < 210; i++) {
    let div = document.createElement("div")
    // tetro will stop falling when it hits a "taken" div so this is the hidden bottom row
    if (i > 199) {
      div.classList.add("taken")
      div.style.backgroundColor = "transparent"
    }
    grid.appendChild(div)
  }

  let squares = Array.from(document.querySelectorAll(".grid div"))

  const upNextGrid = document.querySelector(".upNextGrid")
  // add 20 squares to upNextGrid
  for (let i = 0; i < 20; i++) {
    let div = document.createElement("div")
    upNextGrid.appendChild(div)
  }

  // the tetrominoes
  const iTetro = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]
  const jTetro = [
    [1, 2, width + 1, width * 2 + 1],
    [0, 1, 2, width +2],
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2]
  ] 
  const lTetro = [
    [0, 1, width + 1, width * 2 +1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2]
  ]
  const oTetro = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const sTetro = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 +1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 +1]
  ]
  const tTetro = [
    [1, width, width + 1, width +2],
    [1, width + 1, width +2, width * 2 +1],
    [0, 1, 2, width + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
  const zTetro = [
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2]
  ]
  
  const tetros = [iTetro, jTetro, lTetro, oTetro, sTetro, tTetro, zTetro]

  // tetromino position on grid
  let currentPosition = 4    
  
  // indexes to use with tetro in rotate function: tetro[currentTetro][currentRotation] 
  let currentTetro           
  let currentRotation   

  // randomly select first and next tetro and position, bind currentTetro and currentRotation
  let randomRotation = () => {
    let number =  Math.floor(Math.random() * 4)
    currentRotation = number
    return number
  }
  let randomTetro = () => {
    let number = Math.floor(Math.random() * tetros.length)
    currentTetro = number
    return number
  }
  let tetro = tetros[randomTetro()][randomRotation()]
  let upNextTetro = Math.floor(Math.random() * tetros.length)

  // draw tetro
  function draw() {
    tetro.forEach( num => {
      squares[currentPosition + num].classList.add("tetro")
      squares[currentPosition + num].style.backgroundColor = tetroColors[currentTetro]
      squares[currentPosition + num].style.borderColor = "rgb(130, 127, 127)"
    })
  }

  // undraw tetro
  function undraw() {
    tetro.forEach( num => {
      squares[currentPosition + num].classList.remove("tetro")
      squares[currentPosition + num].style.backgroundColor = ""
      squares[currentPosition + num].style.borderColor = "transparent"
    })
  }

  // keyboard game controls
  addEventListener("keydown", controls)

  function controls(e) {
    if (e.keyCode === 37) moveLeft()
    if (e.keyCode === 39) moveRight()
    if (e.keyCode === 40) dropDown()
    if (e.keyCode === 32) rotate()
  }

  // start / stop button
  let playing = false
  let gravity 
  let speed = 1000      // rate at which tetro drops
  
  playPauseBtn.addEventListener("click", playPause)

  function playPause(e) {
    // if e the user clicked play/pause button, else this function is called in the code
    if (e) e.preventDefault()
    // need to lose button focus on chrome otherwise the spacebar activates the button
    playPauseBtn.blur()
    if (playing) {
      clearInterval(gravity)
      playing = false
      if (e) playPauseBtn.innerHTML = 'PLAY <i class="fa fa-play"></i>' 
    } else {
      if (e) playPauseBtn.innerHTML = 'PAUSE <i class="fa fa-pause"></i>'
      draw()
      gravity = setInterval(dropDown, speed)
      playing = true
      // if upNextTetro don't change it, but needs to be initially set randomly
      upNextTetro = upNextTetro ? upNextTetro : Math.floor(Math.random() * tetros.length)
      displayNextTetro()
    }
  }

  // button game controls for mobile
  const touchRotate = document.getElementById("rotate")
  const touchMoveDown = document.getElementById("moveDown")
  const touchMoveLeft = document.getElementById("moveLeft")
  const touchMoveRight = document.getElementById("moveRight")
  
  touchRotate.addEventListener("touchend", rotate)
  touchMoveDown.addEventListener("touchend", dropDown)
  touchMoveLeft.addEventListener("touchend", moveLeft)
  touchMoveRight.addEventListener("touchend", moveRight)

  function dropDown(e) {
    // if e user is using touch controls
    if (e) e.preventDefault()
    if (!playing) return
    undraw()
    currentPosition += width
    draw()
    stopTetro()
    return false
  }
  
  // stop tetro from falling when it collides with a div that includes class "taken"
  function stopTetro() {
    if (tetro.some( num => squares[currentPosition + num + width].classList.contains("taken"))) {
      tetro.forEach( num => squares[currentPosition + num].classList.add("taken"))
      currentTetro = upNextTetro
      tetro = tetros[currentTetro][randomRotation()]
      upNextTetro = Math.floor(Math.random() * tetros.length)  
      currentPosition = 4
      let clearingSquares = scorePoints()  
      // if clearingSquares == false game play is handled here
      // else game play is handled in scorePoints() after rows are cleared
      if (!clearingSquares) {
        if (soundOn) landSound.play()
        displayNextTetro()
        draw()
        endGame()
      }
    }
  }

  // detect collision with other tetros and left and right edges
  const tetroCollision = () => { return tetro.some( num => squares[currentPosition + num].classList.contains("taken")) }
  const rightEdgeCollision = () => { return tetro.some( num => (currentPosition + num) % width === width - 1) }
  const leftEdgeCollision = () => { return tetro.some( num => (currentPosition + num) % width === 0) }

  // move tetro left till it hits edge or another tetro
  function moveLeft(e) {
    if (e) e.preventDefault()
    if (!playing) return
    undraw()
    if (!leftEdgeCollision()) currentPosition--
    if (tetroCollision()) currentPosition++
    draw()
    return false
  }

  // move tetro right till it hits edge or another tetro
  function moveRight(e) {
    if (e) e.preventDefault();
    if (!playing) return
    undraw()
    if (!rightEdgeCollision()) currentPosition++
    if (tetroCollision()) currentPosition--
    draw()
    return false
  }

  // rotate the tetro
  function rotate(e) {
    if (e) e.preventDefault()
    if (!playing) return
    undraw()
    currentRotation++
    if (currentRotation === tetro.length) currentRotation = 0
    tetro = tetros[currentTetro][currentRotation] 
    // make sure another tetro is not in the way of rotation
    if (tetroCollision()) {
      checkRotatedPosition()
      draw()
      return 
    } 
    // make sure the new rotated position is not off an edge
    // currentPosition % width will only be 9 if a tetro is rotated on the left edge 
    if (currentPosition % width < 9) {
      if (rightEdgeCollision()) {
        checkRotatedPosition("right")
      }
    } else {
      if (leftEdgeCollision()) {
        checkRotatedPosition("left")
      }
    } 
    draw()
    stopTetro()
    if (soundOn) rotateSound.play()
    return false
  }

  function checkRotatedPosition(edge = null) {
    // hold value of currentPosition before checking rotated positions 
    // in case currentPosition has to be reset to pre-rotated value so tetro does not rotate
    let tempPosition = currentPosition

    function checkPosition(edge = null) {
      // if edge == left || right there was a collision with an edge
      if (edge == "right") {
        if (offRightEdge()) {
          // move tetro left and check if it hits another tetro
          currentPosition--
          if (tetroCollision()) {
            currentPosition++
            currentPosition = tempPosition == currentPosition ? currentPosition : tempPosition
            resetCurrentRotation()
            return
          }
          checkPosition("right")
        } 
      } else if (edge == "left") {
        if (offLeftEdge()) {
          // move tetro right and check if it hits another tetro
          currentPosition++
          if (tetroCollision()) {
            currentPosition--
            currentPosition = tempPosition == currentPosition ? currentPosition : tempPosition
            resetCurrentRotation()
            return
          }
          checkPosition("left")
        }
      } else {
        // a tetro collision occured but the tetro is not off an edge so which side 
        // the collision occured needs to be determined to increment or decrement currentPosition
        const side = tetroCollisionSide()
        
        if (side == "left") {
          currentPosition++
          if (!offRightEdge() && !tetroCollision()) {
            return
          } else if (tetroCollisionSide() == "right") {
            // moved tetro right but it hit a tetro on right side so can't rotate
            currentPosition = tempPosition
            resetCurrentRotation()
            return
          } else {
            // still a collision so try again
            checkPosition()
          }
        }          
        if (side == "right") {
          currentPosition--
          if (!offLeftEdge() && !tetroCollision()) {
            return
          } else if (tetroCollisionSide() == "left") {
            // moved tetro left but it hit a tetro on left side so can't rotate
            currentPosition = tempPosition
            resetCurrentRotation()
            return
          } else {
            // still a collision so try again
            checkPosition()
          }
        }
        // side == undefined when the tetro is off an edge so it
        // cannot rotate and needs to be reset
        if (side == undefined) {
          currentPosition = tempPosition
          resetCurrentRotation()
          return
        }
           
      }
    }
    checkPosition(edge)
  }

  function resetCurrentRotation() {
    currentRotation--
    if (currentRotation < 0) currentRotation = tetro.length - 1
    tetro = tetros[currentTetro][currentRotation]
  }

  function tetroCollisionSide() {
    let collisionSide
    let i = 0
    
    for (i; i < tetro.length; i++) {
      if (squares[i + currentPosition].classList.contains("taken")) {
        if (i === 0) {
          // check that tetro is not wraping around the edge
          if (!offLeftEdge()) {
            collisionSide = "left"
            break
          } else {
            collisionSide = undefined
            break
          }
        } else if (i > 0) {
          // check that tetro is not wraping around the edge
          if (!checkLeftEdge()) {
            collisionSide = "right"
            break
          } else {
            collisionSide = undefined
            break
          }
        }
      }
    }
    return collisionSide
  }

  // checks if tetro is wrapping around edges
  const offRightEdge = () => { return tetro.some( num => ((currentPosition + num) % width === 0) || ((currentPosition + num) % width === 1)) }
  const offLeftEdge = () => { return tetro.some( num => ((currentPosition + num) % width === width - 1)) }

  // in tetroCollisionSide() this function needs to be used rather than offRightEdge() 
  // because the tetro index needs to be greater than 0 if ((currentPosition + num) % width) === 1)
  const checkLeftEdge = () => {
    return tetro.some( (num, i) => {
      ((currentPosition + num) % width === 0) || (i > 0 && ((currentPosition + num) % width) === 1)
    })
  }

  // show up next tetro
  const upNextGridSquares = document.querySelectorAll(".upNextGrid div")
  const nextGridWidth = 5
  const upNextTetros = [
    [2, nextGridWidth + 2, nextGridWidth * 2 + 2, nextGridWidth * 3 + 2],                     // iTetro
    [2, nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],                     // jTetro
    [2, nextGridWidth + 2, nextGridWidth * 2 + 2, nextGridWidth * 2 + 3],                     // lTetro
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],     // oTetro
    [nextGridWidth + 2, nextGridWidth + 3, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],     // sTetro
    [nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2, nextGridWidth * 2 + 3], // tTetro
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth * 2 + 2, nextGridWidth * 2 + 3]      // zTetro  
  ] 

  // display up next tetro
  function displayNextTetro() {
    upNextGridSquares.forEach( x => {
      x.classList.remove("tetro")
      x.style.backgroundColor = ""
      x.style.borderColor = "transparent"
    })
    upNextTetros[upNextTetro].forEach( num => {
      upNextGridSquares[num].classList.add("tetro")
      upNextGridSquares[num].style.backgroundColor = tetroColors[upNextTetro]
      upNextGridSquares[num].style.borderColor = "rgb(130, 127, 127)"
    })
  }

  // score points and remove squares
  let points = 0

  function scorePoints() {
    let rowsCleared = 0,
        pointsScored = 0,
        rowsToClear = [],
        i = 0

    // check if any points scored    
    for (i; i < 199; i += width) {
      let row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every( num => squares[num].classList.contains("taken"))) {
        rowsCleared++
        pointsScored += 10
        rowsToClear.push(row)
      }
    }

    if (rowsToClear.length > 0) {
      // points scored, need to total points and clear rows
      playPause()
      if (soundOn) scoreSound.play()
      let lastRow = rowsToClear[rowsToClear.length - 1],
          lastSq = lastRow[lastRow.length - 1]

      squares[lastSq].addEventListener("animationend", clearRows)

      rowsToClear.forEach( row => {
        row.forEach( sq => {
          squares[sq].classList.add("animate__animated", "animate__flash")
        })
      })

      function clearRows() {
        squares[lastSq].removeEventListener("animationend", clearRows)
        rowsToClear.forEach( row => {
          row.forEach( sq => {
            squares[sq].classList.remove("taken", "tetro", "animate__animated", "animate__flash")
            squares[sq].style.backgroundColor = ""
            squares[sq].style.borderColor = "transparent"
          })
          squares = squares.splice(row[0], width).concat(squares)
          squares.forEach( square => grid.appendChild(square))
        })

        points += (rowsCleared * pointsScored)
        score.innerHTML = points
        if (points >= winngingScore) {
          winGame()
        } else {
          if (points >= gamelevel) {
            speed -= 100
            gamelevel += winngingScore / 10
          }
          displayNextTetro()
          draw()
          endGame()
          playPause()
        }
      }
      return true
    } else {
      // no points scored
      return false
    }
  }

  // game over
  function endGame() {
    if (tetro.some( num => squares[currentPosition + num].classList.contains("taken"))) {
      playing = false
      gameOver.classList.add("animate__animated", "animate__flash")
      gameOver.style.display = "flex"
      gameOver.style.visibility = "visible"
      upNextGrid.style.display = "none"
      clearInterval(gravity)
    }
  }

  // win game 
  function winGame() {
    playing = false
    gameOver.innerText = "WINNER!"
    gameOver.style.color = "green"
    gameOver.classList.add("animate__animated", "animate__flash")
    gameOver.style.display = "flex"
    gameOver.style.visibility = "visible"
    upNextGrid.style.display = "none"
    clearInterval(gravity)
  }

  // reset game
  const reset = document.getElementById("reset")
  
  reset.addEventListener("click", resetGame)

  function resetGame() {
    playing = false
    gamelevel = winngingScore / 10
    speed = 1000
    score.innerHTML = "0"
    gameOver.style.visibility = "hidden"
    gameOver.classList.remove("animate__animated", "animate__flash")
    gameOver.style.display = "none"
    gameOver.innerText = "GAME OVER"
    gameOver.style.color = "RED"
    upNextGrid.style.display = "flex"
    playPauseBtn.innerHTML = 'PLAY <i class="fa fa-play"></i>'
    currentPosition = 4
    clearInterval(gravity)
    for (let i = 0; i < 200; i++) {
      squares[i].classList.remove("taken", "tetro")
      squares[i].style.backgroundColor = ""
      squares[i].style.borderColor = "transparent"
    }
    upNextGridSquares.forEach( x => {
      x.classList.remove("tetro")
      x.style.backgroundColor = ""
      x.style.borderColor = "transparent"
    })
    tetro = tetros[randomTetro()][randomRotation()]
    upNextTetro = Math.floor(Math.random() * tetros.length)
  }
})