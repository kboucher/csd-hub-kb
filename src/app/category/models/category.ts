export class Category {
    constructor(
        public text: string,
        public id: string,
        public image: string,
        public state: any,
        public children: Category[],
    ) {}
}
