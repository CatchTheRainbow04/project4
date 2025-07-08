import axiosClient from "./axiosClient";

const sliderApi = {
    getAll : (params)=>{
        return axiosClient.get("/settings",{params})
    }
}
export default sliderApi;