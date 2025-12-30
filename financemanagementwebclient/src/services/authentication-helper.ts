export class AuthenticationHelper {
    backendUrl: string = "http://localhost:5265";

    public async getBearerToken(): Promise<string> {
        const resp: Response = await fetch(this.backendUrl + "/login/bearer?name=API&apiKey=test", {
            method: "POST"
        });
        if (!resp.ok) {
            throw new Error("Failed to login.");
        }
        // TODO womee: return json with token en expiry
        const jsonResult = await resp.text();
        // TODO do we need to get a specific property?
        const bearerToken: string = jsonResult;

        return bearerToken;
    }

    public async login() {
        const resp: Response = await fetch(this.backendUrl + "/login/cookie?name=API&apiKey=test", {
            method: "POST"
        });

        if (!resp.ok) {
            throw new Error("Failed to login.");
        }
    }
}
