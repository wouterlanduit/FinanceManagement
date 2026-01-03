export class AuthenticationHelper {
    backendUrl: string = "http://localhost:5265";

    public async getBearerToken(): Promise<string> {
        let bearerToken: string = "";

        try {
            const resp: Response = await fetch(this.backendUrl + "/authenticate/bearer?name=API&apiKey=test", {
                method: "POST"
            });
            if (!resp.ok) {
                throw new Error("Failed to login.");
            }
            // TODO womee: return json with token en expiry
            const jsonResult = await resp.text();
            // TODO do we need to get a specific property?
            bearerToken = jsonResult;
        }
        catch (error) {
            console.error(error);
            throw new Error("Failed to login.");
        }

        return bearerToken;
    }

    public async login() {
        const resp: Response = await fetch(this.backendUrl + "/authenticate/login?name=API&apiKey=test", {
            method: "POST"
        });

        if (!resp.ok) {
            throw new Error("Failed to login.");
        }
    }

    public async logout() {
        const resp: Response = await fetch(this.backendUrl + "/authenticate/logout", {
            method: "POST"
        });

        if (!resp.ok) {
            throw new Error("Failed to logout.");
        }        
    }
}
