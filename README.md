# Refugee help board backend
Backend server for studies subject 'Software Engineering'. 
It's application to support war refugees in finding help and shelter.

## How to run application?
1. Clone project using `git clone https://github.com/wojdzie/refugee-help-board-backend.git`
2. In project directory run `npm install` to install dependencies into the `node_modules/` directory.
3. Run `npm start` to start HTTP server.

## How to contribute?
I will show you how to contribute based on get all users feature.
1. Create new directory in project folder for your feature (e.g. `user`)
2. If not existing, create two JavaScript files, one for service and one for controller (e.g. `user.controller.js` and `user.service.js`)
3. In service write function with logic to solve given issue (e.g. `getAll` in `user.service.js`)
4. In controller write function to call service function and add endpoint path to router (e.g. `getAll` in `user.controller.js` and `router.get('/', getAll)`)
5. Add prefix to `// API routes` in `server.js` (e.g. `app.use('/user', require('./user/user.controller'))`)
6. Commit changes and push them to remote repository
