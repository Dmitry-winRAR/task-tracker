const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority-select');
const themeToggle = document.getElementById('theme-toggle');
const filters = document.querySelectorAll('.filters button');

const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.priority, task.completed));
};

const saveTasks = () => {
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('span').textContent,
        priority: task.querySelector('.priority').classList[1],
        completed: task.classList.contains('completed'),
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTaskToDOM = (text, priority = 'low', completed = false) => {
    const li = document.createElement('li');
    li.className = `task ${completed ? 'completed' : ''}`;

    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority ${priority}`;
    prioritySpan.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
    li.appendChild(prioritySpan);

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    li.appendChild(textSpan);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        const newText = prompt('Edit your task:', textSpan.textContent);
        if (newText) {
            textSpan.textContent = newText;
            saveTasks();
        }
    });
    li.appendChild(editButton);

    const completeButton = document.createElement('button');
    completeButton.textContent = completed ? 'Undo' : 'Complete';
    completeButton.addEventListener('click', () => {
        li.classList.toggle('completed');
        completeButton.textContent = li.classList.contains('completed') ? 'Undo' : 'Complete';
        saveTasks();
    });
    li.appendChild(completeButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });
    li.appendChild(deleteButton);

    taskList.appendChild(li);
};

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const taskPriority = prioritySelect.value;
    if (taskText) {
        addTaskToDOM(taskText, taskPriority);
        taskInput.value = ''; 
        saveTasks(); 
    }
});

filters.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        filters.forEach(button => button.classList.remove('active'));
        filterButton.classList.add('active');

        const filter = filterButton.dataset.filter;
        Array.from(taskList.children).forEach(task => {
            switch (filter) {
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? '' : 'none';
                    break;
                case 'pending':
                    task.style.display = task.classList.contains('completed') ? 'none' : '';
                    break;
                case 'all':
                default:
                    task.style.display = '';
                    break;
            }
        });
    });
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

loadTasks();
