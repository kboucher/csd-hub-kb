import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'preventOrphans',
})
export class PreventOrphansPipe implements PipeTransform {
    public transform(value: string) {
        const stringArr = value.trim().split(' ');

        stringArr.splice(stringArr.length - 2, 0, '<span class="text-nowrap">');
        stringArr.push('</span>');

        return stringArr.join(' ');
    }
}
