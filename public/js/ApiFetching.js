class ApiFetching {
    constructor() {
        this.usersApi = "/api/users";
        this.questionsApi = "/api/questions";
    }

    async getAllUsers(){
        const response = await axios.get(
            "/api/users"
        );
        return response.data;
    }
    async getUser(username){
        const response = await axios.get(
            `/api/users/${username}`
        );
        return response.data;
    }
    async getQuestion(questionNumber){
        const response = await axios.get(
            `/api/questions`
        );
        return response.data[questionNumber];
    }

}

export default ApiFetching;
