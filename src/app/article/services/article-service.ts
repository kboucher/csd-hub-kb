import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import { Category } from '../../category/models/category';

@Injectable()
export class ArticleService {
    private articles: Array<Article> = [
        new Article('First Article Title', 1, 'LoremElit laboris iis amet eram, quis ad si fugiat laborum an eiusmod non nulla ingeniis sed o quid malis de appellat. Laboris legam labore eiusmod ipsum. Legam ad commodo, cupidatat fore consequat, et magna e culpa, export cohaerescant eiusmod tempor laborum. Incididunt quem irure ex quae.'),
        new Article('Second Article Title', 2, 'LoremElit laboris iis amet eram, quis ad si fugiat laborum an eiusmod non nulla ingeniis sed o quid malis de appellat. Laboris legam labore eiusmod ipsum. Legam ad commodo, cupidatat fore consequat, et magna e culpa, export cohaerescant eiusmod tempor laborum. Incididunt quem irure ex quae.'),
        new Article('Third Article Title', 3, 'LoremElit laboris iis amet eram, quis ad si fugiat laborum an eiusmod non nulla ingeniis sed o quid malis de appellat. Laboris legam labore eiusmod ipsum. Legam ad commodo, cupidatat fore consequat, et magna e culpa, export cohaerescant eiusmod tempor laborum. Incididunt quem irure ex quae.'),
        new Article('Fourth Article Title', 4, 'LoremElit laboris iis amet eram, quis ad si fugiat laborum an eiusmod non nulla ingeniis sed o quid malis de appellat. Laboris legam labore eiusmod ipsum. Legam ad commodo, cupidatat fore consequat, et magna e culpa, export cohaerescant eiusmod tempor laborum. Incididunt quem irure ex quae.'),
        new Article('Fifth Article Title', 5, 'LoremElit laboris iis amet eram, quis ad si fugiat laborum an eiusmod non nulla ingeniis sed o quid malis de appellat. Laboris legam labore eiusmod ipsum. Legam ad commodo, cupidatat fore consequat, et magna e culpa, export cohaerescant eiusmod tempor laborum. Incididunt quem irure ex quae.')
    ];

    getArticlesByCategory(category: Category): Array<Article> {
        return this.articles;
    }
}
