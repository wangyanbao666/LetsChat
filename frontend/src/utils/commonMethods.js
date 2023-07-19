const oneDay = 24 * 60 * 60 * 1000;

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

export function getUserTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function convertSystemTime(datetime){
    const dateTime = new Date(datetime);
    return dateTime.toLocaleString('en-US', {timeZone: getUserTimeZone()})
}

export function getSystemTime() {
    return new Date().toLocaleString('en-US', {timeZone: getUserTimeZone()})
}


export function getDateDiff(datetime){
    const utcDate1 = new Date()
    const utcDate2 = new Date(datetime)
    const diffDays = Math.floor((utcDate1 - utcDate2) / oneDay);
    if (diffDays === 0){
        return "Today"
    }
    else if (diffDays <= 1){
        return "Yesterday"
    }
    else {
        return utcDate2.toLocaleTimeString([], {month:"short", day:"2-digit"})
    }
}