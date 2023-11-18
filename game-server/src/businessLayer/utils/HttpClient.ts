import axios, { AxiosResponse } from "axios";
import { Constants } from "./Constants";
import EnvConfigVars from "./EnvConfigVars";
import { CustomError } from "../model/CustomError";
import { ErrorType } from "../enum/ErrorType";

class HttpClient {
    public async sendHttpRequest<T>(url: string, body: T, methodCaseInsensitive: string): Promise<AxiosResponse> {
        const method = methodCaseInsensitive.toLowerCase();
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        // set custom secret to access api-server
        if (body) (body as any)[Constants.S2SCustomBodyKeyName] = EnvConfigVars.S2S_CUSTOM_SECRET;
        switch (method) {
            case "get": return axios.get(url, { headers });
            case "post": return axios.post(url, body, { headers });
            default: throw new CustomError(ErrorType.InvalidMethod, "Unsupported method", { method })
        }
    }
}

export const httpClient = new HttpClient()
