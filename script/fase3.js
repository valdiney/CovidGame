document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')
  const resultDisplay = document.querySelector('#result')
  let width = 15
  let currentShooterIndex = 202
  let currentInvaderIndex = 0
  let alienInvadersTakenDown = []
  let result = 0
  let direction = 1
  let invaderId;
  let perdeu = false;

  //define the alien invaders
  const alienInvaders = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      15,16,17,18,19,20,21,22,23,24,
      30,31,32,33,34,35,36,37,38,39,
      40,41,42,43,44,45,46,47,48,49
    ]

  //draw the alien invaders
  alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))

  //draw the shooter
  squares[currentShooterIndex].classList.add('shooter')

  //move the shooter along a line
  function moveShooter(e) {
    if (perdeu !== true) {
      squares[currentShooterIndex].classList.remove('shooter')
      switch(e.keyCode) {
        case 37:
          if(currentShooterIndex % width !== 0) currentShooterIndex -= 1
          break
        case 39:
          if(currentShooterIndex % width < width - 1) currentShooterIndex += 1
          break
      }

      squares[currentShooterIndex].classList.add('shooter')
      
      }
  }
  document.addEventListener('keydown', moveShooter)

  //move the alien invaders
  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1

      if ((leftEdge && direction === -1) || (rightEdge && direction === 1)){
        direction = width
      } else if (direction === width) {
        if (leftEdge) direction = 1
        else direction = -1
      }

      for (let i = 0; i <= alienInvaders.length - 1; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
      }

      for (let i = 0; i <= alienInvaders.length - 1; i++) {
        alienInvaders[i] += direction
      }

      for (let i = 0; i <= alienInvaders.length - 1; i++) {
      //ADD IF LATER
        if (!alienInvadersTakenDown.includes(i)){
          squares[alienInvaders[i]].classList.add('invader')
        }
      }

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      resultDisplay.textContent = 'Você perdeu'
      squares[currentShooterIndex].classList.add('boom')
      document.querySelector('.shooter').style.backgroundImage = "url('script/style/perdeu.png')";
      document.querySelector('.shooter').classList.add('perdeu')
      perdeu = true
      clearInterval(invaderId)
    }

    for (let i = 0; i <= alienInvaders.length - 1; i++){
      if (alienInvaders[i] > (squares.length - (width -1))) {
        resultDisplay.textContent = 'Você perdeu'
        squares[currentShooterIndex].classList.add('boom')
        document.querySelector('.shooter').style.backgroundImage = "url('script/style/perdeu.png')";
        document.querySelector('.shooter').classList.add('perdeu')
        perdeu = true
        clearInterval(invaderId)
      }
    }

    //ADD LATER
    if(alienInvadersTakenDown.length === alienInvaders.length) {
      console.log(alienInvadersTakenDown.length)
      console.log(alienInvaders.length)
      resultDisplay.textContent = 'Você venceu!'
      clearInterval(invaderId)
      //window.location = 'fase3.html';
    }
  }
  invaderId = setInterval(moveInvaders, 100)

  //shoot at aliens
  function shoot(e) {
    document.querySelector('.shooter').style.backgroundImage = "url('script/style/shooter.png')";
    let laserId
    let currentLaserIndex = currentShooterIndex
    //move the laser from the shooter to the alien invader
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser')
      currentLaserIndex -= width
      squares[currentLaserIndex].classList.add('laser')

      if (squares[currentLaserIndex].classList.contains('invader')) {
        squares[currentLaserIndex].classList.remove('laser')
        squares[currentLaserIndex].classList.remove('invader')
        squares[currentLaserIndex].classList.add('boom')
        
        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
        clearInterval(laserId)

        const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
        alienInvadersTakenDown.push(alienTakenDown)
        result++
        resultDisplay.textContent = result
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
      }
    }

    switch(e.keyCode) {
      case 32:
      if (perdeu !== true) {
        document.querySelector('.shooter').style.backgroundImage = "url('script/style/shooter2.png')";
        laserId = setInterval(moveLaser, 100)
        break
      }
        
    }
  }

  document.addEventListener('keyup', shoot)
})