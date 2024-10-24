export function getColumnKeys(columns: any[]) {
  return columns?.filter(({ key }) => key !== 'actions').map(({ key }) => ({ key, visible: true })) || []
}
