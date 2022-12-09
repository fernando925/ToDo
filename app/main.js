const loadInitialTemplate = () => {
	const template = `
    <div class="container">
		<h1 class="h1-initial">To-Do List</h1>
        <div class="search">
            <form class="form-initial" id="task-form">
                    <input class="input-initial" name="name" placeholder="New task..." />
                    <button type="submit" class="btn-add">+</button>
            </form>
        </div>    
        <div class="li-container">
		    <ul id="task-list"></ul>
        </div>    
    </div>    
	`
	const body = document.getElementsByTagName('body')[0]
	body.innerHTML = template
}
const getTasks = async () => {
	const response = await fetch('/tasks', {
		headers: {
			Authorization: localStorage.getItem('jwt')
		}
	})
	const tasks = await response.json()
	const template = task => `
		<li>
			${task.name} <button data-id="${task._id}" class="btn-delete" >x</button>
		</li>
	`

	const taskList = document.getElementById('task-list')
	taskList.innerHTML = tasks.map(task => template(task)).join('')
	tasks.forEach(task => {
		const taskNode = document.querySelector(`[data-id="${task._id}"]`)
		taskNode.onclick = async e => {
			await fetch(`/tasks/${task._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: localStorage.getItem('jwt')
				}
			})
			taskNode.parentNode.remove()
			alert('Eliminado con éxito')
		}
	})
}
const addFormListener = () => {
	const taskForm = document.getElementById('task-form')
	taskForm.onsubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData(taskForm)
		const data = Object.fromEntries(formData.entries())
		
		await fetch('/tasks', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('jwt')
			}
		})
		taskForm.reset()
		getTasks()
	}
}

const checkLogin = () =>
    localStorage.getItem('jwt')

const tasksPage = () => {
    loadInitialTemplate()
    addFormListener()
    getTasks()
} 



const loadRegisterTemplate = () => {
	const template = `
    <div class="container">
        <h1>Create new account</h1>
        <h2>To access the To-Do List</h2>
            <form  id="register-form">
                <div>
                    <input class="input-general" name ="email" placeholder="Email" />
                </div>
                <div>
                    <input class="input-general" name ="password" placeholder="Password" />
                </div>
                <button class="btn-general" type="submit">Create Account</button>
            </form>
            <div class="div-goto">
                <a class="btn-goto" href="#" id="login">Log In</a>
            </div>
        <div class="error" id="error" ></div> 
    </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}
const gotoLoginListener = () => {
	const gotoLogin = document.getElementById('login')
    gotoLogin.onclick = (e) => {
        e.preventDefault()
        loginPage()
}
}
const registerPage = () => {
    loadRegisterTemplate()
    addRegisterListener()
    gotoLoginListener()
} 


const loginPage = () =>{
    loadLoginTemplate()
    addLoginListener()
    gotoRegisterListener()
}
const loadLoginTemplate = () =>{
    const template = `
    <div class="container">
        <h1>Log in</h1>
        <h2>To access the To-Do List</h2>
        <form id="login-form">
            <div>
                <input class="input-general" name ="email" placeholder="Email"/>
            </div>
            <div>
                <input class="input-general" name ="password" placeholder="Password"/>
            </div>
            <button class="btn-general" type="submit">Log in</button>
        </form>
        <div class="div-goto">
            <a class="btn-goto" href="#" id="register">Create new account </a>
        </div>
            <div class="error" id="error" ></div> 
    </div>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}
const gotoRegisterListener = () => {
    const gotoRegister = document.getElementById('register')
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
}
}


const authListener = action => () => {
	const form = document.getElementById(`${action}-form`)
    form.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch(`/${action}`,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const responseData = await response.text()
        if(response.status >= 300){
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else{
			localStorage.setItem('jwt', `Bearer ${responseData}`)
			tasksPage()
        }
    }
}
const addRegisterListener = authListener('register')
const addLoginListener = authListener('login')


window.onload = () =>{
    const isLoggedIn = checkLogin()
    if(isLoggedIn){
		tasksPage()
    } else{
	loginPage()
	}
} 
