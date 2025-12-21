
export const productListKey = async (page) => `v${getCacheVersion()}:products:page:${page}`;
export const productDetailKey = async (id) => `v${getCacheVersion()}:products:${id}`;