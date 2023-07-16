export function checkUserExistance(friends, user){
    for (let friend of friends){
        if (friend.id == user.id){
            return true;
        }
    }
    return false;
}

export function updateConnection(previousConnectionRequest, invitation){
    for (let i=0;i<previousConnectionRequest.length;i++){
        let sentInvitation = previousConnectionRequest[i];
        if (sentInvitation.receiverName == invitation.receiverName){
            previousConnectionRequest.splice(i,1);
        }
    }
    let newConnectionRequest = [invitation, ...previousConnectionRequest]
    return newConnectionRequest
}

export function getTime(){
    return new Date().toJSON();
}