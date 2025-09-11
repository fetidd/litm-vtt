export default class User {
    constructor(
        public username: string,
        public role: 'narrator' | 'player'
    ) {}
}