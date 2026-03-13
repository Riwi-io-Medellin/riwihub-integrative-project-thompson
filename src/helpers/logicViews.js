export function initViewLogic(path) {

    if (path === "/login") {
        loginLogic();
    } 
    else if (path === "/register") {
        registerLogic();
    } 
    else if (path === "/landingPage") {
        landingPageLogic();
    } 
    else if (path === "/adminPage") {
        adminLogic();
    } 
    else if (path === "/comercialPage") {
        comercialLogic();
    }
    else if(path === "/clientPage") {
        clientLogic();
    }
}