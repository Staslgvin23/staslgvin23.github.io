let totalRows = 1;
let totalColumns = 1;
let ant;
let moveInterval;

/**
 * Events block
 */
window.addEventListener('load', onLoadListener);

window.onbeforeunload = () => {
  window.removeEventListener('load', onLoadListener);
  clearInterval(moveInterval);
}

/**
 * Functions block
 */
/**
 * this function was borrowed from
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 * Thanks to https://stackoverflow.com/users/58808/ionu%c8%9b-g-stan and https://stackoverflow.com/users/883970/micnic
 * for their answer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preparePage() {
  const root = document.getElementById('root');
  let pageWidth = root.clientWidth;
  let pageHeight = root.clientHeight;

  // This is just to be sure that page has no irregular size "blocks"
  if (pageWidth % 10 !== 0) {
    const extraColumn = pageWidth % 10;

    root.style.marginLeft = extraColumn + 'px';
    pageWidth -= extraColumn;
  }

  if (pageHeight % 10 !== 0) {
    const extraRow = pageHeight % 10;

    root.style.marginTop = extraRow + 'px';
    pageHeight -= extraRow;
  }

  totalRows = pageHeight / 10;
  totalColumns = pageWidth / 10;

  for (let i = 0, n = totalRows; i < n; ++i) {
    const row = document.createElement('div');

    row.style.height = '10px';
    row.style.display = 'flex';

    for (let j = 0, m = totalColumns; j < m; ++j) {
      const block = document.createElement('div');

      // small element styling
      block.style.display = 'inline-bloc';
      block.style.height = '10px';
      block.style.width = '10px';
      block.style.display = 'flex';
      block.style.justifyContent = 'center';
      block.style.alignItems = 'center';

      block.dataset.y = `${i + 1}`;
      block.dataset.x = `${j + 1}`;

      block.style.backgroundColor = Math.random() >= 0.5 ? '#000' : '#fff';

      row.appendChild(block);
    }

    root.appendChild(row);
  }
}

function onLoadListener() {
  preparePage();

  // now we can place our ant
  ant = new Ant(totalColumns, totalRows);

  moveInterval = setInterval(() => {
    ant.move();
  }, 1)
}

/**
 * Behaviour block
 */
function Ant(totalColumns, totalRows) {
  this.y = getRandomInt(0, totalRows);
  this.x = getRandomInt(0, totalColumns);
  this.degree = 0;

  const antElement = document.createElement('div');

  // small ant element styling to recognize it on the screen
  antElement.style.width = '7px';
  antElement.style.height = '7px';
  antElement.style.backgroundColor = '#f00';
  antElement.id = 'ant-model';
  // ant's face (basic direction of the element)
  antElement.style.borderTop = '2px solid #ff0'

  const startingPoint = this.findNewParent();

  startingPoint.appendChild(antElement);
}

Ant.prototype.findNewParent = function () {
  return document.querySelector(`[data-y="${this.y}"][data-x="${this.x}"]`)
}

/**
 * currentParent.style.backgroundColor === '#000'
 * we have to:
 * turn left
 * change parent background to opposite color
 * move one step towards the face
 */
/**
 * currentParent.style.backgroundColor === '#fff'
 * we have to:
 * turn right
 * change parent background to opposite color
 * move one step towards the face
 */
Ant.prototype.move = function () {
  const antElement = document.getElementById('ant-model');
  const currentParent = antElement.parentElement;
  const isParentColored = currentParent.style.backgroundColor === 'rgb(0, 0, 0)'

  this.changeDirection(isParentColored ? -90 : 90);

  antElement.style.transform = `rotate(${this.degree}deg)`;
  currentParent.style.backgroundColor = isParentColored ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';

  this.handlePositionChange(antElement);
}

Ant.prototype.changeDirection = function (diff) {
  this.degree = this.degree + diff;

  // prevent uncontrolled degree value growing
  if (this.degree === 360 || this.degree === -360) {
    this.degree = 0;
  }
}

Ant.prototype.handlePositionChange = function (antElement) {
  switch (this.degree) {
    case 0: {
      //  move up
      this.y = this.y - 1 <= 0 ? totalRows : this.y - 1;
      break;
    }
    case 90:
    case -270:  {
      //  move right
      this.x = this.x + 1 >= totalColumns ? 1 : this.x + 1;
      break;
    }
    case 180:
    case -180:  {
      //  move down
      this.y = this.y + 1 >= totalRows ? 1 : this.y + 1;
      break;
    }
    case -90:
    case 270:  {
      //  move left
      this.x = this.x - 1 <= 0 ? totalColumns : this.x - 1;
      break;
    }
  }

  const newParent = this.findNewParent();

  newParent.appendChild(antElement);
}
