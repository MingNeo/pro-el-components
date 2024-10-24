export async function getData(params: any) {
  const { pageNo = 1, pageSize = 10, name } = params || {}
  await new Promise(resolve => setTimeout(resolve, 200))
  const data = Array.from({ length: 100 }).fill(0).map((_, index) => ({
    date: `2016-05-0${index + 1}`,
    name: `用户${index + 1}`,
    address: `上海市普陀区金沙江路 1518 弄${index + 1}号`,
  })).filter(_ => !name || _.name.includes(name))

  const showData = data.slice((pageNo - 1) * pageSize, pageNo * pageSize)
  return {
    data: showData,
    total: data.length,
  }
}
