console.log("Test");
var tableGenerated = false; //Проверялка
var selectingStart = false;
var selectingFinish = false;

function generate(){
  if (tableGenerated == false)
  {
    var body = document.getElementsByTagName("body")[0];
    var size = document.getElementById("size").value;
    var container = document.createElement("container");
    container.className = "container";
    console.log(size);
    var tbl = document.createElement("table");
    for (var i = 0; i < parseInt(size); i++) 
    {
        var row = document.createElement("tr");
        for (var j = 0; j < parseInt(size); j++) 
        {
          var cell = document.createElement("td");
          row.appendChild(cell);
          var content = document.createElement("div"); //Чтобы текст случайно не выделялся, заменил его на div'ы фиксированного размера
          content.className = "content";
          cell.appendChild(content);
          cell.id = i + " " + j;
          //Теперь координаты задаются как x y
          cell.setAttribute("xcoord", i); //Добавил кастомные атрибуты чтобы можно было выдёргивать координаты х и у отдельно
          cell.setAttribute("ycoord", j);
          cell.className = "pass";
        }
        tbl.appendChild(row);
    }
    container.appendChild(tbl)
    body.appendChild(container);
    tableGenerated = true;
    let cells = document.querySelectorAll("td");
    cells.forEach(function (element)
    {
        element.onclick = function ()
        {
          if (selectingStart)
          {
            element.className = "start pass";
            var button = document.getElementById("selectstart")
            button.style.color = "hsl(140, 100%, 30%)";
            selectingStart = false;
          }
          else if (selectingFinish)
          {
            element.className = "finish pass";
            var button = document.getElementById("selectfinish")
            button.style.color = "hsl(350, 80%, 50%)";
            selectingFinish = false;
          }
          else if (element.classList.contains("pass"))
          {
            element.className = "impass";
          }
          else if (element.classList.contains("impass"))
          {
            element.className = "pass";
          }
        }
    })
  }
  else
  {
    alert("Таблица уже создана");  //Добавил проверку на созданность таблицы
  }
}

function selectStart()
{
  if (tableGenerated)
  {
    selectingStart = true;
    selectingFinish = false;
    var button = document.getElementById("selectstart")
    button.style.color = "grey";
    var start = document.querySelector(".start");
    if (start != null)
    {
      start.className = "pass";
    }
  }
  else
  {
    alert("Создайте таблицу");
  }
}

function selectFinish()
{
  if (tableGenerated)
  {
    selectingFinish = true;
    selectingStart = false;
    var button = document.getElementById("selectfinish")
    button.style.color = "grey";
    var finish = document.querySelector(".finish");
    if (finish != null)
    {
      finish.className = "pass";
    }
  }
  else
  {
    alert("Создайте таблицу");
  }
}

function generateMaze()
{
  var size = parseInt(document.getElementById("size").value); //todo: как-нибудь запоминать сайз, чтобы при изменении размера в input, всё не ломалось
  var matrix = new Array(size); //Как я прочитал, в js нет двумерных массивов
  var visitedmatrix = new Array(size);
  for (let i = 0; i < size; i++)
  {
    matrix[i] = new Array(size); //Поэтому я делаю массив массивов
    visitedmatrix[i] = new Array(size);
    for (let k = 0; k < size; k++)
    {
      var current = document.getElementById(i + " " + k);
      if (oddPosition(i,k) == false)
      {
        current.className ='impass';
      }
      matrix[i][k] = current;
      visitedmatrix[i][k] = false;
    }
  }
  var x = getRandomIntInclusive(0,size/2-1) * 2 + 1;
  var y = getRandomIntInclusive(0,size/2-1) * 2 + 1;
  dfs(matrix,x,y,size, visitedmatrix);
}

function dfs(matrix, x, y, size, visitedmatrix)
{
  visitedmatrix[x][y] = true; 
  matrix[x][y].className = "pass";
  var directions = ["up","down","right","left"]
  while (directions.length != 0)
  {
    var dir = getRandomIntInclusive(0,directions.length-1);
    switch(directions[dir])
    {
      case "up":
        if (isInside(x,y-2,size) && matrix[x][y-2].classList.contains("pass") && visitedmatrix[x][y-2] == false)
        {
          matrix[x][y-1].className = "pass";
          dfs(matrix, x, y-2, size, visitedmatrix);
        }
        directions.splice(dir, 1);
      break;
      case "down":
        if (isInside(x,y+2,size) && matrix[x][y+2].classList.contains("pass") && visitedmatrix[x][y+2] == false)
        {
          matrix[x][y+1].className = "pass";
          dfs(matrix, x, y+2, size, visitedmatrix);
        }
        directions.splice(dir, 1);
      break;
      case "right":
        if (isInside(x-2,y,size) && matrix[x-2][y].classList.contains("pass") && visitedmatrix[x-2][y] == false)
        {
          matrix[x-1][y].className = "pass";
          dfs(matrix, x-2, y, size,visitedmatrix);
        }
        directions.splice(dir, 1);
      break;
      case "left":
        if (isInside(x+2,y,size) && matrix[x+2][y].classList.contains("pass") && visitedmatrix[x+2][y] == false)
        {
          matrix[x+1][y].className = "pass";
          dfs(matrix, x+2, y, size, visitedmatrix);
        }
        directions.splice(dir, 1);
      break;
    }
  }
}

function findPath()
{
  var pathFound = false;
  var size = parseInt(document.getElementById("size").value);
  var map = new Array(size);
  for (let i = 0; i < size; i++)
  {
    map[i] = new Array(size); //Поэтому я делаю массив массивов
    for (let j = 0; j < size; j++)
    {
      map[i][j] = new Cell(document.getElementById(i + " " + j), i, j);
      if (map[i][j].element.classList.contains("start"))
      {
        var start = map[i][j];
      }
      else if (map[i][j].element.classList.contains("finish"))
      {
        var finish = map[i][j];
      }
    }
  }
  border = new PriorityQueue();
  start.g = 0;
  start.h = h(start.x, start.y, finish.x, finish.y)
  start.f = start.h;
  border.enqueue(start);
  var path = [];
  while (!border.isEmpty())
  {
    let current = border.dequeue();
    if (current == finish)
    {
      pathFound = true;
      current = current.parent;
      while (current != start)
      {
        path.push(current);
        current.element.classList.add("path");
        current = current.parent;
      }
    }
    current.isVisited = true;
    var successors = [];
    if (isInside(current.x - 1, current.y, size)) // N (i - 1, j)
    {
      successors.push(map[current.x - 1][current.y]);
    }
    if (isInside(current.x + 1, current.y, size)) // S (i + 1, j)
    {
      successors.push(map[current.x + 1][current.y]);
    }
    if (isInside(current.x, current.y + 1, size)) // E (i, j + 1)
    {
      successors.push(map[current.x][current.y + 1]);
    }
    if (isInside(current.x, current.y - 1, size)) // W (i, j - 1)
    {
      successors.push(map[current.x][current.y - 1]);
    }
    if (isInside(current.x - 1, current.y + 1, size)) // NE (i - 1, j + 1)
    {
      successors.push(map[current.x - 1][current.y + 1]);
    }
    if (isInside(current.x - 1, current.y - 1, size)) // NW (i - 1, j - 1)
    {
      successors.push(map[current.x - 1][current.y - 1]);
    }
    if (isInside(current.x + 1, current.y + 1, size)) // SE (i + 1, j + 1)
    {
      successors.push(map[current.x + 1][current.y + 1]);
    }
    if (isInside(current.x + 1, current.y - 1, size)) // SW (i + 1, j - 1)
    {
      successors.push(map[current.x + 1][current.y - 1]);
    }
    successors.forEach(successor => {
      if (!successor.isVisited && successor.element.classList.contains("pass"))
      {
        successor.g = current.g + 1;
        successor.h = h(successor.x, successor.y, finish.x, finish.y);
        successor.f = successor.g + successor.h;
        if (!border.data.includes(successor))
        {
          border.data.push(successor);
          successor.parent = current;
        }
      }
    })
  }
  if (!pathFound)
  {
    alert("Маршрут не найден");
  }
}

function isInside(x, y, size)
{
  return x < size && x >= 0 && y < size && y >= 0;
}

function getRandomIntInclusive(min, max) { //Функция рандома, ибо Math.random в JS берёт число в промежутке 0-1
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function oddPosition(x, y)
{
  return x % 2 != 0 && y % 2 != 0;
}

function h(x1, y1, x2, y2)
{
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

class PriorityQueue
{
  constructor()
  {
    this.data = [];
  }
  enqueue(object)
  {
    this.data.push(object);
  }
  dequeue()
  {
    let priority = this.data[0].f;
    let position = 0;
    this.data.forEach((element, index) => {
      if(element.f < priority) {
        priority = element.f;
        position = index;
      }
    });
    return this.data.splice(position, 1)[0];
  }
  isEmpty()
  {
    return this.data.length === 0;
  } 
  size()
  {
    return this.data.length;
  }
  clear()
  {
    this.data.length = 0;
  }
}

class Cell
{
  constructor(element, x, y)
  {
    this.element = element;
    this.x = x;
    this.y = y;
    this.parent = null;
    this.f = Number.MAX_SAFE_INTEGER;
    this.g = Number.MAX_SAFE_INTEGER;
    this.h = Number.MAX_SAFE_INTEGER;
    this.isVisited = false;
  }
}