import { Route } from '@/types';
import got from '@/utils/got';
import { parseDate } from '@/utils/parse-date';
import cache from '@/utils/cache';

const host = 'https://www.theblock.co';

export const route: Route = {
    name: '区块链快讯 分类',
    path: '/category/:category',
    parameters: {
        type: {
            description: '类型',
            default: 'markets',
            options: [
                {
                    value: 'companies',
                    label: 'Companies',
                },
                {
                    value: 'nfts-gaming-and-metaverse',
                    label: 'Metaverse &amp; NFT',
                },
                {
                    value: 'crypto-ecosystems',
                    label: 'Crypto Ecosystems',
                },
                {
                    value: 'markets',
                    label: 'Markets',
                },
                {
                    value: 'deals',
                    label: 'Deals',
                },
                {
                    value: 'policy',
                    label: 'Policy',
                },
            ],
        },
    },
    example: '/category/market',
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
            source: ['www.theblock.co/category/'],
            target: '',
        },
    ],
};

async function handler(ctx) {
    const category = ctx.req.param('category') ?? 'markets';

    const response: any = await cache.tryGet(
        `theblock-category-${category}`,
        async () => {
            const resp = await got(`${host}/api/category/${category}`);
            return resp.data;
        },
        60,
        false
    );

    const items = response.data.articles.map((item) => ({
        title: item.title,
        link: item.url,
        pubDate: parseDate(item.date),
    }));

    return {
        title: response.pageMeta.title,
        link: host,
        item: items,
    };
}
