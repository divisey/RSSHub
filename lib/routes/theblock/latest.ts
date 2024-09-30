import { Route } from '@/types';
import got from '@/utils/got';
import { parseDate } from '@/utils/parse-date';
import cache from '@/utils/cache';

const host = 'https://www.theblock.co';

export const route: Route = {
    name: '区块链快讯',
    path: '/latest',
    example: '/latest',
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: true,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    maintainers: ['divisey'],
    handler,
    radar: [
        {
            source: ['www.theblock.co/latest'],
            target: '',
        },
    ],
};

async function handler() {
    const response: any = await cache.tryGet(
        'theblock-latest-data',
        async () => {
            const resp = await got(`${host}/api/pagesPlus/data/latest/1`);
            return resp.data;
        },
        60,
        false
    );

    const items = response.latest.posts.map((item) => ({
        title: item.title,
        link: item.url,
        pubDate: parseDate(item.date),
    }));

    return {
        title: response.pageData.title,
        link: host,
        item: items,
    };
}
