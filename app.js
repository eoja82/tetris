document.addEventListener("DOMContentLoaded", () => {
  const width = 10
  const grid = document.querySelector(".grid")
  const score = document.getElementById("score")
  const gameOver = document.getElementById("gameOver")
  const playPauseBtn = document.getElementById("playPauseBtn")
  const tetroColors = [
    "orange",              // i
    "red",                 // j
    "rgb(31, 209, 221)",   // l
    "blue",                // 0 
    "purple",              // s 
    "green",               // t 
    "yellow"               // z
  ]
  
  // sidebar hide and show
  const sidebar = document.getElementById("sidebar") 
  const closeSidebar = document.getElementById("closeSidebar")
  const openSidebar = document.getElementById("openSidebar")

  closeSidebar.addEventListener("click", handleSidebar)
  openSidebar.addEventListener("click", handleSidebar)

  function handleSidebar() {
    if (sidebar.style.display == "none") {
      sidebar.style.display = "block"
    } else {
      sidebar.style.display = "none"
    }
  }

  // instructions modal
  const instrutcions = document.getElementById("instructions")
  const closeInstructions = document.getElementById("closeInstructions")
  const showInstructions = document.getElementById("showInstructions")

  closeInstructions.addEventListener("click", handleInstructions)
  showInstructions.addEventListener("click", handleInstructions)

  function handleInstructions(e) {
    console.log(instrutcions.style.display)
    if (instrutcions.style.display == "none") {
      instrutcions.style.display = "block"
      handleSidebar()
    } else {
      instrutcions.style.display = "none"
    }
  }

  // intro animations
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
    const gameContainer = document.querySelector(".gameContainer")
    const controlsContainer = document.getElementById("controlsContainer")
    const display = getComputedStyle(document.body).getPropertyValue("--controlsDisplay")

    setTimeout(function () {
      hLetters.forEach( x => {
        x.classList.remove("animate__animated", "animate__fadeIn")
        x.style.fontSize = fontSizeEnd
        x.style.marginTop = "1rem"
      }, delay)
    })

    hLetters[hLetters.length - 1].removeEventListener("animationend", moveToTop)
    gameContainer.classList.add("animate__animated", "animate__fadeInUp")
    gameContainer.style.display = "flex"

    setTimeout(function () {
      controlsContainer.classList.add("animate__animated", "animate__fadeIn")
      controlsContainer.style.display = display
      openSidebar.classList.add("animate__animated", "animate__fadeIn")
      openSidebar.style.display = "block"
    }, 500)
  }

  // add 200 squares to grid plus 10 for bottom row to stop tetros
  for (let i = 0; i < 210; i++) {
    let div = document.createElement("div")
    // tetro will stop falling when it hits a "taken" div so this is the floor
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

  // for testing
  //const tetros = [lTetro]

  let currentPosition = 4    // position on grid
  
  // indexes to use with tetro in rotate function: tetro[currentTetro][currentRotation] 
  let currentTetro           
  let currentRotation   

  // randomly select first/next tetro and position, bind currentTetro and currentRotation
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

  //draw()

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

  function playPause() {
    if (playing) {
      clearInterval(gravity)
      playing = false
      playPauseBtn.innerHTML = 'PLAY <i class="fa fa-play"></i>' 
    } else {
      playPauseBtn.innerHTML = 'PAUSE <i class="fa fa-pause"></i>'
      draw()
      gravity = setInterval(dropDown, speed)
      playing = true
      // if upNextTetro don't change it, but needs to be initially set randomly
      upNextTetro = upNextTetro ? upNextTetro : Math.floor(Math.random() * tetros.length)
      displayNextTetro()
    }
  }

  // button game controls
  const touchRotate = document.getElementById("rotate")
  const touchMoveDown = document.getElementById("moveDown")
  const touchMoveLeft = document.getElementById("moveLeft")
  const touchMoveRight = document.getElementById("moveRight")
  //console.log(touchMoveRight)
  touchRotate.addEventListener("touchend", rotate)
  touchMoveDown.addEventListener("touchend", dropDown)
  touchMoveLeft.addEventListener("touchend", moveLeft)
  touchMoveRight.addEventListener("touchend", moveRight)

  function dropDown(e) {
    if (e) e.preventDefault()
    if (!playing) return
    undraw()
    currentPosition += width
    //console.log("dropdown draw")
    draw()
    stopTetro()
    return false
  }
  
  // stop tetro from falling when it collides with a div that include class "taken"
  function stopTetro() {
    if (tetro.some( num => squares[currentPosition + num + width].classList.contains("taken"))) {
      //console.log("stopping tetro")
      tetro.forEach( num => squares[currentPosition + num].classList.add("taken"))
      // drop next tetro
      currentTetro = upNextTetro
      tetro = tetros[currentTetro][randomRotation()]
      upNextTetro = Math.floor(Math.random() * tetros.length)  
      currentPosition = 4
      displayNextTetro()
      scorePoints()
      draw()
      endGame()
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
    //stopTetro()
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
    //stopTetro()
    return false
  }

  // rotate the tetro
  function rotate(e) {
    //console.log("rotated")
    if (e) e.preventDefault()
    if (!playing) return
    undraw()
    currentRotation++
    if (currentRotation === tetro.length) currentRotation = 0
    tetro = tetros[currentTetro][currentRotation] 
    // make sure another tetro is not in the way of rotation
     if (tetroCollision()) {
      //console.log("tetro collision on rotate")
      checkRotatedPosition()
      //console.log("pre draw")
      draw()
      //stopTetro()
      return 
    } 

    // make sure the new rotated position is not off an edge
    // currentPosition % width will only be 9 if a tetro is rotated on the left edge 
    if (currentPosition % width < 9) {
      if (rightEdgeCollision()) {
        //console.log("Right edge collision " + "currentPosition " + currentPosition)
        checkRotatedPosition("right")
      }
    } else {
      if (leftEdgeCollision()) {
        //console.log("Left edge collision")
        checkRotatedPosition("left")
      }
    } 
    //stopTetro()
    //console.log("pre draw")
    draw()
    stopTetro()
    return false
  }

  function checkRotatedPosition(edge = null) {
    let tempPosition = currentPosition
    //console.log( "tempPosition " + tempPosition)

    function checkPosition(edge = null) {
      //console.log("edge: " + edge)
      if (edge == "right") {
        if (offRightEdge()) {
          //console.log("Off right edge " + "currentPosition " + currentPosition)
          currentPosition--
          if (tetroCollision()) {
            currentPosition++
            currentPosition = tempPosition == currentPosition ? currentPosition : tempPosition
            console.log("currentPosition " + currentPosition + " pre reset")
            resetCurrentRotation()
            return
          }
          //console.log("run function again " + "currentPosition " + currentPosition)
          checkPosition("right")
        } 
      } else if (edge == "left") {
        //console.log("Off left edge")
        if (offLeftEdge()) {
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
        const side = tetroCollisionSide()
        //console.log(side)
        
        if (side == "left") {
          //console.log("offLeftEdge " + offLeftEdge())
          currentPosition++
          //console.log("offRightEdge " + offRightEdge())
          //console.log("tetro collision " + tetroCollision())
          //checkPosition()
          if (!offRightEdge() && !tetroCollision()) {
            //console.log("returning left side")
            return
          } else if (tetroCollisionSide() == "right") {
            currentPosition = tempPosition
            resetCurrentRotation()
            return
          } else {
            checkPosition()
            //currentPosition = tempPosition
            //if (tetroCollision()) resetCurrentRotation()
          }
        }          
        if (side == "right") {
          currentPosition--
          //console.log("offLeftEdge " + offLeftEdge())
          //console.log("tetro collision " + tetroCollision())
          //checkPosition()
          if (!offLeftEdge() && !tetroCollision()) {
            //console.log("returning right side")
            return
          } else if (tetroCollisionSide() == "left") {
            //console.log("Tetro collision moving left")
            currentPosition = tempPosition
            resetCurrentRotation()
            return
          } else {
            //console.log("rechecking position for right side")
            checkPosition()
            //currentPosition = tempPosition
            //if (tetroCollision()) resetCurrentRotation()
          }
        }
        if (side == undefined) {
          //console.log("side is undefined")
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
    //console.log("tetroCollisionSide")
    let collisionSide
    let i = 0
    
    for (i; i < tetro.length; i++) {
      //console.log("i = " + i)
      if (squares[i + currentPosition].classList.contains("taken")) {
        //console.log("i = " + i)
        if (i === 0) {
          // check that it is not wraping around the edge
          if (!offLeftEdge()) {
            collisionSide = "left"
            break
          } else {
            collisionSide = undefined
            break
          }
        } else if (i > 0) {
          // check that it is not wraping around the edge
          //console.log("1 > 0, checkLeftEdge: " + checkLeftEdge())
          //console.log("currentPosition: " + currentPosition)
          if (!checkLeftEdge()) {
            //console.log("i > 0 not offRightEdge")
            collisionSide = "right"
            break
          } else {
            //console.log("i > 0 checkRightEdge")
            collisionSide = undefined
            break
          }
        }
      }
    }

    return collisionSide
  }

  // checks if tetro is wrapping acound edges
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
    [2, nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],         // jTetro
    [2, nextGridWidth + 2, nextGridWidth * 2 + 2, nextGridWidth * 2 + 3],            // lTetro
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],      // oTetro
    [nextGridWidth + 2, nextGridWidth + 3, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],     // sTetro
    [nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2, nextGridWidth * 2 + 3], // tTetro
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth * 2 + 2, nextGridWidth * 2 + 3]         // zTetro  
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
        pointsScored = 0
    for (let i = 0; i < 199; i += width) {
      let row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
  
      if (row.every( num => squares[num].classList.contains("taken"))) {
        //points += 10
        //score.innerHTML = points
        rowsCleared++
        //console.log(rowsCleared)
        pointsScored += 10
        //console.log(pointsScored)
        row.forEach( num => {
          squares[num].classList.remove("taken", "tetro")
          squares[num].style.backgroundColor = ""
          squares[num].style.borderColor = "transparent"
        })
        // remove row and put it at the beginning
        squares = squares.splice(i, width).concat(squares)
        squares.forEach( square => grid.appendChild(square))
      }
    }
    points += (rowsCleared * pointsScored)
    // if (points > 10000000) end game
    score.innerHTML = points
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

  // reset game
  const reset = document.getElementById("reset")
  reset.addEventListener("click", resetGame)

  function resetGame() {
    playing = false
    score.innerHTML = "0"
    gameOver.style.visibility = "hidden"
    gameOver.classList.remove("animate__animated", "animate__flash")
    gameOver.style.display = "none"
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
  }
})