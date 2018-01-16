import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'kb-paginator',
    styleUrls: ['./paginator.scss'],
    templateUrl: './paginator.html',
})
export class PaginatorComponent implements OnChanges {
    @Input() currentPage: number;
    @Input() displayMax: number = 3;
    @Input() isCompactView: boolean = false;
    @Input() pages: number[];
    @Input() pageArticleCount: number;
    @Input() pageSize: number;
    @Input() totalArticleCount: number;
    @Output() goToPage = new EventEmitter();

    displayPages: number[];
    fromItem: number;
    nextPage: number;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    prevPage: number;
    toItem: number;

    ngOnChanges() {
        const currentPage = this.currentPage;
        const pageSize = this.pageSize;
        const totalPages = this.pages.length;

        this.prevPage = currentPage - 1 > 0 ? currentPage - 1 : null;
        this.nextPage = currentPage + 1 <= totalPages ? currentPage + 1 : null;
        this.fromItem = currentPage * pageSize - pageSize + 1;
        this.toItem = this.fromItem + (this.pageArticleCount - 1);

        // Trim page list down if desired
        if (this.displayMax < totalPages) {
            this.setDisplayPages();
        } else {
            this.displayPages = this.pages;
        }
    }

    changePage(pageNum: number) {
        event.preventDefault();

        this.goToPage.emit({pageNum, pageSize: this.pageSize});
    }

    changePageSize(pageSize: number) {
        event.preventDefault();

        this.goToPage.emit({pageNum: 1, pageSize});
    }

    setDisplayPages() {
        const pages = [];
        const half = Math.floor(this.displayMax / 2);
        let start = this.currentPage - half + 1 - this.displayMax % 2;
        let end = this.currentPage + half;
        let iterator;

        // handle boundary case
        if (start <= 0) {
            start = 1;
            end = this.displayMax;
        }
        if (end > this.pages.length) {
            start = this.pages.length - this.displayMax + 1;
            end = this.pages.length;
        }

        iterator = start;
        while (iterator <= end) {
            pages.push(iterator);
            iterator++;
        }

        // add ellipses for omitted pages
        if (pages[pages.length - 1] < this.pages.length) {
            pages.push(-1);
            pages.push(this.pages.length);
        }
        if (pages[0] > 1) {
            pages.unshift(-1);
            pages.unshift(1);
        }

        this.displayPages = pages;
    }
}
