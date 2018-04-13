## Starting a session

POST  https://letshavelunchserver.herokuapp.com/api/session_start
	body:{
    emails: 'example@mail.com',
    location: {
      longitude: "example lon",
      latitude: "example lat"
    },
    guests: 5
  }

You will receive a response with the session key:



## Loading location data

GET https://letshavelunchserver.herokuapp.com/api/{session}/load_location_data

You will receive a JSON response with all the current location data.

## Loading image data

GET https://letshavelunchserver.herokuapp.com/api/{session}/load_images

You will receive a JSON response with the current images for the session.
The key for each image is the place_id for each location.

ex:
''
      {
        "ChIJW1T-ZUqH3YgRL55uMbBRnW8": "https://lh3.googleusercontent.com/p/AF1QipPHC69ORGH1WMGQ1oOvJ8LYr602uXKNeMGWIktL=s1600-w400",
        "ChIJa7iM4DKH3YgRKLjmXG0JrjI": "https://lh3.googleusercontent.com/p/AF1QipPi1YEyNDpyrYgf62iGxMdoaZPjRASIotNcgkic=s1600-w400",
        "ChIJkQ9ttDKH3YgRsXew8QIyxhY": "https://lh3.googleusercontent.com/p/AF1QipM0PL2jyPyC1Z6nRc05dUIrvI33IPqczYGLBc6C=s1600-w400",
        "ChIJp4_GQkqH3YgR46URowhCCIU": "https://lh3.googleusercontent.com/p/AF1QipN3t_rlf_jAmZRAEAtgaMECviSXExGjj1HkiN02=s1600-w400"
      }
``
## Add a vote

POST https://letshavelunchserver.herokuapp.com/api/{session}/vote/{place_id}

This will increase the vote count of the place by one.

## Add an email
POST https://letshavelunchserver.herokuapp.com/api/{session}/email_add

  body:{
    email: "example@example.com"
  }

## Get current Results

GET https://letshavelunchserver.herokuapp.com/api/{session}/get_res

  returns the current results plus locations
