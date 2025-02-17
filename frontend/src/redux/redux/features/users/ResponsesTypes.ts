export interface LoggedUser {
    accessToken: string;
    user: User;
}

interface User {
    email: string;
    isSubscribed: boolean;
}
