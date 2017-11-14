import { Injectable } from '@angular/core';
import { Category } from '../models/category';

function stateFactory() {
    return {
        disabled: false,
        opened: false,
        selected: false
    };
}

@Injectable()
export class CategoryService {
    private categories: Array<Category> = [
        new Category('Accounting', 'node_1', 'MONEY_ICON', stateFactory(), [
            new Category('Record Keeping', 'node_5', 'RECORDS_ICON', stateFactory(), []),
            new Category('IRS Records', 'node_6', 'IRS_ICON', stateFactory(), []),
        ]),
        new Category('Benefits', 'node_2', 'MAZE_ICON', stateFactory(), [
            new Category('Prescriptions', 'node_7', 'DRUGS_ICON', stateFactory(), []),
            new Category('Copay', 'node_8', 'COPAY_ICON', stateFactory(), []),
        ]),
        new Category('Bluecare', 'node_3', 'CHATBOX_ICON', stateFactory(), []),
        new Category('Breaking News', 'node_4', 'NEWS_ICON', stateFactory(), []),
    ];

    getCategories(): Array<Category> {
        return this.categories;
    }
}
