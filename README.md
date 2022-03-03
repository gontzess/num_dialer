# NumDialer

Your goal is to implement NumDialer, a NodeJS web application that lets users dial down a list of phone numbers.

To simulate calling phone numbers, we've created a simple HTTP API that you'll be using.

Feel free to use any NodeJS frameworks you feel comfortable with, and follow the front-end and back-end specifications
listed below. There is no starter code for this take-home. you'll have full autonomy over designing this application.

The list of phone numbers that users will be dialing down is static, and it is included below.
Note that there are some repeats. users may call the same number more than once.

```
13018040009

19842068287

15512459377

19362072765

18582210308

13018040009

19842068287

15512459377

19362072765
```

The biggest thing we're looking for is clean, simple code. Don't try to be clever when you don't need to be, and don't worry
about performance until it becomes a bottleneck. We want to see you design a project that is robust, functionally correct,
and easy for other engineers to read and understand.

## API Setup and Docs

For the purposes of this take-home, we're not actually making real calls; we're just simulating what may happen.
To simulate making phone calls, you'll be using an API that we've created.
The API is written in Node.js. If you don't already have Node.js version 10.x and npm installed on your system,
please do so by visiting https://nodejs.org/en/.

Please download the app from http://d30l2an5huagqb.cloudfront.net/api-work/numDialer.zip and extract it. Then:

```
$ cd numDialer

$ npm install             # Install dependencies.

$ node build/server.js    # Run the API server.
```

**Do not modify the API server in any way. This is not starter code.**

The above commands will clone and start the server, and it'll listen on localhost:4830.
The API consists of a single endpoint:

**POST /call**

Simulates a phone call to a number. You must provide the following parameters in a JSON-encoded HTTP body:

- phone (string) - The phone number to call, in exactly the format as specified in the list of numbers at the top of this page.
- webhookURL (string) - As the call progresses through stages, the API server will make POST requests to this URL, informing you of the status of the call. See the next section for details.

In response to POST /call, you'll receive a JSON object with a single key: id (number), whose value is a number uniquely
identifying the call. For instance, { "id": 2345 } would tell you the call has an identifier of 2345.

### Requests to Your Webhook

As the call progresses through stages (ringing, answered, completed), the API server will make POST requests to this URL,
informing you of the status of the call. Each POST request will contain a JSON body containing two key-value pairs,
id (integer) and status (string), identifying the call and telling you its new status. The status will either be the literal
string "ringing", "answered", or "completed".

For instance, you may get the JSON body { "id": 2345, "status": "answered" }, telling you that the call with an identifier
of 2345 was just answered.

## Front-end specification

There are two components to the front-end:

- At all times, you should display every phone number and the status of the call made to it. If a call hasn't yet begun,
  show the status idle. The statuses should update live, without needing to refresh the page. In other words, the user should
  see the statuses change in real-time. It's fine if there's a lag between receiving the webhook and updating the status on
  the page.
- A single button labeled Call, which should commence dialing as per the backend specification below.
  The page should not refresh/redirect when this button is clicked. Disable or remove this button after dialing has started;
  it never needs to be re-enabled.

Do not write any CSS, we're not judging this application on its looks.

## Back-end specification

The back-end must provide HTTP routes to display the front-end, make calls using the API, and handle webhooks.
It's up to you to decide how to structure and architect your back-end. There are a few key requirements:

- Once dialing has commenced, you must dial 3 numbers simultaneously at all times (unless there are fewer than 3 numbers
  left). If a phone call finishes, you should go ahead and dial the next number in the list.
  Numbers must be dialed in the order they are given in the list. Do not put this logic on the front-end we don't want to give
  the client the ability to initiate more than 3 calls at a time, dial numbers outside of the list we specified, or
  dial numbers out of order.
- Do not use a database; just maintain the state of calls in memory. You can assume there's only one user, and that user
  only dials down the list of numbers a single time.

**Guidelines**

- We mentioned this earlier, but it bears repeating: keep your code as simple as possible while being functionally correct. You should strive to make it easy for a novice engineer to understand your code. The goal is not to be clever; it's to write maintainable, clear code.
- Don't prematurely optimize. In fact, there should be little need to optimize at all for this take-home.
