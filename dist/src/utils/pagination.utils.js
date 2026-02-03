export const pagination = (page = 1, pageSize = 10, maxPageSize = 30) => {
    const currentPage = Math.max(page, 1);
    const take = Math.min(pageSize, maxPageSize);
    const skip = (currentPage - 1) * take;
    return { currentPage, skip, take };
};
