/*
Frontend

UI
list of numbers "static"
  - single button named called "Call" for the whole lists
    - when you click it
      - button is disabled, it never needs to be re-enabled.
  - show status for each number
    - updates various stages until it's done
    - "Idle" => call hasn't yet begun
    - "ringing"
    - "answered"
    - "completed"

Backend

our server
  UI sends one request => call this list

  server will call them all following these rules:
  - you must dial 3 numbers simultaneously at all times (unless there are fewer than 3 numbers
  left)
  - If a phone call finishes, you should go ahead and dial the next number in the list
  - Numbers must be dialed in the order they are given in the list
  - We don't want to give the client the ability to:
    - initiate more than 3 calls at a time,
    - dial numbers outside of the list we specified, or
    - dial numbers out of order.

router
- GET phoneNumbers

  response payload
  [
    {
      phoneNumber: 2344534535,
      phoneNumberID: 453
    },
    ...
  ]

- POST callPhoneNumbers
  no body
  respond 200 OK

  - inititates chain of POST requests to numberDialerAPI /call

- Init websockets connect (SOMEHOW)
  =>
  <= server to client { phoneNumberID, status}
  close connection

- POST callStatus/:phoneNumberID   // this is the webhook endpoint

  - receive updates, already know for which for number
  - send an update via websocket { phoneNumberID, status}



3-rd party API server (all exists already)

POST /call
  expected json body:
  - phone (string)
  - webhookURL (string)
    ex. `localhost:3000/callStatus/:phoneNumberID`

  response json body:
  - { "id": 2345 } (number uniquely identifying the call)

The webhook receives POST requests at the url we set.

POST request contains:
id (integer) and status (string), identifying the call and telling you its new status.

ex. { "id": 2345, "status": "answered" }

possible status: "ringing", "answered", or "completed"



*/

/*

implementation plan:

1) focus on getting the end-to-end functionality right without live updates (no websockets)
  - backend, responds to GET phoneNumbers/
  - responds POST callPhoneNumbers/ with 200 OK, does nothing yet

  - frontend, sends GET phoneNumbers/ on load
  - then POST callPhoneNumbers/ on click (doesn't receive updates)

  - initiates POST to third-party call/ endpoint
    - three workers running in parallel
  - backend, receives POST callStatus/:phoneNumberID
    - only log status updates for now

*/
