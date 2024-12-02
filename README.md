# CS5610 Final Project - Online Store Web Application
## Group 6

## Deployed Application:

Client: [cs5610-final-project-client.vercel.app](https://cs5610-final-project-client.vercel.app/)

Server: [cs5610-final-project-server.vercel.app](https://cs5610-final-project-server.vercel.app/)

## Demo Video: https://vimeo.com/1035076256/2d62e0a055

## Set up the backend, frontend, and run the project locally

### Required dependencies
`npm install react-router-dom`

`npm install cors jsonwebtoken bcryptjs express mongodb azure-maps-control`

`npm install --save-dev jest` for testing purpose

`npm install react-scripts` for testing purpose

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
