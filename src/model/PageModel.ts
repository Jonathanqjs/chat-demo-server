
const assert = require('assert');
export class PageModel<T> {
  private pageSize: number
  private total: number
  private data: Array<T>
  private pagingData: Array<Array<T>> = new Array()
  constructor({ data, pageSize, total }: { data: Array<T>, pageSize: number, total?: number }) {
    this.data = data
    this.pageSize = pageSize
    this.total = total ?? data.length
    for (let i = 0; i < this.total; i += this.pageSize) {
      this.pagingData.push(this.data.slice(i, i + this.pageSize))
    }

  }

  getData(page: number)  {
    return {
      total: this.total,
      currentPage: page,
      list: this.pagingData[page - 1] ?? []
    }
  }
}