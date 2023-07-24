const config = {
    registerUrl: 'http://localhost:8080/user/register',
    loginUrl: 'http://localhost:8080/user/login',
    websocketUrl: 'ws://localhost:8084/websocket',
    sendInvitationUrl: 'http://localhost:8080/user/connection/add',
    handleInvitationUrl: 'http://localhost:8080/user/connection/handle',
    updateMessageSeenUrl: 'http://localhost:8082/message/update/seen',
    deleteConnectionUrl: 'http://localhost:8080/user/connection/delete',
    addRemarkUrl: 'http://localhost:8080/user/remark/add',
    changeUsernameUrl: 'http://localhost:8080/user/username/change',
    searchUserByNameStartUrl: 'http://localhost:8080/user/searchuser',
  };
  
  export default config;