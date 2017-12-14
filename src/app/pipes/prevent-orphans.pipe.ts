import { Pipe, Injectable } from '@angular/core';

@Pipe({
    name: 'preventOrphans'
})
export class PreventOrphansPipe {
    constructor() {}

    public transform(value: string) {
        var stringArr = value.trim().split(' ');

        stringArr.splice(stringArr.length - 2, 0, '<span class="text-nowrap">');
        stringArr.push('</span>');

        return stringArr.join(' ');
    }
}
