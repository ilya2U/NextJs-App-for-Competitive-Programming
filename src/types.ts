export interface RegisterUserInput {
    avatar: string;
    hash: string;
    username: string;
}

export interface LogInUserInput {
    hash: string;
    username: string;
}

export interface RegisterUserResponse {
    access_token: string;
}


export interface TaskI {
    _id: string;
    uuid: string;
    title: string;
    description: string;
    results: any[]; // здесь можете уточнить тип данных для results
    __v: number;
  };