document.addEventListener('DOMContentLoaded', () => {

  let tasks = []

  const $inputTask = document.querySelector('#todo')
  const $addTask = document.querySelector('#add-task')
  const $taskContainer = document.querySelector('.task-container')
  const $doneContainer = document.querySelector('.done-container')
  const $todoCounter = document.querySelector('#todo-counter')
  const $doneCounter = document.querySelector('#done-counter')

  tasks = JSON.parse(localStorage.getItem('tasks')) || []
  createTask()

  $addTask.addEventListener('click', handleAddTask)
  $taskContainer.addEventListener('click', handleTaskContainerClick)
  $doneContainer.addEventListener('click', handleDoneContainerClick)
  $inputTask.addEventListener('keydown', handleEnterPress)

  function handleAddTask() {
    const input = $inputTask.value.trim()
    if (input !== '') {
      let task = {
        id: Date.now(),
        task: input,
        done: false
      }
      tasks = [...tasks, task]
      createTask()
      cleanInput($inputTask)
      updateTodoCounter()
    }
  }

  function handleTaskContainerClick(e) {
    e.stopPropagation()
    if (e.target.parentElement.id === 'done') {
      markTaskAsDone(e)
    } else if (e.target.parentElement.id === 'delete') {
      deleteTask(e)
    }
  }

  function handleDoneContainerClick(e) {
    e.stopPropagation
    if (e.target.parentElement.id === 'delete') deleteTask(e)
  }

  function handleEnterPress(e) {
    if (e.key === 'Enter') handleAddTask()
  }

  function createTask() {
    syncLocalStorage()
    cleanTasks()
    updateTodoCounter()
    tasks.map(({ id, task, done }) => {
      const taskElement = createTaskElement(id, task, done);
      if (done === false) {
        $taskContainer.appendChild(taskElement);
      } else {
        $doneContainer.appendChild(taskElement);
      }
    })
  }

  function createSvgDone() {
    return `
    <svg width="23" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m19.785 6.674-11 11a.688.688 0 0 1-.973 0L3 12.86a.688.688 0 1 1 .973-.972l4.326 4.326L18.812 5.701a.688.688 0 0 1 .973.973Z"
      fill="currentColor"/>
    </svg>
    `
  }

  function createSvgDelete() {
    return `
    <svg width="23" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.611 4.125H3.486a.688.688 0 1 0 0 1.375h.688v12.375a1.375 1.375 0 0 0 1.375 1.375h11a1.375 1.375 0 0 0 1.375-1.375V5.5h.687a.687.687 0 0 0 0-1.375Zm-2.062 13.75h-11V5.5h11v12.375ZM6.924 2.062a.688.688 0 0 1 .687-.687h6.875a.687.687 0 0 1 0 1.375H7.611a.688.688 0 0 1-.687-.688Z"
      fill="currentColor"/>
    </svg>
    `
  }

  function createBtn(href, id, innerHTML, className = 'btn') {
    const a = document.createElement('a')
    a.setAttribute('href', href)
    a.setAttribute('id', id)
    a.classList.add(className)
    a.innerHTML = innerHTML
    return a
  }

  function createTaskElement(id, task, done) {
    const container = document.createElement('div')
    container.setAttribute('id', id)
    container.classList.add('task')

    const description = document.createElement('p')
    description.textContent = task

    const btnContainer = document.createElement('div')
    btnContainer.classList.add('btn-container')

    const btnDone = done === false ? createBtn('#', 'done', createSvgDone()) : null
    const btnDelete = createBtn('#', 'delete', createSvgDelete())

    container.appendChild(description)
    container.appendChild(btnContainer)

    if (btnDone) btnContainer.appendChild(btnDone);
    btnContainer.appendChild(btnDelete);

    return container;
  }

  function markTaskAsDone(e) {
    tasks.forEach(task => {
      if (task.id === Number(e.target.parentElement.parentElement.parentElement.id)) {
        task.done = true
      }
    });
    createTask()
  }

  function deleteTask(e) {
    tasks = tasks.filter(task => task.id !== Number(e.target.parentElement.parentElement.parentElement.id))
    createTask()
  }

  function updateTodoCounter() {
    $todoCounter.textContent = tasks.filter(task => task.done === false).length
    $doneCounter.textContent = tasks.filter(task => task.done === true).length
  }

  function cleanInput(inputElement) {
    inputElement.value = ''
  }

  function cleanTasks() {
    while ($taskContainer.firstChild) {
      $taskContainer.removeChild($taskContainer.firstChild)
    }
    while ($doneContainer.firstChild) {
      $doneContainer.removeChild($doneContainer.firstChild);
    }
  }

  function syncLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

})