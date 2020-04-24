const createDebug = require('debug');
const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

const info = createDebug('cleanup:info');

async function cleanup() {
  info('Running');
  const expiredUsers = await User.find({
    expiresAt: { $lte: new Date() },
    cleaned: null
  }).distinct('_id');
  if (expiredUsers.length === 0) {
    info('No expired users found');
  } else {
    info('Found the following expired users: %o', expiredUsers);

    // Removing chats of expired participants
    const expiredChats = await Chat.find({ owner: { $in: expiredUsers } }).distinct('_id');
    info('Found the following expired chats: %o', expiredChats);

    const messageDeleteResult = await Message.deleteMany({ chat: { $in: expiredChats } });
    info('Deleted %s messages', messageDeleteResult.deletedCount);

    const chatsDeleteResult = await Chat.deleteMany({ owner: { $in: expiredUsers } });
    info('Deleted %s chats with expired owners', chatsDeleteResult.deletedCount);

    const userUpdateResult = await User.updateMany({ _id: { $in: expiredUsers } }, { cleaned: true });
    info('Cleaned %s users', userUpdateResult.nModified);
  }
  info('Finished');
}

module.exports = cleanup;