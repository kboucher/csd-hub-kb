export class Article {
    constructor(
        public title: string,
        public id: number,
        public date: string,
        public body?: string,
        public categories?: any[],
        public error?: any,
        public read?: boolean,
    ) {}
}
