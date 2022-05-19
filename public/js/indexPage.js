window.addEventListener('DOMContentLoaded', () => {
    if(username){
        let wrapper = document.createElement("div")
        wrapper.classList.add("divText")
        let textConnected = document.createElement("p")
        textConnected.innerText = "Vous êtes connecté en tant que: " + username;
        wrapper.appendChild(textConnected)
        document.body.appendChild(wrapper)

        let circularMenuItems = document.getElementsByClassName("items-wrapper")[0]
        let newItem = document.createElement("a")
        let ytbItem = document.getElementsByClassName("fa-home")[0]
        newItem.href = "/logout"
        newItem.classList.add("menu-item")
        newItem.classList.add("fa")
        newItem.classList.add("fa-sign-out-alt")
        circularMenuItems.insertBefore(newItem, ytbItem)

    }else{
        let wrapper = document.createElement("div")
        wrapper.classList.add("divText")
        let textConnected = document.createElement("p")
        textConnected.innerText = "Vous n'êtes pas connecté !";
        wrapper.appendChild(textConnected)
        document.body.appendChild(wrapper)

        let circularMenuItems = document.getElementsByClassName("items-wrapper")[0]
        let newItem = document.createElement("a")
        let ytbItem = document.getElementsByClassName("fa-home")[0]
        newItem.href = "/signin"
        newItem.classList.add("menu-item")
        newItem.classList.add("fa")
        newItem.classList.add("fa-user")
        circularMenuItems.insertBefore(newItem, ytbItem)
    }
});
