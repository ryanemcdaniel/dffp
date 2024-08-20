import raw from './raw.json';
import {sortyBy, toObjKeyedBy} from '../pure';

const sorted = raw.RAW_UNITS
    .map((u) => ({
        ...u,
        village    : u.village.toUpperCase(),
        category   : u.category.toUpperCase(),
        subCategory: u.subCategory.toUpperCase(),
    }))
    .sort((a, b) => {
        if (sortyBy('village')(a, b)) {
            if (sortyBy('category')(a, b)) {
                if (sortyBy('subCategory')(a, b)) {
                    return sortyBy('subCategory')(a, b);
                }
            }
        }

        sortyBy('category')(a, b);
        return -1;
    })
    .sort(sortyBy('village'))
    .sort(sortyBy('village'))
    .sort(sortyBy('village'));
    // .reduce(toObjKeyedBy('id'), {});

console.log(sorted);

sorted.forEach((u) => {
    const thing = `${u.village}_${u.subCategory}_ID_${u.name}=${u.id};`
        .replaceAll(' ', '_')
        .replaceAll('.', '')
        .toUpperCase();
    console.log(`export const ${thing}`);
});
