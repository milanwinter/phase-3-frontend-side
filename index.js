document.addEventListener("DOMContentLoaded", () => {

    
    const exerciseTable = document.querySelector("tbody")
    const exerciseDiv = document.querySelector("#exercise-panel")
    const planButton = document.querySelector("#submit-button")
    const input = document.querySelector("#plan-input")
    const planList = document.querySelector("#plans-list")
    const plansDiv = document.querySelector("#plans")
    let currentUser = ""


    plansDiv.addEventListener("click",handlePlanClick)

    //Everything to do with the login Modal Box --------------------------------------------

    const loginModal = document.querySelector("#login")
    const loginButton = document.querySelector("#login-button")
    const usernameInput = document.querySelector("#user-input")
    const emailInput = document.querySelector("#email-input")
     loginModal.style.display = "block"

    
    loginButton.addEventListener("click", createLoginUser)


    function createLoginUser(e) {
        e.preventDefault()
        const username = usernameInput.value
        const email = emailInput.value
        
        fetch("http://localhost:3000/users",{
            method: "POST",
            headers: {
                "Content-type":"application/json",
                "Accept":"application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email
            })
        })
            .then(resp => resp.json())
            .then(json => {
                handleUserResponse(json)
            })
        
    }

    function handleUserResponse(res) {
        if (res.error) {
            alert("Incorrect Credentials Try again")

        } else {
           
            currentUser = res.id
            // alert(`Welcome ${res.user_name}`)
            loginModal.style.display = "none"
            fetchWorkoutPlans()

        }
    }
    
    //End of the Login Modal Box Stuff ========================================================================









    // Everything to do with the exercise modal box------------------------------------------
    const exerciseModal = document.querySelector("#Exercises")
    const exerciseModalBody = document.querySelector(".modal-card-body")
    const exerciseModalClose = document.querySelector('.delete')
    const exerciseModalCancel = document.querySelector("button#cancel")
    const exerciseModalSelect = document.querySelector("select")
    const exerciseModalAddBtn = document.querySelector("#add")
    

    planButton.addEventListener("click", (e) => addPlan(e))
    exerciseModalClose.addEventListener("click", () => {
        exerciseModal.style.display = 'none'
    })
    exerciseModalCancel.addEventListener("click", () => {
        exerciseModal.style.display = 'none'
    
    })
    exerciseModalAddBtn.addEventListener("click", addExerciseToPlan)
    
    /// End of the modal box Stuff ==============================================================







    exerciseDiv.addEventListener("click", (e) => handleEvent(e))

    //these will run when page loads

    fetchExercises()
    // fetchWorkoutPlans()


    // fetching all exercises with thse next 3 functions ///
    function fetchExercises() {
        fetch("http://localhost:3000/exercises")
            .then(resp => resp.json())
            .then(json => displayExercises(json))
    }

    function displayExercises(exercises) {
        exercises.forEach(exercise => {
            displaySingleExercise(exercise)
        })
    }

    function displaySingleExercise(ex) {
        const tr = document.createElement("tr")
        const name = document.createElement("td")
        const description = document.createElement("td")
        const muscleGroup = document.createElement("td")
        const addButton = document.createElement('button')
        const imageCell = document.createElement("td")
        const image = document.createElement("img")
        image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzcOouX0aFFrzVJIVLTibFcageIi5Rw5ySkA&usqp=CAU"
        imageCell.appendChild(image)
        addButton.innerText = "Add"
        addButton.className = "button is-primary"
        addButton.dataset.exerciseId= ex.id
        name.innerText = ex.name
        description.innerText = ex.description
        muscleGroup.innerText=ex.muscle_group.name

        tr.append(name,description,muscleGroup,imageCell,addButton)

        exerciseTable.appendChild(tr)

    }

    // End of fetching/creating Exercises =============================================================



    // Adding an exercise to a workoutplan with this right here ------------------------->


    function handleEvent(e) {
      
        if(e.target.tagName === "BUTTON"){
            const id = e.target.dataset.exerciseId
            exerciseModal.style.display = 'block'
            addExerciseModalOptions()
            exerciseModal.dataset.exerciseId = id


            // exerciseModalAddBtn.addEventListener("click", () => addExerciseToPlan(e, id) )

            // fetch("http://localhost:3000/workout_plans", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Accept" : "application/json"
            //     },
            //     body: JSON.stringify({
            //         id: id
            //     })
            // })
        }
    }

    function addExerciseModalOptions() {
       const select = document.querySelector("select")

       fetch("http://localhost:3000/workout_plans")
        .then(resp => resp.json())
        .then(json => createOptions(json))
       
    }

    function createOptions(plans) {
        exerciseModalSelect.innerHTML = ""
        let userPlans = plans.filter(plan => plan.user_id === currentUser)
            if (userPlans.length > 0) {
                userPlans.forEach( 
                (plan) => {
                const option = document.createElement("option")
                option.value = plan.name
                option.innerText = plan.name
                option.dataset.planId = plan.id
                exerciseModalSelect.appendChild(option)
                })
            } else {
                exerciseModalBody.innerText = "No Plans Made yet, Create one so you can add exercises dummy"
            }

    }
    
    function addExerciseToPlan() {
        const id = exerciseModal.dataset.exerciseId
        const plan = exerciseModalSelect.value
         fetch("http://localhost:3000/workout_exercises", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify({
                    exercise_id: id,
                    name: plan
                })
            })
                .then(resp => resp.json())
                .then(json => {
                 exerciseModal.style.display = 'none'
                 fetchWorkoutPlans()
                })

    }
    


    /// end of adding exercises ===============================================================







    // Adding Plans Down below ------------------------------------------------------>

    function addPlan(e) {
       
       fetch("http://localhost:3000/workout_plans", {
           method: "POST",
           headers: {
               "Content-type": "application/json",
               "Accept": "application/json"
           },
           body: JSON.stringify({
               name: input.value,
               userId: currentUser
           })
       })
        .then(resp => resp.json())
        .then(json => {
            fetchWorkoutPlans()
        })
        
    }

    function fetchWorkoutPlans() {
        fetch("http://localhost:3000/workout_plans")
            .then(resp => resp.json())
            .then(json => displayPlans(json))
    }

    function displayPlans(plans) {
        let userPlans = plans.filter(plan =>  plan.user_id === currentUser)
        planList.innerHTML = ""
        if(userPlans.length > 0) {
            userPlans.forEach((plan) => {
                plan.user_id === currentUser
                    displaySinglePlan(plan)
            
            })
        } else {
            planList.innerHTML = "No Plans Yet, Try to Make one!"
        }
    }

    function displaySinglePlan(plan) {
       
        const bigLi = document.createElement("li")
        const ul = document.createElement("ul")
        bigLi.innerText = plan.name
        bigLi.dataset.planId = plan.id
        if (plan.exercises && plan.exercises.length > 0) {
            plan.exercises.forEach((exercise) => {
                const li = document.createElement("li")
                li.innerText = exercise.name + "     "
                li.dataset.exerciseId = exercise.id
                const deleteButton = document.createElement("button")
                deleteButton.innerText = "delete"
                deleteButton.className = "delete is-medium has-background-danger"
                li.appendChild(deleteButton)
                ul.appendChild(li)
            })
        } else {
            const li = document.createElement("li")
            li.innerText = "No Exercises for this plan yet, add some!"
            ul.appendChild(li)
        }

        bigLi.appendChild(ul)
        planList.appendChild(bigLi)
    }

    function handlePlanClick(e) {
        console.log(e.target)
        const exerciseId = e.target.parentNode.dataset.exerciseId
        const planId =  e.target.parentNode.parentNode.parentNode.dataset.planId
        
        if (e.target.className === "delete is-medium has-background-danger") {
            console.log(exerciseId)
            console.log(planId)
            fetch("http://localhost:3000/workout_plans", {
                method: "DESTROY",
                headers: {
                    "Content-Type": "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify({
                    exerciseId: exerciseId,
                    planId: planId
                })
            })
            
        }
    }

    /// end of adding plans ==========================================================
})