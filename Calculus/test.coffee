coffee = (message="Ready for some coffee?") ->
    answer = confirm message
    "Your answer is #{answer}"

alert "You said #{coffee()}"