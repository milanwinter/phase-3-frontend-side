document.addEventListener("DOMContentLoaded", {
    fetchExercises()

    function fetchExercises() {
        fetch("http://localhost:3000/exercises")
            .then(resp => resp.json())
            .then(console.log)
    }
})