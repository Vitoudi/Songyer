export function updateMembers(action, member, callback) {
  if (action === "leave") {
    callback((members) => {
      const update = members.filter((currentMember) => {
        return currentMember.id !== member.id;
      });
      return update;
    });
  } else if (action === "enter") {
    callback((members) => {
      return [...members, member];
    });
  } else {
    throw new Error("invalid update method");
  }
}