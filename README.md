# CS5610 Final Project - Online Store Web Application
## Group 6

## Deployed Application:

Client: [cs5610-final-project-client.vercel.app](https://cs5610-final-project-client.vercel.app/)

Server: [cs5610-final-project-server.vercel.app](https://cs5610-final-project-server.vercel.app/)

## Demo Video: [https://vimeo.com/1036609792?share=copy](https://vimeo.com/1036609792?share=copy)

## Set up the backend, frontend, and run the project locally

### Required dependencies
For client, 
"dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "azure-maps-control": "^3.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.0.1",
    "react-scripts": "^5.0.1",
    "web-vitals": "^2.1.4"
  },

For server, 
"dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  }



### Set up and run

Create a folder named final-project, then under that, create two folders, client and server. 

Open up a terminal, `cd .\server` and `npm init -y`, then install the dependencies required for backend `npm install cors jsonwebtoken bcryptjs express mongodb`.

Place the server repository content in the server folder, overwrite whatever is already there. 

To start the server, `npm start`. 

Server will be running on http://localhost:5001/

------------------------------------------------------------------------------------------------
Open up another terminal, `cd .\client` and `npx create-react-app .`, then install the dependencies required for frontend `npm install react-router-dom react-dom azure-maps-control`.

Place the client repository content in the client folder, overwrite whatever is already there. 

<strong>To run with local server, manually replace 'https://cs5610-final-project-server.vercel.app' with 'http://localhost:5001' in each .js file in components folder. </strong>

To start the client, `npm start`.

Client will be running on http://localhost:3000/

Folder structure looks like below: 

![image](https://github.com/user-attachments/assets/a3d66985-b2b2-49d7-9c49-1b13b011df27)

## Database setup

Not necessary. Database is accessible to any IP. 

## Testing setup

To set up testing for this project, follow these steps:

Install the necessary testing dependencies:
`npm install --save-dev jest`
`npm install react-scripts`

Run the tests using the following command:
`npm test`
