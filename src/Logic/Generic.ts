export const createIndex = (arr: any[], key: string) => {
    let obj: any = {};

    arr.forEach((item: any) => {
        if (item[key]) {
            obj[item[key]] = item;
        }
    });
    return obj;
};
