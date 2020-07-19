export enum Stage {
    PROD = 'Prod',
    STAGE = 'Stage',
    LOCAL = 'http://localhost:3000', // Default api gateway url using SAM local start-api
}

export interface ApiSetup {
    /**
     * Specify the stage of the api gateway
     * If stage is LOCAL then localhost will be used
     */
    stage?: Stage;

    /**
     * Base URL of api requests
     */
    baseURL: string;

    /**
     * Function to get authorization token, required for authenticated requests
     */
    tokenFn?: () => string;
}
