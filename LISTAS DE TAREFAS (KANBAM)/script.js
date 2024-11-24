document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const colunas = {
      open: document.getElementById('taskListOpen'),
      bid: document.getElementById('taskListBid'),
      andamento: document.getElementById('taskListAndamento'),
      done: document.getElementById('taskListDone')
  };

  const isValidSetup = taskInput && addTaskBtn && 
      colunas.open && colunas.bid && 
      colunas.andamento && colunas.done;

  if (!isValidSetup) {
      console.error('Elementos necessários não encontrados no DOM');
      return;
  }

  loadTasks();

  addTaskBtn.addEventListener('click', () => {
      if (taskInput.value.trim()) {
          createTaskElement('open', taskInput.value.trim());
          taskInput.value = '';
      }
  });

  taskInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && taskInput.value.trim()) {
          createTaskElement('open', taskInput.value.trim());
          taskInput.value = '';
      }
  });

  function createTaskElement(coluna, taskDescription) {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
      taskElement.draggable = true;
      taskElement.innerHTML = `
          <span>${taskDescription}</span>
          <button onclick="removeTask(this)">X</button>
      `;
      taskElement.addEventListener('dragstart', dragStart);

      if (colunas[coluna]) {
          colunas[coluna].appendChild(taskElement);
          saveTask(coluna, taskDescription);
      }
  }

  function saveTask(coluna, taskDescription) {
      const tasks = getStoredTasks();
      
      if (tasks[coluna] && !tasks[coluna].includes(taskDescription)) {
          tasks[coluna].push(taskDescription);
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  }

  function loadTasks() {
      const tasks = getStoredTasks();
      
      Object.keys(colunas).forEach(coluna => {
          if (colunas[coluna]) {
              colunas[coluna].innerHTML = '';
          }
      });

      Object.entries(tasks).forEach(([coluna, taskList]) => {
          if (colunas[coluna]) {
              taskList.forEach(taskDescription => {
                  createTaskElement(coluna, taskDescription);
              });
          }
      });
  }

  function getStoredTasks() {
      return JSON.parse(localStorage.getItem('tasks')) || {
          open: [],
          bid: [],
          andamento: [],
          done: []
      };
  }

  window.removeTask = function(button) {
      const taskElement = button.parentElement;
      const coluna = taskElement.parentElement.id.replace('taskList', '').toLowerCase();
      const taskDescription = taskElement.querySelector('span').innerText;

      taskElement.remove();
      removeTaskFromStorage(coluna, taskDescription);
  };

  function removeTaskFromStorage(coluna, taskDescription) {
      const tasks = getStoredTasks();
      if (tasks[coluna]) {
          tasks[coluna] = tasks[coluna].filter(task => task !== taskDescription);
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  }

  Object.values(colunas).forEach(colunaElement => {
      if (colunaElement) {
          colunaElement.addEventListener('dragover', dragOver);
          colunaElement.addEventListener('drop', drop);
      }
  });

  function dragStart(event) {
      event.dataTransfer.setData('text', event.target.querySelector('span').innerText);
      event.dataTransfer.setData('origincoluna', event.target.parentElement.id.replace('taskList', '').toLowerCase());
      event.target.classList.add('dragging');
  }

  function dragOver(event) {
      event.preventDefault();
  }

  function drop(event) {
      event.preventDefault();
      const taskDescription = event.dataTransfer.getData('text');
      const origincoluna = event.dataTransfer.getData('origincoluna');
      let targetcoluna = event.target.id.replace('taskList', '').toLowerCase();
      
      if (!targetcoluna || !colunas[targetcoluna]) {
          const parentElement = event.target.closest('.taskList');
          if (parentElement) {
              targetcoluna = parentElement.id.replace('taskList', '').toLowerCase();
          }
      }

      if (colunas[targetcoluna] && origincoluna !== targetcoluna) {
          removeTaskFromStorage(origincoluna, taskDescription);
          createTaskElement(targetcoluna, taskDescription);

          const taskElement = document.querySelector('.dragging');
          if (taskElement) {
              taskElement.classList.remove('dragging');
              taskElement.remove();
          }
      }
  }
});