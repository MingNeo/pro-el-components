export async function createRegion(_values: any) {
  return void 0
}

export async function updateRegion(_values: any) {
  return Promise.resolve(void 0)
}

export async function getRegionInfo(_id: number) {
  return {
    id: 1,
    regionCode: '1',
    regionName: '中国',
    regionShortName: '中国',
    regionAlias: '中国',
    timeZone: '东八区',
    regionLanguage: '中文',
    currencyName: '人民币',
  }
}
