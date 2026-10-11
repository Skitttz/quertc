declare global {
  var onlineUsers: Map<string, number> | undefined;
}

const registry = () => {
  global.onlineUsers ??= new Map();
  return global.onlineUsers;
};

const presenceRoom = (userId: string) => `presence:${userId}`;

function markConnected(userId: string) {
  const count = registry().get(userId) ?? 0;
  registry().set(userId, count + 1);
  return count === 0;
}

function markDisconnected(userId: string) {
  const count = (registry().get(userId) ?? 0) - 1;

  if (count > 0) {
    registry().set(userId, count);
    return false;
  }

  registry().delete(userId);
  return true;
}

const isOnline = (userId: string) => registry().has(userId);

export { isOnline, markConnected, markDisconnected, presenceRoom };
