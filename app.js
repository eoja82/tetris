document.addEventListener("DOMContentLoaded", () => {
  const width = 10
  const grid = document.querySelector(".grid")
  const score = document.getElementById("score")
  const playPauseBtn = document.getElementById("playPauseBtn")
  const tetroColors = ["red", "green", "orange", "purple", "blue"]
  
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
  // add 16 squares to upNextGrid
  for (let i = 0; i < 25; i++) {
    let div = document.createElement("div")
    upNextGrid.appendChild(div)
  }

  // the tetros
  const lTetro = [
    [1, 2, width + 1, width * 2 + 1],
    [0, 1, 2, width +2],
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2]
  ] 
  const tTetro = [
    [1, width, width + 1, width +2],
    [1, width + 1, width +2, width * 2 +1],
    [0, 1, 2, width + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
  const iTetro = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [0, 1, 2, 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [0, 1, 2, 3]
  ]
  const zTetro = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 +1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 +1]
  ]
  const oTetro = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const tetros = [lTetro, tTetro, iTetro, zTetro, oTetro]

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

  // game controls
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
      playPauseBtn.innerHTML = 'Play <i class="fa fa-play"></i>' 
    } else {
      playPauseBtn.innerHTML = 'Pause <i class="fa fa-pause"></i>'
      draw()
      gravity = setInterval(dropDown, speed)
      playing = true
      // if upNextTetro don't change it, but needs to be initially set randomly
      upNextTetro = upNextTetro ? upNextTetro : Math.floor(Math.random() * tetros.length)
      displayNextTetro()
    }
  }

  function dropDown() {
    if (!playing) return
    undraw()
    currentPosition += width
    draw()
    stopTetro()
  }
  
  // stop tetro from falling when it collides with a div that include class "taken"
  function stopTetro() {
    if (tetro.some( num => squares[currentPosition + num + width].classList.contains("taken"))) {
      tetro.forEach( num => squares[currentPosition + num].classList.add("taken"))
      // drop next tetro
      currentTetro = upNextTetro
      tetro = tetros[currentTetro][randomRotation()]
      upNextTetro = Math.floor(Math.random() * tetros.length)  
      currentPosition = 4
      draw()
      displayNextTetro()
      scorePoints()
      endGame()
    }
  }

  // detect collision with other tetros
  let tetroCollision = () => { return tetro.some( num => squares[currentPosition + num].classList.contains("taken")) }

  // move tetro left till it hits edge or another tetro
  function moveLeft() {
    if (!playing) return
    undraw()
    let leftEdgeCollision = tetro.some( num => (currentPosition + num) % width === 0)
    if (!leftEdgeCollision) currentPosition--
    if (tetroCollision()) currentPosition++
    draw()
  }

  // move tetro right till it hits edge or another tetro
  function moveRight() {
    if (!playing) return
    undraw()
    let rightEdgeCollison = tetro.some( num => (currentPosition + num) % width === width - 1)
    if (!rightEdgeCollison) currentPosition++
    if (tetroCollision()) currentPosition--
    draw()
  }

  // rotate the tetro
  function rotate() {
    if (!playing) return
    undraw()
    currentRotation++
    if (currentRotation === tetro.length) currentRotation = 0
    tetro = tetros[currentTetro][currentRotation]    
    draw()
  }

  // show up next tetro
  const upNextGridSquares = document.querySelectorAll(".upNextGrid div")
  const nextGridWidth = 5
  //const nextGridIndex = 0

  const upNextTetros = [
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth + 3, nextGridWidth * 2 + 3],                                  // lTetro
    [2, nextGridWidth + 1, nextGridWidth + 2, nextGridWidth + 3],                           // tTetro
    [2, nextGridWidth + 2, nextGridWidth * 2 + 2, nextGridWidth * 3 + 2, nextGridWidth * 3 + 2],              // iTetro
    [nextGridWidth + 2, nextGridWidth + 3, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2],   // zTetro
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth * 2 + 1, nextGridWidth * 2 + 2]                                           // oTetro
  ] 

  // display up next tetro
  function displayNextTetro() {
    upNextGridSquares.forEach( x => {
      x.classList.remove("tetro")
      x.style.backgroundColor = ""
    })
    upNextTetros[upNextTetro].forEach( num => {
      upNextGridSquares[num].classList.add("tetro")
      upNextGridSquares[num].style.backgroundColor = tetroColors[upNextTetro]
    })
  }

  // score points and remove squares
  let points = 0
  let removedSquares = []

  function scorePoints() {
    for (let i = 0; i < 199; i += width) {
      let row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
  
      if (row.every( num => squares[num].classList.contains("taken"))) {
        points += 10
        score.innerHTML = points
        row.forEach( num => {
          squares[num].classList.remove("taken", "tetro")
          squares[num].style.backgroundColor = ""
          squares[num].style.borderColor = "transparent"
        })
        let spliceSquares = squares.splice(i, width)
        squares = spliceSquares.concat(squares)
        squares.forEach( square => grid.appendChild(square))
        //removedSquares.concat(spliceSquares)
        //console.log(removedSquares)
       /*  squares = removedSquares.concat(squares)
        squares.forEach( square => grid.appendChild(square)) */
      }
      /* squares = removedSquares.concat(squares)
      squares.forEach( square => grid.appendChild(square))
      removedSquares = [] */
    }
  }

  // game over
  function endGame() {
    if (tetro.some( num => squares[currentPosition + num].classList.contains("taken"))) {
      playing = false
      const gameOver = document.getElementById("gameOver")
      gameOver.classList.add("animated", "flash")
      gameOver.style.visibility = "visible"

      clearInterval(gravity)
    }
  }

  // reset game
  const reset = document.getElementById("reset")
  reset.addEventListener("click", resetGame)

  function resetGame() {
    score.innerHTML = "0"
    gameOver.style.visibility = "hidden"
    gameOver.classList.remove("animated", "flash")
    playPauseBtn.innerHTML = 'Play <i class="fa fa-play"></i>'
    for (let i = 0; i < 199; i++) {
      squares[i].classList.remove("taken", "tetro")
      squares[i].style.backgroundColor = ""
      squares[i].style.borderColor = "transparent"
    }

  }
})