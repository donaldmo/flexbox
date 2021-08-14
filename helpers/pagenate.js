module.exports.pagenate = (query) => {
  console.log('query: ', query);
  let { page, size } = query;
  if (!page || page === '' || page === undefined) page = 1;
  if (!size || size === '' || size === undefined) size = 3;
  return { page, size }
}