import { Component, Prop, Vue } from 'vue-property-decorator'
import { DateUtil } from 'fant'
import QueryParam from 'model/request/QueryParam'
import InventoryDetailButton from 'pages/inventory/cmp/InventoryCheckButton.vue'
import CheckInventory from 'model/inventory/check/CheckInventory'
import PermissionMgr from 'mgr/PermissionMgr'

@Component({
  components: { InventoryDetailButton }
})
export default class InventoryCheckListTable extends Vue {
  @Prop() data: CheckInventory[]
  @Prop() query: QueryParam
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  // 节点对象
  /**
   * 表格排序条件
   */
  doSortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': prop, 'direction': order })
    this.$emit('setSorters', sorters)
  }

  /**
   * 表格选择
   * @param val
   */
  doSelectionChange(val: CheckInventory[]) {
    this.$emit('selectData', val)
  }

  getList() {
    this.$emit('getList')
  }

  /**
   * 表格过滤器： 业务时间
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  dateFormatter(row: any, column: any, value: string) {
    if (value) {
      let date = DateUtil.format(new Date(value), 'yyyy-MM-dd')
      return date
    } else {
      return '--'
    }
  }

  /**
   * 表格过滤器： 状态
   * @param {string} value
   * @returns {string}
   */
  statusFormatter(value: string) {
    if (value) {
      let statusText: string = ''
      switch (value) {
        case 'unaudited':
          statusText = 'warning'
          break
        case 'audited':
          statusText = 'info'
          break
        default:
          statusText = ''
      }
      return statusText
    } else {
      return ''
    }
  }

  /**
   * 表格过滤器： 销售额
   * @param row
   * @param column
   * @param {string} value
   * @returns {string}
   */
  priceFormatter(row: any, column: any, value: string) {
    if (value && Number(value) !== 0) {
      return Number(value).toFixed(2)
    } else {
      return '0.00'
    }
  }

  /**
   * 跳转到详情
   * @param {string} id
   */
  doGoDetail(id: string) {
    let ids: any[] = []
    this.data.forEach((item) => {
      ids.push(item.id!)
    })
    this.$router.push({
      name: 'inventoryCheckView',
      query: { id: id },
      params: { ids: JSON.stringify(ids), query: JSON.stringify(this.query) }
    })
  }

  filterColor(value: string, positiveColor: string, negativeColor: string) {
    if (value && Number(value) > 0) {
      return 'color:' + positiveColor
    }
    if (value && Number(value) < 0) {
      return 'color:' + negativeColor
    }
  }
}

InventoryCheckListTable.filter('status', (value: string) => {
  if (value) {
    let statusText: string = ''
    switch (value) {
      case 'unaudited':
        statusText = '草稿'
        break
      case 'audited':
        statusText = '已审核'
        break
      case 'ABOLISHED':
        statusText = '已作废'
        break
      default:
        statusText = '--'
    }
    return statusText
  } else {
    return '--'
  }
})
InventoryCheckListTable.filter('price', (value: string) => {
  if (value && Number(value) !== 0) {
    return Number(value).toFixed(2)
  } else {
    return '0.00'
  }
})


