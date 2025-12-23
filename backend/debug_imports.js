const eventController = require('./src/controllers/eventController');
const authMiddleware = require('./src/middleware/authMiddleware');

console.log('eventController:', eventController);
console.log('deleteEvent:', eventController.deleteEvent);
console.log('deleteAllEvents:', eventController.deleteAllEvents);

console.log('authMiddleware:', authMiddleware);
console.log('verifyToken:', authMiddleware.verifyToken);
console.log('isAdmin:', authMiddleware.isAdmin);
