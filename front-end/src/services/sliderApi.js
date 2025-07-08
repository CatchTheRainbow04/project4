import axiosClient from "./axiosClient";

const sliderApi = {
    getAll : (params)=>{
        return axiosClient.get("/sliders",{params})
    }
}
export default sliderApi;