document.addEventListener("DOMContentLoaded", () => {
  const width = 10
  const grid = document.querySelector(".grid")
  const score = document.getElementById("score")
  const startStop = document.getElementById("startStop")
  
  // add 200 squares to grid plus 10 for bottom row to stop tetros
  for (let i = 0; i < 210; i++) {
    let div = document.createElement("div")
    // tetro will stop falling when it hits a "taken" div so tis is the floor
    if (i > 199) div.classList.add("taken")
    grid.appendChild(div)
  }

  let squares = document.querySelectorAll(".grid div")

  const upNextGrid = document.querySelector(".upNextGrid")
  // add 16 squares to miniGrid
  for (let i = 0; i < 16; i++) {
    let div = document.createElement("div")
    upNextGrid.appendChild(div)
  }

  // the tetros
  const lTetro = [
    [1, 2, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 +2]
  ] 
  const tTetro = [
    [1, width, width + 1, width +2],
    [1, width + 1, width +2, width * 2 +1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
  const iTetro = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]
  const zTetro = [
    [width + 1, width + 2, width * 2, width * 2 +1],
    [0, width, width + 1, width * 2 +1],
    [width + 1, width + 2, width * 2, width * 2 +1],
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
  //let upNextTetro = Math.floor(Math.random() * tetros.length)

  // draw tetro
  function draw() {
    tetro.forEach( num => {
      squares[currentPosition + num].classList.add("tetro")
    })
  }

  draw()

  // undraw tetro
  function undraw() {
    tetro.forEach( num => {
      squares[currentPosition + num].classList.remove("tetro")
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


  // add gravity to tetro
  let speed = 1000  
  let gravity = setInterval(dropDown, speed)

  function dropDown() {
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
      tetro = tetros[randomTetro()][randomRotation()]
      //upNextTetro = tetros[randomTetro()][randomRotation()]
      currentPosition = 4
      draw()
      //displayTetro()
    }
  }

  // detect collision with other tetros
  let tetroCollision = () => { return tetro.some( num => squares[currentPosition + num].classList.contains("taken")) }

  // move tetro left till it hits edge or another tetro
  function moveLeft() {
    undraw()
    let leftEdgeCollision = tetro.some( num => (currentPosition + num) % width === 0)
    
    if (!leftEdgeCollision) currentPosition--
    if (tetroCollision()) currentPosition++

    draw()
  }

  // move tetro right till it hits edge or another tetro
  function moveRight() {
    undraw()
    
    let rightEdgeCollison = tetro.some( num => (currentPosition + num) % width === width - 1)

    if (!rightEdgeCollison) currentPosition++
    if (tetroCollision()) currentPosition--

    draw()
  }

  // rotate the tetro
  function rotate() {
    undraw()
    //console.log(currentPosition)
    currentRotation++
    if (currentRotation === tetro.length) currentRotation = 0

    tetro = tetros[currentTetro][currentRotation]    
    
    draw()
  }

  // show up next tetro
  /* const upNextGridSquares = document.querySelectorAll(".upNextGrid div")
  const nextGridWidth = 4
  const nextGridIndex = 0

  const upNextTetros = [
    [1, 2, nextGridWidth + 1, nextGridWidth * 2 + 1],                                  // lTetro
    [1, nextGridWidth, nextGridWidth + 1, nextGridWidth +2],                           // tTetro
    [1, nextGridWidth + 1, nextGridWidth * 2 + 1, nextGridWidth * 3 + 1],              // iTetro
    [nextGridWidth + 1, nextGridWidth + 2, nextGridWidth * 2, nextGridWidth * 2 +1],   // zTetro
    [0, 1, nextGridWidth, nextGridWidth + 1]                                           // oTetro
  ] */

  // display up next tetro
  /* function displayTetro() {
    upNextGridSquares.forEach( x => x.classList.remove("tetro"))

    upNextTetros[upNextTetro].forEach( num => upNextGridSquares[nextGridIndex + num].classList.add("tetro"))
  } */


})