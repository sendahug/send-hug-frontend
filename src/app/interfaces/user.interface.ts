/*
  User interface
  Based on the User Model
  For the user's own profile
---------------------------------------------------
MIT License

Copyright (c) 2020 Send A Hug

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

export interface User {
  id?: number;
  auth0Id: string;
  displayName: string;
  receivedHugs: number;
  givenHugs: number;
  postsNum: number;
  loginCount: number;
  role: string;
  jwt: string;
  blocked: boolean;
  releaseDate: Date | undefined;
  autoRefresh: boolean;
  pushEnabled: boolean;
  refreshRate: number;
}
